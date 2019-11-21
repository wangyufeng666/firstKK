var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "商品名称", dataIndex: 'MERNAME', width:'120px',sortable:false}
      ,{header: "用户名", dataIndex: 'USERNAME', width:'120px',sortable:false}
      ,{header: "手机号", dataIndex: 'MOBILE', width:'120px',sortable:false}
      ,{header: "星级", dataIndex: 'STARLEVEL', width:'120px',sortable:false}
      ,{header: "评价来源", dataIndex: 'SOURCE', width:'120px',sortable:false}
      ,{header: "评价时间", dataIndex: 'COMMENTTIME', width:'65px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'60px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="commentInfo(\''+data['USERID']+'\')" class="a_link">查看</a>';
		  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="update(\''+data['USERID']+'\')">修改</a>';    	  
		  	returnText += '|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['USERID']+'\')">删除</a>';    	  
          return returnText;
        }
      }
    ]
    ,url : '/yonghu/comment/pagelist'
  });
});

/**
 * 评价详情
 * @param orderNo
 * @return
 */
function commentInfo(Id){
	window.location.href = "/yonghu/comment/commentinfo?Id="+Id;
}
/**
 * 修改评价
 * @param orderNo
 * @return
 */
function update(Id){
	window.location.href = "/yonghu/comment/editcomment?Id="+Id;
}

/**
 * 新增评价
 * @param orderNo
 * @return
 */
function addComment(){
	window.location.href = "/yonghu/comment/addcomment";
}
/**
 * 随机批增
 * @param orderNo
 * @return
 */
function addCommentMore(){
	var limit = $('#limits').val();
	//window.location.href = "/yonghu/comment/addcommentmore?limit="+limit;
	if(confirm('你确定要随机批增'+limit+'条留言吗？')){
		$.post("/yonghu/comment/addcommentmore",{limit:limit},function(data){
			if(data == 'Y'){
				window.location.href = '/yonghu/comment/index';
			}else{
				alert('批增失败');
			}
		})
	}
	
}

/**
 * 删除评价
 */
function deleteThis(Id){
	if(confirm("是否确认删除当前数据？")){
		$.ajax({
			type: "POST",
			dataType:"json",
			url:'/yonghu/comment/delete',
			data:{Id:Id},
			success: function(data){
				if(data=='1'){
					//alert("删除成功");
					window.location.href='/yonghu/comment/index';
				}else{
					alert("删除失败");
				}
	        },
	        error: function (XMLHttpRequest, textStatus, errorThrown) { 
                alert(errorThrown); 
        	} 
		}); 
	}

}
function getParams(){
    return {
        userName:$('#userName').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        source:$('#source').val()
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
