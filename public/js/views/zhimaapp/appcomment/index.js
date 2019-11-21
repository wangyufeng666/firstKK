var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
            {checkbox : true},
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"订单时间", dataIndex:'STRORDERDATE', width:'70px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE',width:'95px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['TIP']=='Y'&& data['REVIEW']=='N'){
						return'<font color="red">'+data['CREATEDATE']+'</font>';
					}else{
						return data['CREATEDATE'];
					}
				}
			}
			,{header:"处理状态", dataIndex:'REVIEW',width:'60px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['REVIEW']=='Y'){
						return'已通过';
					}else if(data['REVIEW']=='S'){
						return'未通过';
					}else{
						return'<font color="red">未审核</font>';
					}
				}
			}
			,{header:"状况", dataIndex:'TYPEFLAG',width:'40px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['TYPEFLAG']=='Y'){
						return'好评';
					}else{
						return'不评';
					}
				}
			}
			,{header:"评论", dataIndex:'COMMENTS', width:'170px',sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME',width:'90px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['MERTYPENAME']+' '+data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header:"联系方式", dataIndex:'', width:'100px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
        		}
			} 
			,{header:"订单类型", dataIndex:'ZMTYPENAME', width:'70px',sortable:false}
			,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
        		}
			}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var returnText ='<a href="javascript:void(0);" onclick="orderInfo(\''+orderNo+'\')" class="a_link">订单详情</a>';
					var review = data['REVIEW'];
						returnText +=' |<a href="javascript:void(0);" onclick="todealWith(\''+orderNo+'\')" class="a_link">去审核</a>';
					return returnText;
				}
			}
		]
		,url:'/zhimaapp/appcomment/pagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[15,20,30,50]
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

function doSearch(){
	grid.query(getParams());
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
 * 去审核
 * @param orderNo
 * @return
 */
function todealWith(orderNo){
	layer.confirm('是否确认通过审核？', {
		btn: ['通过','不通过'] //按钮
	}, function(){
		dealComment(orderNo,'Y');
	}, function(){
		dealComment(orderNo,'S');
	});
}

//审核
function dealComment(orderNo,review) {
	$.post('/zhimaapp/appcomment/todealwith', {orderNo:orderNo,review:review}, function(data){
		if(data == 'Y'){
			layer.msg("审核完成");
			doSearch();
		}else{
			layer.msg('审核失败');
		}
	});
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}


function getParams(){
	return {
		start:start,
		status:$('#status').val(),
		orderNo:$('#orderNo').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

