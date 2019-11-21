var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"分类编码", dataIndex:'TYPECODE', width:'80PX',sortable:false}
			,{header:"分类类名称", dataIndex:'TYPENAME', sortable:false}
			,{header:"状态", dataIndex:'ENABLEFLAG', width:'100PX',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == 'Y'){
						return '<span style="color:green;">已启用</span>';
					}else if(value == 'N'){
						return '<span style="color:red;">已停用</span>';
					}else if(value == 'C'){
						return '<span style="color:red;">未启用</span>';
					}else{
						return value;
					}
				}
			}
			,{header:"排列序号", dataIndex:'SEQ', width:'80PX',sortable:false}
		]
		,url:'/recycle/mertypes/pagelist'
		,baseParams:{categoryCode:$('#categoryCode').val()}
	});
});