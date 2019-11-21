var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['MERTYPENAME']+' '+data['PNAME'];
				}
			}
			,{header:"商品名称", dataIndex:'MERNAME', sortable:false}
			,{header:"状态", dataIndex:'CHULIREN1',width:'80px',sortable:false,
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
			,{header:"操作", dataIndex:'MERID', width:'60px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	return '<a class="a_link" href="javascript:getSelectMer1(\''+value+'\', '+JSON.stringify(data).replace(/"/g, '&quot;')+')">选择</a>';
				}
		   	}
		]
		,url:'/recycle/product/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
	});
	
	/**
	 * 品类改变事件
	 */
	$("#merType").change(function(){
		var merType = $(this).val();
		if(merType != ''){
			$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
				$("#brandCode").html("<option value=''>全部</option>");
				for(i in data){
					$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
				}
			}, 'json');
		}else{
			$("#brandCode").html("<option value=''>全部</option>");
		}
	});
	
	/**
	 * 品牌改变事件
	 */
	$('#brandCode').change(function(){
		var brandCode = $(this).val();
		if(brandCode != ''){
			doSearch();
		}
	});
});

function getParams(){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val(),
		brandCode:$('#brandCode').val(),
		source:1
	};
}

function doSearch(){
	grid.query(getParams());
}

function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

document.onkeypress = keypress;

/**
 * 选中商品
 * @returns
 */
function getSelectMer1(merId, merInfo){
	if(clickData){
		parent.getSaleSelectMer(merId, merInfo, clickData);
	}else{
		parent.getSelectMer(merId, merInfo);
	}
}
