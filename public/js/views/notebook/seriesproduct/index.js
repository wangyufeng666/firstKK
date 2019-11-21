var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'40px',sortable:false} 
           ,{header: "所属品牌", dataIndex: 'PNAME', width:'80px',sortable:false}
           ,{header: "商品名称", dataIndex: 'MERNAME', width:'160px', sortable:false}
           ,{header: "商品别称", dataIndex: 'NICKNAME', width:'160px', sortable:false}
           ,{header: "热度", dataIndex: 'REDU', width:'80px',sortable:false}
           ,{header: "关键词", dataIndex: 'KEYWORDS',sortable:false}
           ,{header: "操作", dataIndex: '', width:'120px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="set(\''+data['MERID']+'\')">型号设置</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/notebook/series/pagelist'
        ,baseParams:{merName:$('#merName').val(),pinpai:$('#pinpai').val()}
	});
});


/**
 * 跳转到修改商品报价页面
 * @param orderNo
 */
function set(spId){
	window.location.href = "/notebook/seriesproduct/setproducts?spId="+spId;
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