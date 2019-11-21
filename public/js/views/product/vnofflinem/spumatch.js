$().ready(function(){
	$('#saveButton').bind('click', function(){saveMerInfo();});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{//类型
				required:true
			}
        	,brandCode:{//品牌
        		required:true
        	}
        	,partnerMerId:{//合作商品ID
        		required:true
        		,maxlength:100
        	}
        	,partnerMerName:{//合作商品名称
        		required:true
        		,maxlength:100
        	}
		}
		,messages:{
			merType:{//类型
				required:"请选择类型"
			}
			,brandCode:{//品牌
				required:"请选择品牌"
			}
			,partnerMerId:{//商品名称
				required:"请输入合作商品ID",
				maxlength:"合作商品ID最多100字符"
			}
			,partnerMarName:{//商品名称
				required:"请输入合作商品名称",
				maxlength:"合作商品名称最多100字符"
			}
		}
	});
	
	/**
	 * 商品类型改变
	 */
	$("#merType").change(function(e, p_brandCode){
		var loadFlag1 = false, loadFlag2 = false;
		var merType = $(this).val();
		var loadIndex = layer.load(1);
		if(merType != ''){
			//品牌列表
			$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
				$("#brandCode").html("<option value=''>全部</option>");
				for(i in data){
					$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
				}
				layer.close(loadIndex);
				if(p_brandCode && p_brandCode != ''){
					$('#brandCode').val(p_brandCode);
				}
			}, 'json');
		}else{
			$("#brandCode").html("<option value=''>全部</option>");
			$("#ruleId").html("<option value=''>全部</option>");
		}
	});
});

/**
 * 保存商品信息
 * @param thisAttrId
 * @returns
 */
function saveMerInfo(thisAttrId){
	if(!$("#addForm").valid()){
		return;
	}
	var params = {
			pkId:$('#pkId').val(),
			merId:$('#merId').val(),
			ruleId:$('#ruleId').val(),
			partnerCode:$('#partnerCode').val(),
			partnerMerId:$('#partnerMerId').val(),
			partnerMerName:$('#partnerMerName').val(),
	};
	
	if(params.merId == ''){
		alert('请选择商品');
		return;
	}
	
	if(params.ruleId == ''){
		alert('请选择规则');
		return;
	}

	$('#saveButton').unbind('click');
	$.ajax({
		type:'POST'//请求方式
		,url:"/product/vnofflinem/updatemer" //请求路径
		,data:params //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
			if(data == "Y"){
				parent.reload();
			}
		},
		error:function(){
			alert('修改保存失败，请重新修改');
			$('#saveButton').bind('click', function(){saveMerInfo();});
		}
	});
//	}else{
//		$('#saveButton').bind('click', function(){saveMerInfo();});
//	}
}

/**
 * 选择商品
 * @returns
 */
function selectMerInfo(){
	var merType = $('#merType').val();
	var brandCode = $('#brandCode').val();
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/product/cooperate/merlist?merType='+merType+'&brandCode='+brandCode,
		area:['99%','99%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 选择商品
 * @returns
 */
function selectMerRule(){
	var merType = $('#merType').val();
	var merType = $('#merType').val();
 	var merTypeName = $("#merType").find("option:selected").text();
	layer.open({
		type:2,
		title:'商品规则选择',
		shadeClose:true,
		content:'/product/cooperate/rulelist?merType='+merType+'&merTypeName='+merTypeName,
		area:['99%','99%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){
	
	var merName = '', merType = '', brandCode = '', ruleId = '', ruleName='';
	ruleId = p_merInfo['SSLXID'];
	ruleName = p_merInfo['SUXINGNAME'];
	
	merType = p_merInfo['MERTYPE'];
	merName = p_merInfo['PNAME']+' '+p_merInfo['MERNAME'];
	brandCode = p_merInfo['PCODE'];
	
	layer.closeAll('iframe');
	var thisMerType = $('#merType').val();
	if(thisMerType != merType){
		$('#brandCode').val(brandCode);
		$('#merType').val(merType).trigger('change', [brandCode]);
	}
	$('#merId').val(merId);
	$('#merName').html(merName);
	
	$('#ruleId').val(ruleId);
	$('#ruleName').html(ruleName);
}

/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectRule(ruleId, p_ruleInfo){
	var ruleName = '', ruleId = '';
	ruleId = p_ruleInfo['RULEID'];
	ruleName = p_ruleInfo['RULENAME'];
	
	layer.closeAll('iframe');
	
	$('#ruleId').val(ruleId);
	$('#ruleName').html(ruleName);
}

function goBack(){
	parent.reload();
}