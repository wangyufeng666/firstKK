var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
			  ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
			  ,{header: "维修单号", dataIndex: 'ORDERNO', width:'10%',sortable:false}
			  ,{header: "报修单号", dataIndex: 'PREORDERNO', width:'10%',sortable:false}
			  ,{header: "租赁单号", dataIndex: 'RENT_ORDERNO', width:'12%',sortable:false}
			  ,{header: "机器名称", dataIndex: 'MERNAME', width:'10%',sortable:false}
			  ,{header: "IMEI", dataIndex: 'IMEI', width:'10%',sortable:false}
			  ,{header: "联系人", dataIndex: 'CONTACT_NAME', width:'6%',sortable:false}
			  ,{header: "手机号码", dataIndex: 'CONTACT_MOBILE', width:'8%',sortable:false}
			  ,{header: "维修结果", dataIndex: 'RESULTS_TXT', width:'10%',sortable:false}
			  ,{header: "状态", dataIndex: 'STATUS_TXT', width:'10%',sortable:false}
			  ,{header: "操作", dataIndex: '', width:'15%', sortable:false,
					renderer : function(value, data, rowIndex, colIndex, metadata){
					  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="infos(\''+data['PKID']+'\')">详情</a>';
					  	
					  	return returnText;
					}
	           	}
		]
		,url : '/repairs/repairs/pagelist'
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
	window.location.href = "/repairs/repairs/orderinfosel?pkid="+pkid+"&backUrl="+backUrl;
}

/**
 * 返回上一页
 */
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