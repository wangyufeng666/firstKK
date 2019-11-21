var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "公司名称", dataIndex: 'COMPANYNAME', width:'80px',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
		]
		,url:'/offline/company/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

function addCompany(){
	window.location.href = '/offline/company/addcompany';
}

function getParams(){
	return {
		companyName:$('#companyName').val(),
		companyCode:$('#companyCode').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
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
		dialog:{msg:msg, type:8}
	});
}
