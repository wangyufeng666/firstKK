var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"用户手机", dataIndex:'MOBILE', width:'80px',sortable:false}
			,{header:"个人订单总金额", dataIndex:'perPrice', width:'120px',sortable:false}
			,{header:"邀好友总金额", dataIndex:'invitePrice', width:'100px',sortable:false}
			,{header:"冻结总金额", dataIndex:'thawPrice', width:'80px',sortable:false}
			,{header:"可提现总金额", dataIndex:'useWithdrawalPrice', width:'80px',sortable:false}
			,{header:"钱包异常状态", dataIndex:'SOCKFLAG', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SOCKFLAG'] == 'N'){
						return '正常';
					}else{
						return '冻结中 | ' + '<a class="a_link" href="javascript:unLock(\''+data['USERID']+'\')">去解冻</a>';
					}
				}
			}
			,{header:"操作", dataIndex:'DINGDANNO', width:'120px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '' ;
					if(data['useWithdrawalPrice'] > 0 && data['SOCKFLAG'] == 'N' ){
						returnText += ' <a class="a_link" href="javascript:payment(\''+data['useWithdrawalPrice']+'\',\''+data['USERID']+'\')">确认付款</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/caiwu/payment/appaccountlist'
		,pageSizeList:[30,50]
	});
});


/**
 * 付款
 * @param price
 * @param userId
 */
function payment(price,userId){
    layer.open({
        type:2,
        title:'订单支付',
        shadeClose:false,
        shade:0.8,
        content:'/caiwu/payment/toapppayment?price='+price + '&userId='+userId,
        area:['500px','350px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * @param userId
 */
function unLock(userId) {
	if (confirm("是否进行解冻？")){
		$.ajax({
			type:'POST'//请求方式
			,url:"/caiwu/payment/unlockaccount"  //请求路径
			,data:{userId:userId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(result){
				if (result == 'Y'){
					layer.msg('解冻成功');
					doSearch();
				}else{
					layer.msg('解冻失败');
				}
			}
		});
	}
}

function getParams(){
    return {
		mobile:$('#mobile').val(),
    }
}

function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll();
	grid.reload();
}

//渠道change事件
$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});
