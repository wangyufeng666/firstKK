var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "所属品牌", dataIndex: 'PINPAI', width:'8%',sortable:false}
           ,{header: "商品类型", dataIndex: 'MERTYPE', width:'8%',sortable:false}
           ,{header: "商品来源", dataIndex: 'MERSOURCE', width:'8%',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					if(data['MERSOURCE'] == '1'){
						returnText = '<span class="green">线上商品</span>';
					}else if(data['MERSOURCE'] == '2'){
						returnText = '<span class="red">线下商品</span>';
					}
					return returnText;
				}
           }
           ,{header: "商品名称", dataIndex: 'SPNAME', width:'30%',sortable:false}
           ,{header: "商品别称", dataIndex: 'NICKNAME', width:'30%',sortable:false}
           ,{header: "商品标记", dataIndex: 'ENABLEDTXT', width:'10%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'12%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="quoteInfo(\''+data['SPID']+'\')">查看报价</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="editMerQuote(\''+data['SPID']+'\')">修改报价</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/offline/quote/merpagelist'
	});
});

/**
 * 商品报价详情
 * @param orderId
 * @return
 */
function quoteInfo(spId){
	$.layer({
  	    type : 2,
        title : '商品报价详情',
        iframe : {src : '/huishous/quote/quoteinfo?spId='+spId},
        area : ['750', '500'],
        offset : ['50px', ''],
        close : function(index){
            layer.close(index);
        }
    });
}

/**
 * 跳转到修改商品报价页面
 * @param orderNo
 */
function editMerQuote(spId){
	$.layer({
  	    type : 2,
        title : '修改商品报价',
        iframe : {src : '/huishous/quote/editmerquote?spId='+spId},
        area : ['750', '620'],
        offset : ['50px', ''],
        close : function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
    	merName:$('#merName').val(), 
    	merType:$('#merType').val(),
    	pinpai:$('#pinpai').val(),
    	enableds:$('#enableds').val()
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

/*
 * 导出
 */
function doExport(){
	var merName = $('#merName').val();
	var merType = $('#merType').val();
	var pinpai = $('#pinpai').val();
	var enableds = $('#enableds').val();
    var param = 'merName='+merName+'&merType='+merType+'&pinpai='+pinpai+'&enableds='+enableds+'&merSource=2';
	window.location.href = "/huishous/quote/exportexecl?"+encodeURI(param);
}