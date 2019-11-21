function bindblan(mobile,applyflag){
	var orderNos = $("#orderNos").val();
	var withFlag = $("#withFlag").val();
	var name = $("#name").val();
	var shenfenzheng = $("#shenfenzheng").val();
	var kahao = $("#kahao").val();
	var blanName = $('.sidebar_content .item.selected').attr('index');

function checkidcard(){
	var shenfenzheng = $("#shenfenzheng").val();
	var idcard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;//身份证验证
	return new RegExp(idcard).test(shenfenzheng);
}

function checkkahao(){
	var kahao = $("#kahao").val();
	var kahaocard =  /^(\d{16}|\d{19})$/;//身份证验证
	return new RegExp(kahaocard).test(kahao);
}
	
if(name){
	if(shenfenzheng){
		if(checkidcard()){
			if(kahao){
				if(checkkahao()){
					if(blanName !==''){
						$.ajax({
						type:'POST'//请求方式
						,url:"/partner/bank/saveapproval"  //请求路径
						,data:{name:name, mobile:mobile, shenfenzheng:shenfenzheng, kahao:kahao, blanName:blanName,applyflag:applyflag}//发送到服务器的数据
						,cache:false
						,async:false
						,timeout:6000
						,dataType:'json'
							,success:function(data){
								if(data == 'Y'){
									showTips('绑定成功');
									window.location.href = "/partner/bank/banklist?orderNos="+orderNos+"&withFlag="+withFlag;
								}else if(data == 'A'){
									showTips('绑定成功');
									window.location.href = "/partner/bank/list";
								}else{
									showTips("该银行卡号已经绑定过，无法再绑定");
								}
							}
						});
					}else{
						showTips("请选择银行");
					}
				}else{
					showTips("请输入正确的银行卡号");
				}
			}else{
				showTips("银行卡号不能为空");
			}
		}else{
			showTips("请输入正确的身份证号");
		}
	}else{
		showTips("身份证号不能为空");
	}
}else{
	showTips("姓名不能为空");
}
}

function showTips(text){
	layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}
/**
 * sidebar 隐藏
 */
function sidebarHide(){
    $('#slideMask').hide();
    $('html,body').animate({scrollTop:0}, 1);
}

/**
 * sidebar 展示
 */
function sidebarShow(){
    $('#slideMask').show();
    $('html,body').animate({scrollTop:0}, 1);
}
$('.list_box .bank_name').click(function(){
    sidebarShow();
    $('#areaSidebar').slideDown();
});

$('.sidebar_content .item').click(function(){
    $('.sidebar_content .item').removeClass('selected');
    var value = $(this).addClass('selected').html();
    $('.list_box .bank_val').text(value);
    $('#areaSidebar').slideUp();
    sidebarHide();
})
$('.menu_sidebar img').click(function(){
    $('#areaSidebar').slideUp();
    sidebarHide();
})
