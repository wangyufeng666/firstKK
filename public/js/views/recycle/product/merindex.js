var grid, layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'100px',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'260px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var href = 'http://detail.zol.com.cn/index.php?c=SearchList&kword='+data['PNAME']+' '+value;
					return value+'&nbsp;<a class="a_link" target="_blank" href="'+href+'">搜</a>';
				}
			}
			,{header:"所用规则", dataIndex:'SUXINGNAME', width:'200px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var renderHtml = '';
					if(data['SUXINGNAME']){
						renderHtml = '<a class="a_link" href="javascript:showRuleInfo(\''+data['SSLXID']+'\')">'+data['SUXINGNAME']+'</a>';
					}
					return renderHtml;
				}
			}
			,{header:"热度", dataIndex:'REDU', width:'80px',sortable:false}
			,{header:"状态", dataIndex:'CHULIREN1',width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ENABLED'] == 'Y'){
						var returnText = '<span class="green">已启用</span>';
					}else if(data['ENABLED'] == 'N'){
						var returnText = '<span class="red">已停用</span>';
					}else if(data['ENABLED'] == 'C'){
						var returnText = '<span class="blue">新增未启用</span>';
					}else if(data['ENABLED'] == 'H'){
						var returnText = '<span class="red">已隐藏</span>';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'MERID', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var returnText ='<a class="a_link" href="javascript:recycleMerInfo(\''+value+'\',\''+pkid+'\')">详情</a>';
					if(data['ENABLED'] == 'Y'){
						returnText += ' | <a class="a_link" href="javascript:closeThis(\''+value+'\')">停用</a>';
					}
					if(data['ENABLED'] == 'C' || data['ENABLED'] == 'N'){
						returnText += ' | <a class="a_link" href="javascript:opensThis(\''+value+'\')">启用</a>';
					}
					returnText += ' | <a class="a_link" href="javascript:syncRedis(\''+value+'\')">同步</a>';
					if(data['ENABLED'] != 'Y'){
						returnText += ' | <a class="a_link" href="javascript:editThis(\''+value+'\')">修改</a>';
					}
					if(data['ENABLED'] == 'C'){
						returnText += ' | <a class="a_link" href="javascript:deleteThis(\''+value+'\')">删除</a>';
					}
					/*var
						MERNAME = data['MERNAME'],
						title = pkid == null ? '库' : '库';
					returnText += ' | <a class="a_link" href="javascript:hotstock(\''+MERNAME+'\',\''+value+'\',\''+pkid+'\')">'+title+'</a>';*/
					return returnText;
				}
		 	}
		]
		,url:'/recycle/product/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
});

/**
 * 跳转到新增补充图片界面
 */
function addWarehouseRecord(){
	layer.open({
		type:2,
		title:'补充图片信息',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/product/addpicture',
		area:['600px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}
/**
 * 商品详情
 * @param orderId
 * @return
 */
function recycleMerInfo(merId,pkid=''){
	layer.open({
		type:2,
		title:'商品详情',
		shadeClose:false,
		shade:0.8,
		content:"/recycle/product/merinfo?merId="+merId+"&pkid="+pkid+"&random="+(new Date()).valueOf(),
		area:['600px','600px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 新增回收商品
 * @return
 */
function addRecycleMer(){
	layer.open({
		type:2,
		title:'新增回收商品信息',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/product/addmer',
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function editThis(merId){
	layer.open({
		type:2,
		title:'修改回收商品信息',
		shadeClose:false,
		shade:0.8,
		content:"/recycle/product/editmer?merId="+merId,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除
 */
function deleteThis(merId){
	if(confirm('是否确认删除选中的商品？')){
		$.post('/recycle/product/deletemer', {merId:merId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
}

/**
 * top20
 */
function hotstock(productname,merId,pkid){
	var url = "/recycle/hotstock/hotstock?merId="+merId+"&pkid="+pkid+'&productname='+productname;
	if(pkid == 'null') {
		layer.open({
			type:2,
			title:'新增热门库存',
			shadeClose:false,
			shade:0.8,
			content:url,
			area:['25%','25%'],
			close:function(index){
				layer.close(index);
			},
			end:function(index){
				grid.reload();//刷新
			}
		});
	}else{
		var postdata = { "merId":merId, "viewseq":'' ,"pkid":pkid};
		if(layer.confirm('确认删除 '+productname+' 热门库存？',{btn:['确认','取消']},function(){
			$.post('/recycle/hotstock/hotstocksave', postdata, function (data) {
				if (data == 'Y') {
					layer.alert('删除成功', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
					setTimeout("doSearch()",1300);
				} else {
					alert('操作错误：' + data);
				}
			});
		}));
	}
}


/**
 * 启用
 */
function opensThis(merId){
	if(confirm("你确定要启用该商品吗？")){
		statusUpdate(merId, 'Y');
	}
}
/**
 * 停用
 */
function closeThis(merId){
	if(confirm("你确定要停用该商品吗？")){
		statusUpdate(merId, 'N');
	}
}

/**
 * 同步
 */
function syncRedis(merId){
	if(confirm("是否要更新缓存数据？")){
		$.post('/redis/recycle/removelike',{keyword:merId},function(data){
			if(data == 'Y'){
				alert('清空成功');
			}else{
				alert('清空失败');
		 	}
		});
	}
}

/**
 * 修改状态
 */
function statusUpdate(merId, status){
	$.post("/recycle/product/updatestatus",{merId:merId, status:status, submit:'1'},function(data){
		if(data == 'Y'){
			grid.reload();
		}else{
			alert('操作失败');
			grid.reload();
		}
	});
}

/**
 * 加入报表
 * create by zhuhaili
 * createdate 2017-6-16
 */
function addReport(merId){
	$.post("/report/merquote/savemer",{merId:merId, submit:'1'},function(data){
		alert(data);
	});
}

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#brandCode").html("<option value=''>全部</option>");
		for(i in data){
			$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function getParams(){
	return {
		category:$('#category').val(),
		merType:$('#merType').val(),
		merName:$('#merName').val(), 
		brandCode:$('#brandCode').val(),
		status:$('#status').val(),
		source:1
	};
}

function doSearch(){
	layerIndex = layer.msg('搜索中', {icon:16,shade:0.2});
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
 * 规则展示
 * @param ruleId
 * @returns
 */
function showRuleInfo(ruleId){
	layer.open({
		type:2,
		title:'商品规则展示',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/merrule/ruledetail?ruleId='+ruleId,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}
/**
 * 导出销售订单
 */
function pageExport(){
	var param = '';
	param += 'merName=' + $('#merName').val();
	param += '&merType=' + $('#merType').val();
	param += '&brandCode=' + $('#brandCode').val();
	param += '&ruleId=' + $('#ruleId').val();
	param += '&source=' + $('#source').val();
	param += '&status=' + $('#status').val();
	window.location.href = '/recycle/product/pageexport?'+param;
	return false; //截取返回false就不会保存网页了
}
