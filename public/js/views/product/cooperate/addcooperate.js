$().ready(function(){
	$('.saveMerBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{//类型
				required:true
			}
			,brandCode:{//品牌
				required:true
			}
			,partnerCode:{//合作商
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
			,partnerCode:{//请选择合作商
				required:"请选择合作商"
			}
		}
	});
	
	/**
	 * 商品类型改变
	 */
	$("#merType").change(function(e, p_brandCode='', p_ruleId=''){
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
				loadFlag1 = true;
				if(loadFlag1 && loadFlag2){
					layer.close(loadIndex);
				}
				if(p_brandCode != ''){
					$('#brandCode').val(p_brandCode);
				}
			}, 'json');
			
			//所属规则列表
			$.post('/recycle/product/getrulelist', {merType:merType, sysFlag:'1'}, function(data){
				$("#ruleId").html("<option value=''>全部</option>");
				for(i in data){
					$("#ruleId").append("<option value='"+data[i]['SUOSHULXID']+"'>"+data[i]['SUXINGNAME']+"</option>");
				}
				
				if(p_brandCode != ''){
					$('#ruleId').val(p_ruleId);
				}
				
				loadFlag2 = true;
				if(loadFlag1 && loadFlag2){
					layer.close(loadIndex);
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
	$('.saveMerBtn').unbind('click');
	if($("#addForm").valid()){

		var params = {
				merId:$('#merId').val(),
				ruleId:$('#ruleId').val(),
				merType:$('#merType').val(),
				brandCode:$('#brandCode').val(),
				partnerCode:$('#partnerCode').val(),
				partnerMerId:$('#partnerMerId').val(),
				partnerMerName:$('#partnerMerName').val(),
		};
		if(params.merId == ''){
			alert('请选择商品');
			$('.saveMerBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
			return;
		}
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/product/cooperate/savemer" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndNewBtn'){
						$('#partnerMerId').val('');
						$('#partnerMerName').val('');
						$('#merId').val('');
						$('#merName').val('');

						$('.saveMerBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}
			}
		});
	}else{
		$('.saveRecyBtn').bind('click', function(){saveMerInfo($(this).attr('id'));});
	}
}

/**
 * 选择商品
 * @returns
 */
function selectMer(){
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
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){

	var merName = '', merType = '', brandCode = '', ruleId = '';
	ruleId = p_merInfo['SSLXID'];
	merType = p_merInfo['MERTYPE'];
	merName = p_merInfo['PNAME']+' '+p_merInfo['MERNAME'];
	brandCode = p_merInfo['PCODE'];

	layer.closeAll('iframe');
	var thisMerType = $('merType').val();
	if(thisMerType != merType){
		$('#merType').val(merType).trigger('change', [brandCode, ruleId]);
		$('#brandCode').val(brandCode);
	}
	$('#merId').val(merId);
	$('#merName').html(merName);
}

function goBack(){
	parent.reload();
}