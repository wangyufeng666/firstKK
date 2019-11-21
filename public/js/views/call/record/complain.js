var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "客户姓名", dataIndex: 'USERNAME', width:'40px',sortable:false}
			,{header: "客户手机", dataIndex: 'CONTACTWAY', width:'60px',sortable:false}
			,{header: "投诉时间", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
			,{header: "投诉订单", dataIndex: 'ORDERNO', width:'90px',sortable:false}
			,{header: "客诉类型", dataIndex: 'COMPLAINTYPENAME', width:'80px',sortable:false}
			,{header: "客诉等级", dataIndex: 'COMPLAINLEVELNAME', width:'60px',sortable:false}
			,{header: "投诉内容", dataIndex: 'CONTENTTYPENAME', width:'100px',sortable:false}
			,{header: "投诉备注", dataIndex: 'CONTENTREMARK', width:'100px',sortable:false}
			,{header: "处理方案", dataIndex: 'DEALPLANTYPENAME', width:'80px',sortable:false}
			,{header: "处理方案备注", dataIndex: 'DEALPLANREMARK', width:'80px',sortable:false}
			,{header: "赔偿金额", dataIndex: 'COMPLAINMONEY', width:'60px',sortable:false}
			,{header: "责任人", dataIndex: 'LIABLEPERSON', width:'60px',sortable:false}
			,{header: "处理结果 ", dataIndex: 'DEALRESULTTYPENAME', width:'80px',sortable:false}
			,{header: "最新状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}

			,{header: "操作", dataIndex: '', width:'130px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var pkId = data['PKID'];
					var returnText = '';
					if (orderNo != ''){
						returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="complainInfo(\''+pkId+'\',\''+orderNo+'\')" class="a_link">查看 | </a>';
					}
						returnText +='<a title="'+orderNo+'" href="javascript:editComplain(\''+pkId+'\')" class="a_link">修改</a>';
					return returnText;
				}
			}
		]
		,url : '/call/record/complainpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,20,30,50]
 	});
});

function initParams(){
	var params = getParams();
	params['start'] = start;
	params['limit'] = limit;
	return params;
}


function getParams(){
	return {
		orderNo:$('#orderNo').val(),
		username:$('#username').val(),
		contactWay:$('#contactWay').val(),
		contentType:$('#contentType').val(),
		dealPlanType:$('#dealPlanType').val(),
		status:$('#status').val(),
		complainType:$('#complainType').val(),
		dealResultType:$('#dealResultType').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

function doSearch(){
	var orderNo = $('#orderNo').val();
	var contactWay = $('#contactWay').val();
	if(contactWay != '' && contactWay.length< 11){
		messagesBox('手机号必须填写11位');
	}else if(orderNo != '' && orderNo.length< 3){
		messagesBox('订单编号最少填3位');
	}else{
		layer.load('数据加载中...', 1);
		grid.query(getParams());
	}
}

function messagesBox(msg){
	$.layer({
		title:'提示',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}
	});
}

/**
 * 查看
 */
function complainInfo(pkId,orderNo){
	$.layer({
		type : 2,
		title : '订单详情',
		iframe : {src : '/call/record/complaininfo?orderNo='+orderNo+'&pkId='+pkId},
		area : ['1100' , '700'],
		offset : ['50px',''],
		close : function(index){
			layer.close(index);
		}
	});
}

/**
 *  修改客诉
 */
function editComplain(pkId){
	$.layer({
		type : 2,
		title : '修改客诉',
		iframe : {src : '/call/record/editcomplain?pkId='+pkId},
		area : ['500' , '450'],
		offset : ['50px',''],
		close : function(index){
			layer.close(index);
		},
		end: function () {
			location.reload();
		}
	});
}

/**
 * 客诉导出
 */
function complainExport(){
	var params = {};
	params.startDate = $('#startDate').val();
	params.endDate = $('#endDate').val();
	params.orderNo = $('#orderNo').val();
	params.username = $('#username').val();
	params.contactWay = $('#contactWay').val();
	params.contentType = $('#contentType').val();
	params.dealPlanType = $('#dealPlanType').val();
	params.status = $('#status').val();
	params.complainType = $('#complainType').val();
	params.dealResultType = $('#dealResultType').val();

	$.ajax({
		type:'POST'//请求方式
		,url:"/call/record/countcomplain"  //请求路径
		,data:params  //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if (data.code == 1000){
				window.location.href='/call/record/complainexport?startDate='+params.startDate+'&endDate='+params.endDate+'&orderNo='+params.orderNo
					+'&username='+params.username+'&contactWay='+params.contactWay+'&contentType='+params.contentType+'&dealPlanType='+params.dealPlanType
					+'&complainType='+params.complainType+'&dealResultType='+params.dealResultType+'&status='+params.status;
				layer.msg('导出成功',2,9);
			}else{
				layer.msg(res.data);
			}
		}
	});

}