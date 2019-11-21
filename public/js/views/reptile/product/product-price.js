var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'id', width:'5%',sortable:false}
			  ,{header: "平台", dataIndex: 'platform_idname', width:'5%',sortable:false}
			,{header: "任务id", dataIndex: 'job_id', width:'5%',sortable:false}

			  ,{header: "品牌", dataIndex: 'bname', width:'5%',sortable:false}
			  ,{header: "分类", dataIndex: 'cname', width:'5%',sortable:false}
			  ,{header: "商品名称", dataIndex: 'pname', width:'10%',sortable:false}
			  ,{header: "标签", dataIndex: 'answers_names', width:'25%',sortable:false}
			  ,{header: "价格", dataIndex: 'price', width:'5%',sortable:false}
			  ,{header: "操作", dataIndex: '', width:'15%', sortable:false,
					renderer : function(value, data, rowIndex, colIndex, metadata){
						var returnText ='<a class="a_link" href="javascript:void(0);" onclick="updateprice(\''+data['id']+'\')">获取实时价格</a>';
						return returnText;
					  	return ;
					}
	           	}
		]
		,url : '/reptile/product/product-price-list'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});



	$('#platform_id').change(
		function(){
			$.ajax({
				url:'/reptile/product/getbrandcategory',
				type:'POST',
				data:{platform_id:$.trim($('#platform_id').val())},
				dataType:'json',
				timeout:5000,
				error: function(){ alert('服务器错误, 请与管理员联系!', '提示信息'); },
				success: function(result){
					$("#brand_id").empty();
					jQuery("#brand_id").append("<option  value=''>全选</option>");

					$("#class_id").empty();
					jQuery("#class_id").append("<option value=''>全选</option>");

					if (result!=null){
						$.each(result['brand'],function(index,value){
							jQuery("#brand_id").append("<option value='"+value['brand_id']+"'>"+value['name']+"</option>");
						});

						$.each(result['category'],function(index,value){
							jQuery("#class_id").append("<option value='"+value['class_id']+"'>"+value['name']+"</option>");
						});

					}
				}
			});
		}
	);
});
function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}



/**
 * 状态修改
 */
function updateprice(id){
	$.post("/reptile/product/updateprice",{id:id},function(data){
		if(data['code'] == 0){

			layer.msg('加入队列成功，稍后查看', {icon: 6});
			grid.query(getParams());
		}else{
			layer.msg(data['msg'], {icon: 5});
		}
	})
}



/**
 * 返回上一页
 */
function goBack(){
	window.location.href = backUrl;
}

function getParams(){
    return {
		pname:$('#pname').val(),
		cname:$('#cname').val(),
		bname:$('#bname').val(),
		platform_id:$('#platform_id').val(),
		class_id:$('#class_id').val(),
		brand_id:$('#brand_id').val(),
    };
}
function doSearch(){
	// layer.load('数据加载中...', 1);
    grid.query(getParams());
}
function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg,type:8}
	});
}

function addJob() {
	grid.query(getParams());
	platform_id = $('#platform_id').val();
	class_id = $('#class_id').val();
	brand_id = $('#brand_id').val();
	type = 1;

	if(platform_id == ''||class_id==''||brand_id==''){
		layer.msg("选择框不能为空", {icon: 5});
		return false
	}

	$.post("/reptile/product/addjob",{
		platform_id:platform_id,
		class_id:class_id,
		brand_id:brand_id,
		type:type
	},function(data){
		if(data['code'] == 0){
			layer.msg('添加成功', {icon: 6});
		}else{
			layer.msg(data['msg'], {icon: 5});
		}
		layer.close(index);
	})




}