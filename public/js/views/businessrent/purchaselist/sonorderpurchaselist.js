var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"创建时间", dataIndex:"CREATE_DATE", width:'10%', sortable:false}
		   ,{header: "总订单号", dataIndex: 'PARTNER_NO', width:'15%',sortable:false}         
		   ,{header: "订单号", dataIndex: 'ORDER_NO', width:'15%',sortable:false}  
		   ,{header: "商品名", dataIndex: 'PRODUCT', width:'20%',sortable:false,
            renderer:function(value, data, rowIndex, colIndex, metadata){                 
                        return data['PRODUCT_NAME']+' '+data['MODEL_NAME'];              
              }
        }  
		   ,{header: "IMEI号", dataIndex: 'IMEI', width:'10%',sortable:false}               		   
		   ,{header: "新机价格", dataIndex: 'NEW_PRODUCT_PRICE', width:'10%',sortable:false}            
		   ,{header: "旧机价格", dataIndex: 'OLD_PRODUCT_PRICE', width:'10%',sortable:false}            
		   ,{header: "采购价格", dataIndex: 'PURCHASE', width:'10%',sortable:false}                   
		   ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'8%', sortable:false}
		   ,{header:"采购状态", dataIndex:'ISPURCHASENAME', width:'62px', sortable:false}
		   ,{header: "操作", dataIndex: '', width:'15%', sortable:false,
		   renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDER_NO'];
					var imei = data['IMEI'];
					var purchase = data['PURCHASE'];
					if(data['ISPURCHASE'] != '2'){
                        var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="inbound(\''+orderNo+'\',\''+imei+'\',\''+purchase+'\')" class="a_link">入库</a>';
					}
          			return returnText;
				}
			}     
		]
    ,url : '/businessrent/order/sonorderpurchaseinfo'
    ,baseParams:initParams()
    ,pageSizeList:[10,15,20,30,50]
	});
});

function inbound(orderNo,imei,price){
    layer.open({
        type:2,
        title:'订单采购入库',
        shadeClose:false,
        shade:0.4,
        content:'/businessrent/order/inbound?orderNo='+orderNo,
        area:['400px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}
function initParams(){
	if(backFlag == 'Y'){
		changeSourceShow();    
		var params = getParams();
		params['isPurchase'] = '1';
		params['status'] = '3';    
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		var params = {};
		params['partnerNo'] = $('#partnerNo').val();
		params['isPurchase'] = '1';
		params['status'] = '3';
		return params;
	}
}
function getParams(){
    return {
    	startDate:$('#startDate').val(),
    	productName:$.trim($('#productName').val()),
    	orderNo:$.trim($('#orderNo').val()),
    	partnerNo:$('#partnerNo').val(),
    	imei:$('#imei').val()
    };
}

function goBack(){
	window.location.href = backUrl+"?backFlag=Y";
}
function reload(){
    layer.closeAll();
    grid.reload();
}

function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒 
    layer.close(index);
    grid.query(getParams());
}
