var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
        	{header: "NO.", dataIndex: 'R', width:'40px',sortable:false} 
        	,{header: "商品类型", dataIndex: 'MERTYPE', width:'80px',sortable:false}
           ,{header: "所属品牌", dataIndex: 'PINPAI', width:'80px',sortable:false}
           ,{header: "商品来源", dataIndex: 'MERSOURCE', width:'80px',sortable:false,
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
           ,{header: "商品名称", dataIndex: 'SPNAME', width:'250px',sortable:false}
           ,{header: "商品别称", dataIndex: 'NICKNAME', width:'250px',sortable:false}
           ,{header: "商品标记", dataIndex: 'ENABLEDTXT', width:'80px',sortable:false}
           ,{header: "操作", dataIndex: '', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="quoteInfo(\''+data['SPID']+'\')">查看报价</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="editMerQuote(\''+data['SPID']+'\')">修改报价</a>';
				  	//returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="orderList(\''+data['SPID']+'\')">相关订单</a>';
				  	return returnText;
				}
           	}
        ]
        ,url:'/huishous/quote/merpagelist'
	});
});

/**
 * 商品报价详情
 * @param orderId
 * @return
 */
function quoteInfo(spId){
	layer.open({
  	    type:2,
        title:'商品报价详情',
		shadeClose:false,
		shade:0.8,
        content:'/huishous/quote/quoteinfo?spId='+spId,
        area:['950px', '600px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 跳转到修改商品报价页面
 * @param orderNo
 */
function editMerQuote(spId){
	layer.open({
  	    type:2,
        title:'修改商品报价',
		shadeClose:false,
		shade:0.8,
        content:'/huishous/quote/editmerquote?spId='+spId,
        area:['950px', '600px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 相关订单
 * @param orderNo
 */
function orderList(spId){
	if(spId){
		layer.open({
	  	    type:2,
	        title:'相关订单',
			shadeClose:false,
			shade:0.8,
	        content:'/order/order/merorder?spId='+spId,
	        area:['1000px', '550px'],
	        close:function(index){
	            layer.close(index);
	        }
	    });
	}else{
		alert('刷新重试');
	}
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
    grid.query(getParams());
}

/**
 * 导出
 */
function doExport(){
	var merName = $('#merName').val();
	var merType = $('#merType').val();
	var pinpai = $('#pinpai').val();
	var enableds = $('#enableds').val();
    var param = 'merName='+merName+'&merType='+merType+'&pinpai='+pinpai+'&enableds='+enableds+'&merSource=1';
	window.location.href = "/huishous/quote/exportexecl?"+encodeURI(param);
}
