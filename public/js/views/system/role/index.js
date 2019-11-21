var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "角色ID", dataIndex: 'ROLEID', width:'8%',sortable:false}
           ,{header: "角色名称", dataIndex: 'ROLENAME', width:'8%',sortable:false}
           ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'20%',sortable:false}
           ,{header: "修改日期", dataIndex: 'UPDATEDATE', width:'20%',sortable:false}
           ,{header: "是否基本角色", dataIndex: 'ISBASEROLE', width:'8%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
        	   return value == 'HKBOOLEAN_1' ? '是' : '否';
			}   
           }
           ,{header: "角色状态", dataIndex: 'ROLESTATUS', width:'8%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
        	   return value == 'HKVALID_1' ? '有效' : '无效';
			}  
           }
           ,{header: "操作", dataIndex: '', width:'12%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var	returnText = '<a class="a_link" href="javascript:void(0);" onclick="editRole(\''+data['ROLEID']+'\')"><img style="border:0px" src="/images/edit2.jpg" title="修改"/></a>';
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteRole(\''+data['ROLEID']+'\')"><img src="/images/delete4.jpg" border="0" title="删除" /></a>';
				  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="rolefunction(\''+data['ROLEID']+'\')"><img src="/images/bt_user.gif" border="0" title="权限" /></a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/system/role/pagelist'
	});
});



/**
 * 新增角色
 * @return
 */
function addRole(){
	
	window.location.href = "/system/role/addrole?backUrl=/system/role/index";
	
}

/**
 * 跳转到修改角色页面
 * @param orderNo
 */
function editRole(roleId){

	window.location.href = "/system/role/editrole?roleId="+roleId;
}

/**
 * 跳转到角色功能权限管理页面
 * @param orderNo
 */
function rolefunction(roleId){
	
	window.location.href = "/system/rolefunction/rolefunction?roleId="+roleId;
}

/**
 * 删除
 */
function deleteRole(roleId){
	if(confirm("确认删除该条记录吗？")){
		$.post("/system/role/deleterole", {roleId:roleId}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}

function getParams(){
    return {
    	roleName:$('#roleName').val() 
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}