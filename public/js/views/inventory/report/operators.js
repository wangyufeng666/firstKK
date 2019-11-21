var grid;
$().ready(function(){
	grid = $('#grid').grid({
	
	height:250
		,cm :[
			{header:"NO.",dataIndex:'R',width:'50px',sortable:false}
			,{header:"仓管员",dataIndex:'USERNAME',width:'200px',sortable:false}
			,{header:"入库日期",dataIndex:'INWAREDATE',width:'200px',sortable:false}
			,{header:"入库数",dataIndex:'INCOUNT',width:'150px',sortable:false,
				/*renderer:function(value,data,rowIndex,colIndex,metadata){
					var inoperatorid = data['INOPERATORID'];//入库ID
					
					var spid = data['SPID'];//商品ID
					
					return '<a class="a_link" href="javascript:showRuleMers(\''+inoperatorId+'\',\''+spId+'\')">'+data['INCOUNT']+'</a>';
				}
			  */
			}
			,{header:"出库数",dataIndex:'OUTCOUNT',width:'150px',sortable:false}
			,{header:"操作",dataIndex:'',width:'250px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					
				}
			 }
			
		]
	,url:'/inventory/report/operatorslist',
	});
});