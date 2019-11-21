var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'60PX',sortable:false}
//			,{header:"用户ID", dataIndex:'USERID', width:'160px',sortable:false
//				,renderer:function(value, data, rowIndex, colIndex, metadata){
//					return '<a href="javascript:userInfo(\''+value+'\')" class="a_link">'+value+'</a>';
//				}
//			}
			,{header:"姓名", dataIndex:'USERNAME', width:'200px',sortable:false}
            ,{header:"工号", dataIndex:'JOBNUM', width:'140px',sortable:false}
            ,{header:"用户类型", dataIndex:'USERTYPE', width:'140px',sortable:false}
			,{header:'登录名', dataIndex:'LOGINNAME', width:'120px',sortable:false}
			,{header:'创建时间', dataIndex:'CREATEDATE', width:'140px',sortable:false}
			,{header:'用户状态', dataIndex:'USERSTATUS', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == 'USERSTATUS_1'){
						return '有效';
					}else{
						return '无效';
					}
				}
			}
			,{header:'所在部门', dataIndex:'DEPTNAME', width:'120px',sortable:false
		}

			,{header:"操作", dataIndex:'USERID', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText =' <a href="javascript:editUser(\''+value+'\')" class="a_link"     >修改</a>';
					returnText+=' |&nbsp; <a href="javascript:deleteUser(\''+value+'\')" class="a_link">删除</a>';
					returnText+=' |&nbsp; <a href="javascript:userInfo(\''+value+'\')" class="a_link">权限</a>';
					return returnText;
				}
			}
		]
		,url:'/system/user/pagelist'
		,baseParams:getParams()
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
});

/**
 * 新增用户
 * @return
 */
function addUser(){
	layer.open({
		type:2,
		title:'新增用户信息',
		shadeClose:false,
		content:"/system/user/adduser",
		area:['500px','400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 查看用户
 * @return
 */
function userInfo(userId){
	layer.open({
		type:2,
		title:'用户信息',
		shadeClose:false,
		content:"/system/user/userinfo?userId="+userId,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 跳转到修改用户页面
 * @param orderNo
 */
function editUser(userId){
	layer.open({
		type:2,
		title:'修改用户信息',
		shadeClose:false,
		content:"/system/user/editusers?userId="+userId,
		area:['500px','400px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除
 */
function deleteUser(userId){
	if(confirm("确认删除该条记录吗？")){
		$.post("/system/user/deleteusers", {userId:userId}, function(data){
			if(data == 'Y'){
				reload();
			}
		});
	}
}

function getParams(){
	return {
		userName:$('#userName').val(),
		loginName:$('#loginName').val(),
		userStatus:$('#userStatus').val(),
        jobNum:$('#jobNum').val(),
        userType:$('#userType').val(),
        deptName:$('#deptName').val()

	};
}

function doSearch(){
	layerIndex = layer.msg('查询中',{icon:16,time:10000});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}
