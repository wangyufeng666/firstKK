var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "投诉人", dataIndex: 'COMPLAINANT', width:'60px',sortable:false}
			,{header: "被投诉人", dataIndex: 'COMPLAINOBJECT', width:'60px',sortable:false}
			,{header: "投诉订单", dataIndex: 'ORDERNO', width:'100px',sortable:false}
			,{header: "投诉时间", dataIndex: 'CREATEDATE', width:'60px',sortable:false}
			,{header: "投诉部门", dataIndex: 'COMPLAINMENTNAME', width:'50px',sortable:false}
			,{header: "投诉事项", dataIndex: 'COMPLAINTYPENAME', width:'90px',sortable:false}
			,{header: "事项备注", dataIndex: 'COMPLAINREMARK', width:'90px',sortable:false}
			,{header: "调查结果", dataIndex: 'FINDINGSNAME', width:'60px',sortable:false}
			,{header: "处理方案", dataIndex: 'DEALPLAN', width:'80px',sortable:false}
			,{header: "处理结果", dataIndex: 'DEALRESULTNAME', width:'60px',sortable:false}
			,{header: "损失金额", dataIndex: 'LOSSMONEY', width:'60px',sortable:false}
			,{header: "处理进度", dataIndex: 'DEALSTATUSNAME', width:'60px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var pkId = data['PKID'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="orderInfo(\''+pkId+'\',\''+orderNo+'\')" class="a_link">查看</a>';
					if (data['DEALRESULT'] == 2) {
						 returnText +=  ' | 已结案';
					}else{
						 returnText += ' | <a href="javascript:editInComplain(\''+pkId+'\')" class="a_link">处理</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/order/incomplain/incomplainlist'
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
		complainObject:$('#complainObject').val(),
		complainMent:$('#complainMent').val(),
		findings:$('#findings').val(),
		dealStatus:$('#dealStatus').val(),
		complainType:$('#complainType').val(),
		dealResult:$('#dealResult').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val()
	};
}

function doSearch(){
	var orderNo = $('#orderNo').val();
	if(orderNo != '' && orderNo.length< 3){
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
function orderInfo(pkId,orderNo){
	$.layer({
		type : 2,
		title : '订单详情',
		iframe : {src : '/order/incomplain/orderinfo?orderNo='+orderNo+'&pkId='+pkId},
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
function editInComplain(pkId){
	$.layer({
		type : 2,
		title : '修改内部投诉',
		iframe : {src : '/order/incomplain/editincomplain?pkId='+pkId},
		area : ['500' , '550'],
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
 * 内部投诉导出
 */
function inComplainExport(){
	var params = {};
	params.startDate = $('#startDate').val();
	params.endDate = $('#endDate').val();
	params.orderNo = $('#orderNo').val();
	params.complainObject = $('#complainObject').val();
	params.complainMent = $('#complainMent').val();
	params.findings = $('#findings').val();
	params.dealStatus = $('#dealStatus').val();
	params.complainType = $('#complainType').val();
	params.dealResult = $('#dealResult').val();

	$.ajax({
		type:'POST'//请求方式
		,url:"/order/incomplain/incountcomplain"  //请求路径
		,data:params  //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if (data.code == 1000){
				window.location.href='/order/incomplain/incomplainexport?startDate='+params.startDate+'&endDate='+params.endDate+'&endDate='+params.endDate
					+'&orderNo='+params.orderNo+'&complainObject='+params.complainObject+'&complainMent='+params.complainMent+'&findings='+params.findings
					+'&dealStatus='+params.dealStatus+'&complainType='+params.complainType+'&dealResult='+params.dealResult;
				layer.msg('导出成功',2,9);
			}else{
				layer.msg(res.data);
			}
		}
	});

}