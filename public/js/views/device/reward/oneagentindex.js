var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:380
		,cm:[
			{checkbox:true}
			,{header:"No.", dataIndex:'R', width:'40PX',sortable:false} 
			,{header:"代理商名称", dataIndex:'COMPANYNAME', width:'150px',sortable:false}
			,{header:"负责人", dataIndex:'CONTACTS', width:'120px',sortable:false
		      	,renderer : function(value, data, rowIndex, colIndex, metadata){
		            return data['CONTACTS']+'('+data['MOBILE']+')';
		          }
			}
			,{header:"佣金总数", dataIndex:'BRO_COUNTS', width:'60px',sortable:false}
			,{header:"佣金金额", dataIndex:'BRO_PRICE', width:'60px',sortable:false}
			,{header:"分成总数", dataIndex:'DIV_COUNTS', width:'60px',sortable:false}
			,{header:"分成金额", dataIndex:'DIV_PRICE', width:'60px',sortable:false}
			,{header:"卡券总数", dataIndex:'COU_COUNTS', width:'70px',sortable:false}
			,{header:"卡券金额", dataIndex:'COU_PRICE', width:'70px',sortable:false}
			,{header:"奖励总数", dataIndex:'COUNTS', width:'60px',sortable:false}
			,{header:"奖励总金额", dataIndex:'PRICES', width:'60px',sortable:false}
		]
		,url:'/device/reward/oneagentlist'
		,baseParams:initParams()
	});
});

/**
 * 批量请求出库
 */
function sendReward(){
	var typeCodes = ''; 
	var result = grid.getSelections();
	var j=0;
	if(result == ''){
		alert('请选择申请打款的代理商');
	}else{
		for(var i = 0; i < result.length ; i++){
			j++
			typeCodes += "'"+result[i].TYPECODE+"',";
		}
		if(confirm('是否确定一共'+j+'家代理商申请打款')){
			$.post('/device/reward/sendreward',{typeCodes:typeCodes},function(data){
				if(data == 'Y'){
					alert('申请成功');
					doSearch();//刷新
				}else{
					alert('申请失败，请重新操作');
				}
			});
		}
	}
}


function initParams(){
	var params = getParams();
	params['rewardGet'] = $('#rewardGet').val();
	params['status'] = $('#status').val();
	if(backFlag == 'Y'){
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}
	return params;
}

function getParams(){
	return {
		agents:$('#agents').val(),
		contacts:$('#contacts').val(),
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}