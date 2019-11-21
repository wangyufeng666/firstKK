var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"序号", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}
			,{header:"销售单号", dataIndex:'SALEBILLNO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:saleInfo(\"" + value + "\")'>"+value+"</a> ";
				}
			}
            ,{header:"销售部门", dataIndex:'SALEBRANCH', width:'70px',sortable:false}
            ,{header:"销售人", dataIndex:'SALER', width:'70px',sortable:false}
            ,{header:"销售时间", dataIndex:'SALEDATE', width:'70px',sortable:false}
            ,{header:"销售数量", dataIndex:'TOTALCOUNT', width:'70px',sortable:false}
            ,{header:"成本价格", dataIndex:'COST_AMOUNT', width:'70px',sortable:false}
            ,{header:"销售价格", dataIndex:'SALE_AMOUNT', width:'70px',sortable:false}
            ,{header:"其他费用", dataIndex:'OTHER_AMOUNT', width:'70px',sortable:false}
            ,{header:"毛利额", dataIndex:'PROFITVALUE', width:'70px',sortable:false}
            ,{header:"毛利率", dataIndex:'PROFITRATE', width:'60px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+' %';
				}
            }
            ,{header:"销售类型", dataIndex:'PARTNER_TYPE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '个人' : '回收商';
				}
            }
            ,{header:"销售渠道", dataIndex:'PROVIDERNAME', width:'80px',sortable:false}
            ,{header:"收款方式", dataIndex:'PAYTYPENAME', width:'70px',sortable:false}
            ,{header:"订单状态", dataIndex:'ORDERSTATUSNAME', width:'70px',sortable:false}
            ,{header:"操作", dataIndex:'SALEBILLNO', width:'110px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                	var status = data['STATUS'];
                	var html = "";
                	
            		if(status == 1 || status == 4){
            			html += "<a class='a_link' href='javaScript:updateStatus(\"" + value + "\",\"2\")'>提审</a> | ";
                	}else if(status == 2){
                		html += "<a class='a_link' href='javaScript:updateStatus(\"" + value + "\",\"1\")'>撤销</a> | ";
                	}
                	if(status == 1 || status == 4 || status == 5){
                		html += "<a class='a_link' href='javaScript:delSaleBill(\"" + value + "\")'>删除</a> | ";
                	}
                    return html;
                }
            }
		]
		,url:'/recycle/salebill/pagelist'
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
		businessType:$('#businessType').val(),
		saleBranch:$('#saleBranch').val(),
		createrStart:$('#createrStart').val(),
		createrEnd:$('#createrEnd').val(),
		saleStart:$('#saleStart').val(),
		saleEnd:$('#saleEnd').val(),
		billStatus:$('#billStatus').val(),
		saler:$('#saler').val(),
		partnerName:$('#partnerName').val(),
		payType:$('#payType').val(),
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
function saleInfo(saleBillNo){
	layer.open({
		type:2,
		title:'详情',
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
 * 删除
 */
function delSaleBill(saleBillNo){
	if(confirm('是否确定删除销售单？')){
		$.post("/recycle/salebill/delsalebill", {saleBillNo:saleBillNo}, function(data){
	        if(data == 'Y'){
	            layer.msg('成功');
	            grid.reload();
	        }else{
	        	layer.alert('删除失败：'+data);
	        }
	    });
	}
}

/**
 * 修改状态
 */
function updateStatus(saleBillNo, status){
	if(status == '1'){
		var txt = "撤销";
	}else if(status == '2'){
		var txt = "提审";
	}else if(status == '3'){
		var txt = "通过";
	}else if(status == '4'){
		var txt = "驳回";
	}
	if(saleBillNo && status){
		if(confirm('是否确定进行【'+txt+'】操作？')){
			saleBillOper(saleBillNo, status);
		}
	}else{
		layer.alert('操作失败稍后再试');
	}
}

/**
 * 修改状态
 */
function saleBillOper(saleBillNo, status){
	$.post("/recycle/salebill/updatestatus", {saleBillNo:saleBillNo, status:status}, function(data){
        if(data == 'Y'){
            layer.msg('操作成功');
            grid.reload();
        }else{
        	layer.alert('操作失败：'+data);
        }
    },'json');
}

/**
 * 模版下载
 */
$('#templateDownload').on('click',function(){
	window.location.href = '/template/xls/Finance_salebill_temp04.xls';
});

/**
 * 销售单数据导入
 * @returns
 */
function dataImport(){
	var businessType = $('#businessType').val();
	layer.open({
		type:2,
		title:'品类销售报表导入',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/salebill/ebsimportpage?businessType='+businessType,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function saleBillExport(){
	var businessType = $('#businessType').val();
	var saleBranch = $('#saleBranch').val();
	var saleBillNo = $('#saleBillNo').val();
	var createrStart = $('#createrStart').val();
	var saleStart = $('#saleStart').val();
	var saleEnd = $('#saleEnd').val();
	var saler = $('#saler').val();
	var partnerName = $('#partnerName').val();
	var payType = $('#payType').val();
	var billStatus = $('#billStatus').val();
	
	var param = '?businessType='+businessType+'&saleBranch='+saleBranch+'&saleBillNo='+saleBillNo;
	param += '&createrStart='+createrStart+'&saleStart='+saleStart+'&billStatus='+billStatus;
	param += '&saleEnd='+saleEnd+'&saler='+saler+'&partnerName='+partnerName+'&payType='+payType;
	
	window.location.href = '/recycle/salebill/exportlist'+param;
}