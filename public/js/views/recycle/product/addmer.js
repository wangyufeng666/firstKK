$().ready(function(){
	$('.saveRecyBtn').bind('click', function(){saveRecyMer($(this).attr('id'));});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{//类型
				required:true
			}
			,brandCode:{//品牌
				required:true
			}
			,sslxId:{//计算类型
				required:true
			}
			,merName:{//商品名称
				required:true
				,maxlength:100
			}
			,nickName:{//商品别名
				required:true
				,maxlength:100
			}
			,keywords:{//关键词
				maxlength:100
			}
			,imgPath:{//小图路径
				maxlength:100
			}
			,redu:{number:true}
			,sysFlag:{//规则类型
				required:true
			}
		}
		,messages:{
			merType:{//类型
				required:"请选择类型"
			}
			,brandCode:{//品牌
				required:"请选择品牌"
			}
			,sysFlag:{//规则类型
				required:"请选择规则类型"
			}
			,sslxId:{//计算类型
				required:"请选择计算类型"
			}
			,merName:{//商品名称
				required:"请输入商品名称",
				maxlength:"商品名称最多100字符"
			}
			,nickName:{//商品别名
				required:"请输入商品别名",
				maxlength:"商品别名最多100字符"
			}
			,keywords:{//关键词
				maxlength:"关键词不能超过100字符"
			}
			,imgPath:{//小图路径
				maxlength:"小图路径不能超过100字符"
			}
		}
	});
	
	$("#merType").change(function(){
		var merType = $(this).val();
		var sysFlag = $('#sysFlag').val();
		$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
			$("#brandCode").html("<option value=''>全部</option>");
			for(i in data){
				$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
			}
		}, 'json');
		
		if(merType != ''){
			$("#ruleId").val('');
			$('#ruleName').html('');
		}
	});
});

function saveRecyMer(thisAttrId){
	
	$('.saveRecyBtn').unbind('click');
	
	if($("#addForm").valid()){
		
		var params = {
				merType:$('#merType').val(),
				brandCode:$('#brandCode').val(),
				ruleId:$('#ruleId').val(),
				merName:$('#merName').val(),
				nickName:$('#nickName').val(),
				publishDate:$('#publishDate').val(),
				redu:$('#redu').val(),
				keywords:$('#keywords').val(),
				imgPath:$('#imgPath').val()
		};
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/product/savemer" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					if(thisAttrId == 'saveAndNewBtn'){
						$('#merName').val('');
						$('#nickName').val('');
						$('#publishDate').val('');
						$('#redu').val('');
						$('#keywords').val('');
						$('#imgPath').val('');
						$('.saveRecyBtn').bind('click', function(){saveRecyMer($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}
			}
		});
	}else{
		$('.saveRecyBtn').bind('click', function(){saveRecyMer($(this).attr('id'));});
	}
}

/**
 * 选择商品
 * @returns
 */
function selectMerRule(){
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
function getSelectRule(ruleId, p_ruleInfo){
	console.log(p_ruleInfo);
	var ruleName = '', ruleId = '';
	ruleId = p_ruleInfo['RULEID'];
	ruleName = p_ruleInfo['RULENAME'];
	
	layer.closeAll('iframe');
	
	$('#ruleId').val(ruleId);
	$('#ruleName').html(ruleName);
}

function goBack(){
	parent.closeLayer();
}

function addMerRule(){
	var backUrl = encodeURIComponent(window.location.href);
	window.location.href = '/recycle/merrule/addrule?backUrl='+backUrl;
}