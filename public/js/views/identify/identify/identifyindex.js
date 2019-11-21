var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
			,{header: "创建日期", dataIndex: 'STRORDERDATE', width:'100px',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'100px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'140px',sortable:false}
			,{header: "鉴定报告", dataIndex: 'REPORTNO', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					if(value){
						return '<a class="a_link" href="javascript:identifyReportInfo(\''+orderNo+'\')" title="'+value+'">'+value+'</a>';
					}else{
						return '暂无';
					}
				}
			}
			,{header:"订单来源", dataIndex:'', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var channel ='';
					if(data['ORDERTYPE']=='71' || data['ORDERTYPE']=='73'){
						if(data['CHANNEL']=='idle'){
							channel = '闲鱼';
						}else if(data['CHANNEL']=='tmall'){
							channel = '天猫';
						}else if(data['CHANNEL']=='alipay'){
							channel = '支付宝';
						}else if(data['CHANNEL']=='taobao'){
							channel = '淘宝';
						}else if(data['CHANNEL']=='tmall-service'){
							channel = '天猫以旧换新';
						}
					}
					if(channel){
						return data['SOURCENAME']+'('+channel+')';
					}else{
						return data['SOURCENAME'];
					}
				}
			}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: 'ORDERNO',width:'160px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderStatus = data['ORDERSTATUS'];
					var tradeType = data['TRADETYPE'];
					var returnText ='<a class="a_link" href="javascript:orderInfo(\''+value+'\')">查看</a>';
					if(tradeType != '2' && (orderStatus == '4' || orderStatus == '8')){
						returnText += ' | <a class="a_link" href="javascript:orderIndentify(\''+value+'\')">鉴定检测</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/identify/identify/pagelist'
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
 * 鉴定报告
 * @param callId
 * @returns
 */
function identifyReportInfo(orderNo){
	layer.open({
		type:2,
		title:'鉴定报告',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/inspectionreport?orderNo='+orderNo,
		area:['98%','98%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单详情页面 
 */
function orderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单详情',
		shadeClose:false,
		shade:0.8,
		content:'/order/order/orderinfo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 订单待鉴定页面 
 */
function orderIndentify(orderNo){
	layer.open({
		type:2,
		title:'商品鉴定',
		shadeClose:false,
		shade:0.8,
		content:'/idlefishpai/recyorder/identifypagetwo?orderNo='+orderNo,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function downloadExport(){
	var param = '';
	param += '&startDate=' + $('#pay_date_start').val();
	param += '&endDate=' + $('#pay_date_end').val();
	window.location.href = '/idlefish/recyorder/payexport?'+param;
	return false;
}

/**
 * 详情
 */
function infos(pkid){
	window.location.href = "/idlefish/creditfinance/payinfo?pkid="+pkid+"&backUrl="+backUrl;
}

function goBack(){
	window.history.go(-1);
}

function closeLayer(){
	layer.closeAll('iframe');
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(), 
    	merName:$('#merName').val(),
    	bizOrderNo:$('#bizOrderNo').val(),
    	orderStatus:$('#orderStatus').val(),
    	contactWay:$('#contactWay').val(),
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
    	merType:$('#merType').val(),
		address:$('#address').val(),
    	category:$('#category').val()
    };
}
function doSearch(){
    grid.query(getParams());
}

function downloadOrder(){
	var param = '';
	param += '&orderNo=' + $('#orderNo').val();
	param += '&merName=' + $('#merName').val();
	param += '&bizOrderNo=' + $('#bizOrderNo').val();	
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&merType=' + $('#merType').val();
	param += '&category=' + $('#category').val();
	window.location.href = '/identify/ifishorder/orderexport?'+param;
	return false; //截取返回false就不会保存网页了
}

