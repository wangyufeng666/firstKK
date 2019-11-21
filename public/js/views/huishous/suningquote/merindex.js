var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
        	{header: "NO.", dataIndex: 'R', width:'40px',sortable:false} 
        	,{header: "商品类型", dataIndex: 'MERTYPE', width:'80px',sortable:false}
           ,{header: "所属品牌", dataIndex: 'PINPAI', width:'80px',sortable:false}
           ,{header: "商品来源", dataIndex: 'MERSOURCENAME', width:'80px',sortable:false,}
           ,{header: "商品名称", dataIndex: 'SPNAME', width:'250px',sortable:false}
           ,{header: "商品别称", dataIndex: 'NICKNAME', width:'250px',sortable:false}
           ,{header: "苏宁商品名称", dataIndex: 'P_MERNAME', width:'250px',sortable:false}
           ,{header: "商品标记", dataIndex: 'ENABLEDTXT', width:'80px',sortable:false}
           ,{header: "操作", dataIndex: '', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="quoteInfo(\''+data['SPID']+'\', \''+data['P_MERID']+'\')">查看报价</a>';
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="editMerQuote(\''+data['SPID']+'\', \''+data['P_MERID']+'\')">修改报价</a>';
				  	return returnText;
				}
           	}
        ]
        ,url:'/huishous/suningquote/merpagelist'
	});
});

/**
 * 商品报价详情
 * @param orderId
 * @return
 */
function quoteInfo(spId, p_merId){
	layer.open({
  	    type:2,
        title:'商品报价详情',
		shadeClose:false,
		shade:0.8,
        content:'/huishous/suningquote/quoteinfo?spId='+spId+'&p_merId='+p_merId,
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
function editMerQuote(spId, p_merId){
	layer.open({
  	    type:2,
        title:'修改商品报价',
		shadeClose:false,
		shade:0.8,
        content:'/huishous/suningquote/editmerquote?spId='+spId+'&p_merId='+p_merId,
        area:['950px', '600px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
    	merName:$('#merName').val(), 
    	merType:$('#merType').val(),
    	pinpai:$('#pinpai').val(),
    	enableds:$('#enableds').val(),
    	p_merName:$('#p_merName').val(),
    };
}

function doSearch(){
    grid.query(getParams());
}
