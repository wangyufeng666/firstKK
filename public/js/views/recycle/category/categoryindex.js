var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"品类编码", dataIndex:'TYPECODE', width:'80PX',sortable:false}
			,{header:"品类名称", dataIndex:'TYPENAME', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:showMerTypes(\''+data['TYPEID']+'\')">'+value+'</a>';
				}
			}
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
			,{header:"操作", dataIndex:'', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var html = "<a class='a_link' href='javaScript:delCategory(\"" + data['TYPEID'] + "\")'>删除</a>";
					if(data['ENABLEFLAG'] == 'Y'){
						html += " | <a class='a_link' href='javaScript:disableCategory(\"" + data['TYPEID'] + "\")'>停用</a>";
					}else{
						html += " | <a class='a_link' href='javaScript:enableCategory(\"" + data['TYPEID']+"\")'>启用</a>";
					}
					return html;
				}
			}
		]
		,url:'/recycle/category/pagelist'
		,baseParams:initParams()
	});
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

function getParams(){
	return {
		categoryName:$('#categoryName').val(),
		enableFlag:$('#enableFlag').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

/**
 * 添加品类
 * @returns
 */
function addCategory(){
	layer.open({
		type:2,
		title:'新增品类',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/category/addcategory',
		area:['450px', '300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 修改品类
 * @param typeId
 * @returns
 */
function editCategory(categoryId){
	layer.open({
		type:2,
		title:'修改品类',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/category/editcategory?categoryId='+categoryId,
		area:['470px','500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除品类
 * @param typeId
 * @returns
 */
function delCategory(typeId){
	if(confirm('是否确认删除？')){
		$.ajax({
			type:"POST",
			url:'/recycle/category/delcategory',
			data:{typeId:typeId},
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					alert('删除失败：'+data);
				}
			},
			error:function(){
				alert('网络错误');
			}
		});
	}
}

/**
 * 启用品类
 * @param typeId
 * @returns
 */
function enableCategory(typeId){
	if(confirm('是否开启使用？')){
		$.ajax({
			type:"POST",
			url:"/recycle/category/enable",
			data:{typeId:typeId},
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					alert('启用失败：'+data);
				}
			},
			error:function(){
				alert('网络错误');
			}
		});
	}
}

/**
 * 停用品类
 * @param typeId
 * @returns
 */
function disableCategory(typeId){
	if(confirm('是否停用该品类？')){
		$.ajax({
			type:"POST",
			url:"/recycle/category/disable",
			data:{typeId:typeId},
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					alert('停用失败：'+data);
				}
			},
			error:function(){
				alert('网络错误');
			}
		});
	}
}

/**
 * 展示分类列表
 * @param categoryId
 * @returns
 */
function showMerTypes(categoryId){
	layer.open({
		type:2,
		title:'',
		shadeClose:true,
		shade:0.8,
		content:'/recycle/category/showmertypes?categoryId='+categoryId,
		area:['650px','325px'],
		close:function(index){
			layer.close(index);
		}
	});
}
