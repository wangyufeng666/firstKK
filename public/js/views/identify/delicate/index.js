var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'40PX',sortable:false}
			,{header:"商品编码", dataIndex:'CATENAME', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'TYPENAME', width:'100px',sortable:false}
			,{header:"规则类型", dataIndex:'RULETYPENAME', width:'70px',sortable:false}
			,{header:"品牌", dataIndex:'pinpailistName', width:'80px',sortable:false}
			,{header:"包含类型", dataIndex:'productlistName', width:'80px',sortable:false}
			,{header:"检测阈值", dataIndex:'LIMIT_AMOUNT', width:'70px',sortable:false}
			,{header: "操作", dataIndex: 'DELICATE_ID',width:'160px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:detail(\''+value+'\')">查看</a>';
					returnText +=' | <a class="a_link" href="javascript:updatesingle(\''+value+'\')">修改</a>';
					returnText +=' | <a class="a_link" href="javascript:deleteAll(\''+value+'\')">删除</a>';
					return returnText;
				}
			}
		]
		,url : '/identify/delicate/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
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

/**
 * 搜索品牌数据获取
 */
$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#brandCode").html("<option value=''>全部</option>");
		for(i in data){
			$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});


/**
 * 新增精细化规则
 * @return
 */
function add(){
	layer.open({
		type:2,
		title:'新增精细化检测检测规则',
		shadeClose:false,
		shade:0.8,
		content:'/identify/delicate/add',
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		},end:function () {
			//doSearch();
		}
	});
}

/**
 * 更新精细化规则
 * @return
 */
function updatesingle(delicate_id){
	layer.open({
		type:2,
		title:'更新精细化检测检测规则',
		shadeClose:false,
		shade:0.8,
		content:'/identify/delicate/add?delicate_id='+delicate_id,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		},
		end:function () {
			doSearch();
		}
	});
}

/**
 * 删除精细化规则
 * @param delicate_id
 */
function deleteAll(delicate_id) {
	layer.confirm('确认删除吗？？？', {
		btn: ['确定','取消'] //按钮
	}, function(){
		$.post('/identify/delicate/delete',{delicate_id:delicate_id},function(data){
			var msg = '';
			if(data == 'Y'){
				msg = '操作成功';
			}else{
				msg = '操作失败';
			}
			layer.alert(msg, {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
			setTimeout("location.reload()", 3000);
		})
	}, function(){

	});
}

/**
 * 查看精细化规则页面
 */
function detail(delicate_id){
	layer.open({
		type:2,
		title:'精细规则详情',
		shadeClose:false,
		shade:0.8,
		content:'/identify/delicate/detail?delicate_id='+delicate_id,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		},
		end:function () {
			doSearch();
		}
	});
}

function goBack(){
	window.history.go(-1);
}

function closeLayer(){
	layer.closeAll('iframe');
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function getParams(){
    return {
    	orderNo:$('#orderNo').val(), 
    	merName:$('#merName').val(),
    	limit_amount:$('#limit_amount').val(),
    	orderStatus:$('#orderStatus').val(),
		brandCode:$('#brandCode').val(),
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
    	merType:$('#merType').val(),
		address:$('#address').val(),
    	category:$('#category').val(),
    	ruletype:$('#ruletype').val()
    };
}
function doSearch(){
    grid.query(getParams());
}



