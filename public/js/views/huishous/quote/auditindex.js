var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
        	{header: "NO.", dataIndex: 'R', width:'3%',sortable:false} 
           ,{header: "所属品牌", dataIndex: 'PNAME', width:'8%',sortable:false}
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
           ,{header: "商品名称", dataIndex: 'MERNAME', width:'23%',sortable:false}
           ,{header: "回收商", dataIndex: 'PROVIDERNAME', width:'22%',sortable:false}
           ,{header: "报价日期", dataIndex: 'STRCREATEDATE', width:'12%',sortable:false}
           ,{header: "最低报价", dataIndex: 'ZUIDIPRICE', width:'8%',sortable:false}
           ,{header: "最高报价", dataIndex: 'ZUIGAOPRICE', width:'8%',sortable:false}
           ,{header: "操作", dataIndex: '', width:'8%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="quoteAudit(\''+data['SPID']+'\', \''+data['PROVIDERID']+'\')">审批</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/huishous/quote/auditpagelist'
	});
});

/**
 * 商品报价审批
 * @param orderId
 * @return
 */
function quoteAudit(spId, providerId){
	if(confirm('是否确认审批？')){
		$.post('/huishous/quote/quoteaudit', {spId:spId, providerId:providerId}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert('审批失败，请重试');
			}
		});
	}
}

function getParams(){
    return {
    	merName:$('#merName').val(), 
    	merType:$('#merType').val(),
    	pinpai:$('#pinpai').val(),
    	merSource:$('#merSource').val(),
    };
}

function doSearch(){
    grid.query(getParams());
}