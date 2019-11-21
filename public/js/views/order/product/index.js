var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"所属品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'',sortable:false}
			,{header:"商品来源", dataIndex:'MERSOURCE', width:'',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '1'){
						return '<span color="green">线上来源</span>';
					}else if(value == '2'){
						return '线下来源';
					}
				}
			}
			,{header:"操作", dataIndex:'', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:selectMer(\''+data['MERID']+'\',\''+data['PNAME']+data['MERNAME']+'\',\''+data['MERTYPE']+'\')">选择</a>';
				  	return returnText;
				}
		   	}
		]
		,url:'/order/product/pagelist'
		,baseParams:{merType:$('#merType').val(), merName:$('#merName').val(),pinpai:$('#pinpai').val()}
	});
});

/**
 * 更换回收商品
 * create by zhuhaili
 * createdate 2017-6-28
 */
function selectMer(merId, merName, merType){
	if(confirm('当前订单确定更换商品信息？')){
		var param = {merId:merId,merName:merName,oldMerId:oldMerId,orderNo:orderNo,merType:merType};
		$.post("/order/order/replacemer", param, function(data){
			if(data != 'Y'){
				alert('操作失败');
			}
			parent.location.reload();
		})
	}
}

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#pinpai").html("<option value=''>全部</option>");
		for(i in data){
			$("#pinpai").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function getParams(){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val(),
		pinpai:$('#pinpai').val(),
		merSource:$('#merSource').val()
	};
}

function doSearch(){
	grid.query(getParams());
}