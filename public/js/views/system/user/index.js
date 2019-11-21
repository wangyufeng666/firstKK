var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "序号", dataIndex: 'R', width:'40PX',sortable:false} 
      ,{header: "用户ID", dataIndex: 'USERID', width:'100px',sortable:false
        ,renderer : function(value, data, rowIndex, colIndex, metadata){
          var url = '/system/user/userinfo?userId='+data['USERID'];
          return '<a href="'+url+'" class="a_link">'+value+'</a>';
        }
      }
      ,{header: "用户名", dataIndex: 'USERNAME', width:'60px',sortable:false} 
      ,{header:'登录名', dataIndex: 'LOGINNAME', width:'120px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'140px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText =' <a href="javascript:void(0);" onclick="editUser(\''+data['USERID']+'\')" class="a_link"><img style="border:0px" src="/images/edit2.jpg" title="修改"/></a>';
        	  returnText+=' |&nbsp; <a href="javascript:void(0);" onclick="deleteUser(\''+data['USERID']+'\')" class="a_link"><img src="/images/delete4.jpg" border="0" title="删除" /></a>';
        	  returnText+=' |&nbsp; <a href="javascript:void(0);" onclick="userInfo(\''+data['USERID']+'\')" class="a_link"><img src="/images/detail2.jpg" border="0" title="查看" /></a>';
          return returnText;
        }
      }
    ]
    ,url : '/system/user/pagelist'
  });
});

/**
 * 新增用户
 * @return
 */
function addUser(){
	
	window.location.href = "/system/user/adduser";
	
}
/**
 * 查看用户
 * @return
 */
function userInfo(userId){
	
	window.location.href = "/system/user/userinfo?userId="+userId;
	
}
/**
 * 跳转到修改用户页面
 * @param orderNo
 */
function editUser(userId){

	window.location.href = "/system/user/editusers?userId="+userId;
}

/**
 * 删除
 */
function deleteUser(userId){
	if(confirm("确认删除该条记录吗？")){
		$.post("/system/user/deleteusers", {userId:userId}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}

function getParams(){
    return {
    	userName:$('#userName').val(), 
    	loginName:$('#loginName').val()
    };
}

function doSearch(){
    grid.query(getParams());
}