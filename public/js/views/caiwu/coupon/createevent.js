$("#btnSave").bind("click", formSubmit);
$('#couponFrom').validate({
	rules:{
        eventName:{required:true,maxlength:50}//请填写类型名称
		,eventType:{required:true,number:true}
		,reateRate:{required:true}//类型描述
		,reateValue:{required:true}//类型描述
		,rodePoint:{required:true}//类型描述
		,startCreateDate:{required:true}//类型描述
		,stopCreateDate:{required:true}//类型描述
		,ticketType:{required:true}//类型描述
		,payType:{required:true}//类型描述
		,creditPay:{required:true}//类型描述
		,creditCode:{required:true}//类型描述
		,partnerCode:{required:true}//订单渠道商
		,classIfyCode:{required:true}
	}
	,messages:{
        eventName:{required:"请填写活动名称",maxlength:'最多50个字'}
		,eventType:{required:"请选择活动类型"}
		,reateRate:{required:"请填写返利百分比"}
		,reateValue:{required:"请填写返利绝对值"}
		,rodePoint:{required:"请填写活动基准率"}
		,startCreateDate:{required:"请选择活动开始时间"}
		,stopCreateDate:{required:"请选择活动结束时间"}
		,ticketType:{required:"请选择抵用类型"}
		,payType:{required:"请选支付类型"}
		,creditPay:{required:"请选择信用支付方式"}
		,creditCode:{required:"请选择信用规则"}
		,partnerCode:{required:"请选择订单渠道方"}
		,classIfyCode:{required:"请选择优惠券分类"}
	}
});

function formSubmit(){
    $("#btnSave").unbind("click");
    if($("#couponFrom").valid()){
    	$.ajax({
    		type:'POST'//请求方式
			,url:"/caiwu/coupon/saveevent"  //请求路径
			,data:{
                eventName:$("#eventName").val(),//活动名称
                eventType:$("#eventType").val(),//活动类型
                reateRate:$("#reateRate").val(),//返利百分比
                reateValue:$("#reateValue").val(),//返利绝对值
                rodePoint:$("#rodePoint").val(),//活动基准率
                startCreateDate:$("#startCreateDate").val(),//活动开始时间
                stopCreateDate:$("#stopCreateDate").val(),//活动结束时间
                ticketType:$("#ticketType").val(),//抵用类型
                payType:$("#payType").val(),//支付类型
                partnerCode:$("#partnerCode").val(),//订单渠道方
                creditPay:$("#creditPay").val(),//信用支付方式
                creditCode:$("#creditCode").val(),//信用规则
    			classIfyCode:$("#classIfyCode").val(),//优惠券分类
                eventDesc:$("#eventDesc").val(),//优惠券分类
                eventMark:$("#eventMark").val()//优惠券分类
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
	$("#classIfyCode").html("<option value=''>请选择</option>");
	$("#creditCode").html("<option value=''>请选择</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.get('/caiwu/coupon/ordercategory', {partnerCode:thisVal},function(data){
			var optionHtml = '', id = '', name = '';
			for(i in data.category){
				id = data.category[i]['CLASSIFYCODE'];
				name = data.category[i]['CLASSIFYNAME'];
				optionHtml += "<option value='"+id+"' title='"+id+"'>"+name+"</option>";
			}
			$("#classIfyCode").append(optionHtml);
            optionHtml = ''
            for(j in data.creditRule){
                id = data.creditRule[j]['CREDITRULE_CODE'];
                name = data.creditRule[j]['CREDITRULE_NAME'];
                optionHtml += "<option value='"+id+"' title='"+id+"'>"+name+"</option>";
            }
            $("#creditCode").append(optionHtml);
		});
	}
});


