var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"批次编号", dataIndex:'BATCHCODE', width:'100px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"数量", dataIndex:'COUNTS', width:'50px',sortable:false}
			,{header:"开始时间", dataIndex:'STARTDATE', width:'120px',sortable:false}
			,{header:"结束时间", dataIndex:'ENDDATE', width:'120px',sortable:false}
			,{header:"类型", dataIndex:'TYPENAME', sortable:false}
			,{header:"合作方批次编号", dataIndex:'PARTNERBATCHCODE', width:'100px',sortable:false}
			,{header:"是否有效", dataIndex:'', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['ISVALID']=='1'?'<font color="green">有效</font>':'<font color="red">作废</font>';
				}
			}
			,{header:"操作", dataIndex:'', width:'160px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="delBatch(\''+data['BATCHCODE']+'\')">删除</a>';
					if(data['ISVALID'] == '1')
						returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="destroy(\''+data['BATCHCODE']+'\')">作废</a>';
					else if(data['ISVALID'] == '0')
						returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="recover(\''+data['BATCHCODE']+'\')">恢复</a>';
					return returnText;
				}
			}
		]
		,url:'/caiwu/coupon/batchlist'
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
		start:(grid.getPageNumber()-1)*10
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
	});;
}

function destroy(batchCode){
	var load1 = layer.load('请稍候...');
	$.ajax({
		type:'POST'//请求方式
		,url:"/caiwu/coupon/destroybatch"  //请求路径
		,data:{batchCode:batchCode}  //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			layer.close(load1);
			if(data == 'Y')
				alert("作废成功");
			else
				alert("作废失败");
			doSearchAsThisPsge();
		}
		,error:function(){
			layer.close(load1);
			alert("作废失败");
			doSearchAsThisPsge();
		}
	});;
}

function recover(batchCode){
	var load1 = layer.load('请稍候...');
	$.ajax({
		type:'POST'//请求方式
		,url:"/caiwu/coupon/recoverbatch"  //请求路径
		,data:{batchCode:batchCode}  //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			layer.close(load1);
			if(data == 'Y')
				alert("恢复成功");
			else
				alert("恢复失败");
			doSearchAsThisPsge();
		}
		,error:function(){
			layer.close(load1);
			alert("恢复失败");
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

function createBatch(){
    $.layer({
        type:2,
        title:'创建优惠券批次',
        iframe:{src:'/caiwu/coupon/createbatch'},
        area:['500','400'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}