var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'40px',sortable:false} 
           ,{header: "所属品牌", dataIndex: 'PNAME', width:'100px',sortable:false}
           ,{header: "商品名称", dataIndex: 'MERNAME', width:'150px', sortable:false}
           ,{header: "商品别称", dataIndex: 'NICKNAME', width:'200px', sortable:false}
           ,{header: "热度", dataIndex: 'REDU', width:'80px',sortable:false}
           ,{header: "关键词", dataIndex: 'KEYWORDS', width:'24%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'120px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="seriesInfo(\''+data['MERID']+'\')">详情</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['MERID']+'\')">修改</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['MERID']+'\')">删除</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/notebook/series/pagelist'
        ,baseParams:{merType:'P', merName:$('#merName').val(),pinpai:$('#pinpai').val()}
	});
});

/**
 * 商品报价详情
 * @param orderId
 * @return
 */
function seriesInfo(seriesId){
	window.location.href = "/notebook/series/seriesinfo?seriesId="+seriesId;
}

/**
 * 新增笔记本系列
 * @return
 */
function addSeries(){
	window.location.href = "/notebook/series/addseries";
}

/**
 * 删除
 */
function deleteThis(seriesID){
	if(confirm('是否确认删除选中的系列？')){
		$.post('/notebook/series/deleteseries', {seriesID:seriesID}, function(data){
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
function edit(seriesID){
	window.location.href = "/notebook/series/editseries?seriesID="+seriesID;
}

function getParams(){
    return {
    	keyWord:$('#keyWord').val(), 
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