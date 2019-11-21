var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
			  ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
			  ,{header: "租赁订单编号", dataIndex: 'ORDER_NO', width:'15%',sortable:false}
			  ,{header: "新机名称", dataIndex: 'MERNAME', width:'15%',sortable:false}
			  ,{header: "新品价格", dataIndex: 'NEW_PRODUCT_PRICE', width:'5%',sortable:false}
			  ,{header: "总租金", dataIndex: 'TOTAL_PRICE', width:'5%',sortable:false}
			  ,{header: "联系人", dataIndex: 'CONTACT_NAME', width:'10%',sortable:false}
			  ,{header: "手机号码", dataIndex: 'CONTACT_MOBILE', width:'10%',sortable:false}
			  ,{header: "操作", dataIndex: '', width:'25%', sortable:false,
			
							renderer : function(value, data, rowIndex, colIndex, metadata){
							  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="infos(\''+data['PKID']+'\')">详情</a>';
							  		returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="repairgo(\''+data['PKID']+'\')">报修</a>';
							  	return returnText;
							}
			           	}
		]
		,url : '/repairs/rentgome/pagelist'
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
 * 详情
 */
function infos(pkid){
	window.location.href = "/repairs/rentgome/orderinfo?pkid="+pkid+"&backUrl="+backUrl;
}
/**
 * 报修
 */
function repairgo(pkid){
	window.location.href = "/repairs/rentgome/reportrepair?pkid="+pkid+"&backUrl="+backUrl;
}
function goBack(){
	window.location.href = backUrl;
}
function getParams(){
    return {
    	uname:$('#uname').val(), 
    	mobile:$('#mobile').val()
    };
}
function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg,type:8}
	});
}