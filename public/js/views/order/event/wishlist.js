var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
           {header: "提交日期", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
           ,{header: "品类", dataIndex: 'MERTYPENAME', width:'6%',sortable:false}
           ,{header: "型号", dataIndex: 'MERDESC', width:'10%',sortable:false}
           ,{header: "成色", dataIndex: 'CLASS', width:'3%',sortable:false}
           ,{header: "要求", dataIndex: 'REQUIREMENTS', width:'15%',sortable:false}
           ,{header: "价格", dataIndex: '', width:'8%',sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['MINPRICE']+"-"+data['MAXPRICE'];
				}
           }
           ,{header: "联系方式", dataIndex: 'CONTACTWAY', width:'15%',sortable:false}
           ,{header: "状态", dataIndex: 'STATUSNAME', width:'5%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'7%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ="";
					if(data['STATUS'] == '1'){
						returnText ='<a class="a_link" href="javascript:void(0);" onclick="completeWish(\''+data['WISHLISTID']+'\')">完成</a>';
						returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="stopWish(\''+data['WISHLISTID']+'\')">终止</a>';
					}
					return returnText;
				}
           }
	]
    ,url : '/order/event/wishlistjson'
  });
});

function stopWish(wishId){
	if(confirm('是否确认终止？')){
		$.post('/order/event/stopwish', {wishId:wishId}, function(data, textStatus){
			if(textStatus == 'success'){
				if(data == 'Y'){
					doSearch();
				}else{
					errorBox('终止失败');
				}
			}
		});
	}
}

function  completeWish(wishId){
	if(confirm('确认已联系？')){
		$.post('/order/event/completewish', {wishId:wishId}, function(data, textStatus){
			if(textStatus == 'success'){
				if(data == 'Y'){
					doSearch();
				}else{
					errorBox('操作失败');
				}
			}
		});
	}
}

function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	userName:$('#userName').val(),
    	contactWay:$('#contactWay').val(),
    	merType:$('#merType').val(),
    	merDesc:$('#merDesc').val(),
    	class:$('#class').val(),
    	status:$('#status').val()
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