var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'40px',sortable:false} 
           ,{header: "品牌", dataIndex: 'PNAME', width:'100px',sortable:false}
           ,{header: "系列名称", dataIndex: 'MERNAME', width:'150px', sortable:false}
           ,{header: "型号", dataIndex: 'TYPENAME', width:'200px', sortable:false}
           ,{header: "是否完整", dataIndex: '', width:'80px',sortable:false,
        	   renderer:function(value, data, rowIndex, colIndex, metadata){
        		   var str = data['ATTRSTEXT'];
        		   i=0;
        		   for(key in str){
        			   if(',' == str[key]){
        				   i++;
        			   }
        		   }
        		   
        		   if(i == 5){
        			   return 'Y';
        		   }else{
        			   return 'N';
        		   }
        	   }
           }
           ,{header: "操作", dataIndex: '', width:'120px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="productInfo(\''+data['TYPE_ID']+'\')">详情</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['TYPE_ID']+'\')">修改</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['TYPE_ID']+'\')">删除</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/notebook/product/pagelist'
        ,baseParams:{merType:'P', merName:$('#merName').val(),pinpai:$('#pinpai').val()}
	});
});

/**
 *型号详情
 * @param orderId
 * @return
 */
function productInfo(typeId){
	window.location.href = "/notebook/product/prductinfo?typeId="+typeId;
}

/**
 * 新增笔记型号
 * @return
 */
function addProduct(){
	
	window.location.href = "/notebook/product/addproduct";
}

/**
 * 删除笔记本型号
 */
function deleteThis(typeId){
	if(confirm('是否确认删除选中的型号？')){
		$.post('/notebook/product/deleteproduct', {typeId:typeId}, function(data){
			if(data == 'Y'){		
				doSearch();
			}
		});
	}
}

/**
 * 
 * 跳转修改页面
 */
function edit(typeId){
	window.location.href = "/notebook/product/editproduct?typeId="+typeId;
}

function getParams(){
    return {
    	merName:$('#merName').val(), 
    	pinpai:$('#pinpai').val()
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