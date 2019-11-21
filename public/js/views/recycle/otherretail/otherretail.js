
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'40PX',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
			,{header: "订单时间", dataIndex: 'ORDERDATE', width:'150px',sortable:false}
			,{header: "商店名称", dataIndex: 'SHOPNAME', width:'100px',sortable:false}
			,{header: "订单编号", dataIndex:'', width:'150px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var orderNo = data['ORDERNO'];
					return "<a href='javaScript:orderInfo(\"" + pkid + "\")'>"+orderNo+"</a>";
				}
			}
            ,{header: "商品名称", dataIndex: 'PRODUCTNAME', width:'200px',sortable:false}
            ,{header: "商品价格", dataIndex: 'PRODUCTPRICE', width:'80px',sortable:false}
            ,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'80px',sortable:false}
            ,{header: "结算价格", dataIndex: 'SALEPRICE', width:'80px',sortable:false}
            ,{header: "购买数量", dataIndex: 'COUNTS', width:'80px',sortable:false}
            ,{header: "订单状态", dataIndex: 'STATUSNAME', width:'100px',sortable:false}
            ,{header: "联系电话", dataIndex:'', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['MOBILE']+'('+data['CONTACTS']+')';
				}
			}
            ,{header: "联系地址", dataIndex: 'ADDRESS', width:'150px',sortable:false}
            ,{header: "操作", dataIndex: '',  sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                	var pkid = data['PKID'];
                	var html = "<a class='a_link' href='javaScript:orderInfo(\"" + pkid + "\")'>详情</a> ";
                	html += " | <a class='a_link' href='javaScript:orderDel(\"" + pkid + "\")'>删除</a> ";
                    return html;
                }
            }
		]
		,url : '/recycle/otherretail/pagelist'
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
		mobile:$('#mobile').val(),
		orderNo:$('#orderNo').val(),
		status:$('#status').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		startcreate:$('#startcreate').val(),
		endcreate:$('#endcreate').val(),
		shopName:$('#shopName').val()
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
function orderInfo(pkid){
	if(pkid){
		layer.open({
			type:2,
			title:'订单详情',
			shadeClose:false,
			shade:0.8,
			content:'/recycle/otherretail/orderinfo?pkid='+pkid,
			area:['100%' , '100%'],
			close:function(index){
				layer.close(index);
			}
		});
	}else{
		layer.alert('失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
	}
	
}

/**
 * 导入
 */
$('#importList').on('click',function(){
	layer.open({
		type:2,
		title:'订单导入',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/otherretail/importlist',
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
});

/**
 * 导出
 */
$('#exportlist').on('click',function(){
	var mobile = $('#mobile').val();
	var orderNo = $('#orderNo').val();
	var status = $('#status').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var shopName = $('#shopName').val();
	var startcreate = $('#startcreate').val();
	var endcreate = $('#endcreate').val();
	var param = '?mobile='+mobile+'&orderNo='+orderNo+'&status='+status+'&startDate='+startDate+'&endDate='+endDate;
	param += '&shopName='+shopName+'&startcreate='+startcreate+'&endcreate='+endcreate;
	window.location.href = '/recycle/otherretail/exportlist'+param;
});

/**
 * 删除
 */
function orderDel(pkid){
	if(pkid){
		layer.confirm("确定删除当前订单？", {
			  btn: ['确定','取消'] 
			}, function(){
				$.post("/recycle/otherretail/orderdel", {pkid:pkid}, function(data){
			        if(data == 'Y'){
			            layer.msg('成功');
			            setTimeout(function(){doSearch()}, 2000);
			        }else{
			        	layer.alert('失败：'+data, {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
			        }
			    });
			}, function(){
			  
			});
	}else{
		layer.alert('操作失败稍后再试', {skin: 'layui-layer-lan',closeBtn: 0,anim: 6});
	}
}
