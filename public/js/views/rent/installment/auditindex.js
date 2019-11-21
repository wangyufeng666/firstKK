var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="/rent/installment/inspectionbill?orderNo='+data['ORDER_NO']+'" target="view_window" title="'+data['ORDER_NO']+'" class="a_link">'+value+'</a>';
               }
            }
		   ,{header:"创建时间", dataIndex:'CREATE_DATE', width:'10%', sortable:false}
		   ,{header:"订单来源", dataIndex:'ORDER_SOURCENAME', width:'14%', sortable:false}
           ,{header: "订单号", dataIndex: 'ORDER_NO', width:'12%',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return '<a href="/rent/installment/deliverbill?orderNo='+value+'" target="view_window" title="'+value+'" class="a_link">'+value+'</a>';
               }
            }
		   ,{header:"商品类型", dataIndex:'PRODUCT_TYPE_NAME', width:'5%', sortable:false}
		   ,{header:"商品名", dataIndex:'', width:'15%', sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
                return data['PRODUCT_NAME']+' '+data['MODEL_NAME'];
              }
		   }
           ,{header: "联系方式", dataIndex: '', width:'10%',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
              }		   
		   ,{header:"新机价格", dataIndex:'NEW_PRODUCT_PRICE', width:'5%', sortable:false}
           ,{header:"交易方式", dataIndex:'TRADE_TYPE', width:'8%', sortable:false}
           ,{header:"结算方式", dataIndex:'PAYTYPE', width:'8%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				return value == '1' ? '乐百分' : value == '2' ? '花呗' : value == '3' ? '支付宝全额':'小程序代扣';
			}
          }
           ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'8%', sortable:false}
            , {header: "是否采购", dataIndex: 'ISPURCHASE', width: '8%', sortable: false,
                renderer: function (value, data, rowIndex, colIndex, metadata) {
                    return value == 'N' ? '未采购' : value == 'Y' ? '<span style="color:red">已采购</span>' : '';
                }
            }
           ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
                    var customer_account_name = data['CUSTOMER_ACCOUNT_NAME'];
                    var account_source = data['ACCOUNT_SOURCE'];
                    var auditFlag = data['AUDITFLAG'];
					var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
                    // if(data['ORDER_SOURCE'] == '1019'){
                    //     returnText += ' | <a href="javascript:void(0);" onclick="newBrandStopOrder(\'' + order_no + '\')" class="a_link">取消订单</a>';
                    // }
					returnText+=' | <a href="javascript:void(0);" onclick="updateAccount(\''+order_no+'\',\''+customer_account_name+'\',\''+account_source+'\')" class="a_link">账号</a>';
                    returnText+=' | <a href="javascript:void(0);" onclick="confirmAudit(\''+order_no+'\',\''+customer_account_name+'\')" class="a_link">审核</a>';
					returnText+='| <a href="javascript:void(0);" onclick="call(\''+data['CONTACT_MOBILE']+'\')" class="a_link">外呼</a>';
					return returnText;
				}
			}       
		]
       ,url : '/rent/installment/installmentauditlist'
	   ,baseParams:initParams()
	   ,pageSizeList:[10,15,20,30,50]
	});
    // 终端变更监听
	$('#order_source').change(function(){
        changeSourceShow();
	});
});

function changeSourceShow(){
    var terminalCode = auditListApp.terminalCode;
    if(terminalCode){
        if(allSourceCode[terminalCode]) {
            auditListApp.terminalName = allTerminal[terminalCode];
            auditListApp.sourceCodeList = allSourceCode[terminalCode];
            auditListApp.showSourceCode = true;
        }else{
            auditListApp.sourceCodeList = '';
            auditListApp.showSourceCode = false;
        }
    }else{
        auditListApp.sourceCodeList = '';
        auditListApp.showSourceCode = false;
    }
    auditListApp.sourceCode = '';
}

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
 * @param order_no
 * @return
 */
function orderInfo(order_no){
	window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
}

/**
 * 外呼
 * @param customerNumber
 * @return
 */
function call(customerNumber){
	$.get(url,{enterpriseId:enterpriseId, cno:cno, pwd:pwd, customerNumber:customerNumber}, function(data){
		alert(data);
	});
}




/**
 * 保存账号:eg:微信号
 * @param Order_no
 * @return
 */
function updateAccount(order_no,account,source){
	$.layer({
		type:2,
		title:'订单状态修改',
		iframe:{src:'/rent/installment/saveaccount?order_no='+order_no+'&account='+account+'&account_source='+source},
		area:['500' , '400'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
            doSearch();
			// window.location.href = window.location.href;
		}
	});
}

/**
 * 审核是否通过
 * @param orderNo
 * @param account
 */
function confirmAudit(orderNo,account){
	if(account == '' || account == null || account == 'null' ){
		layer.msg('请先添加账号！');
		return false;
	}
    if(confirm('审核是否通过？')){
        $.post("/rent/installment/confirmaudit", {orderNo:orderNo}, function(res){
            if(res.code == '1000'){
                layer.msg('审核通过成功');
                window.location.reload();
            }else{
                layer.msg(res.msg);
            }
        });
    }

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
        sourceCode:$('#sourceCode').val(),
        isPurchase:$('#isPurchase').val(),
        shopTypes:$('#shopTypes').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function doAccount(){
    layer.load('账号添加成功!', 1);
    grid.query(getParams());
}

/**
 * 新品牌租赁终止订单
 * @param orderNo
 */
function newBrandStopOrder(orderNo){
    $.layer({
        type:2,
        title:'订单终止',
        iframe:{src:'/rent/installment/tonewbrandstoporder?orderNo='+orderNo},
        area:['500', '350'],
        offset:['50px', ''],
        close:function(index){
            layer.close(index);
        }
    });
}