var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"所属品类", dataIndex:'CATEGORYNAME', width:'150PX',sortable:false}
			,{header:"类型名称", dataIndex:'TYPENAME', width:'150PX', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:showBrands(\''+data['TYPECODE']+'\')">'+value+'</a>';
				}
			}
			,{header:"类型编码", dataIndex:'TYPECODE', width:'80PX',sortable:false}
			,{header:"类型状态", dataIndex:'ENABLEFLAG', width:'80PX',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value == 'Y' ? '<span style="color:green;">已启用</span>' : '<span style="color:red;">已停用</span>';
				}
			}
			,{header:"排序", dataIndex:'SEQ', width:'80PX',sortable:false}
			,{header:"操作", dataIndex:'', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var html = "<a class='a_link' href='javaScript:editMerType(\"" + data['TYPE_ID'] + "\")'>修改</a>";
					if(data['ENABLEFLAG'] != 'Y'){
						html += " | <a class='a_link' href='javaScript:delMertype(\"" + data['TYPE_ID'] + "\")'>删除</a>";
						html += " | <a class='a_link' href='javaScript:useMertype(\"" + data['TYPE_ID'] + "\")'>启用</a>";
					}else{
						html += " | <a class='a_link' href='javaScript:unUseMertype(\"" + data['TYPE_ID'] + "\")'>禁用</a>";
					}
					return html;
				}
			}
		]
		,url:'/recycle/mertypes/pagelist'
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
		categoryCode:$('#categoryCode').val(),
		typeName:$('#typeName').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function addMerType(){
	layer.open({
		type:2,
		title:'新增商品分类',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/mertypes/addmertype',
		area:['500px','360px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 启用
 * @param merTypeId
 * @returns
 */
function useMertype(merTypeId){
	if(confirm('是否启用该类型？')){
		$.ajax({
			type:"POST",
			url:'/recycle/mertypes/usemertype',
			data:{merTypeId:merTypeId},
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
 * 停用
 * @param merTypeId
 * @returns
 */
function unUseMertype(merTypeId){
	if(confirm('是否停用该类型？')){
		$.ajax({
			type:"POST",
			url:'/recycle/mertypes/unusemertype',
			data:{merTypeId:merTypeId},
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
 * 修改商品分类信息
 * @param merTypeId
 * @returns
 */
function editMerType(merTypeId){
	layer.open({
		type:2,
		title:'修改商品分类',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/mertypes/editmertype?merTypeId='+merTypeId,
		area:['470px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除商品分类
 * @param merTypeId
 * @returns
 */
function delMertype(merTypeId){
	if(confirm('是否删除该类型？')){
		$.ajax({
			type:"POST",
			url:'/recycle/mertypes/delmertype',
			data:{merTypeId:merTypeId},
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
 * 展示分类列表
 * @param categoryId
 * @returns
 */
function showBrands(merType){
	layer.open({
		type:2,
		title:'',
		shadeClose:true,
		shade:0.8,
		content:'/recycle/mertypes/showbrands?merType='+merType,
		area:['650px','325px'],
		close:function(index){
			layer.close(index);
		}
	});
}