var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"编号", dataIndex:'YDMPAYNO', width:'100px',sortable:false}
			,{header:"代理商", dataIndex:'COMPANYNAME', width:'100px',sortable:false}
			,{header:"商户", dataIndex:'PARTNERNAME', width:'100px',sortable:false}
			,{header:"店员/用户", dataIndex:'', width:'80px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var name = '用户-'+data['USERID'];
					if(data['NAME']){
						name = '店员-'+ data['NAME']+'-'+data['USERID'];
					}
					return name;
				}	
			}
			,{header:"支付宝账号/ID", dataIndex:'DEVICEID', width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return account = data['ZHIFUBAO'] ? data['ZHIFUBAO'] : data['USERID'];
				}
			}
			,{header:"设备ID", dataIndex:'DEVICEID', width:'100px',sortable:false}
			,{header:"询价来源", dataIndex:'CHANNELNAME', width:'100px',sortable:false}
			,{header:"询价奖励时间", dataIndex:'WINDATE', width:'100px',sortable:false}
			,{header:"金额", dataIndex:'PRICE', width:'80px',sortable:false}
			,{header:"状态", dataIndex:'PRIZESTATUSNAME', width:'100px',sortable:false}
			,{header: "操作", dataIndex: '', width:'80px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var prizeStatus = data['PRIZESTATUS'];
					var ydmpayNo = data['YDMPAYNO'];
					var returnText = '';
					if(prizeStatus == '2'){
						returnText +='<a class="a_link" href="javascript:void(0);" onclick="againPay(\''+ydmpayNo+'\')">重新打款</a>';
					}
				  	return returnText;
				}
			}
		]
		,url:'/device/reward/inquiryrewardlist'
		,baseParams:initParams()
	});
});

function initParams(){
	var params = getParams();
	if(backFlag == 'Y'){
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}
	return params;
}

function getParams(){
	return {
		companyName:$('#companyName').val(),
		partnerName:$('#partnerName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		prizeStatus:$('#prizeStatus').val(),
		deviceId:$('#deviceId').val(),
		channel:$('#channel').val(),
		userFlag:$('#userFlag').val(),
		name:$('#name').val(),
		zhifubao:$('#zhifubao').val(),
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function inquiryExport(){
	var param = '';
	param += '&companyName=' + $('#companyName').val();
	param += '&partnerName=' + $('#partnerName').val();
	param += '&startDate=' + $('#startDate').val();	
	param += '&endDate=' + $('#endDate').val();
	param += '&prizeStatus=' + $('#prizeStatus').val();
	param += '&deviceId=' + $('#deviceId').val();
	param += '&channel=' + $('#channel').val();
	param += '&userFlag=' + $('#userFlag').val();
	param += '&name=' + $('#name').val();
	param += '&zhifubao=' + $('#zhifubao').val();
	window.location.href = '/device/reward/inquiryexport?'+param;
	return false; //截取返回false就不会保存网页了
}

/**
 * 重新打款
 * @param ydmpayNo
 * @returns
 */
function againPay(ydmpayNo){
	if(ydmpayNo && ydmpayNo != ''){
		if(confirm('是否确认重新发放奖励？')){
			$.post('/device/reward/againpay',{ydmpayNo:ydmpayNo},function(data){
				if(data.code == '200'){
					alert('打款成功');
					doSearch();
				}else{
					alert(data.msg);
				}
			})
		}
	}
}

