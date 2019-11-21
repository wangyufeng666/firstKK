var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px', sortable:false}
			,{header:"创建时间", dataIndex:'CREATETIME', width:'120px', sortable:false}
			,{header:"故障编号", dataIndex:'CODE', width:'130px', sortable:false}
			,{header:"联系方式", dataIndex:'UNAME', width:'140px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['MOBILE']+')';
				}
			}
			,{header:"联系地址", dataIndex:'ADDRESS', width:'100px', sortable:false}
			,{header:"IMEI", dataIndex:'IMEI', width:'120px', sortable:false}
			,{header:"产品编号", dataIndex:'MERID', width:'80px', sortable:false}
			,{header:"产品名", dataIndex:'MERNAME', width:'80px', sortable:false}
			,{header:"产品型号", dataIndex:'MODEL', width:'80px', sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'80px', sortable:false}
			,{header:"故障描述", dataIndex:'DESCRIBES', width:'100px', sortable:false}
			,{header:"备注", dataIndex:'REMARKS', width:'80px', sortable:false}
			,{header:"操作", dataIndex:'CODE', width:'100px', sortable:false,
				renderer:function (value, data, rowIndex, colIndex, metadata) {
					var status = data['STATUS'];
					var returnText = '<a href="javascript:faultInfo(\'' + value + '\')" class="a_link">详情</a>';
					if(status == '0'){
						returnText += ' | <a href="javascript:auditApply(\'' + value + '\')" class="a_link">审核</a>';
						returnText += ' | <a href="javascript:closeAudit(\'' + value + '\')" class="a_link">关闭</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/rent/machinefault/list'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
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
function getParams(){
	return {
		startCreateDate:$('#startCreateDate').val(),
		endCreateDate:$('#endCreateDate').val(),
		mobile:$('#mobile').val(),
		address:$('#address').val(),
		status:$('#status').val(),
		imei:$('#imei').val(),
		merId:$('#merId').val(),
		merName:$('#merName').val(),
		code:$('#code').val()
	};
}

/**
 * 已审核
 * @param code
 */
function auditApply(code){
	layer.confirm('是否确认已审核?', function(index){
		$.post('/rent/machinefault/auditapply', {code:code}, function(data){
			if(data['code'] == '1000'){
				layer.msg("已审核成功");
				grid.reload();
			}else{
				layer.msg(data['msg']);
			}
		});
		layer.close(index);
	});
}

/**
 * 关闭审核
 * @param code
 */
function closeAudit(code){
	layer.confirm('是否确认关闭审核?', function(index){
		$.post('/rent/machinefault/closeaudit', {code:code}, function(data){
			if(data['code'] == '1000'){
				layer.msg("关闭审核成功");
				grid.reload();
			}else{
				layer.msg(data['msg']);
			}
		});
		layer.close(index);
	});
}

function doSearch(){
	grid.query(getParams());
}

function faultInfo(value){
    layer.open({
        type:2,
        title:'保修详情',
        shadeClose:false,
        shade:0.8,
        content:'/rent/machinefault/faultinfo?value='+value,
        area:['600px', '550px'],
        resize:false,
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 导出报表
 */
function exportReport(){
	var params = getParams();
	parmStr = "";
	for(var i in params){
		parmStr += i + "=" + params[i] + "&";
	}
	window.location.href = "/rent/machinefault/exportreport?" + parmStr;
}
