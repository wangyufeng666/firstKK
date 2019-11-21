var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"代理商", dataIndex:'COMPANYNAME', width:'150px',sortable:false}
			,{header:"负责人", dataIndex:'CONTACTS', width:'120px',sortable:false
		      	,renderer : function(value, data, rowIndex, colIndex, metadata){
		            return data['CONTACTS']+'('+data['MOBILE']+')';
		          }
			}
			,{header:"批次号", dataIndex:'BATCHCODE', width:'120px',sortable:false}
			,{header:"申请时间", dataIndex:'BA_CREATEDATE', width:'100px',sortable:false}
			,{header:"申请人", dataIndex:'INOPERATORID', width:'60px',sortable:false}
			,{header:"佣金总数", dataIndex:'BRONUM', width:'60px',sortable:false}
			,{header:"佣金金额", dataIndex:'BROAMOUNT', width:'60px',sortable:false}
			,{header:"分成总数", dataIndex:'DIVNUM', width:'60px',sortable:false}
			,{header:"分成金额", dataIndex:'DIVAMOUNT', width:'60px',sortable:false}
			,{header:"卡券总数", dataIndex:'COUNUM', width:'70px',sortable:false}
			,{header:"卡券金额", dataIndex:'COUAMOUNT', width:'70px',sortable:false}
			,{header:"奖励总数", dataIndex:'TOTALNUM', width:'60px',sortable:false}
			,{header:"奖励总金额", dataIndex:'TOTALAMOUNT', width:'60px',sortable:false}
			,{header:"打款时间", dataIndex:'BA_SUREDATE', width:'100px',sortable:false}
			,{header:"打款人", dataIndex:'SUREOPERAID', width:'60px',sortable:false}
			,{header:"操作", dataIndex:'', width:'160px', sortable:false,
	        	   renderer : function(value, data, rowIndex, colIndex, metadata){
	        		     var returnText ='<a class="a_link" href="javascript:void(0);" onclick="batchInfo(\''+data['BATCHCODE']+'\')">查看详情</a> ';
	        		     var isvalid = data['ISVALID']
	        		     if(isvalid == 'N'){
	        		    	 returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="updateStatus(\''+data['BATCHCODE']+'\')">确认打款</a> ';
	        		     }else{
	        		    	 returnText +=' | <a class="a_link" href="javascript:void(0);" >已打款</a> ';
	        		     }
						return returnText;
					}
	           }
		]
		,url:'/device/reward/batchlist'
		,baseParams:initParams()
	});
});

/**
 * 查看批次详情
 * @param batchCode
 * @returns
 */
function batchInfo(batchCode){
    layer.open({
        type: 2,
        title: '批次奖励明细',
        content: '/device/reward/index?batchCode=' + batchCode,
        area: ['90%', '90%']
    });
}


/**
 * 更改奖励批次状态
 * @returns
 */
function updateStatus(batchCode){
	if(confirm('是否确认已转账成功?')){
		$.post('/device/reward/updatebatchstatus',{batchCode:batchCode},function(data){
			if(data == 'Y'){
				window.location.href = window.location.href;
			}else{
				alert('操作失败，请重新操作');
			}
		})
	}
}


function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

function getParams(){
	return {
		agents:$('#agents').val(),
		partnerName:$('#partnerName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		priceFlag:$('#priceFlag').val(),
		status:$('#status').val(),
		orderNo:$('#orderNo').val(),
		rewardGet:$('#rewardGet').val(),
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function brokerageExport(){
	var param = '';
	param += '&name=' + $('#name').val();
	param += '&status=' + $('#status').val();
	param += '&startDate=' + $('#startDate').val();	
	param += '&endDate=' + $('#endDate').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&winStatus=' + $('#winStatus').val();
	param += '&orderNo=' + $('#orderNo').val();
	param += '&sheng=' + $('#sheng').val();
	param += '&shi=' + $('#shi').val()
	window.location.href = '/system/brokerage/brokerageexport?'+param;
	return false; //截取返回false就不会保存网页了
}

