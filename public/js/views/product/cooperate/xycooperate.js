var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'70px',sortable:false}
			,{header:"商品编码", dataIndex:'MERCODE', width:'70px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'150px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+'-'+data['MERNAME'];
				}
			}
			,{header:"商品状态", dataIndex:'ENABLED', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['DELFLAG'] == 'Y'){
						return '<del>已删除</del>';
					}else{
						if(value == 'Y'){
							return '<span class="green">已启用</span>';
						}else if(value == 'N'){
							return '<span class="red">已停用</span>';
						}else if(value == 'C'){
							return '<span class="blue">新增未启用</span>';
						}else if(value == 'H'){
							return '<span class="red">已隐藏</span>';
						}
					}
				}
			}
			,{header:"合作商品名称", dataIndex:'P_MERNAME', width:'140px',sortable:false}
			,{header:"规则模板名称", dataIndex:'SUXINGNAME', width:'150px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var renderHtml = '';
					if(data['SUXINGNAME']){
						renderHtml = '<a class="a_link" title="'+value+'" href="javascript:showRuleInfo(\''+data['SUOSHULXID']+'\', \''+value+'\')">'+value+'</a>';
					}
					if(data['MERTYPE'] == 'L'){
						if(value != null && value != '' && value.indexOf('闲鱼') >= 0){
							
						}else{
							renderHtml += ' | '+'<a class="a_link" href="javascript:initIfishRule(\''+data['SPUID']+'\', \''+data['MERID']+'\')">初始化</a>';
						}
					}
					return renderHtml;
				}
			}
			,{header:"场景", dataIndex:'', width:'45px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['SCENETYPE'] == '3C' ? '二期' : '三期';
				}
			}
			,{header:"SPUID", dataIndex:'SPUID', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a class="a_link" href="javascript:showTestRQcode(\''+data['SPUID']+'\', \''+data['MERTYPE']+'\', \''+data['SCENETYPE']+'\')">'+data['SPUID']+'</a>';
				}
			}
			,{header:"合作商品状态", dataIndex:'MERSTATUS', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '0'){
						return '<span class="green">新增</span>';
					}else if(value == '1'){
						return '<del class="red">删除</del>';
					}else if(value == '2'){
						return '修改';
					}
				}
			}
			,{header:"关联状态", dataIndex:'', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['RELEVANCEFLAG'] == 'Y' ? '已关联' : '未关联';
				}
			}
			,{header:"操作状态", dataIndex:'', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['OPERFLAG'] == '2' ? '已操作' : '未操作';
				}
			}
			,{header:"挂载状态", dataIndex:'MOUNTFLAG', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(value == '1'){
						return '待测试挂载';
					}else if(value == '2'){
						return '已测试挂载';
					}else if(value == '3'){
						return '待正式挂载';
					}else if(value == '4'){
						return '已正式挂载';
					}
				}
			}
			,{header:"操作", dataIndex:'', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					if(data['RELEVANCEFLAG'] ==  'N'){
						returnText += '<a class="a_link" href="javascript:merMatch(\''+data['PKID']+'\', \''+data['P_MERNAME']+'\')">关联</a>';
					}else{
						returnText += '<a class="a_link" href="javascript:merMatch(\''+data['PKID']+'\', \''+data['P_MERNAME']+'\')">重新关联</a>';
					}
					
					if(data['MERSTATUS'] == '0' && data['RELEVANCEFLAG'] ==  'Y'){//新增商品
						if(data['MOUNTFLAG'] == '1'){//待测试挂载
							returnText += ' | <a class="a_link" href="javascript:spuTestMount(\''+data['PKID']+'\', \''+data['SPUID']+'\', \''+data['MERTYPE']+'\', \''+data['SCENETYPE']+'\')">测试挂载</a>';
						}else if(data['MOUNTFLAG'] == '3'){//待正式挂载
							returnText += ' | <a class="a_link" href="javascript:spuProdMount(\''+data['PKID']+'\')">正式挂载</a>';
						}else if(data['MOUNTFLAG'] == '4'){//待正式挂载
							returnText += ' | <a class="a_link" href="javascript:delSpuMount(\''+data['PKID']+'\', \''+data['SCENETYPE']+'\')">删除</a>';
						}
					}else if(data['MERSTATUS'] == '1'){//已删除可以重新挂载除
						returnText += ' | <a class="a_link" href="javascript:spuReset(\''+data['PKID']+'\')">重新启用</a>';
					}
					if(data['MOUNTFLAG'] == '4' && (data['MERSTATUS']=='0'||data['MERSTATUS']=='2')){
						returnText += ' | <a class="a_link" href="javascript:redisReset(\''+data['SPUID']+'\', \''+data['MODELID']+'\', \''+data['SUOSHULXID']+'\', \''+data['SCENETYPE']+'\')">同步缓存</a>';
					}
					return returnText;
				}
			}
		]
		,pageSizeList:[15,30,50,100]
		,url:'/product/cooperate/pagelist'
		,baseParams:getParams()
	});
	
	/**
	 * 获取分类下的品牌
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
});

function getParams(){
    return {
    	partnerCode:'10000070',
        merName:$('#merName').val(),
        merType:$('#merType').val(),
        brandCode:$('#brandCode').val(),
        mountFlag:$('#mountFlag').val(),
        sceneType:$('#sceneType').val(),
        relevanceFlag:$('#relevanceFlag').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

/**
 * 同步规则到redis
 * @param ruleId
 * @return
 */
function redisReset(spuId,modelId,suoshulxId,sceneType){
	$.ajax({
		type:'POST'//请求方式
		,url:"/redis/recycle/redisreset"  //请求路径
		,data:{spuId:spuId,modelId:modelId,suoshulxId:suoshulxId,sceneType:sceneType} //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if(data == "Y"){
				layer.msg('同步成功', {icon:6}, function(){});
			}else{
				alert("同步失败");
			}
		}
	});
}

/**
 * SPU挂载
 * @param spuId
 */
function spuTestMount(pkId, spuId,merType,scenetype){
	if(confirm('是否确认挂载该商品？')){
		var mountFlag = '2';
		$.post('/product/cooperate/xymount', {pkId:pkId, mountFlag:mountFlag}, function(data){
			if(data == 'Y'){
				grid.reload();
				showTestRQcode(spuId,merType,scenetype);
			}else{
				alert('测试挂载失败：'+data);
			}
		});
	}
}

/**
 * 正式挂载
 * @param spuId
 * @returns
 */
function spuProdMount(pkId){
	if(confirm('是否确认挂载该商品？')){
		var mountFlag = '4';
		$.post('/product/cooperate/xymount', {pkId:pkId, mountFlag:mountFlag}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('测试挂载失败：'+data);
			}
		});
	}
}

/**
 * SPU重置
 * @param pkId
 * @returns
 */
function spuReset(pkId){
	if(confirm('是否确认启用该商品？')){
		$.post('/product/cooperate/ifishspureset', {pkId:pkId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('启用失败：'+data);
			}
		});
	}
}

/**
 * 合作商品匹配
 * @param 
 * @return
 */
function merMatch(pkId, partnerMerName){
	layer.open({
		type:2,
		title:'闲鱼商品关联|'+partnerMerName,
		shadeClose:false,
		shade:0.8,
		content:'/product/cooperate/ifishspumatch?pkId='+pkId,
		area:['800px', '500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除SPU挂载
 * @returns
 */
function delSpuMount(pkId, scenetype){
	if(confirm('是否确认删除该商品的挂载？')){
		$.post('/product/cooperate/delifshspumount', {pkId:pkId,sceneType:scenetype}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('删除失败：'+data);
			}
		});
	}
}

/**
 * 展示关联规则
 * @param ruleId
 * @returns
 */
function showRuleInfo(ruleId, ruleName){
	var backUrl = encodeURIComponent(window.location.href);
	layer.open({
		type:2,
		title:ruleName,
		shadeClose:false,
		shade:0.8,
		content:'/recycle/merrule/ruledetail?ruleId='+ruleId+'&backUrl='+backUrl,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 闲鱼商品规则初始化
 * @param ruleId
 * @param merId
 * @returns
 */
function initIfishRule(spuId){
	if(confirm('是否确认初始化该笔记本的闲鱼规则？')){
		$.post('/recycle/merruletemplate/initifishmerrule', {spuId:spuId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 显示测试二维码
 * @param spuId
 * @returns
 */
function showTestRQcode(spuId,merType,scenetype){
	layer.open({
		type:2,
		title:'测试挂载',
		shadeClose:false,
		shade:0.8,
		content:'/product/cooperate/ifishv2qrcode?spuId='+spuId+'&merType='+merType+'&sceneType='+scenetype,
		area:['300px','380px'],
		close:function(index){
			layer.close(index);
		}
	});
}
