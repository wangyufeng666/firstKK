var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize:10,
    height:250
    ,cm:[
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'90px',sortable:false}
      ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'90px',sortable:false}
      ,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
          return data['PNAME']+' '+data['MERNAME'];
        }
      }
      ,{header: "联系方式", dataIndex: '', width:'140px',sortable:false
      	,renderer : function(value, data, rowIndex, colIndex, metadata){
            return data['LIANXIDH']+'('+data['LIANXIREN']+')';
          }
        }
      ,{header: "联系地址", dataIndex: 'DIZHI', width:'160px',sortable:false}
      ,{header: "订单来源", dataIndex: 'SOURCENAME', width:'120px',sortable:false}
      ,{header: "结算类型", dataIndex: 'EVENTNAME', width:'110px',sortable:false}
      ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'80px',sortable:false}
      ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'80px',sortable:false}
    ]
    ,url : '/order/order1/pagelist'
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

function getParams(){
    return {
        merName:$('#merName').val(),
        orderNo:$('#orderNo').val(),
        sourcecode:$('#sourcecode').val(),
        tradeType:$('#tradeType').val(),
        contactWay:$('#contactWay').val(),
        partnerCode:$('#partnerCode').val(),
        orderStatus:$('#orderStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        category:$('#category').val(),
        merType:$('#merType').val(),
        address:$('#address').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});