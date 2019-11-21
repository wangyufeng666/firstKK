var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "订单编号", dataIndex: 'ORDERNO', width:'10%',sortable:false}
		   ,{header: "派单时间", dataIndex: 'ASSIGNDATE', width:'8%',sortable:false}
           ,{header: "地址", dataIndex: 'DIZHI', width:'10%',sortable:false}
           ,{header: "品牌", dataIndex: 'PNAME', width:'5%',sortable:false}
           ,{header: "商品名", dataIndex: 'MERNAME', width:'8%',sortable:false}
           ,{header: "交易方式", dataIndex: 'TRADETYPE', width:'5%',sortable:false}
           ,{header: "支付方式", dataIndex: 'PAYTYPENAME', width:'5%',sortable:false}
           ,{header: "订单状态", dataIndex: 'DINGDANSTATUS', width:'5%',sortable:false}
           ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'8%',sortable:false}
           ,{header: "终止原因", dataIndex: 'ZZCASE', width:'6%',sortable:false}
	]
	,url : '/system/inspector/taskinfopagelist'
    ,baseParams:{isAll:'all',inspectorId:$('#inspectorId').val()}
  });
});


/**
 * 删检测人员
 */
function deleteInspector(inspectorId){
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/system/inspector/deleteinspector"  //请求路径
        ,data : {inspectorId:inspectorId}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
		,success : function(data){
    		if(data == "Y"){
    			window.location.href = "/system/inspector/";
            }
		}
	});
}

/**
 * 修改检测人员信息
 */

function editInspector(inspectorId){
	window.location.href = "/system/inspector/editinspector?inspectorId="+inspectorId;
}

function getParams(){
    return {
    	orderStatus:$('#orderStatus').val(),
    	tradeType:$('#tradeType').val(),
    	address:$('#address').val(),
    	payType:$('#payType').val(),
    	sources:$('#sources').val(),
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val()
    };
}

function doSearch(){
	grid.query(getParams());
}
