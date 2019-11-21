
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATE_DATE', width:'10%',sortable:false}
			,{header: "订单编号", dataIndex: '', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:orderInfo(\"" + data['ORDERNO'] + "\")'>"+data['ORDERNO']+"</a>";
				}
			}
            ,{header: "商品品类", dataIndex: 'MERTYPENAME', width:'5%',sortable:false}
            ,{header: "商品品牌", dataIndex: 'PNAME', width:'5%',sortable:false}
            ,{header: "商品名称", dataIndex: 'MERNAME', width:'10%',sortable:false}
            ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'5%',sortable:false}
            ,{header: "优惠券金额", dataIndex: 'COUPONPRICE', width:'5%',sortable:false}
            ,{header: "手机号 / 昵称", dataIndex: '', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['MOBILE']+' / '+data['UNAME'];
				}
			}
            ,{header: "异常等级", dataIndex: 'LEVEL', width:'5%',sortable:false}
            ,{header: "地址", dataIndex: 'ADDRESS', width:'10%',sortable:false}
            ,{header: "操作标识", dataIndex: '', width:'80PX', sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var html = "";
                    var yes = "Y";
                    var no = "N";
                    if(data['ABNORMAL_FLAG'] != 'N'){
                        html += " <a class='a_link' href='javaScript:audit(\"" + data['ORDERNO'] + "\",\"" + no + "\")'>正常</a> | ";
                        html += " <a class='a_link' href='javaScript:audit(\"" + data['ORDERNO'] + "\",\"" + yes + "\")'>异常</a>";
                    }else{
                        html += "";
                    }
                    return html;
                }
            }
		]
		,url : '/analyze/orderwarn/userorderpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
	});
});

var backUrl = '/analyze/orderwarn/userorder';
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function audit(orderNo,status){
	var txt = "确定修改当前订单添加标识？";
	if(status == 'N'){
		txt = "确定修改当前订单添加标识为异常？";
	}else if(status == 'Y'){
		txt = "确定修改当前订单添加标识为正常？";
	}
	if(status == 'N' || status == 'Y'){
		source = 'U';
		if(confirm(txt)){
	        $.post("/analyze/orderwarn/addwarn", {orderNo:orderNo,status:status,source:source}, function(data){
	            if(data == 'Y'){
	            	alert('操作成功');
	                doSearch();
	            }else{
	            	alert('操作失败稍后再试');
	            }
	        });
	    }
	}else{
		alert('操作失败稍后再试');
	}
}

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		var params = [];
		return params;
	}
}

function getParams(){
	return {
		merType:$('#merType').val(),
		partnerCode:$('#partnerCode').val(),
		orderSource:$('#orderSource').val(),
		orderNo:$('#orderNo').val(),
		mobile:$('#mobile').val(),
		level:$('#level').val()
	};
}


function doSearch(){
	layer.msg('加载中', {icon:16,shade:0.1});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

$('#exportlist').on('click',function(){
	var merType = $('#merType').val();
	var partnerCode = $('#partnerCode').val();
	var orderSource = $('#orderSource').val();
	var orderNo = $('#orderNo').val();
	var mobile = $('#mobile').val();
	var level = $('#level').val();
	var param = '?merType='+merType+'&partnerCode='+partnerCode+'&orderSource='+orderSource+'&orderNo='+orderNo+'&mobile='+mobile+'&level='+level;
	window.location.href = '/analyze/orderwarn/exportuserorder'+param;
});

//渠道change事件
$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
		$("#orderSource").html("<option value=''>请选择来源</option>");
		for(i in data){
			$("#orderSource").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
		}
	}, 'json');
});