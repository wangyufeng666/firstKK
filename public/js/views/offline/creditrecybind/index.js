var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "合作商名称", dataIndex: 'PARTNERNAME', width:'70px',sortable:false}
			,{header: "合作商联系人", dataIndex: '', width:'70px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'-'+data['CONTACTWAY'];
				}
			}
			,{header: "合作商编码", dataIndex: 'PARTNERCODE', width:'50px',sortable:false}
			,{header: "闲置支付编码", dataIndex: 'RELA_PARTNERCODE', width:'50px',sortable:false}
			,{header: "绑定日期", dataIndex: 'BINDDATE', width:'80px',sortable:false}
		]
		,url:'/offline/creditrecybind/pagelist'
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

function importInfo(){	
    $.layer({
        type : 2,
        title : '导入线下闲置支付信息',
        iframe : {src : '/offline/creditrecybind/import'},
        area : ['400' , '300'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
            doSearch();
        }
    });
}

function getParams(){
	return {
		partnerName:$('#partnerName').val(),
		partnerCode:$('#partnerCode').val(),
		relaPartnerCode:$('#relaPartnerCode').val(),
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
