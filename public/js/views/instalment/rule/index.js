var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false}
			,{header: "规则名称", dataIndex: 'RULE_NAME', width:'200px',sortable:false}
			,{header: "分期总数", dataIndex: 'TOTAL_PERIODS', width:'100px',sortable:false} 
			,{header: "每期天数", dataIndex: 'PERIOD_DAYS', width:'100px',sortable:false} 
			,{header: "手续费费率 %", dataIndex: 'FEE_RATE', width:'100px',sortable:false}
			,{header: "备注", dataIndex: 'REMARKS', width:'',sortable:false} 
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
				    var html = "<a class='a_link' href='javaScript:void(0)' onclick=''>停用</a>";
				    return html;
				}
			}
		]
		,url:'/instalment/rule/getrulelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
	
	
	$("#addNewRule").bind("click", function(){addNewRule();});
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

function getParams(){
	return {
//		merName:$('#merName').val(),
//		orderNo:$('#orderNo').val(),
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

function addNewRule(){
    //window.location.href = "/instalment/rule/addnewrule";
    $.layer({
        type:2,
        title:'订单状态修改',
        iframe:{src:'/instalment/rule/addnewrule'},
        area:['450' , '400'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
    
}

