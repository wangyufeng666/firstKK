var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'3%',sortable:false} 
      ,{header: "创建日期", dataIndex: 'CREATE_DATE', width:'10%',sortable:false}
      ,{header: "订单编号", dataIndex: 'ORDER_NO', width:'12%',sortable:false}
           ,{header: "联系方式", dataIndex: '', width:'13%',sortable:false
              ,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
              }
      ,{header: "代扣编号", dataIndex: 'RENT_TRADE_NO', width:'15%',sortable:false}
      ,{header: "扣款开始时间", dataIndex: 'START_DATE', width:'10%',sortable:false}
      ,{header: "实际扣款时间", dataIndex: 'WITH_DATE', width:'10%',sortable:false}
      ,{header: "支付方式", dataIndex: 'PAYTYPENAME', width:'10%',sortable:false}
      ,{header: "代扣类型", dataIndex: 'WITHTYPENAME', width:'10%',sortable:false}
      ,{header: "扣款类型", dataIndex: 'PERIODNAME', width:'10%',sortable:false}
      ,{header: "代扣金额", dataIndex: 'AMOUNT', width:'10%',sortable:false}
      ,{header: "代扣状态", dataIndex: 'RESULTCODENAME', width:'10%',sortable:false}
      ,{header:"操作", dataIndex:'', width:'20%', sortable:false,
              renderer:function(value, data, rowIndex, colIndex, metadata){
                  var orderNo = data['ORDER_NO'];
                  var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
                  if(data['KEY'] && (data['RESULT_CODE'] == 'PAY_WILLPROCESS' || data['RESULT_CODE'] == 'PAY_READY_PROCESS' || data['RESULT_CODE'] == 'PAY_INPROCESS')){
                    returnText +=' | <a href="javascript:void(0);" title="'+orderNo+'" onclick="settlementWithhold(\''+orderNo+'\',\''+data['PERCODE']+'\',\''+data['RENT_TRADE_NO']+'\')" class="a_link">扣款</a>';
                    returnText +=' | <a href="javascript:void(0);" title="'+orderNo+'" onclick="settlementRepayment(\''+orderNo+'\',\''+data['RENT_TRADE_NO']+'\')" class="a_link">自行还款</a>';
                  }              
                  return returnText;
              }
          }
      ]
      ,url : '/businessrent/withholdinform/settlewithholdlist'
      ,baseParams:initParams()
      ,pageSizeList:[10,15,20,30,50]
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
/**
 * 订单详情
 * @param orderNo
 * @return
 */
function orderInfo(orderNo){
    window.location.href = "/businessrent/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl+"&sign="+'7';
}
function getParams(){
    return {
      partnerNo:$.trim($('#partnerNo').val()),
      rentTradeNo:$.trim($('#rentTradeNo').val()),
      startDate:$('#startDate').val(),
      mobile:$.trim($('#mobile').val()),
      payType:$('#payType').val(),
      resultCodeName:$('#resultCodeName').val(),
      crStartDate:$('#crStartDate').val()
    };
}
function settlementWithhold(orderNo,perCode,rentTradeNo){
    layer.confirm('确认扣款吗？', {
        btn: ['确认', '取消']
    }, function(){
        $.ajax({
            url:"/businessrent/withholdinform/settlementWithhold",
            type:"post",
            data:{orderNo:orderNo,perCode:perCode,rentTradeNo:rentTradeNo},
            dataType:"json",
            success:function(data){
                console.log(data);
                if(data['code'] !== '1000'){
                    layer.msg('操作错误：'+data['msg']);
                }else{
                    layer.msg('扣款成功');
                    grid.reload();
                }
            },
            error:function(){
                layer.msg('网络错误！');
            }
        });
    });
}
function settlementRepayment(orderNo,rentTradeNo){
  layer.open({
        type:2,
        title:'用户自行还款',
        shadeClose:false,
        shade:0.8,
        content:'/businessrent/withholdinform/settlementrepayment?orderNo=' + orderNo+'&rentTradeNo='+rentTradeNo,
        area:['50%','60%'],
        close:function(index){
            layer.close(index);
        }
   });
}
function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒 
    layer.close(index);
    grid.query(getParams());
}