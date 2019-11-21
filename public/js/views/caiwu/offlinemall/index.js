var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm : [
        	{header: "No.", dataIndex: 'R', width:'20px',sortable:false} 
        	,{header: "订单号", dataIndex: 'ORDERNO', width:'80px',sortable:false}
        	,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'25px',sortable:false}
        	,{header: "器材名称", dataIndex: 'MERNAME', width:'40px',sortable:false}
        	,{header: "联系人", dataIndex: 'LIANXIREN', width:'20px',sortable:false}
    	   ,{header: "联系方式", dataIndex: 'LIANXIDH', width:'40px',sortable:false}
           ,{header: "下单日期", dataIndex: 'CREATEDATE', width:'60px',sortable:false}
           ,{header: "券来源", dataIndex: 'SOURCENAME', width:'60px',sortable:false}
           ,{header: "兑换码", dataIndex: 'COUPONCODE', width:'60px',sortable:false}
           ,{header: "金额", dataIndex: 'PRICE', width:'40px',sortable:false}
           ,{header: "券码类型", dataIndex: 'COUPONFLAG', width:'40px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '普通支付券码' : '先行支付券码';
				}
          }
           ,{header: "券码状态", dataIndex: 'COUPONSTATUS', width:'40px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					if(value == '1'){
						return '<font color="green">未使用</font>';
					}else if(value == '2'){
						return '<font color="blue">已使用</font>';
					}else if(value == '3'){
						return '<font color="red">已作废</font>';
					}
				}
           }
           ,{header: "操作时间", dataIndex: 'USEDATE', width:'60px',sortable:false}
           ,{header: "操作人", dataIndex: 'SENDNAME', width:'40px',sortable:false}
           ,{header: "操作", dataIndex: '', width:'80px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var couponStatus = data['COUPONSTATUS'];
					var couponCode = data['COUPONCODE'];
					var returnText = '<a href="javascript:void(0);" onclick="initializeCoupon(\''+couponCode+'\')" class="a_link">初始化</a>';
					if(couponStatus == '1'){//待使用
						returnText += ' | <a href="javascript:void(0);" onclick="useCoupon(\''+couponCode+'\')" class="a_link">使用</a>';
						returnText += ' | <a href="javascript:void(0);" onclick="stopCoupon(\''+couponCode+'\')" class="a_link">作废</a>';
					}
					
					return returnText;
				}
           }
    ]
    ,url : '/caiwu/offlinemall/orderpagelist'
    ,pageSizeList:[20,30,50]
  });
});

function getParams(){
    return {
    	contactName:$('#contactName').val(),
    	mobile:$('#mobile').val(),
    	orderNo:$('#orderNo').val(),
    	couponCode:$('#couponCode').val(), 
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),
        couponSources:$('#couponSources').val(),
    };
}

//使用券码
function useCoupon(couponCode){
	if(confirm("确定使用"+couponCode+"此券码吗？")){
		$.post('/caiwu/offlinemall/usecoupon',{couponCode:couponCode,statusFlag:"2"},function(data){
			if(data == 'Y'){
				alert("使用成功");
			}else{
				alert(data);
			}
			doSearch();
		});
	}
//	var coupon = prompt("请输入兑换券码后三位：","");
//	var couponCode = couponCode;
//	var newCouponCode = couponCode.substring(7); 
//	if(coupon != null && coupon != ''){
//		if(coupon == newCouponCode){
//			if(confirm("确定使用"+couponCode+"此券码吗？")){
//				$.post('/caiwu/offlinemall/usecoupon',{couponCode:couponCode,statusFlag:"Y"},function(data){
//					if(data == 'Y'){
//						alert("使用成功");
//						window.location.href = '/caiwu/offlinemall/index';
//					}else{
//						alert(data);
//					}
//				});
//			}
//		}else{
//			alert("券码有误请重新输入");
//		}
//	}else{
//		alert("请输入兑换券码");
//	}
}

//作废券码
function stopCoupon(couponCode){
	if(confirm("确定作废"+couponCode+"此券码吗？")){
		$.post('/caiwu/offlinemall/usecoupon',{couponCode:couponCode,statusFlag:"3"},function(data){
			if(data == 'Y'){
				alert("作废成功");
			}else{
				alert(data);
			}
			doSearch();
		});
	}
//	var coupon = prompt("请输入兑换券码：","");
//	var couponCode = couponCode;
//	var newCouponCode = couponCode.substring(7);
//	if(coupon != null && coupon != ''){
//		if(coupon == newCouponCode){
//			if(confirm("确定作废"+couponCode+"此券码吗？")){
//				$.post('/caiwu/offlinemall/usecoupon',{couponCode:couponCode},function(data){
//					if(data == 'Y'){
//						alert("作废成功");
//						window.location.href = '/caiwu/offlinemall/index';
//					}else{
//						alert(data);
//					}
//				});
//			}
//		}else{
//			alert("券码有误请重新输入");
//		}
//	}else{
//		alert("请输入兑换券码");
//	}
}

//初始化券码
function initializeCoupon(couponCode){
	if(confirm("确定初始化"+couponCode+"此券码吗？")){
		$.post('/caiwu/offlinemall/usecoupon',{couponCode:couponCode,statusFlag:"1"},function(data){
			if(data == 'Y'){
				alert("初始化成功");
			}else{
				alert(data);
			}
			doSearch();
		});
	}
}

function exportCoupon(){
	var param = '';
	param += '&orderNo=' + $('#orderNo').val();
	param += '&contactName=' + $('#contactName').val();
	param += '&couponCode=' + $('#couponCode').val();
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();
	param += '&mobile=' + $('#mobile').val();
	param += '&couponSources=' + $('#couponSources').val();
	window.location.href = '/caiwu/offlinemall/exportcoupon?'+param;
	return false; //截取返回false就不会保存网页了
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