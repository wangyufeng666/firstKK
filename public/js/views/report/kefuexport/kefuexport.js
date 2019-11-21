var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"合作商", dataIndex:'PARTNERNAME', width:'90px', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDERSOURCE', width:'90px', sortable:false}
		   ,{header:"处理时间", dataIndex:'CREATEDATE', width:'95px', sortable:false}
		   ,{header:"订单号", dataIndex:'ORDERNO', width:'100px', sortable:false}		   
		   ,{header:"器材名", dataIndex:'MERNAME', width:'110px', sortable:false}		   
           ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['LIANXIREN']+'('+data['LIANXIDH']+')';
                }
              }		   
		   ,{header:"操作人", dataIndex:'USERNAME', width:'80px', sortable:false}
           ,{header: "订单价格", dataIndex: '', width:'130px',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
				  if(data['SETTLEPRICE']){
					  return data['DINGDANPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
				  }else{
					  return data['DINGDANPRICE'];
				  }
                }
              }           
           ,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'90px', sortable:false}
           ,{header:"交易方式", dataIndex:'CHULITYPE', width:'90px', sortable:false}
       ]
       ,url : '/report/kefuexport/kefuexportbilllist'
       ,baseParams:{isAll:'all'}
	});
});
function getParams(){
    return {
    	flowStatus:$('#flowStatus').val(),
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	partnerCode:$('#partnerCode').val(),
    	orderSource:$('#orderSource').val(),
    	orderStatus:$('#orderStatus').val()    	
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
function downloadkefuexport(){
	var param = '';
	param += '&flowStatus=' + $('#flowStatus').val();
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();	
	param += '&orderStatus=' + $('#orderStatus').val();
	param += '&orderSource=' + $('#orderSource').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	window.location.href = '/report/kefuexport/kefuexport?'+param;
	return false; //截取返回false就不会保存网页了
}