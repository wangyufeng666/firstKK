var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"创建时间", dataIndex:'CREATE_DATE', width:'95px', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'90px', sortable:false}
		   ,{header:"订单号", dataIndex:'ORDER_NO', width:'110px', sortable:false}
		   ,{header:"商品类型名", dataIndex:'PRODUCT_TYPE_NAME', width:'70px', sortable:false}
		   ,{header:"商品名", dataIndex:'', width:'130px', sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
                return data['PRODUCT_NAME']+' '+data['MODEL_NAME'];
              }
		   }
           ,{header: "联系方式", dataIndex: '', width:'105px',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
              }		   
           ,{header:"芝麻等级", dataIndex:'ZM_GRADE', width:'80px', sortable:false}
           ,{header:"合同开始日期", dataIndex:'CONTRACTS_DATE', width:'95px', sortable:false}
           ,{header:"合同结束日期", dataIndex:'CONTRACTS_ENDDATE', width:'95px', sortable:false}
		   ,{header:"市场价", dataIndex:'NEW_PRODUCT_PRICE', width:'60px', sortable:false}
		   ,{header:"采购价格", dataIndex:'PURCHASEPRICE', width:'60px', sortable:false}
		   ,{header:"回收价", dataIndex:'RECOVERYPRICE', width:'60px', sortable:false}
		   ,{header:"手续费", dataIndex:'SERVICEPRICE', width:'60px', sortable:false}
		   ,{header:"保险费", dataIndex:'INSURANCEPRICE', width:'60px', sortable:false}
		   ,{header:"买断价格", dataIndex:'BUYOFFPRICE', width:'60px', sortable:false}
		   ,{header:"期数×每期付费=分期总费用", dataIndex:'', width:'140px', sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return data['TOTAL_PERIODS']+'×'+data['PERIOD_PRICE']+'='+data['TOTAL_PRICE'];
               }
             }	
           ,{header:"租赁利润", dataIndex:'PROFITPRICE', width:'60px', sortable:false}
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'62px', sortable:false}
           ,{header: "操作", dataIndex: '', width:'140px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
					return returnText;
				}
			}       
		]
       ,url : '/rent/installment/installmentlist'
       ,baseParams:{isAll:'all'}
	});

    // 终端变更监听
    $('#order_source').change(function(){
        changeSourceShow();
    });
});

// 修改查询来源
function changeSourceShow(){
    var terminalCode = orderListApp.terminalCode;
    if(terminalCode){
        if(allSourceCode[terminalCode]) {
            orderListApp.terminalName = allTerminal[terminalCode];
            orderListApp.sourceCodeList = allSourceCode[terminalCode];
            orderListApp.showSourceCode = true;
        }else{
            orderListApp.sourceCodeList = '';
            orderListApp.showSourceCode = false;
        }
    }else{
        orderListApp.sourceCodeList = '';
        orderListApp.showSourceCode = false;
    }
    orderListApp.sourceCode = '';
}

/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(order_no){
	window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl=/rent/installment/report";
}

function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	mobile:$('#mobile').val(),
    	order_source:$('#order_source').val(),
    	status:$('#status').val(),
    	product_name:$('#product_name').val(),
    	merType:$('#merType').val(),
    	order_no:$('#order_no').val(),
        sourceCode:$('#sourceCode').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function exportReport(){
    var params = getParams();
    parmStr = "";
    for(var i in params){
        parmStr += i + "=" + params[i] + "&";
    }
    window.location.href = "/rent/installment/exportreport?" + parmStr;
}

