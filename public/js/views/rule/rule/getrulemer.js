var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15
	   ,height:375
	   ,cm:[
			{header:"NO.", dataIndex:'R', width:'5%',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'8%',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'8%',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'8%',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'25%',sortable:false}
			,{header:"商品来源", dataIndex:'MERSOURCE', width:'8%',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['MERSOURCE'] == '1'){
						var returnText = '<span class="green">线上商品</span>';
					}else if(data['MERSOURCE'] == '2'){
						var returnText = '<span class="red">线下商品</span>';
					}
					return returnText;
				}
			}
			,{header:"热度", dataIndex:'REDU', width:'8%',sortable:false}
			,{header:"状态", dataIndex:'CHULIREN1',width:'8%',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ENABLED'] == 'Y'){
						var returnText = '已启用';
					}else if(data['ENABLED'] == 'N'){
						var returnText = '已删除';
					}else if(data['ENABLED'] == 'C'){
						var returnText = '未启用';
					}else if(data['ENABLED'] == 'H'){
						var returnText = '已隐藏';
					}
					return returnText;
				}
			}
		]
		,url:'/product/product/pagelist'
		,baseParams:{merType:$('#merType').val(), merName:$('#merName').val(),pinpai:$('#pinpai').val(),ruleId:ruleId}
	});
});

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#pinpai").html("<option value=''>全部</option>");
		for(i in data){
			$("#pinpai").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function goback(ruleId){
	window.location.href = "/rule/rule/ruleinfo?ruleId="+ruleId;
}

function getParams(ruleId){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val(),
		pinpai:$('#pinpai').val(),
		merSource:$('#merSource').val(),
		ruleId:ruleId
	};
}

function doSearch(ruleId){
	grid.query(getParams(ruleId));
}