var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250,
		cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "创建日期", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
			,{header: "旧机单号", dataIndex: 'ORDERNO', width:'150px',sortable:false}
			,{header: "器材编码", dataIndex: 'MERUNIQUECODE', width:'150px',sortable:false}
			,{header: "商品类型", dataIndex: 'CATEGORYNAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME', width:'80px',sortable:false}
			,{header: "器材属性", dataIndex: 'MERFLAGNAME', width:'70px',sortable:false}
			,{header: "销售状态", dataIndex: 'SALEFLAG', width:'70px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '未销售' : '已销售';
				}
			}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var merCode = data['MERUNIQUECODE'];
					var returnText ='<a href="javascript:void(0);" onclick="merInfo(\''+merCode+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}
		]
		,url : '/sale/presalemer/pagelist'
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
 * 订单详情
 * @param orderNo
 * @return
 */
function merInfo(merCode){
	window.location.href = "/sale/presalemer/merinfo?merCode="+merCode+"&backUrl="+backUrl;
}

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merCode:$('#merCode').val(),
        merFlag:$('#merFlag').val(),
        saleFlag:$('#saleFlag').val()
    };
}

function getPageParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merCode:$('#merCode').val(),
        merFlag:$('#merFlag').val(),
        saleFlag:$('#saleFlag').val(),
        start:(parseInt($(".current").html())-1)*limit
    };
}

function importPresaleMer(){	
    $.layer({
        type : 2,
        title : '导入预销售产品',
        iframe : {src : '/sale/presalemer/import'},
        area : ['400' , '300'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
            doPageSearch();
        }
    });
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function doPageSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getPageParams());
}

/**
 * 下载预销售商品
 * @returns {Boolean}
 */
function downloadMer(){
	
	var param = '';
	param += 'orderNo=' + $('#orderNo').val();
	param += '&merName=' + $('#merName').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&category=' + $('#category').val();
	param += '&merCode=' + $('#merCode').val();
	param += '&merFlag=' + $('#merFlag').val();
	window.location.href = '/sale/presalemer/merexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}