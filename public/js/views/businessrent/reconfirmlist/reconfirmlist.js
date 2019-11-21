var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"创建时间", dataIndex:"CREATE_DATE", width:'10%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'10%', sortable:false}
		   ,{header: "订单号", dataIndex: 'ORDER_NO', width:'15%',sortable:false}
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
          			var returnText = '';
					var orderNo = data['ORDER_NO'];
					returnText +='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
                    returnText +=' | <a href="javascript:void(0);" title="'+orderNo+'" onclick="cancelOrder(\''+orderNo+'\')" class="a_link">取消订单</a>';
          			if(data['STATUS'] == '2' && data['KFCONFIRMFLAG'] == 'Y'){
              			returnText += ' | <a href="javascript:void(0);" title="'+orderNo+'" onclick="reconfirm(\''+orderNo+'\')" class="a_link">二次确认</a>';
          			}
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
function reload(){
    layer.closeAll();
    grid.reload();
}
function reconfirm(orderNo){
    layer.open({
        type:2,
        title:'订单状态修改',
        shadeClose:false,
        shade:0.4,
        content:'/businessrent/order/reconfirmorder?orderNo='+orderNo,
        area:['400px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}
function cancelOrder(orderNo){
    layer.confirm('确认取消订单吗？', {
        btn: ['确认', '取消']
    }, function(){
        $.ajax({
            url:"/businessrent/order/cancelorder",
            type:"post",
            data:{orderNo:orderNo},
            async:false,
            dataType:"json",
            success:function(data){
                if(data['code'] !== '1000'){
                    layer.msg('操作错误：'+data['msg']);
                }else{
                    layer.msg('取消订单成功');
                    grid.reload();
                }
            },
            error:function(){
                layer.msg('网络错误！');
            }
        });
    });
}
function initParams(){
	if(backFlag == 'Y'){
		changeSourceShow();    
		var params = getParams();
		params['status'] = '2';
		params['kfConfirmFlag'] = 'Y';
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		var params = {};
		params['status'] = '2';
		params['kfConfirmFlag'] = 'Y';
		return params;
	}
}

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
	  window.location.href = "/businessrent/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl+"&sign="+'2';
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
