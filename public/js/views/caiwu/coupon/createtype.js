$("#btnSave").bind("click", formSubmit);
$('#couponFrom').validate({
	rules:{
		typeName:{required:true,maxlength:50}//请填写类型名称
		,typePrice:{required:true,number:true}
		,typeDesc:{maxlength:100}//类型描述
		,acquireType:{required:true}//
		,partnerCode:{required:true}//订单渠道商
		,eventCode:{required:true}
	}
	,messages:{
		typeName:{required:"请填写类型名称",maxlength:'最多50个字'}
		,typePrice:{required:"请填写券面额",number:'请输入正确金额'}
		,typeDesc:{maxlength:"最多100个字"}
		,acquireType:{required:"请选择获取方式"}
		,partnerCode:{required:"请选择订单渠道方"}
		,eventCode:{required:"请选择活动"}
	}
});

function formSubmit(){
    $("#btnSave").unbind("click");
    if($("#couponFrom").valid()){
    	$.ajax({
    		type:'POST'//请求方式
			,url:"/caiwu/coupon/savetype"  //请求路径
			,data:{
    			typeName:$("#typeName").val(), 
    			typePrice:$("#typePrice").val(), 
    			typeDesc:$("#typeDesc").val(),
    			acquireType:$("#acquireType").val(),
    			partnerCode:$("#partnerCode").val(),
    			eventCode:$("#eventCode").val(),
    			classIfyCode:$("#classIfyCode").val()
    		}
    		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
    		,async:false //同步请求
    		,timeout:60000//默认超时60秒
    		,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
    			if(data == 'Y'){
    				alert("创建成功");
    				var index = parent.layer.getFrameIndex(window.name);
    				parent.doSearch();
    				parent.layer.close(index);
    			}else{
    				alert("创建失败");
    			}
			}
		});
	}else{
		$('#btnSave').bind('click', formSubmit);
	}
}

//
$('#partnerCode').change(function(){
	$("#eventCode").html("<option value='' data-code=''>请选择</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.get('/caiwu/coupon/orderevents', {partnerCode:thisVal},function(data){
			var optionHtml = '', id = '', name = '', classIfyCode = '';
			for(i in data){
				id = data[i]['EVENTCODE'];
				name = data[i]['EVENTNAME'];
                classIfyCode = data[i]['CLASSIFYCODE'];
				optionHtml += "<option value='"+id+"' title='"+id+"' data-code='"+classIfyCode+"'>"+name+"</option>";
			}
			$("#eventCode").append(optionHtml);
		});
	}
});

$('#eventCode').change(function(){
    var classIfyCode = $('#eventCode option:selected').attr('data-code');
	$("#classIfyCode").val(classIfyCode);
});
