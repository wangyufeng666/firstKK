var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250,
		cm : [
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
			,{header: "创建日期", dataIndex: 'CREATETIME', width:'10%',sortable:false}
			,{header: "销售单号", dataIndex: 'SALENO', width:'10%',sortable:false}
			,{header: "预销售单号", dataIndex: 'PRESALENO', width:'10%',sortable:false}
			,{header: "回收商", dataIndex: 'PROVIDERNAME', width:'15%',sortable:false}
			,{header: "售结时间", dataIndex: 'SALETIME', width:'10%',sortable:false}
			,{header: "商品来源", dataIndex: 'SOURCECODE', width:'10%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '线上' : value == '2' ? '线下':'未知';
				}
			}
			,{header: "售结价格", dataIndex: 'SALEPRICE', width:'10%',sortable:false}
			,{header: "售结状态", dataIndex: 'STATUSNAME', width:'10%',sortable:false}
			,{header: "操作", dataIndex: '', width:'20%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var saleNo = data['SALENO'];
					var presaleNo = data['PRESALENO'];
					var status = data['SALESTATUS'];
					var providerId = data['PROVIDERID'];
					var returnText ='<a href="javascript:void(0);" onclick="saleInfo(\''+saleNo+'\')" class="a_link">详情</a>';
					if(status == '1'){
						returnText +=' | <a href="javascript:void(0);" onclick="salefk(\''+saleNo+'\',\''+presaleNo+'\',\''+providerId+'\')" class="a_link">收款</a>';
						returnText +=' | <a href="javascript:void(0);" onclick="stopsale(\''+saleNo+'\')" class="a_link">终止</a>';
					}
					if(status == '4'){
						returnText +=' | <a href="javascript:void(0);" onclick="sale(\''+saleNo+'\',\''+presaleNo+'\',\''+providerId+'\')" class="a_link">销售</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/sale/salebill/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 预销售单详情
 * @param presaleNo
 * @return
 */
function saleInfo(saleNo){
	window.location.href = "/sale/salebill/saleinfo?saleNo="+saleNo+"&backUrl="+backUrl;
}

function getParams(){
    return {
        presaleNo:$('#presaleNo').val(),
        saleNo:$('#saleNo').val(),
        providerId:$('#providerId').val(),
        providerName:$('#providerName').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        status:$('#status').val()
    };
}

function getPageParams(){
    return {
        presaleNo:$('#presaleNo').val(),
        saleNo:$('#saleNo').val(),
        providerId:$('#providerId').val(),
        providerName:$('#providerName').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        status:$('#status').val(),
        start:(parseInt($(".current").html())-1)*limit
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function doPageSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getPageParams());
}

function sale(saleNo){
	if(confirm('是否确认销售？')){
		$.post('/sale/salebill/finishsale', {saleNo:saleNo}, function(data){
			if(data == 'Y'){
                doPageSearch();
			}else{
				alert('提交失败');
			}
		});
	}
}

function salefk(saleNo, presaleNo, providerId){
    $.layer({
        type : 2,
        title : '销售',
        iframe : {src : '/sale/salebill/tosalefk?saleNo='+saleNo+'&presaleNo='+presaleNo+'&providerId='+providerId},
        area : ['400' , '300'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
            doPageSearch();
        }
    });
}

/**
 *终止销售单
 * @param saleNo
 * @return
 */
function stopsale(saleNo){
	if(confirm('是否确认终止销售单？')){
		$.post("/sale/salebill/stopsale", {saleNo:saleNo}, function(data){
			if(data == 'Y'){
				alert('终止成功');
                doPageSearch();
			}
		});
	}
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}