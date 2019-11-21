var grid;

$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'5%',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'8%',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'8%',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'8%',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'25%',sortable:false}
			,{header:"规则模板名称", dataIndex:'SUXINGNAME', width:'25%',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var renderHtml = '';
					if(data['SUXINGNAME']){
						renderHtml = '<a class="a_link" href="javascript:showRuleInfo(\''+data['SUOSHULXID']+'\')">'+data['SUXINGNAME']+'</a>';
					}
//						咸鱼商品规则初始化
//						if(data['MERTYPE'] == 'L'){
//							renderHtml += ' | '+'<a class="a_link" href="javascript:initIfishRule(\''+data['SPUID']+'\', \''+data['MERID']+'\')">初始化规则</a>';
//						}
						return renderHtml;
					}
			}
			,{header:"热度", dataIndex:'REDU', width:'8%',sortable:false}
			,{header:"状态", dataIndex:'CHULIREN1',width:'8%',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ENABLED'] == 'Y'){
						var returnText = '已启用';
					}else if(data['ENABLED'] == 'N'){
						var returnText = '已删除';
					}else if(data['ENABLED'] == 'C'){
						var returnText = '未启用';
					}else if(data['ENABLED'] == 'H'){
						var returnText = '已隐藏';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="recycleMerInfo(\''+data['MERID']+'\')">详情</a>';
				  	if(data['ENABLED']=='Y'){
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="closeThis(\''+data['MERID']+'\')">停用</a>';
				  	}
				  	if(data['ENABLED']=='C'){
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="opensThis(\''+data['MERID']+'\')">启用</a>';
				  	}
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="syncRedis(\''+data['MERID']+'\')">同步</a>';
				  	if(data['ENABLED']!='Y'){
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['MERID']+'\')">修改</a>';
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['MERID']+'\')">删除</a>';
				  	}
				  	return returnText;
				}
		   	}
		]
		,url:'/product/product/pagelist'
		,baseParams:{merType:$('#merType').val(), merName:$('#merName').val(),pinpai:$('#pinpai').val(),merSource:1}
	});
});

/**
 * 商品详情
 * @param orderId
 * @return
 */
function recycleMerInfo(merId){
	window.location.href = "/product/product/recyclemerinfo?merId="+merId;
}


/**
 * 新增回收商品
 * @return
 */
function addRecycleMer(){
	window.location.href = "/product/product/addrecyclemer";
}

/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function edit(merId){
	window.location.href = "/product/product/editrecyclemer?merId="+merId;
}

/**
 * 删除
 */
function deleteThis(merId){
	if(confirm('是否确认删除选中的商品？')){
		$.post('/product/product/deleterecyclemer', {merId:merId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
}
/**
 * 启用
 */
function opensThis(merId){
if(confirm("你确定要启用吗？？？")){
		statusUpdate(merId,'Y');
	}
}
/**
 * 停用
 */
function closeThis(merId){
	if(confirm("你确定要停用吗？？？")){
		statusUpdate(merId,'C');
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
function statusUpdate(merId,status){
	$.post("/product/product/updatestatus/",{merId:merId,status:status,submit:'1'},function(data){
		if(data == 'Y'){
			grid.reload();
		}else{
			grid.reload();
			alert('操作失败');
		}
	});
}

/**
 * 加入报表
 * create by zhuhaili
 * createdate 2017-6-16
 */
function addReport(merId){
	$.post("/report/merquote/savemer/",{merId:merId,submit:'1'},function(data){
		alert(data);
	});
}

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#pinpai").html("<option value=''>全部</option>");
		for(i in data){
			$("#pinpai").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function getParams(){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val(),
		pinpai:$('#pinpai').val(),
	};
}


function doSearch(){
	grid.query(getParams());
}

/**
 * 闲鱼商品规则初始化
 * @param ruleId
 * @param merId
 * @returns
 */
//function initIfishRule(spuId){
//	if(confirm('是否确认初始化该笔记本的闲鱼规则？')){
//		$.post('/recycle/merruletemplate/initifishmerrule', {spuId:spuId}, function(data){
//			if(data == 'Y'){
//				//grid.reload();
//			}else{
//				alert(data);
//			}
//		});
//	}
//}


function showRuleInfo(ruleId){
   layer.open({
        type:2,
        title:'商品规则分类',
        content:'/rule/rule/ruleinfo?ruleId='+ruleId,
        area:['90%','90%']
   });
}
