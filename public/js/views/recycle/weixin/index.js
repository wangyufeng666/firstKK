var grid;
$().ready(function() {
	grid = $('#grid').grid({
		pageSize:15
		,height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px', sortable:false}
			,{header:"小程序商品名称", dataIndex:'SPTYPE', width:'200PX', sortable:false}
			,{header:"商品名称", dataIndex:'SPNAME', sortable:false}
			,{header:"产品ID", dataIndex:'', width:'260px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<input type="text" class="spidFlag" value="'+data['SPID']+'"/>';
				}
			},{header:"有效状态", dataIndex:'BINDFLAG', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['BINDFLAG'] == 'Y' ? '有效' : '无效';
				}
			}
			,{header:"操作", dataIndex:'', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var type = data['SPTYPE'];
					return  '<a href="javascript:void(0);" onclick="save(\''+type+'\',\''+rowIndex+'\')" class="a_link">保存</a>';
				}
			}
		]
		,url:'/recycle/weixin/pagelist'
	});
});

function save(type, rowIndex) {
	var value = '';
	$('input.spidFlag').each(function(index){
		if(index == rowIndex){
			value = $(this).val();
		}
	});
	if(value){
		if((value.length == '32')){
			$.post('/recycle/weixin/update', {spId:value,spType:type}, function(data) {
				if(data == '200'){
					layer.load('保存成功', 2);
				}else{
					layer.load('产品ID错误，请重新输入',2);
				}
			}, 'json');
		}else{
			layer.load('产品ID必须是32位', 2);
		}
	}else{
		layer.load('产品ID不可以为空', 2);
	}
}