var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"创建时间", dataIndex:'CREATEDATE', width:'10%', sortable:false}
		   ,{header:"总订单号", dataIndex:'PARTNER_NO', width:'10%', sortable:false}
		   ,{header:"子订单号", dataIndex:'ORDER_NO', width:'15%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDERSOURCENAME', width:'8%', sortable:false}
		   ,{header:"商品信息", dataIndex:'', width:'15%', sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
                return data['PRODUCT_NAME']+' '+data['MODEL_NAME'];
              }
		   }
           ,{header: "联系方式", dataIndex: '', width:'10%',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
            }		   
           ,{header:"预计归还日期", dataIndex:'TOREDATE', width:'10%', sortable:false}
           ,{header:"实际归还日期", dataIndex:'RELREDATE', width:'10%', sortable:false}
           ,{header:"归还状态", dataIndex:'', width:'10%', sortable:false
              ,renderer : function(value, data, rowIndex, colIndex, metadata){
                  if(data['STATUS'] == '1' || data['STATUS'] == '3' || data['STATUS'] == '4'){
                      var returnText = "<span style='color:red'>"+data['STATUSNAME']+"</span>";
                  }else{
                      var returnText = "<span>"+data['STATUSNAME']+"</span>";
                  }
                  return returnText;
                }
            }
           ,{header: "操作", dataIndex: '', width:'24%', sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="sonOrderInfo(\''+data['ORDER_NO']+'\')" class="a_link">查看</a>';
                    if(data['STATUS'] === '1'){
                      returnText +=' | <a href="javascript:void(0);" title="'+orderNo+'" onclick="giveBack(\''+data['ORDER_NO']+'\')" class="a_link">归还</a>';
                    }
                    return returnText;
                }
		    }
		]
       ,url : '/businessrent/rentback/backorderlist'
	   ,baseParams:initParams()
	   ,pageSizeList:[10,15,20,30,50]
	});
	changeSourceShow();
  	$('#orderSource').change(function(){
          changeSourceShow();
  	});
});
function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}
function sonOrderInfo(orderNo){
    window.location.href = "/businessrent/order/sonorderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}
function giveBack(orderNo) {
	layer.open({
		type:2,
		title:'订单结算',
		shadeClose:false,
		shade:0.4,
		content:'/businessrent/rentback/giveback?orderNo='+orderNo,
		area:['400px','300px'],
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
      status:$('#status').val(),
      productName:$.trim($('#productName').val()),
      orderSource:orderSource,
      sourceCode:sourceCode,
      orderNo:$.trim($('#orderNo').val()),
    };
}
function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒 
    layer.close(index);
    grid.query(getParams());
}

$('#exportlist').on('click',function(){
	var startDate = $('#startDate').val();
	var mobile = $('#mobile').val();
	var status = $('#status').val();
	var productName = $('#productName').val();
	var orderSource = $('#orderSource').val();
	var sourcecode = $('#sourcecode').val();
	var orderNo = $('#orderNo').val();
	
	var param = '?startDate='+startDate+'&mobile='+mobile+'&status='+status+'&productName='+productName;
	param += '&orderSource='+orderSource+'&sourcecode='+sourcecode+'&orderNo='+orderNo;
	window.location.href = '/businessrent/rentback/rentbackexport'+param;
});