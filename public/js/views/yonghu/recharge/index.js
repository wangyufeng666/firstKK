var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    
{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
,{header: "充值单号", dataIndex: 'RECHARGECODE', width:'150px',sortable:false}
,{header: "充值日期", dataIndex: 'CREATETIME', width:'120px',sortable:false}
,{header: "手机号", dataIndex: 'MOBILE',width:'80px',sortable:false}
,{header: "充值金额", dataIndex: 'PRICE',width:'80px',sortable:false}
,{header: "订单来源", dataIndex: 'SOURCETXT',width:'80px',sortable:false,}
,{header: "IP", dataIndex: 'IP',width:'120px',sortable:false}
,{header: "充值状态", dataIndex: 'STATUS', width:'80px',sortable:false,
	renderer : function(value, data, rowIndex, colIndex, metadata){
		if(data['STATUS'] == 1){
			var returnText = '成功';
		}else{
			var returnText = '失败';
		}
		return returnText;
	}
}
,{header: "操作", dataIndex: '', width:'150px', sortable:false,

				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['RECHARGECODE']+'\')">详情</a> | ';
				  	returnText +='<a class="a_link" href="javascript:void(0);" onclick="update(\''+data['RECHARGECODE']+'\')">修改</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/yonghu/recharge/pagelist'
        ,baseParams:{rechargecode:$('#rechargecode').val(),mobile:$('#mobile').val(),
        	createtime_start:$('#createtime_start').val(),createtime_end:$('#createtime_end').val(),
        	status:$('#status').val()}
	});
});

/**
 * 详情
 */
function info(rechargecode){
	window.location.href = "/yonghu/recharge/rechargeinfo/rechargecode/"+rechargecode;
}
/**
 * 修改
 */
function update(rechargecode){
	window.location.href = "/yonghu/recharge/rechargeupdate/rechargecode/"+rechargecode;
}
/**
 * 添加备注
 */
$('#submit_btn_memo').on('click',function(){
	$('#submit_btn_memo').unbind('click');
	var rechargecode = $("#rechargecode").val();
	var memos = $('#memos').val();
	//alert(orderNo)
	$.post("/yonghu/recharge/savememos/",{rechargecode:rechargecode,memos:memos,submit:'1'},function(data){
		if(data == 'Y'){
			alert('操作成功');
			window.location.href=window.location.href;
		}else{
			alert('操作失败');
		}
	});
	
});
function getParams(){
    return {
    	rechargecode:$('#rechargecode').val(), 
    	mobile:$('#mobile').val(),
    	createtime_start:$('#createtime_start').val(),
    	createtime_end:$('#createtime_end').val(),
    	status:$('#status').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
