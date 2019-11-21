var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"序号", dataIndex:'R', width:'40px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"开始时间", dataIndex:'STARTDATE', width:'120px',sortable:false}
			,{header:"结束时间", dataIndex:'ENDDATE', width:'120px',sortable:false}
			,{header:"状态", dataIndex:'', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var status = '';
					switch(data['USESTATUS']){
						case '1':
							status='未使用';
							break;
						case '2':
							status='已锁定';
							break;
						case '3':
							status='已发放';
							break;
						case '4':
							status='<del>已作废</del>';
							break;
						default:
							status=data['USESTATUS'];
					}
					return status;
				}
			}
			,{header:"所属批次号", dataIndex:'BATCHCODE', width:'100px',sortable:false}
			,{header:"抵用券类型", dataIndex:'TYPENAME', width:'200px',sortable:false}
			,{header:"是否有效", dataIndex:'', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['ISVALID']=='1'?'<font color="green">有效</font>':'<font color="red"><del>作废</del></font>';
				}
			}
		]
		,url:'/caiwu/coupon/detailist'
		,baseParams:{isAll:'all'}
	});
});

function alterBatch(typeCode){
	window.location.href = "/caiwu/coupon/altertype?typeCode="+typeCode;
}

function getParams(){
	return {
		typeCode:$("#typeCode").val(),
		typeName:$("#typeName").val(),
		batchCode:$("#batchCode").val(),
		startCreateDate:$("#startCreateDate").val(),
		endCreateDate:$("#endCreateDate").val(),
		startDate:$("#startDate").val(),
		endDate:$("#endDate").val()
	};
}

function getParamsAsThisPage(){
	return {
		typeCode:$("#typeCode").val(),
		typeName:$("#typeName").val(),
		batchCode:$("#batchCode").val(),
		startCreateDate:$("#startCreateDate").val(),
		endCreateDate:$("#endCreateDate").val(),
		startDate:$("#startDate").val(),
		endDate:$("#endDate").val(),
		start:(grid.getPageNumber()-1)*20
	};
}

function delBatch(batchCode){
	var load1 = layer.load('请稍候...');
	$.ajax({
		type:'POST'//请求方式
		,url:"/caiwu/coupon/delbatch"  //请求路径
		,data:{batchCode:batchCode}  //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			layer.close(load1);
			if(data == 'Y')
				alert("删除成功");
			else
				alert("删除失败");
			doSearchAsThisPsge();
		}
	});
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function doSearchAsThisPsge(){
	layer.load('数据加载中...', 1);
	grid.query(getParamsAsThisPage());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}	
	});
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function importCoupon(){
	$.layer({
		type:2,
		title:'导入',
		iframe:{src:'/caiwu/coupon/importcoupon'},
		area:['600' , '350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}