var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "所属品牌", dataIndex: 'PINPAI', width:'8%',sortable:false}
           ,{header: "商品类型", dataIndex: 'MERTYPE', width:'8%',sortable:false}
           ,{header: "商品名称", dataIndex: 'SPNAME', width:'20%',sortable:false}
           ,{header: "商品别称", dataIndex: 'NICKNAME', width:'20%',sortable:false}
           ,{header: "热度", dataIndex: 'REDU', width:'6%',sortable:false}
           ,{header: "关键词", dataIndex: 'KEYWORDS', width:'24%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'12%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="mobilephoneInfo(\''+data['SPID']+'\')">详情</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['SPID']+'\')">修改</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['SPID']+'\')">删除</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/product/mobilephone/pagelist'
        ,baseParams:{merType:'J', merName:$('#merName').val(),pinpai:$('#pinpai').val()}
	});
});

/**
 * 商品报价详情
 * @param orderId
 * @return
 */
function mobilephoneInfo(spId){
	var start = $('#start').val();
	var pinpai = $('#pinpai').val();
	var merName = $('#merName').val();
	window.location.href = "/product/mobilephone/mobilephoneinfo?spId="+spId+"&merName="+merName+"&pinpai="+pinpai;
}

/**
 * 新增手机
 * @return
 */
function addMobilephone(){
	var pinpai = $('#pinpai').val();
	var merName = $('#merName').val();
	window.location.href = "/product/mobilephone/addmobilephone?pinpai="+pinpai+"&merName="+merName;
}

/**
 * 跳转到修改商品报价页面
 * @param orderNo
 */
function edit(spId){
	var pinpai = $('#pinpai').val();
	var merName = $('#merName').val();
	window.location.href = "/product/mobilephone/editmobilephone?spId="+spId+"&pinpai="+pinpai+"&merName="+merName;
}

/**
 * 删除
 */
function deleteThis(spId){
	if(confirm('是否确认删除选中的商品？')){
		$.post('/product/mobilephone/deletemobilephone', {spId:spId}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}



function getParams(){
    return {
    	merName:$('#merName').val(), 
    	merType:'J', 
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