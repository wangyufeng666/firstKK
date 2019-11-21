var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"序号", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"部门ID", dataIndex:'DEPTID', width:'160px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return value;
				}
			}
			,{header:"部门名", dataIndex:'DEPTNAME', width:'200px',sortable:false}
            ,{header:"创建时间", dataIndex:'CREATEDATE', width:'200px',sortable:false}
			,{header:'部门状态', dataIndex:'DEPTSTATUS', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == 'HKVALID_1'){
						return '有效';
					}else{
						return '无效';
					}
				}
			}
			,{header:"展示排序", dataIndex:'VIEWSEQ', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'DEPTID', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = ' <a href="javascript:editUser(\''+value+'\')" class="a_link">修改</a>';
					returnText+=' | <a href="javascript:deleteUser(\''+value+'\')" class="a_link">删除</a>';
					return returnText;
				}
			}
		]
		,baseParams:getParams()
		,url:'/system/department/pagelist'
	});
});

/**
 * 新增部门
 * @return
 */
function addUser(){
	layer.open({
		type:2,
		title:'新增部门信息',
		shadeClose:false,
		shade:0.8,
		content:"/system/department/adddept",
		area:['600px','350px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 跳转到修改部门页面
 * @param orderNo
 */
function editUser(deptId){
	layer.open({
		type:2,
		title:'编辑部门信息',
		shadeClose:false,
		shade:0.8,
		content:"/system/department/editdept?deptId="+deptId,
		area:['500px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除
 */
function deleteUser(deptId){
	if(confirm("确认删除该条记录吗？")){
		$.post("/system/department/deletedept", {deptId:deptId}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}

function getParams(){
	return {
		deptName:$('#deptName').val(),
		deptStatus:$('#deptStatus').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}
