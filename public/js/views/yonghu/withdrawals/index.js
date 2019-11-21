var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    
{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
,{header: "提现单号", dataIndex: 'ORDERCODE', width:'150px',sortable:false}
,{header: "提现日期", dataIndex: 'CREATETIME', width:'120px',sortable:false}
,{header: "手机号", dataIndex: 'MOBILE',width:'80px',sortable:false}
,{header: "提现人", dataIndex: 'PAYEE',width:'100px',sortable:false}
,{header: "提现金额", dataIndex: 'PRICE',width:'80px',sortable:false}
,{header: "提现来源", dataIndex: 'SOURCETXT',width:'80px',sortable:false,}
,{header: "IP", dataIndex: 'IP',width:'120px',sortable:false}
,{header: "提现类型", dataIndex: 'TYPETXT', width:'80px',sortable:false,}
,{header: "提现状态", dataIndex: 'STATUSTXT', width:'80px',sortable:false,}
,{header: "提现到帐时间", dataIndex: 'MODIFYTIME',width:'120px',sortable:false}
,{header: "操作", dataIndex: '', width:'150px', sortable:false,

				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['ORDERCODE']+'\')">详情</a>';
				  	if(data['CONSUMPTION'] == 1){
				  		returnText += ' &nbsp;|&nbsp; ';
				  		returnText +='<a class="a_link" href="javascript:void(0);" onclick="update(\''+data['ORDERCODE']+'\')">修改</a>';
				  	}
				  	return returnText;
				}
           	}
        ]
        ,url : '/yonghu/withdrawals/pagelist'
        ,baseParams:{ordercode:$('#ordercode').val(),mobile:$('#mobile').val(),payee:$('#payee').val(),
        	createtime_start:$('#createtime_start').val(),createtime_end:$('#createtime_end').val(),
        	types:$('#types').val(),status:$('#status').val(),consumption:$('#consumption').val()}
	});
});

/**
 * 详情
 */
function info(ordercode){
	window.location.href = "/yonghu/withdrawals/orderinfo/ordercode/"+ordercode;
}
/**
 * 修改
 */
function update(ordercode){
	window.location.href = "/yonghu/withdrawals/updatestatus/ordercode/"+ordercode;
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
    	consumption:$('#consumption').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
$(function(){
	/**
	 * 修改状态
	 */
	$('#submit_btns').on('click',function(){
		$('#submit_btn').unbind('click');
		var status = $('#status').val();
		var orderNo = $("#orderNo").val();
		var oldstatus = $('#oldstatus').val();
		$.post("/yonghu/withdrawals/updatestatus/",{ordercode:orderNo,status:status,oldstatus:oldstatus,submit:'1'},function(data){
			if(data == 'Y'){
				alert('修改成功');
				window.location.href=window.location.href;
			}else{
				alert('修改失败');
			}
		});
		
	});
	/**
	 * 添加备注
	 */
	$('#submit_btn_memo').on('click',function(){
		$('#submit_btn_memo').unbind('click');
		var orderNo = $("#orderNo").val();
		var memos = $('#memos').val();
		//alert(orderNo)
		$.post("/yonghu/withdrawals/savememos/",{ordercode:orderNo,memos:memos,submit:'1'},function(data){
			if(data == 'Y'){
				alert('操作成功');
				window.location.href=window.location.href;
			}else{
				alert('操作失败');
			}
		});
		
	});
});