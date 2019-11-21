var daily, layerIndex = 0;
$().ready(function(){
	daily = $('#daily').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"初检日期", dataIndex:'CREATEDATE', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var merName = data['PNAME']+' '+data['MERNAME'];
					var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
					return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['CREATEDATE']+'</span>';
				}
			}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header:"联系地址", dataIndex:'DIZHI', width:'160px',sortable:false}
			,{header:"运单号", dataIndex:'EXPRESSNUM',width:'80px',sortable:false}
			,{header:"库编号", dataIndex:'MERBOXID', width:'130px',width:'80px',sortable:false}
			,{header:"操作人", dataIndex:'USERNAME', width:'80px',sortable:false}
		]
		,url:'/order/initialcheck/pagelistlog'
		,baseParams:logInitParams()
		,afterRender:function(e, daily){
			layer.close(layerIndex);
		}
	});
});

function logInitParams(){
	return getLogParams();
}

function getLogParams(){
	return {
		startDate:$('#logStartDate').val(),
		endDate:$('#logEndDate').val()
	};
}
/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo, merName, orderPrice){
	layer.close(layerIndex);
	$.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
		});
	});
}

/**
 * 导出初检日志
 * @param orderNo
 */
function exportLog(){
	var startCreateDate = $("#startCreateDate").val();
    var endCreateDate = $("#endCreateDate").val();
    if(startCreateDate == ''){
    	alert('请选择开始日期');
    	return false;
	}
    if(endCreateDate == ''){
        alert('请选择结束日期');
        return false;
    }
	window.location.href='/order/initialcheck/exportlog?endCreateDate='+endCreateDate+'&startCreateDate='+startCreateDate;
}

/**
 * 清空本次初检日志
 * @param orderNo
 */
function emptyLog(){
    var startCreateDate = $("#startCreateDate").val();
    var endCreateDate = $("#endCreateDate").val();
    if(startCreateDate == ''){
        alert('请选择开始日期');
        return false;
    }
    if(endCreateDate == ''){
        alert('请选择结束日期');
        return false;
    }
	if(confirm('请先导出日志，清空后不能导出日志，确认清空吗？')){
        $.post('/order/initialcheck/emptylog',{startCreateDate:startCreateDate,endCreateDate:endCreateDate}, function(data){
            if(data == 'Y'){
                daily.reload();
			}else{
            	alert('清空失败')
			}
        });
	}
}

