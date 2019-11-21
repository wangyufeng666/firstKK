$("#btnSave").bind("click", formSubmit);
$('#couponFrom').validate({
	rules:{
        categoryName:{required:true,maxlength:50}//请填写类型名称
		,categoryDesc:{maxlength:100}//类型描述
		,acquireType:{required:true}//
		,quota:{required:true}//
		,partnerCode:{required:true}//订单渠道商
	}
	,messages:{
        categoryName:{required:"请填写类型名称",maxlength:'最多50个字'}
		,categoryDesc:{maxlength:"最多100个字"}
		,acquireType:{required:"请选择获取方式"}
        ,quota:{required:"请选择配额"}
		,partnerCode:{required:"请选择订单渠道方"}
	}
});

function formSubmit(){
    $("#btnSave").unbind("click");
    if($("#couponFrom").valid()){
    	$.ajax({
    		type:'POST'//请求方式
			,url:"/caiwu/coupon/savecategory"  //请求路径
			,data:{
                categoryName:$("#categoryName").val(),
                categoryDesc:$("#categoryDesc").val(),
    			acquireType:$(".acquireType").val(),
                quota:$(".quota").val(),
    			partnerCode:$("#partnerCode").val(),
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

//市动态改变
$('#partnerCode').change(function(){
	$("#eventCode").html("<option value=''>请选择</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.get('/caiwu/coupon/orderevents', {partnerCode:thisVal},function(data){
			var optionHtml = '', id = '', name = '';
			for(i in data){
				id = data[i]['EVENTCODE'];
				name = data[i]['EVENTNAME'];
				optionHtml += "<option value='"+id+"' title='"+id+"'>"+name+"</option>";
			}
			$("#eventCode").append(optionHtml);
		});
	}
});