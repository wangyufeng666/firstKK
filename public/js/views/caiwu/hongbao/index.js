var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250,
		cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "领用日期", dataIndex: 'HONGBAODATE', width:'80px',sortable:false}
			,{header: "旧机名称", dataIndex: 'MERNAME',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "旧机价格", dataIndex: 'ORDERPRICE', width:'90px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "旧机状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "店员姓名", dataIndex: 'USERNAME', width:'80px',sortable:false}
			,{header: "店员编号", dataIndex: 'JOBNUM', width:'70px',sortable:false}
			,{header: "联系方式", dataIndex: 'PHONENUM', width:'100px',sortable:false}
			,{header: "红包价格", dataIndex: 'HONGBAOPRICE', width:'70px',sortable:false}
            ,{header: "红包状态", dataIndex: 'HBSTATUS', width:'70px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '待发送':value == '2' ? '已发送' : '已取消';
				}
			 }
			,{header: "操作", dataIndex: '', width:'130px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var wxopenId = data['WEIXINOPENID'];
					var orderStatus = data['ORDERSTATUS'];
					var hbStatus = data['HBSTATUS'];
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">查看</a>';
					if((orderStatus == '5' || orderStatus == '66') && hbStatus == '1'){
		  				returnText += ' | <a href="javascript:void(0);" onclick="sendHongbao(\''+orderNo+'\',\''+wxopenId+'\')" class="a_link">发送</a>';
						returnText += ' | <a href="javascript:void(0);" onclick="stopHongbao(\''+orderNo+'\',\''+wxopenId+'\')" class="a_link">取消</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/caiwu/hongbao/pagelist'
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
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}


/**
 * 发送红包
 * @param orderId
 * @return
 */
function sendHongbao(orderNo,wxopenId){
	$.layer({
	    type:2,
	    title:'红包发送',
	    iframe:{src : "/caiwu/hongbao/send?orderNo="+orderNo+"&wxopenId="+wxopenId},
	    area : ['360', '240'],
	    offset : ['50px',''],
	    close : function(index){
	    layer.close(index);
	  },
      end : function(index){
  	      doSearch();//刷新
        }
	});
}

function stopHongbao(orderNo,wxopenId){
	if(confirm('是否取消此红包？')){
		$.ajax({
	        type:'POST'//请求方式
	        ,url:"/caiwu/hongbao/stophongbao"  //请求路径
	        ,data:{orderNo:orderNo,wxopenId:wxopenId} //发送到服务器的数据
	        ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async:false //同步请求
	        ,timeout:60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
	    		if(data == "Y"){
	    			window.location.href = backUrl;
	            }else{
					alert("取消失败");
	            }
			}
		});
	}
}

function getParams(){
    return {
    	hbStatus:$('#hbStatus').val(),
        orderNo:$('#orderNo').val(),
        jobNum:$('#jobNum').val(),
        contactWay:$('#contactWay').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val()
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