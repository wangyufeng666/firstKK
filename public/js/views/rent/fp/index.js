var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :15,
		height:375
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"订单号", dataIndex:'ORDER_NO', width:'10%', sortable:false}
		   ,{header:"期数", dataIndex:'PERIODNAME', width:'10%', sortable:false}
		   ,{header:"开票时间", dataIndex:'INVDATE', width:'8%', sortable:false}
		   ,{header:"开始时间", dataIndex:'STARTDATE', width:'10%', sortable:false}
		   ,{header:"结束时间", dataIndex:'ENDDATE', width:'10%', sortable:false}
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
		   ,{header:"发票金额", dataIndex:'INVPRICE', width:'5%', sortable:false}
		   ,{header: "发票号码", dataIndex: '', width:'15%',sortable:false
			   ,renderer : function(value, data, rowIndex, colIndex, metadata){
				   if(data['INVOICEDM'] && data['INVOICEHM']){
					   return data['INVOICEDM']+'('+data['INVOICEHM']+')';
				   }
			   }
		   }
		   ,{header:"状态", dataIndex:'STATUSNAME', width:'5%', sortable:false}
           ,{header: "操作", dataIndex: '', width:'10%', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var order_no = data['ORDER_NO'];
					var status = data['STATUS'];
					var pdfurl = data['PDFURL'];
					if(status == '3' && pdfurl){
						var returnText ='<a href="'+pdfurl+'" class="a_link" target="_blank">查看</a>';
					}
					return returnText;
				}
			}       
		]
       ,url : '/rent/fp/fplist'
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
 * @param order_no
 * @return
 */
function orderInfo(order_no){
	window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
}

/**
 * 开票
 */
function kp(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		url:'http://gomezz.youdemai.com/api/dzfp/billdzfp',
		success:function(data){
			alert('成功开票'+data+'单');
			doSearch();
		}
	});
}


/**
 * 下载发票
 * @return
 */
function xzfp(){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,
		url:'http://gomezz.youdemai.com/api/dzfp/downloadinvoice',
		success:function(data){
			alert('成功下载'+data+'单');
			doSearch();
		}
	});
}

function getParams(){
    return {
    	contactway:$('#contactway').val(),
    	periodname:$('#periodname').val(),
    	status:$('#status').val(),
    	orderNo:$('#orderNo').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
