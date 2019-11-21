var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :15,
		height:375,
		cm : [
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
			,{header: "创建时间", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
			,{header: "合作商名称", dataIndex: 'PROVIDERNAME', width:'30%',sortable:false}
			,{header: "联系人", dataIndex: 'LIANXIREN', width:'10%',sortable:false}
			,{header: "联系电话", dataIndex: 'DIANHUA', width:'10%',sortable:false}
			,{header: "资金池金额", dataIndex: 'POOLPRICE', width:'10%',sortable:false}
			,{header: "状态", dataIndex: 'STATUS', width:'10%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '有效' : '无效';
				}
			}
			,{header: "操作", dataIndex: '', width:'15%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var providerId = data['PROVIDERID'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:void(0);" onclick="accountInfo(\''+providerId+'\')" class="a_link">查看</a>';
					if(status == '1'){//未付款终止
						returnText+=' | <a href="javascript:void(0);" onclick="recharge(\''+providerId+'\')" class="a_link">充值</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/sale/cashpool/pagelist'
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
function accountInfo(providerId){
	window.location.href = "/sale/cashpool/accountinfo?providerId="+providerId+"&backUrl="+backUrl;
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function recharge(providerId){
	$.layer({
		type:2,
		title:'充值',
		iframe:{src:'/sale/cashpool/torecharge?providerId='+providerId},
		area:['400', '300'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
    return {
    	providerName:$('#providerName').val(),
    	contactway:$('#contactway').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}