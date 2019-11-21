var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15
	   ,height:375
	   ,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', sortable:false}
			,{header:"商品来源", dataIndex:'MERSOURCE', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['MERSOURCE'] == '1'){
						var returnText = '<span class="green">线上商品</span>';
					}else if(data['MERSOURCE'] == '2'){
						var returnText = '<span class="red">线下商品</span>';
					}
					return returnText;
				}
			}
			,{header:"热度", dataIndex:'REDU', width:'80px', sortable:false}
			,{header:"状态", dataIndex:'ENABLED', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ENABLED'] == 'Y'){
						var returnText = '<span class="green">已启用</span>';
					}else if(data['ENABLED'] == 'N'){
						var returnText = '<span class="red">已停用</span>';
					}else if(data['ENABLED'] == 'C'){
						var returnText = '<span class="blue">新增未启用</span>';
					}else if(data['ENABLED'] == 'H'){
						var returnText = '<span class="red">已隐藏</span>';
					}
					return returnText;
				}
			}
		]
		,url:'/recycle/product/pagelist'
		,baseParams:{merType:$('#merType').val(), merName:$('#merName').val(),pinpai:$('#pinpai').val(),ruleId:ruleId}
	});
});

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#pinpai").html("<option value=''>全部</option>");
		for(i in data){
			$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function getParams(){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val(),
		brandCode:$('#brandCode').val(),
		source:$('#source').val(),
		status:$('#status').val(),
		ruleId:ruleId
	};
}

function doSearch(){
	grid.query(getParams());
}