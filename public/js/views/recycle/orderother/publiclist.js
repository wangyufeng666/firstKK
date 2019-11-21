
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'180px',sortable:false}
            ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'100px',sortable:false}
            ,{header: "商品名称", dataIndex: 'MERNAME', width:'200px',sortable:false}
            ,{header: "联系电话", dataIndex:'', width:'150px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTSWAY']+'('+data['CONTACTS']+')';
				}
			}
            ,{header: "联系地址", dataIndex: 'ADDRESS', width:'150px',sortable:false}
            ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'80px',sortable:false}
            ,{header: "结算价格", dataIndex: 'SETTLEPRICE', width:'80px',sortable:false}
            ,{header: "订单状态", dataIndex: 'STATUSTXT', width:'80px',sortable:false}
            ,{header: "上门时间", dataIndex: 'DOORTIME', width:'150px',sortable:false}
            ,{header: "操作", dataIndex: '',  sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                	var status = data['STATUS'];
                	var orderNo = data['ORDERNO'];
                	var html = "<a class='a_link' href='javaScript:orderInfo(\"" + orderNo + "\")'>详情</a> ";
                	if(htmlFlag == 'philips'){
                		if(status == 1){
                    		html += " | <a class='a_link' href='javaScript:serviceTime(\"" + orderNo + "\")'>预约</a> ";
                    		html += " | <a class='a_link' href='javaScript:updateStatus(\"" + orderNo + "\",\"2\")'>确认</a> ";
                    	}
                    	if(status == 1 || status == 2 ){
                    		html += " | <a class='a_link' href='javaScript:updateStatus(\"" + orderNo + "\",\"99\")'>关闭</a> ";
                    	}
                	}else if(htmlFlag == 'paylist'){
                		if(status == 2 ){
                    		html += " | <a class='a_link' href='javaScript:payment(\"" + orderNo + "\")'>打款</a> ";
                    	}
                	}
                    return html;
                }
            }
		]
		,url : '/recycle/orderother/pagelist'
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
		params['status'] = status;
		params['partnerCode'] = partnerCode;
		return params;
	}else{
		var params = [];
		params['status'] = status;
		params['partnerCode'] = partnerCode;
		return params;
	}
}

function getParams(){
	return {
		mobile:$('#mobile').val(),
		orderNo:$('#orderNo').val(),
		status:$('#status').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		startTime:$('#startTime').val(),
		endTime:$('#endTime').val(),
		partnerCode:partnerCode
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
			if(s == 1 || s == true){
				location.reload();
			}
        }
	});
}

/**
 * 详情
 */
function orderInfo(orderNo){
	if(orderNo){
		layer.open({
			type:2,
			title:'订单详情',
			shadeClose:false,
			shade:0.8,
			content:'/recycle/orderother/orderinfo?orderNo='+orderNo,
			area:['100%' , '100%'],
			close:function(index){
				layer.close(index);
			}
		});
	}else{
		layer.alert(txt+'失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
	}
	
}

/**
 * 导出
 */
$('#exportlist').on('click',function(){
	var mobile = $('#mobile').val();
	var orderNo = $('#orderNo').val();
	var status = $('#status').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var startTime = $('#startTime').val();
	var endTime = $('#endTime').val();
	var param = '?mobile='+mobile+'&orderNo='+orderNo+'&status='+status+'&startDate='+startDate+'&endDate='+endDate;
	param += '&startTime='+startTime+'&endTime='+endTime+'&partnerCode='+partnerCode;
	window.location.href = '/recycle/orderother/exportlist'+param;
});

/**
 * 修改状态
 */
function updateStatus(orderNo,status){
	if(status == '2'){
		var txt = "审核";
	}else if(status == '99'){
		var txt = "终止";
	}
	if(orderNo && status){
		layer.confirm("确定"+txt+"当前订单？", {
			  btn: ['确定','取消'] 
			}, function(){
				submits(orderNo,status);
			}, function(){
			  
			});
	}else{
		layer.alert('操作失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
	}
}

/**
 * 修改状态
 */
function submits(orderNo,status){
	$.post("/recycle/orderother/updatestatus", {orderNo:orderNo,status:status}, function(data){
        if(data == 'Y'){
            layer.msg('成功');
            setTimeout(function(){doSearch()}, 2000);
        }else{
        	layer.alert(txt+'失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
        }
    });
}

/**
 * 上门时间
 */
function serviceTime(orderNo){
	var datetime = prompt('修改预约时间，请输入时间','');
	if(datetime){
		if(orderNo !='' && datetime !='' && datetime != null){
	        $.post("/recycle/orderother/updatetime", {orderNo:orderNo,datetime:datetime}, function(data){
	            if(data == 'Y'){
	                layer.msg('成功');
	                setTimeout(function(){doSearch()}, 2000);
	            }else{
	            	layer.alert(txt+'失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
	            }
	        });
		}else{
			layer.alert('操作失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
		}
	}else{
		layer.alert('操作失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
	}
}

/**
 * 打款
 */
function payment(orderNo){
	var title = '打款';
	var url = '/recycle/orderother/payindex?orderNo='+orderNo;
	var x = '450px';
	var y = '450px';
	var s = true;
	layeriframe(title,url,x,y,s)
}