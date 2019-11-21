var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"序号", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"销售单号", dataIndex:'SALENO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:saleInfo(\"" + value + "\")'>"+value+"</a> ";
				}
			}
            ,{header:"销售部门", dataIndex:'SALEBRANCH', width:'80px',sortable:false}
            ,{header:"销售人", dataIndex:'SALESPERSON', width:'80px',sortable:false}
            ,{header:"销售时间", dataIndex:'SALEDATE', width:'120px',sortable:false}
            ,{header:"销售数量", dataIndex:'COMMODITYSUM', width:'70px',sortable:false}
            ,{header:"成本价格", dataIndex:'PURCHASE_PRICES', width:'70px',sortable:false}
            ,{header:"销售价格", dataIndex:'SALE_PRICES', width:'70px',sortable:false}
            ,{header:"其他费用", dataIndex:'OTHER_PRICES', width:'70px',sortable:false}
            ,{header:"毛利率", dataIndex:'PROFITRATES', width:'70px',sortable:false}
            ,{header:"销售渠道", dataIndex:'PARTNERNAMETXT', width:'80px',sortable:false}
            ,{header:"联系电话", dataIndex:'CONTACTS', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['MOBILE']+')';
				}
			}
            ,{header:"收款方式", dataIndex:'RECEIVABLESTYPETXT', width:'80px',sortable:false}
            ,{header:"订单状态", dataIndex:'', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS'] == '4' || data['STATUS'] == '5'){
						return '<font color="red">'+data['STATUSTXT']+'</font>';
					}else{
						return '<font color="red">'+data['STATUSTXT']+'</font>';
					}
				}
			}
            ,{header:"操作", dataIndex:'',  sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                	var status = data['STATUS'];
                	var saleNo = data['SALENO'];
                	var html = "<a class='a_link' href='javaScript:saleInfo(\"" + saleNo + "\")'>详情</a> ";
//                	html += " | <a class='a_link' href='javaScript:explodeDetail(\"" + saleNo + "\")'>导出</a> ";
//                	if(htmlFlag == 'saleindex' || htmlFlag == 'cancelsale'){
//            		if(status == 1 || status == 4){
//            			html += " | <a class='a_link' href='javaScript:updateStatus(\"" + saleNo + "\",\"2\")'>提审</a> ";
//                	}else if(status == 2){
//                		html += " | <a class='a_link' href='javaScript:updateStatus(\"" + saleNo + "\",\"1\")'>撤销</a> ";
//                	}else if(status == 5){
//                		html += " | <a class='a_link' href='javaScript:updateStatus(\"" + saleNo + "\",\"2\")'>重新提审</a> ";
//                	}
//                	if(status == 1 || status == 4 || status == 5){
//                		html += " | <a class='a_link' href='javaScript:saleDel(\"" + saleNo + "\")'>删除</a> ";
//                	}
//                	}else if(htmlFlag == 'salefaudit' || htmlFlag == 'cancelsaleaudit'){
//                		if(status == 2 ){
//                			html += " | <a class='a_link' href='javaScript:updateStatus(\"" + saleNo + "\",\"3\")'>通过</a> ";
//                			html += " | <a class='a_link' href='javaScript:updateStatus(\"" + saleNo + "\",\"4\")'>驳回</a> ";
//                    	}
//                	}
                    return html;
                }
            }
		]
		,url:'/recycle/salebill/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});


function initParams(){
	return getParams();
}

function getParams(){
	return {
		businessType:$('#businessType').val(),
		salebranch:$('#salebranch').val(),
		saleNo:$('#saleNo').val(),
		createrStart:$('#createrStart').val(),
		createrEnd:$('#createrEnd').val(),
		saleStart:$('#saleStart').val(),
		saleEnd:$('#saleEnd').val(),
		salesperson:$('#salesperson').val(),
		partnerName:$('#partnerName').val(),
		contacts:$('#contacts').val(),
		mobile:$('#mobile').val(),
		receivablestype:$('#receivablestype').val(),
		status:$('#status').val()
	};
}


function doSearch(){
	layer.msg('加载中');
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
function saleInfo(saleNo){
	if(saleNo){
		layer.open({
			type:2,
			title:'详情',
			shadeClose:false,
			shade:0.8,
			content:'/recycle/salebill/saleinfo?saleNo='+saleNo+'&htmlFlag='+htmlFlag+'&classify='+classify,
			area:['100%' , '100%'],
			close:function(index){
				layer.close(index);
			}
		});
	}else{
		layer.alert('失败稍后再试', {skin:'layui-layer-lan',closeBtn:0,anim:6});
	}
}

/**
 * 删除
 */
function saleDel(saleNo){
	if(saleNo){
		layer.confirm("确定删除当前销售订单？", {
			  btn:['确定','取消'] 
			}, function(){
				$.post("/recycle/salebill/saledel", {saleNo:saleNo,classify:classify}, function(data){
			        if(data == 'Y'){
			            layer.msg('成功');
			            setTimeout(function(){doSearch()}, 2000);
			        }else{
			        	layer.alert('操作失败：'+data, {skin:'layui-layer-lan',closeBtn:0,anim:6});
			        }
			    });
			}, function(){
			  
			});
	}else{
		layer.alert('失败稍后再试', {skin:'layui-layer-lan',closeBtn:0,anim:6});
	}
}

/**
 * 修改状态
 */
function updateStatus(saleNo,status){
	if(status == '1'){
		var txt = "撤销";
	}else if(status == '2'){
		var txt = "提审";
	}else if(status == '3'){
		var txt = "通过";
	}else if(status == '4'){
		var txt = "驳回";
	}
	if(saleNo && status){
		layer.confirm("确定 "+txt+" 当前销售订单？", {
			  btn:['确定','取消'] 
			}, function(){
				submits(saleNo,status);
			}, function(){
			  
			});
	}else{
		layer.alert('操作失败稍后再试', {skin:'layui-layer-lan',closeBtn:0,anim:6});
	}
}

/**
 * 修改状态
 */
function submits(saleNo,status){
	$.post("/recycle/salebill/updatestatus", {saleNo:saleNo,status:status,classify:classify}, function(data){
        if(data == 'Y'){
            layer.msg('成功');
            setTimeout(function(){doSearch()}, 2000);
        }else{
        	layer.alert('操作失败：'+data, {skin:'layui-layer-lan',closeBtn:0,anim:6});
        }
    },'json');
}

/**
 * 导出
 */
$('#exportlist').on('click',function(){
	var businessType = $('#businessType').val();
	var salebranch = $('#salebranch').val();
	var saleNo = $('#saleNo').val();
	var createrStart = $('#createrStart').val();
	var saleStart = $('#saleStart').val();
	var saleEnd = $('#saleEnd').val();
	var salesperson = $('#salesperson').val();
	var partnerName = $('#partnerName').val();
	var contacts = $('#contacts').val();
	var mobile = $('#mobile').val();
	var receivablestype = $('#receivablestype').val();
	var statusVal = $('#status').val();
	if(statusVal){
		status = statusVal;
	}
	var param = '?businessType='+businessType+'&salebranch='+salebranch+'&saleNo='+saleNo+'&createrStart='+createrStart+'&saleStart='+saleStart+'&status='+status;
	param += '&saleEnd='+saleEnd+'&salesperson='+salesperson+'&partnerName='+partnerName+'&contacts='+contacts+'&mobile='+mobile+'&receivablestype='+receivablestype;
	param += '&classify='+classify+'&htmlFlag='+htmlFlag;
	window.location.href = '/recycle/salebill/exportlist'+param;
});

/**
 * 导入
 */
$('#importList').on('click',function(){
	layer.open({
		type:2,
		title:'信息导入',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/salebill/importlist?classify='+classify,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
});

/**
 * 导出详情
 */
function explodeDetail(saleNo){
	if(saleNo){
		window.location.href = '/recycle/salebill/exportlistall?saleNo='+saleNo+'&classify='+classify;
	}else{
		alert('错误！稍后再试');
	}
}

/**
 * 下载模版
 */
$('#downloadExecl').on('click',function(){
	window.location.href = '/template/xls/salebill.csv';
});
