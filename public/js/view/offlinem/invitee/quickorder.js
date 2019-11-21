function checkcode(){
	var inquiryCode = $("#orderCode").val();
	var mobile = /^\d{9}$/;//询价code
	return new RegExp(mobile).test(inquiryCode);
}

function quickOrder(){
	var inquiryCode = $("#orderCode").val();
	if(inquiryCode){
		if(checkcode()){
			window.location.href = "/offlinem/inquiry/quickinquiry?inquiryCode="+inquiryCode;
		}else{
			showTips("请输入正确九位数字的小程序询价号");
		}
	}else{
		showTips("请输入九位数字小程序询价号");
	}
	}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}

