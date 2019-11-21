var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'pid', width:'5%',sortable:false}
			,{header: "平台", dataIndex: 'platform_idname', width:'10%',sortable:false}
			,{header: "品牌", dataIndex: 'bname', width:'10%',sortable:false}
			,{header: "分类", dataIndex: 'cname', width:'10%',sortable:false}
			,{header: "商品名称", dataIndex: 'pname', width:'10%',sortable:false}
			,{header: "状态", dataIndex: 'status', width:'5%',sortable:false}
			,{header: "排序", dataIndex: 'sort', width:'5%',sortable:false}
			,{header: "创建时间", dataIndex: 'create_time', width:'10%',sortable:false}
			,{header: "操作", dataIndex: '', width:'15%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="updatesort(\''+data['pid']+'\')">修改排序</a>';
					 returnText += ' |<a href="javascript:showAnswer(\''+data['product_id']+'\',\''+data['platform_id']+'\')" class="a_link">查看标签</a>';
					return returnText;
					return ;
				}
			}
		]
		,url : '/reptile/product/pagelist'
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

function showAnswer(id,platform_id) {
	layer.open({
		type:2,
		title:'修改商品标签',
		shadeClose:false,
		shade:0.8,
		content:'/reptile/product/details?id='+id+'&platform_id='+platform_id,
		area :['1100px', '600px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function addjobbids() {
	layer.open({
		type:2,
		title:'新增商品任务',
		shadeClose:false,
		shade:0.8,
		content:'/reptile/product/addjobbyid',
		area :['600px', '400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 状态修改
 */
function updatesort(id){
	layer.prompt(function(val, index){
		if(!isNaN(val)){
			$.post("/reptile/product/upsort",{id:id,sort:val},function(data){
				if(data['code'] == 0){
					grid.query(getParams());
				}else{
					layer.msg(data['msg'], {icon: 5});
				}
				layer.close(index);
			})
		}else {
			layer.msg('请输入数字', {icon: 5});
		}
		//
	});
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