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
			,{header:"合作商品名称", dataIndex:'P_MERNAME', width:'120px',sortable:false}
			,{header:"规则模板名称", dataIndex:'SUXINGNAME', width:'120px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var renderHtml = '';
					if(data['SUXINGNAME']){
						renderHtml = '<a class="a_link" title="'+value+'" href="javascript:showRuleInfo(\''+data['SUOSHULXID']+'\', \''+value+'\')">'+value+'</a>';
					}
					return renderHtml;
				}
			}
			,{header:"合作商品编号", dataIndex:'P_MERID', width:'150px',sortable:false}
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
			,{header:"操作状态", dataIndex:'', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['OPERFLAG'] == '2' ? '已操作' : '未操作';
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
						returnText += ' | <a class="a_link" href="javascript:delSpuMount(\''+data['PKID']+'\')">删除</a>';
					}else if(data['MERSTATUS'] == '1'){//已删除可以重新挂载除
						returnText += ' | <a class="a_link" href="javascript:spuReset(\''+data['PKID']+'\')">重新启用</a>';
					}

					if(data['MOUNTFLAG'] == '1') {
						returnText += ' | <a class="a_link" href="javascript:updateMountFlag(\''+data['PKID']+'\',4)">挂载</a>';
					}

					if(data['MOUNTFLAG'] == '4') {
						returnText += ' | <a class="a_link" href="javascript:updateMountFlag(\''+data['PKID']+'\',1)">取消挂载</a>';
					}


					if(data['MOUNTFLAG'] == '4' && (data['MERSTATUS']=='0'||data['MERSTATUS']=='2')){
						returnText += ' | <a class="a_link" href="javascript:redisReset(\''+data['SPUID']+'\', \''+data['MODELID']+'\', \''+data['SUOSHULXID']+'\')">同步缓存</a>';
					}
					return returnText;
				}
			}
		]
		,pageSizeList:[15,30,50,100]
		,url:'/product/vnofflinem/pagelist'
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
    	category:$('#category').val(),
        merType:$('#merType').val(),
        merName:$('#merName').val(),
        brandCode:$('#brandCode').val(),
        merStatus:$('#merStatus').val(),
        mountFlag:$('#mountFlag').val(),
        spuCode:$('#spuCode').val(),
        relevanceFlag:$('#relevanceFlag').val()
    };
}

/**
 * 删除SPU挂载
 * @returns
 */
function delSpuMount(pkId){
	if(confirm('是否确认删除该商品的挂载？')){
		$.post('/product/vnofflinem/delspumount', {pkId:pkId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert('删除失败：'+data);
			}
		});
	}
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
function redisReset(spuId,modelId,suoshulxId){
	$.ajax({
		type:'POST'//请求方式
		,url:"/redis/recycle/redisreset"  //请求路径
		,data:{spuId:spuId,modelId:modelId,suoshulxId:suoshulxId} //发送到服务器的数据
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
function spuTestMount(pkId, spuId){
	if(confirm('是否确认挂载该商品？')){
		var mountFlag = '2';
		$.post('/product/cooperate/xymount', {pkId:pkId, mountFlag:mountFlag}, function(data){
			if(data == 'Y'){
				grid.reload();
				showTestRQcode(spuId,merType);
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
		$.post('/product/vnofflinem/spureset', {pkId:pkId}, function(data){
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
 * added date 2019-01-21
 * added by qiujian
 * @param 
 * @return
 */
function merMatch(pkId, partnerMerName){
	layer.open({
		type:2,
		title:'商品关联 - '+partnerMerName,
		shadeClose:false,
		shade:0.8,
		content:'/product/vnofflinem/spumatch?pkId='+pkId,
		area:['640px', '400px'],
		close:function(index){
			layer.close(index);
		}
	});
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
		content:'/product/cooperate/addcooperate?partnerCode=10000060',
		area:['800px', '500px'],
		close:function(index){
			layer.close(index);
		}
	});
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
		content:'/recycle/merrule/ruledetail?ruleId='+ruleId+'&backUrl='+backUrl+'&source=2',
		area:['90%','90%'],
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