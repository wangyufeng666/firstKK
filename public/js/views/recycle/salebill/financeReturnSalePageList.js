var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"序号", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}
            ,{header:"退货单号", dataIndex:'RETURNBILLNO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:returnBillInfo(\"" + value + "\")'>"+value+"</a> ";
				}}
			,{header:"销售单号", dataIndex:'SALEBILLNO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:saleBillInfo(\"" + value + "\")'>"+value+"</a> ";
				}
			}
            ,{header:"销售部门", dataIndex:'SALEBRANCH', width:'70px',sortable:false}
            ,{header:"销售人", dataIndex:'SALER', width:'70px',sortable:false}
            ,{header:"销售时间", dataIndex:'SALEDATE', width:'70px',sortable:false}
            ,{header:"销售数量", dataIndex:'TOTALCOUNT', width:'70px',sortable:false}
            ,{header:"退货数量", dataIndex:'RETURNCOUNT', width:'70px',sortable:false}
            ,{header:"退货总额", dataIndex:'RETURN_SALEAMOUNT', width:'70px',sortable:false}
            ,{header:"销售类型", dataIndex:'PARTNER_TYPE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '个人' : '回收商';
				}
            }
            ,{header:"退货单状态", dataIndex:'RETURNSTATUSNAME', width:'80px',sortable:false}
            ,{header:"操作", dataIndex:'RETURNBILLNO', width:'110px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                	var status = data['RETURNSTATUS'];
                	var html = "";
            		if(status == 2){
                		html += "<a class='a_link' href='javaScript:updateReturnStatus(\"" + value + "\",\"3\")'>审核通过</a> | ";
                		html += "<a class='a_link' href='javaScript:updateReturnStatus(\"" + value + "\",\"4\")'>驳回</a>";
                	}
                    return html;
                }
            }
		]
		,url:'/recycle/salebill/returnpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
});

function initParams(){
	return getParams();
}

function getParams(){
	return {
		saleBillNo:$('#saleBillNo').val(),
		returnBillNo:$('#returnBillNo').val(),
		htmlFlag:'Y',
//		saleBranch:$('#saleBranch').val(),
//		createrStart:$('#createrStart').val(),
//		createrEnd:$('#createrEnd').val(),
//		saleStart:$('#saleStart').val(),
//		saleEnd:$('#saleEnd').val(),
		billStatus:$('#billStatus').val(),
		saler:$('#saler').val(),
//		partnerName:$('#partnerName').val(),
//		payType:$('#payType').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, shade: 0.1, time:30000});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

/**
 * 详情
 */
function saleBillInfo(saleBillNo){
	layer.open({
		type:2,
		title:'销售单详情',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/salebill/salebillinfo?saleBillNo='+saleBillNo,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 退货详情
 * @returns
 */
function returnBillInfo(returnBillNo){
	layer.open({
		type:2,
		title:'退货单详情',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/salebill/returnbillinfo?returnBillNo='+returnBillNo,
		area:['850px' , '450px'],
		close:function(index){
			layer.close(index);
		}
	});
}


/**
 * 删除
 */
function delSaleReturnBill(retrunBillNo){
	if(confirm('是否确定删除销售单？')){
		$.post("/recycle/salebill/delsalereturnbill", {retrunBillNo:retrunBillNo}, function(data){
	        if(data == 'Y'){
	            layer.msg('成功');
	            grid.reload();
	        }else{
	        	layer.alert('删除失败：'+data.msg);
	        }
	    });
	}
}

/**
 * 修改状态
 */
function updateReturnStatus(returnBillNo, status){
	if(status == '3'){
		var txt = "通过";
	}else if(status == '4'){
		var txt = "驳回";
	}
	if(returnBillNo && status){
		if(confirm('是否确定进行【'+txt+'】操作？')){
			saleReturnBillOper(returnBillNo, status);
		}
	}else{
		layer.alert('操作失败稍后再试');
	}
}

/**
 * 修改状态
 */
function saleReturnBillOper(returnBillNo, status){
	$.post("/recycle/salebill/updatereturnstatus", {returnBillNo:returnBillNo, status:status}, function(data){
        if(data == 'Y'){
            layer.msg('操作成功');
            grid.reload();
        }else{
        	layer.alert('操作失败：'+data);
        }
    },'json');
}

function returnDataExport(){
	var returnBillNo = $('#returnBillNo').val();
	var saleBillNo = $('#saleBillNo').val();
	var saler = $('#saler').val();
	var billStatus = $('#billStatus').val();
	
	var param = 'billStatus='+billStatus+'&saler='+saler+'&saleBillNo='+saleBillNo+'&returnBillNo='+returnBillNo+'&htmlFlag=Y';
	window.location.href = '/recycle/salebill/returnexportlist?'+param;
}
