var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"商品类型", dataIndex:'MERTYPE', width:'50px',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'40px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'160px',sortable:false}
			,{header:"合作商", dataIndex:'PARTNERNAME', width:'80px',sortable:false}
			,{header:"平均价格", dataIndex:'AVGPRICE', width:'40px',sortable:false}
            ,{header:"排序", dataIndex:'VIEWSEQ', width:'30px',sortable:false}
            ,{header:"创建时间", dataIndex:'CREATEDATE', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	returnText = '<a class="a_link" href="javascript:deleteThis(\''+data['MERID']+'\')">删除</a>';
				  	return returnText;
				}
		   	}
		]
		,url:'/product/hotrecovery/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
	});
});

/**
 * 合作商品匹配
 * @param
 * @return
 */
function addRecycleMer(){
    layer.open({
        type:2,
        title:'热门回收商品增加',
        shadeClose:false,
        shade:0.8,
        content:'/product/hotrecovery/addhotrecovery',
        area:['800px', '500px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 删除
 */
function deleteThis(merId){
	if(confirm('是否确认删除选中的商品？')){
		$.post('/product/hotrecovery/deletemer', {merId:merId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
}

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#brandCode").html("<option value=''>全部</option>");
		for(i in data){
			$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function getParams(){
	return {
        partnerCode:$('#partnerCode').val(),
		merName:$('#merName').val(),
		merType:$('#merType').val(),
		brandCode:$('#brandCode').val(),
		source:1
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

