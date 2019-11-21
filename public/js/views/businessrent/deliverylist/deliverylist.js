var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"创建时间", dataIndex:"CREATE_DATE", width:'10%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'10%', sortable:false}
		   ,{header: "订单号", dataIndex: 'ORDER_NO', width:'15%',sortable:false
           ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="/businessrent/order/deliverbill?orderNo='+value+'" target="view_window" title="'+value+'" class="a_link">'+value+'</a>';
               }
         }
		   ,{header: "联系方式", dataIndex: '', width:'10%',sortable:false
        	,renderer : function(value, data, rowIndex, colIndex, metadata){
              return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
            }
        }
		   ,{header: "联系地址", dataIndex: 'ADDRESS', width:'15%',sortable:false}	   
		   ,{header:"结算方式", dataIndex:'PAYNAME', width:'8%', sortable:false}
		   ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'8%', sortable:false}
		   ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDER_NO'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					returnText += ' | <a href="javascript:void(0);" title="'+orderNo+'" onclick="orderDelivery(\''+orderNo+'\')" class="a_link">发货</a>';
          			return returnText;
				}
			}       
		]
    	   ,url : '/businessrent/order/installmentlist'
    	   ,baseParams:initParams()
    	   ,pageSizeList:[10,15,20,30,50]
	});
  	changeSourceShow();
  	$('#orderSource').change(function(){
          changeSourceShow();
  	});
    
});

function orderDelivery(orderNo){
  layer.open({
        type:2,
        title:'订单发货',
        shadeClose:false,
        shade:0.6,
        content:'/businessrent/order/orderdelivery?orderNo='+orderNo,
        area:['500px' , '200px'],
        close:function(index){
            layer.close(index);
        }
    });
}
function reload(){
    layer.closeAll();
    grid.reload();
}
$("#sourcecode").change(function(){
  sourceCode = '';
});
function changeSourceShow(){
	var orderSource = $('#orderSource').val();
  if(orderSource){
    $.ajax({
    	url:"/businessrent/order/sourceshow",
    	type:"post",
    	data:{orderSource:orderSource},
      	dataType:"json",
      	success:function(data){
        	if(data){
          		var sourceshow = "";
          		for (var v in data ){
            		var sourceName = data[v];
            		if(v === sourceCode){
                		sourceshow += "<option selected value=\"" + v + "\" >" + sourceName + "</option>";
            		}else{
                		sourceshow += "<option value=\"" + v + "\" >" + sourceName + "</option>";
            		}
          		}
          		$("#sourcecode").html("<option value=''>请选择</option>"+sourceshow); 
        	}else{
          		$("#sourcecode").html("<option value=''>请选择</option>");
        	}
      	},
      	error:function(){
        	layer.msg('网络错误！');
      	}
    });
  }else{
    $("#sourcecode").html("<option value=''>请选择</option>");
  }
}
function initParams(){
	if(backFlag == 'Y'){
      changeSourceShow();    
  	  var params = getParams();
      params['status'] = '3';
      params['isPurchase'] = '3';
  	  params['start'] = start;
  	  params['limit'] = limit;
  	  return params;
	}else{
      var params = {};
      params['status'] = '3';
      params['isPurchase'] = '3';
	  return params;
	}
}
/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	  window.location.href = "/businessrent/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl+"&sign="+'6';
}
function getParams(){
    var orderSource = $('#orderSource').val();
    if(orderSource){
      var newSourceCode = $('#sourcecode').val();
      if(newSourceCode){
          sourceCode = $('#sourcecode').val();
      }
    }else{
      orderSource = '';
      sourceCode = '';
    }
    return {
      startDate:$('#startDate').val(),
      mobile:$.trim($('#mobile').val()),
      orderSource:orderSource,
      sourcecode:sourceCode,
      orderNo:$.trim($('#orderNo').val())
    };
}

function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒
    layer.close(index);
    grid.query(getParams());
}
