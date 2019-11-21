var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250,
		cm : [
			{header: "No.", dataIndex: 'R', width:'40px',sortable:false} 
			,{header: "创建日期", dataIndex: 'CREATEDATE', width:'120px',sortable:false}
			,{header: "预销售单号", dataIndex: 'PRESALENO', width:'200px',sortable:false}
			,{header: "销售开始时间", dataIndex: 'SALESTARTDATE', width:'120px',sortable:false}
			,{header: "销售结束时间", dataIndex: 'SALESTOPDATEDATE', width:'120px',sortable:false}
			,{header: "商品分类", dataIndex: 'CATEGORYNAME', width:'100px',sortable:false}
			,{header: "商品来源", dataIndex: 'SOURCECODE', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '线上' : value == '2' ? '线下':'未知';
				}
			}
			,{header: "预销售状态", dataIndex: 'STATUSNAME', width:'100px', sortable:false}
			,{header: "操作", dataIndex: '', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var presaleNo = data['PRESALENO'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:presaleInfo(\''+presaleNo+'\')" class="a_link">详情</a>';
					if(status == '1'){
						returnText +=' | <a href="javascript:operate(\''+presaleNo+'\',2)" class="a_link">发布</a>';
					}
					if(status == '2'){
						returnText +=' | <a href="javascript:operate(\''+presaleNo+'\',3)" class="a_link">暂停</a>';
						returnText +=' | <a href="javascript:operate(\''+presaleNo+'\',4)" class="a_link">报价完成</a>';
					}
					if(status == '3'){
						returnText +=' | <a href="javascript:operate(\''+presaleNo+'\',2)" class="a_link">重启</a>';
					}
					if(status == '4'){
						returnText +=' | <a href="javascript:allotmerPrice(\''+presaleNo+'\')" class="a_link">创建销售单</a>';
					}
					if(status != '4' && status != '5'&& status != '6'){
						returnText +=' | <a href="javascript:extension(\''+presaleNo+'\')" class="a_link">延期</a>';
						returnText +=' | <a href="javascript:operate(\''+presaleNo+'\',5)" class="a_link">作废</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/sale/presalebill/pagelist'
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
function presaleInfo(presaleNo){
    layer.open({
        type:2,
        title:'销售单详情',
        shadeClose:false,
        shade:0.8,
        content:"/sale/presalebill/billinfo?presaleNo="+presaleNo,
        area:['90%','90%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 分配预销售单商品价格
 * @param presaleNo
 * @return
 */
function allotmerPrice(presaleNo){
	window.location.href = "/sale/salebill/allotmerprice?presaleNo="+presaleNo;
}

/**
 * 操作预销售单
 * @param presaleNo
 * @return
 */
function operate(presaleNo,nextstatus){
	var hintText = nextstatus == 2 ? '是否确认发布?' : nextstatus == 3 ? '是否确认暂停?' : nextstatus == 4 ? '报价已完成?': '是否确认作废?';
	if(confirm(hintText)){
		$.post("/sale/presalebill/operatebill", {nextstatus:nextstatus,presaleNo:presaleNo}, function(data){
			if(data == 'Y'){
                doPageSearch();
			}
		});
	}
}

function getParams(){
    return {
    	presaleNo:$('#presaleNo').val(),
        category:$('#category').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        salestartDate:$('#salestartDate').val(),
        saleendDate:$('#saleendDate').val(),
        status:$('#status').val()
    };
}

function getPageParams(){
    return {
        presaleNo:$('#presaleNo').val(),
        category:$('#category').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        salestartDate:$('#salestartDate').val(),
        saleendDate:$('#saleendDate').val(),
        status:$('#status').val(),
        start:(parseInt($(".current").html())-1)*limit
    };
}


function addPresaleBill(){
    layer.open({
        type:2,
        title:'创建预销售单',
        shadeClose:false,
        shade:0.8,
        content:"/sale/presalebill/addbill",
        area:['30%','60%'],
        close:function(index){
            layer.close(index);
            doPageSearch();
        }
    });

}
function extension(presaleNo){
    layer.open({
        type:2,
        title:'竞拍延期',
        shadeClose:false,
        shade:0.8,
        content:'/sale/presalebill/toextension?presaleNo='+presaleNo,
        area:['25%','50%'],
        close:function(index){
            layer.close(index);
            doPageSearch();
        }
    });
}

function doSearch(){
    grid.query(getParams());
}

function doPageSearch(){
    grid.query(getPageParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}