var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		width:"100%",
		//height:"100%",
		height:375,
		autowidth:true
		,cm:[
			{header:"NO.", dataIndex:'R',width: '50px' }
			,{header:"记录ID", dataIndex:'RECORDID',sortable:false,width: '200px'}
			,{header:"快递公司", dataIndex:'EXPRESSCOMPANY',sortable:false}
			,{header:"快递单号", dataIndex:'EXPRESSNUMBER',sortable:false}
			,{header:"录入备注", dataIndex:'INPUTREMARKS',sortable:false}
			,{header:"录入人", dataIndex:'INPUTMAN1',sortable:false}
			,{header:"录入时间", dataIndex:'INPUTDATE1',sortable:false}
			,{header:"录入备注", dataIndex:'INPUTREMARKS',sortable:false}
			,{header:"快递来源", dataIndex:'SOURCE',sortable:false}
			,{header:"处理人", dataIndex:'PROCESSMAN1',sortable:false}
			,{header:"处理时间", dataIndex:'PROCESSDATE1',sortable:false}
			,{header:"处理备注", dataIndex:'PROCESSREMARKS',sortable:false}
			,{header:"快递状态", dataIndex:'STATUS',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS'] == '2'){
						var returnText = '<span class="green">已处理</span>';
					}else if(data['STATUS'] == '1'){
						var returnText = '<span class="red">待处理</span>';
					}else{
						var returnText = '<span class="red">待定</span>';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', width:'150px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS'] == '2'){
						return  '已处理';
					}else{
						return ' <a class="a_link" href="javascript:editThis(\''+data['RECORDID']+'\')">修改</a>';
					}
				}
		   	}
		]
		,url:'/express/express/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
	});
});


/**
 * 新增回收商品
 * @return
 */
function addExpressMer(){
	layer.open({
		type:2,
		title:'新增回收商品信息',
		shadeClose:false,
		shade:0.8,
		content:'/express/express/addmer',
		area:['50%','60%'],
		close:function(index){
			layer.close(index);
		}
   });
}

function getParams(){
	return {
		expressCompany:$('#expressCompany').val(),
		expressNumber:$('#expressNumber').val(),
		source:$('#source').val(),
		status:$('#status').val(),
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

/**
 * @param RECORDID
 */
function editThis(RECORDID){
	layer.open({
		type:2,
		title:'修改',
		shadeClose:false,
		shade:0.8,
		content:"/express/express/updateexpress?RECORDID="+RECORDID,
		area:['45%','30%'],
		close:function(index){
			layer.close(index);
		}
	});
}


