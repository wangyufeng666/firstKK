var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"品牌ID", dataIndex:'PID', width:'80PX',sortable:false}
			,{header:"品牌名称", dataIndex:'PNAME', width:'100PX',sortable:false}
			,{header:"品牌编号", dataIndex:'PCODE', width:'100PX',sortable:false}
			,{header:"英文名", dataIndex:'ENAME', width:'100PX',sortable:false}
			,{header:"显示顺序", dataIndex:'SEQ', width:'80PX',sortable:false}
			,{header:"状态", dataIndex:'ISENABLE', width:'80PX',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ISENABLE'] == 'Y'){
						return "<span class='green'>已启用</span>";
					}else if(data['ISENABLE']=='N'){
						return "<span class='red'>已停用</span>";
					}else if(data['ISENABLE']=='C'){//新增
						return "<span class='blue'>新增未启用</span>";
					}else{
						return data['ISENABLE'];
					}
				}
			}
		]
		,url:'/recycle/brand/pagelist'
		,baseParams:{mertype:$('#mertype').val()}
	});
});

