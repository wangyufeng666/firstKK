var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10
    ,height:250
    ,cm : [
           {checkbox:true}
           ,{header: "No.", dataIndex: 'R', width:'40px',sortable:false}
           ,{header: "订单编码", dataIndex: 'ORDERNO', width:'170px',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="javascript:void(0)" onclick="orderInfo(\''+value+'\')" title="'+value+'" class="a_link">'+value+'</a>';
               }
            }
           ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
           ,{header: "商品名称", dataIndex: 'MERNAME', sortable:false,
        	   renderer:function(value, data, rowIndex, colIndex, metadata){
        	   	   return data['PNAME']+"  "+value;
           	   }
           }
           ,{header: "订单价格", dataIndex: 'DINGDANPRICE', width:'70px',sortable:false}
           ,{header: "成交价格", dataIndex: 'SETTLEPRICE', width:'70px',sortable:false}
           ,{header: "入库日期", dataIndex: 'STRINWAREDATE', width:'100px',sortable:false}
           ,{header: "出库日期", dataIndex: 'STROUTWAREDATE', width:'100px',sortable:false}
           ,{header: "订单来源", dataIndex: 'ORDERTYPE', width:'100px',sortable:false}
           ,{header: "结算方式", dataIndex: 'EVENTNAME', width:'100px',sortable:false}
           ,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'80px',sortable:false}
           ,{header: "库存状态", dataIndex: '', width:'130px',sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		   var applySourceName = data['APPLYSOURCENAME']; 
        		   var sourceNameText = data['INVENTORYSTATUSNAME'];
        		   if(applySourceName){
        			   sourceNameText += '('+applySourceName+')';
        		   }
                   return sourceNameText;
        	   }
        	 }
           ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
              renderer : function(value, data, rowIndex, colIndex, metadata){
           	     var returnText ='';
           	     var orderNo = data['ORDERNO'];
           	     var applySource = data['APPLYSOURCE'];
                 var status = data['INVENTORYSTATUS'];
                 //1:已入库； 3:已出库； 4:待领用出库；5:已领用出库；
                 
                 if(status == '4'){//待审批
                  returnText+='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
               	  returnText+=' | <a href="javascript:void(0);" onclick="approval(\''+orderNo+'\',\''+applySource+'\')" class="a_link">审批</a>';
                }
                 return returnText;
               }
           }
    ]
    ,url : '/inventory/order/wareorderlist'
  	,pageSizeList:[10, 15, 20, 30, 50]
    ,baseParams:{inventoryStatus:4}
  });
});

/**
 * 订单详情
 * @param orderId
 * @return
 */
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl=/inventory/order/willapprovalindex";
}

/**
 * 审批操作
 */
function approval(orderNo, applySource){
	$.layer({
	    type:2,
	    title:'审批状态',
	    iframe:{src : '/inventory/order/approvalindex?orderNo='+orderNo+'&applySource='+applySource},
	    area : ['280', '120'],
	    offset : ['50px',''],
	    close : function(index){
	    layer.close(index);
	  },
      end : function(index){
  	      doSearch();//刷新
        }
	});
}

function approvals(){
	var orderNos = []; 
	var result = grid.getSelections();
	if(result == ''){
		alert('请选择订单');
	}else{
		for(var i = 0; i < result.length ; i++){
	    	orderNos.push(result[i].ORDERNO);
		}
	    $.post('/inventory/order/saveapprovals',{orderNos:orderNos},function(data){
	    	  if(data == 'Y'){
	    	      doSearch();//刷新
	    	  }
	    });
	}
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(), //商品名称
    	category:$('#category').val(),//品类
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val()
    };
}

function doSearch(){
	layer.msg('正在查询，请稍后...', 2, 16);
    var s = grid.query(getParams());
}

//监听回车键
$('html').keydown(function(e){
	if(e.which == '13'){
		doSearch();
	}
});