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
       ,{header: "协议号", dataIndex: 'AGREEMENT_NO', width:'15%',sortable:false}
       ,{header: "实付押金", dataIndex: 'REAL_DEPOSIT', width:'15%',sortable:false}
       ,{header: "结算金额", dataIndex: 'SETTLEMENT_AMOUNT', width:'15%',sortable:false}
       ,{header: "结算代扣金额", dataIndex: 'PENALTY', width:'15%',sortable:false}
       ,{header: "实际冻结转支付金额", dataIndex: 'REAL_PAY_AMOUNT', width:'15%',sortable:false}
       ,{header: "实际解冻金额", dataIndex: 'REAL_UNFREEZE_AMOUNT', width:'15%',sortable:false}
       ,{header: "押金状态", dataIndex: 'STATUS_NAME', width:'15%',sortable:false}
       ,{header: "押金解约状态", dataIndex: 'ISUNSIGNNAME', width:'15%',sortable:false}
       ,{header: "转支付状态", dataIndex: 'ISPAYNAME', width:'15%',sortable:false}
       ,{header: "协议状态", dataIndex: 'AGREEMENTSTATUSNAME', width:'15%',sortable:false}
        ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					          var orderNo = data['ORDER_NO'];
                    var returnText = '';
                    if(data['DEPOSITSTATUS'] == '2'){
                        returnText += '<a href="javascript:void(0);" title="'+orderNo+'" onclick="unFreeze(\''+orderNo+'\',\''+data['REAL_DEPOSIT']+'\',\''+data['SETTLEMENT_AMOUNT']+'\')" class="a_link">解冻</a>';;  
                      }
                    if(data['AGREEMENTSTATUS'] == 'NORMAL'){                 
                        if((data['DEPOSITSTATUS'] == '3' || data['DEPOSITSTATUS']== '4') && (data['IS_UNSIGN'] == 'Y' || data['IS_PAY'] == 'Y')){
                          returnText += '<a href="javascript:void(0);" title="'+orderNo+'" onclick="agreementUnSign(\''+orderNo+'\')" class="a_link">解约</a>';;  
                        }
                    }
                    return returnText;
				}
			}       
		]
      ,url : '/businessrent/order/getSettleAccount'
	  ,baseParams:initParams()
	  ,pageSizeList:[10,15,20,30,50]
	});
  	changeSourceShow();
  	$('#orderSource').change(function(){
          changeSourceShow();
  	});
    
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
$("#sourcecode").change(function(){
  sourceCode = '';
});
function reload(){
    layer.closeAll();
    grid.reload();
}
function initParams(){
	if(backFlag == 'Y'){
    	changeSourceShow();    
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}
/**
 * 解冻押金
 * @param orderNo
 * @return
 */
function unFreeze(orderNo,realAmount,settleAmount){
    layer.open({
        type:2,
        title:'订单解冻押金',
        shadeClose:false,
        shade:0.4,
        content:'/businessrent/order/unfreezepage?orderNo='+orderNo+'&realAmount='+realAmount+'&settleAmount='+settleAmount,
        area:['350px','250px'],
        close:function(index){
            layer.close(index);
        }
    });
}
function agreementUnSign(orderNo){
  layer.confirm('确认解约吗？', {
  btn: ['确认', '取消']
}, function(index, layero){
  $.ajax({
      url:"/businessrent/order/agreementunsign",
      type:"post",
      data:{orderNo:orderNo},
        dataType:"json",
        success:function(data){
          if(data['code'] !== '1000'){
              layer.msg('操作错误：'+data['msg']);
              layer.close(index);
              $('#btn_submit').bind('click', function(){formSubmit();});
          }else{
              layer.msg('解冻成功');
              parent.reload();
          }
        },
        error:function(){
          layer.msg('网络错误！');
        }
    });
});
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
      orderSource:orderSource,
      sourcecode:sourceCode,
      status:$('#status').val(),
      orderNo:$.trim($('#orderNo').val()),
      agreementNo:$.trim($('#agreementNo').val()),
      depositStatus:$('#depositStatus').val(),
      isUnsign:$('#isUnsign').val(),
      isPay:$('#isPay').val()
    };
}

function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒 
    layer.close(index);
   	grid.query(getParams());
}
