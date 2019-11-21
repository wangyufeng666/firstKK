var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:435
		,cm:[
			{checkbox:true}
			,{header:"NO.", dataIndex:'R', width:'40px',sortable:false}
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
			,{header:"合作商品名称", dataIndex:'P_MERNAME', width:'150px',sortable:false}
			,{header:"规则模板名称", dataIndex:'SUXINGNAME', width:'150px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var renderHtml = '';
					if(data['SUXINGNAME']){
						renderHtml ='<a class="a_link" title="'+value+'" href="javascript:showRuleInfo(\''+data['SUOSHULXID']+'\', \''+value+'\')">'+value+'</a>' ;
					}
					if(value != null && value != '' && value.indexOf('转转') >= 0){
						return renderHtml;
					}else{
						renderHtml = '<a class="a_link" href="javascript:initZZRule(\''+data['SPUID']+'\', \''+data['MERID']+'\')">初始化</a>'+' | ';
						renderHtml +='<a class="a_link" title="'+value+'" href="javascript:showRuleInfo(\''+data['SUOSHULXID']+'\', \''+value+'\')">'+value+'</a>';
						return renderHtml
					}
				}
			}
			,{header:"SPUID", dataIndex:'SPUID', width:'70px',sortable:false}
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
					var returnText = '<a class="a_link" href="javascript:merMatch(\''+data['PKID']+'\', \''+data['P_MERNAME']+'\')">关联</a>';
					returnText += ' | <a class="a_link" href="javascript:delSpuMount(\''+data['PKID']+'\')">删除</a>';
					
					if(data['MERSTATUS'] == '1'){//已删除可以重新挂载除
						returnText += ' | <a class="a_link" href="javascript:spuReset(\''+data['PKID']+'\')">重新启用</a>';
					}

					if(data['MOUNTFLAG'] == '1') {
						returnText += ' | <a class="a_link" href="javascript:updateMountFlag(\''+data['PKID']+'\',4)">挂载</a>';
					}

					if(data['MOUNTFLAG'] == '4') {
						returnText += ' | <a class="a_link" href="javascript:updateMountFlag(\''+data['PKID']+'\',1)">取消挂载</a>'
					}

					if(data['MOUNTFLAG'] == '4' && (data['MERSTATUS']=='0'||data['MERSTATUS']=='2')){
						returnText += ' | <a class="a_link" href="javascript:redisReset(\''+data['MODELID']+'\')">同步缓存</a>';
					}
					return returnText;
				}
			}
		]
		,pageSizeList:[15,30,50,100]
		,url:'/product/zhuanzhuan/pagelist'
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
    	partnerCode:'10000047',
    	category:$('#category').val(),
        merType:$('#merType').val(),
        merName:$('#merName').val(),
        brandCode:$('#brandCode').val()
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
function redisReset(ruleId){
	$.ajax({
		type:'POST'//请求方式
		,url:"/product/zhuanzhuan/zzredisreset"  //请求路径
		,data:{ruleId:ruleId} //发送到服务器的数据
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
 * SPU重置
 * @param pkId
 * @returns
 */
function spuReset(pkId){
	if(confirm('是否确认启用该商品？')){
		$.post('/product/zhuanzhuan/spureset', {pkId:pkId}, function(data){
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
		title:'商品设置 — '+partnerMerName,
		shadeClose:false,
		shade:0.8,
		content:'/product/zhuanzhuan/spumatch?pkId='+pkId,
		area:['600px', '380px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除SPU挂载
 * @returns
 */
function delSpuMount(pkId){
	if(confirm('是否确认删除该商品的挂载？')){
		$.post('/product/zhuanzhuan/delspumount', {pkId:pkId}, function(data){
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
 * 商品规则初始化
 * @param ruleId
 * @param merId
 * @returns
 */
function initZZRule(spuId){
	if(confirm('是否确认初始化转转规则？')){
		$.post('/recycle/merruletemplate/initzhuanzhuanmerrule', {spuId:spuId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert(data);
			}
		});
	}
}

/**
 * 转转商品规则批量初始化
 * @param ruleId
 * @param merId
 * @returns
 */
var initIndex = -1;
var timerId = null;
function batchInitRule(){
	if($('#btn_batchInit').attr('data-val') == 'Y'){//批量初始化中
		$('#btn_batchInit').attr('data-val', 'N');
		$('#btn_batchInit').html('批量初始化');
		clearTimeout(timerId);
		initIndex = -1;
		grid.reload();
	}else{
		$('#btn_batchInit').attr('data-val', 'Y');
		$('#btn_batchInit').html('批量初始化终止');
		initIndex = -1;
		timerId = setTimeout("timerInitRule()", 500);
	}
}

/**
 * 代扣定时器
 */
function timerInitRule(){
	var result = grid.getSelections();
	initIndex++;
	if(result.length > initIndex){
		var spuId = result[initIndex].SPUID;
		var ruleName = result[initIndex].SUXINGNAME;
		
		if(ruleName != null && ruleName != '' && ruleName.indexOf('转转') >= 0){
			console.log(initIndex+'：'+spuId+'  跳过规则：'+ruleName);
			timerId = setTimeout("timerInitRule()", 100);
		}else{
			console.log(initIndex+'：'+spuId+'__'+ruleName);
			$.post('/recycle/merruletemplate/initzhuanzhuanmerrule', {spuId:spuId}, function(data){
				if(data == 'Y'){
					console.log(spuId+'：初始化成功');
				}else{
					console.log(spuId+'：初始化失败。。');
				}
				timerId = setTimeout("timerInitRule()", 200);
			});
		}
	}else{
		clearTimeout(timerId);
		console.log('执行完成');
		grid.reload();
		batchInitRule();//初始化
		alert('执行完成');
	}
}

/**
 * 新增合作商商品
 * @return
 */
function doAdd(){
	layer.open({
		type:2,
		title:'新增合作商商品信息',
		shadeClose:false,
		shade:0.8,
		content:'/product/cooperate/addcooperate?partnerCode=10000047',
		area:['800px', '500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 挂载操作
 * @param id
 * @param flag
 */
function updateMountFlag(id,flag) {
	var msg = "";
	if(flag == 1) {
		msg = "是否确认清除挂载？";
	}else {
		msg = "是否挂载？";
	}
	layer.confirm(msg, {
		btn: ['确认','取消'] //按钮
	}, function(){
		var index = layer.load();
		$.ajax({
			url:'/product/zhuanzhuan/updatemountflag',
			data:{pkId:id,flag:flag},
			dataType:'json',
			type:'post',
			success:function(data) {
				layer.close(index);
				if(data.code == 200) {
					layer.msg('调整成功',{icon:6},function(){
						location.reload();
					});
				}else {
					layer.msg(data.msg,{icon:5});
				}
			}
		})
	}, function(){

	});
}


