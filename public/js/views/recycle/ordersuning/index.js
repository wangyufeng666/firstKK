var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :20,
		height:250
		,cm : [
		    
{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
,{header: "预约时间", dataIndex: 'SUBSCRIBETIME',width:'100px',sortable:false}
,{header: "订单单号", dataIndex: 'ORDERCODE', width:'100px',sortable:false}
,{header: "旧机名称", dataIndex: 'MERNAME', width:'120px',sortable:false}
,{header: "询价金额", dataIndex: 'INQUIRYPRICE',width:'80px',sortable:false}
,{header: "成交金额", dataIndex: 'SETTLEPRICE',width:'80px',sortable:false}
,{header: "状态", dataIndex: 'STATUS',width:'80px',sortable:false}
,{header: "回收商", dataIndex: 'RECYCLENAME',width:'80px',sortable:false,}
,{header: "城市", dataIndex: 'CITY',width:'80px',sortable:false}
,{header: "联系人", dataIndex: 'LINKMAN', width:'80px',sortable:false,}
,{header: "手机号码", dataIndex: 'MOBILE', width:'80px',sortable:false,}
,{header: "导入时间", dataIndex: 'CREATETIME',width:'100px',sortable:false}
,{header: "操作", dataIndex: '', width:'100px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['ORDERCODE']+'\')">详情</a>';
				  	returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="del(\''+data['ORDERCODE']+'\')">删除</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/recycle/ordersuning/pagelist'
        ,baseParams:{ordercode:$('#ordercode').val(),mobile:$('#mobile').val(),linkman:$('#linkman').val(),
        	time_start:$('#time_start').val(),time_end:$('#time_end').val(),
        	recyclename:$('#recyclename').val(),mername:$('#mername').val()}
	});
});

/**
 * 详情
 */
function info(ordercode){
	window.location.href = "/recycle/ordersuning/orderinfo/ordercode/"+ordercode;
}
/**
 * 导出
 */
function exportorder(){
	window.location.href = "/recycle/ordersuning/exportorder";
}
/**
 * 删除
 */
function del(ordercode){
	if(confirm('你确定要删除吗？？？')){
	$.post("/recycle/ordersuning/orderdel/",{ordercode:ordercode,submit:'1'},function(data){
		if(data == 'Y'){
			alert('操作成功');
			window.location.href=window.location.href;
		}else{
			alert('操作失败');
		}
	});
	}
}

function getParams(){
    return {
    	ordercode:$('#ordercode').val(), 
    	mobile:$('#mobile').val(),
    	linkman:$('#linkman').val(),
    	time_start:$('#time_start').val(),
    	time_end:$('#time_end').val(),
    	recyclename:$('#recyclename').val(),
    	mername:$('#mername').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
$(function(){
	/**
	 * 添加备注
	 */
	$('#submit_btn_remarks').on('click',function(){
		$('#submit_btn_remarks').unbind('click');
		var orderNo = $("#ordercode").text();
		var remarks = $('#remarks').val();
		$.post("/recycle/ordersuning/saveremarks/",{ordercode:orderNo,remarks:remarks,submit:'1'},function(data){
			if(data == 'Y'){
				alert('操作成功');
				window.location.href=window.location.href;
			}else{
				alert('操作失败');
			}
		});
		
	});
	/**
	 * csv导入
	 */
	$('#doadd').change(function(){
		$('#add_csv').submit();
	});
});