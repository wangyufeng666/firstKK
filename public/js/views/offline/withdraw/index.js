var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
	{header: "No.", dataIndex: 'R', width:'30PX',sortable:false} 
	,{header: "提现单号", dataIndex: 'ORDERCODE', width:'150px',sortable:false}
	,{header: "提现日期", dataIndex: 'CREATETIME', width:'120px',sortable:false}
	,{header: "手机号", dataIndex: 'MOBILE',width:'80px',sortable:false}
	,{header: "收款人", dataIndex: 'PAYEE',width:'130px',sortable:false,
		renderer : function(value, data, rowIndex, colIndex, metadata){
			return data['PAYEE']+'-'+data['USERID'];
		}
	}
	,{header: "提现金额", dataIndex: 'PRICE',width:'70px',sortable:false}
	,{header: "提现类型", dataIndex: 'TYPES', width:'80px',sortable:false,
		renderer : function(value, data, rowIndex, colIndex, metadata){
			if(data['TYPES'] == 1){
				var returnText = '微信';
			}else if(data['TYPES'] == 2){
				var returnText = '银行卡';
			}else if(data['TYPES'] == 3){
				var returnText = '支付宝';
			}
			return returnText;
		}
	}
	,{header: "开户行", dataIndex: 'BANKNAME',width:'80px',sortable:false}
	,{header: "卡号", dataIndex: 'BANKNUMBER',width:'120px',sortable:false}
	,{header: "支付宝账号", dataIndex: '',width:'120px',sortable:false,
		renderer : function(value, data, rowIndex, colIndex, metadata){
			returnText = '';
			if(data['TYPES'] == 3){
				returnText = data['BANKCODE'];
			}
			return returnText;
		}
	}
	,{header: "提现来源", dataIndex: 'SOURCETNAME',width:'70px',sortable:false}
	,{header: "提现状态", dataIndex: 'STATUS', width:'70px',sortable:false,
		renderer : function(value, data, rowIndex, colIndex, metadata){
		if(data['STATUS'] == 1){
			var returnText = '待审';
		}if(data['STATUS'] == 2){
			var returnText = '成功';
		}else if(data['STATUS'] == 3){
			var returnText = '失败';
		}else if(data['STATUS'] == 4){
			var returnText = '异常';
		}else if(data['STATUS'] == 5){
			var returnText = '返款';
		}else if(data['STATUS'] == 6){
			var returnText = '关闭';
		}else if(data['STATUS'] == 7){
			var returnText = '支付中';
		}
		return returnText;
		}
	}
	,{header: "审核日期", dataIndex: 'MODIFYTIME',width:'70px',sortable:false}
	,{header: "操作", dataIndex: '', width:'120px', sortable:false,
		renderer : function(value, data, rowIndex, colIndex, metadata){
			var type = data['TYPES'];
			var status = data['STATUS'];
		  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['ORDERCODE']+'\')">详情</a> | ';
		  	if(type == 3 && status == 1){
		  		returnText += '<a class="a_link" href="javascript:void(0);" onclick="apply(\''+data['ORDERCODE']+'\')">审核</a>';
		  		returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="allapply(\''+data['USERID']+'\')">批量审核</a>';
		  	}else if(type == 3 && status == 2){
		  		returnText += '<a class="a_link" href="javascript:void(0);")"><font color="green">已转账</font></a>';
		  	}else if(type == 3 && status == 7){
		  		returnText += '<a class="a_link" href="javascript:void(0);")"><font color="red">转账失败</font></a>';
		  	}else{
		  		returnText +='<a class="a_link" href="javascript:void(0);" onclick="update(\''+data['ORDERCODE']+'\')">修改</a>';
		  	}
		  	return returnText;
			}
   	  }
        ]
        ,url : '/offline/withdraw/pagelist'
        ,baseParams:{ordercode:$('#ordercode').val(),mobile:$('#mobile').val(),payee:$('#payee').val(),
        	createtime_start:$('#createtime_start').val(),createtime_end:$('#createtime_end').val(),
        	types:$('#types').val(),status:$('#status').val(),partnerCode:$('#partner').val(),
        	sourceType:$('#sourceType').val(),orderNo:$('#orderNo').val(),userId:$('#userId').val()}
	});
});

/**
 * 提现详情
 */
function info(ordercode){
	window.location.href = "/offline/withdraw/orderinfo/ordercode/"+ordercode;
}
/**
 * 修改提现
 */
function update(ordercode){
	window.location.href = "/offline/withdraw/updatestatus/ordercode/"+ordercode;
}

/**
 * 功能描述：审核提现信息
 * added by wangbo
 */
function apply(orderCode){
	$.layer({
		type:2,
		title:'支付宝提现审核',
		iframe:{src:'/offline/withdraw/apply?orderCode='+orderCode},
		area:['500' , '350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 功能描述：批量审核提现信息
 * added by wangbo
 */
function allapply(userId){
	$.layer({
		type:2,
		title:'支付宝提现审核',
		iframe:{src:'/offline/withdraw/allapply?userId='+userId},
		area:['800' , '350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

function saveRemark(){
	var remark = $.trim($('#remark').val());
	var orderCode = $("#ordercode").val();
	if(remark != '' && remark != null){
		$.post('/offline/withdraw/insertremark',{orderCode:orderCode, remark:remark},function(data){
		if(data == 'Y'){
			window.location.reload();//刷新
		}else{
			alter(data);
      }
    });
	}else{
    alert('请输入备注信息');
  }
}

function exportWithdraw(){
	var param = '';
	param += '&ordercode=' + $('#ordercode').val();
	param += '&mobile='+$('#mobile').val();
	param += '&payee=' + $('#payee').val();
	param += '&createtime_start=' + $('#createtime_start').val();
	param += '&createtime_end=' + $('#createtime_end').val();
	param += '&types='+$('#types').val();
	param += '&status='+$('#status').val();
	param += '&partnerCode='+$('#partner').val();
	param += '&sourceType='+$('#sourceType').val();
	param += '&orderNo='+$('#orderNo').val();
	param += '&userId='+$('#userId').val();
	window.location.href = '/offline/withdraw/exportwithdraw?'+param;
	return false; //截取返回false就不会保存网页了
}

function getParams(){
    return {
    	ordercode:$('#ordercode').val(), 
    	mobile:$('#mobile').val(),
    	payee:$('#payee').val(),
    	createtime_start:$('#createtime_start').val(),
    	createtime_end:$('#createtime_end').val(),
    	types:$('#types').val(),
    	status:$('#status').val(),
    	partnerCode:$('#partner').val(),
    	sourceType:$('#sourceType').val(),
    	orderNo:$('#orderNo').val(),
    	userId:$('#userId').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
$(function(){
	$('#submit_btn').on('click',function(){
		$('#submit_btn').unbind('click');
		var status = $('#status').val(),ordercode = $('#ordercode').val(),oldstatus = $('#oldstatus').val();
		
		$.post('/offline/withdraw/updatestatus/',{ordercode:ordercode,status:status,oldstatus:oldstatus,submit:1},function(data){
			if(data == 'Y'){
				alert('修改成功');
				window.location.href='/offline/withdraw/index';
			}else{
				alert('修改失败');
			}
		});
	});
});