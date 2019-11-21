$().ready(function(){
	$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
	$("#addForm").validate({
		rules:{
			categoryCode:{required:true},
			typeName:{required:true, maxlength:30},
			typeCode:{required:true, maxlength:5},
			viewSeq:{digits:true, min:1, max:9999}
		},
		messages:{
			categoryCode:{
				required:"请选择品类",
			},
			typeName:{
				required:"请输入商品类型名称",
				maxlength:"最多输入30个字符"
			},
			typeCode:{
				required:"请输入类型编码",
				maxlength:"最多输入5个字符"
			},
			viewSeq:{
				digits:'必须为整数',
				min:'最小值为1',
				max:'最大值为9999'
			}
		}
	});
});

function checkTypeCode(thisAttrId){
	$('.saveBtn').unbind('click');
	var typeCode = $.trim($("#typeCode").val());
	var businessType = $("#businessType").val();
	params = {typeCode:typeCode, businessType:businessType};
	var text = '';
	
	if(typeCode == ''){
		alert('请输入类型编码');
		$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
	}else{
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/mertypes/reviewtypecode"//请求路径
			,data:params//发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == 'Y'){
					alert("类型编码或名称已使用，请更换");
					$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
				}else{
					saveMerTypeInfo(thisAttrId);
				}
			}
			,error:function(){
				alert('网络错误');
				$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
			}
		});
	}
}

function saveMerTypeInfo(thisAttrId){
	if($('#addForm').valid()){
		var viewSeq = $("#viewSeq").val();
		params = {
				typeName:$("#typeName").val(),
				typeCode:$("#typeCode").val(),
				categoryCode:$("#categoryCode").val(),
				businessType:$("#businessType").val(),
				viewSeq:viewSeq
		};
		
		$.ajax({
			type:"POST",
			url:"/recycle/mertypes/savemertype",
			data:params,
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					if(thisAttrId == 'saveAndNewBtn'){
						$('#typeName').val('');
						$('#typeCode').val('');
						$('#viewSeq').val(parseInt(viewSeq)+10);
						$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
					}else{
						parent.reload();
					}
				}else{
					alert('保存失败：'+data);
					$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
				}
			},
			error:function(){
				alert('网络错误');
				$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
			}
		});
	}else{
		$(".saveBtn").bind("click", function(){checkTypeCode($(this).attr('id'));});
	}
}

/**
 * 添加品类
 * @returns
 */
function addCategory(){
	layer.open({
		type:2,
		title:'新增大品类',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/category/addcategory',
		area:['450px', '300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function reload(){
	window.location.href = window.location.href;
}