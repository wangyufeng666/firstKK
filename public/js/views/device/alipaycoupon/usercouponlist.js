var backUrl = '/device/alipaycoupon/usercouponlist';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'150px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var memo = data['MEMO'] !='' && data['MEMO'] != null ? data['MEMO'] : '';
					var createdate = data['CREATEDATE'] !='' && data['CREATEDATE'] != null ? data['CREATEDATE'] : '';
					return '<span title="'+createdate+'" onclick="showRemark(\''+memo+'\',\''+createdate+'\')">'+createdate+'</span>';
				}
			}
			,{header: "红包编号", dataIndex: 'COUPON_NO', width:'200px',sortable:false}
			,{header:"红包ID", dataIndex:'', width:'250px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var voucher_id = data['VOUCHER_ID'];
					if(voucher_id){
						return voucher_id;
					}
				}
			}
			//,{header: "订单编号", dataIndex: 'ORDER_NO', width:'200px',sortable:false}
			,{header: "模版ID", dataIndex: 'TEMPLATE_ID', width:'250px',sortable:false}
			,{header:"用户", dataIndex:'', width:'50px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var voucherId = data['VOUCHER_ID'];
					return '<a title="'+voucherId+'" class="a_link" onclick="showUserInfo(\''+voucherId+'\')">详情</a>';
				}
			}
			,{header: "红包金额", dataIndex: 'AMOUNT', width:'80px',sortable:false}
			,{header: "红包状态", dataIndex: 'STATUSTXT', width:'100px',sortable:false}
			,{header:"扩展信息", dataIndex:'', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var voucherId = data['VOUCHER_ID'];
					if(voucherId){
						return '<a title="'+voucherId+'" class="a_link" onclick="updateDate(\''+voucherId+'\')">更新</a>';
					}
				}
			}
		]
		,url : '/device/alipaycoupon/usercouponpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
	});
});

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
		loginId:$('#loginId').val(),
		couponNo:$('#couponNo').val(),
		voucherId:$('#voucherId').val(),
		taobaoNick:$('#taobaoNick').val(),
		templateId:$('#templateId').val(),
		orderNo:$('#orderNo').val(),
		userId:$('#userId').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		status:$('#status').val()
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


/**
 * 更新扩展
 */
function updateDate(voucherId){
	if(voucherId){
		var loadl = layer.load(1, {shade: [0.3,'#000']});
		  $.post('/device/alipaycoupon/updatecoupon',{voucherId:voucherId},function(msg){
			layer.close(loadl);
			if(msg == 'Y'){
				layer.alert('成功', {icon: 1, skin: 'layer-ext-moon' });
			}else{
				layer.alert('失败：'+msg, {icon: 2, skin: 'layer-ext-moon' });
			}
		  },'json')
	}
}

/**
 * 展示备注
 */
function showRemark(memo,createdate){
	layer.close(layerIndex);
	layerIndex = layer.open({
		type:1, shade:false, title:false, area:['650px', 'auto'],
		content:'<div class="layer_notice">'+createdate+'<br>红包备注： '+memo+'</div>'
	});
	
}

/**
 * 展示用户帐号信息
 */
function showUserInfo(voucherId){
	layer.close(layerIndex);
	$.post('/device/alipaycoupon/couponinfo',{voucherId:voucherId},function(data){
		var html = '<div class="layer_notice">';
		if(typeof data.amount != "undefined"){
			html += '<div class="c_txt"><span class="c_tit">券名称</span><span class="c_con">'+data.voucher_name+'</span></div>';
			html += '<div class="c_txt"><span class="c_tit">用户ID</span><span class="c_con">'+data.user_id+'</span></div>';
			html += '<div class="c_txt"><span class="c_tit">激活时间</span><span class="c_con">'+data.gmt_active+'</span></div>';
			html += '<div class="c_txt"><span class="c_tit">过期时间</span><span class="c_con">'+data.gmt_expired+'</span></div>';
			html += '<div class="c_txt"><span class="c_tit">券面额</span><span class="c_con">'+data.amount+'</span></div>';
			html += '<div class="c_txt"><span class="c_tit">券余额</span><span class="c_con">'+data.price+'</span></div>';
			html += '<div class="c_txt"><span class="c_tit">券状态</span><span class="c_con">'+data.status+'</span></div>';
			html += '<div class="c_txt"><span class="c_tit">账单信息</span><span class="c_con"><table class="c_bill" cellpadding="0" cellspacing="0">';
			html += '<tr><th>支付宝交易号</th><th>交易金额</th><th>商户ID</th><th>商户名称</th><th>账单类型</th><th>交易状态</th><th>交易时间</th></tr>';
			if(typeof data.bill != "undefined"){
				for(var i in data.bill){
					html += '<tr>';
					html += '<td>'+data.bill[i].trade_no+'</td>';
					html += '<td>'+data.bill[i].amount+'</td>';
					html += '<td>'+data.bill[i].partner_id+'</td>';
					html += '<td>'+data.bill[i].partner_name+'</td>';
					html += '<td>'+data.bill[i].biz_type+'</td>';
					html += '<td>'+data.bill[i].bill_status+'</td>';
					html += '<td>'+data.bill[i].bill_create+'</td>';
					html += '</tr>';
				}
			}
			html += '</table></span></div>';
		}
		html += '</div>';
		
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['700px', 'auto'],
			content:html
		});
	},'json');
	
	
	
	
	
}

$('#exportlist').on('click',function(){
	var loginId = $('#loginId').val();
	var couponNo = $('#couponNo').val();
	var voucherId = $('#voucherId').val();
	var taobaoNick = $('#taobaoNick').val();
	var templateId = $('#templateId').val();
	var orderNo = $('#orderNo').val();
	var userId = $('#userId').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var status = $('#status').val();
	var param = '?loginId='+loginId+'&couponNo='+couponNo+'&voucherId='+voucherId+'&taobaoNick='+taobaoNick+'&templateId='+templateId;
	param += '&orderNo='+orderNo+'&userId='+userId+'&startDate='+startDate+'&endDate='+endDate+'&status='+status;
	window.location.href = '/device/alipaycoupon/usercouponexport'+param;
});

function orderInfo(pkid){
	if(pkid){
		window.location.href='/device/alipaycoupon/usercouponinfo?pkid='+pkid;
	}
}

//layer iframe
function layeriframe(title,url,x,y,s){
	var index = layer.open({
		type:2,
		title:title,
		shadeClose:false,
		shade:0.8,
		content:url,
		area:[x , y],
		close:function(index){
			layer.close(index);
		},
		end: function () {
			if(s == 1){
				location.reload();
			}
        }
	});
}

//更新红包扩展信息
function updateInfo(){
	var title = '模版信息';
	var url = '/device/alipaycoupon/updatecoupon';
	var x = '400px';
	var y = '300px';
	layeriframe(title,url,x,y,0);
}