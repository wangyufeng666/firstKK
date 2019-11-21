$('.info .update').click(function(){
	var dateFlag = $(this).attr('dateFlag');
	var promoterId = $(this).attr('promoterId');
	var flag = '1';
	if(dateFlag == 'J'){
		flag = '1';
	}else if(dateFlag == 'L'){
		flag = '2';
	}else if(dateFlag == 'C'){
		flag = '3';
	}
	var name = $('#name'+flag).val();
	var jobnum = $('#jobnum'+flag).val();
	var contactWay = $('#mobile'+flag).val();
	
	if(confirm('是否确认修改？')){
		if(partnerCode && partnerId && promoterId && jobnum && contactWay && name && dateFlag){
			if(checkMobile(contactWay)){
				var resultFLg = checkmobile(partnerCode, jobnum, contactWay, promoterId, partnerId);
				if(resultFLg == 'Y'){
					var data = {jobnum:jobnum,contactWay:contactWay,partnerId:partnerId,name:name,promoterId:promoterId,salesmanRole:dateFlag};
					$.ajaxSettings.async = false;
					$.post('/tmall/distributors/updatepromoter', data, function(data){
						if(data == 'Y'){
							alert('修改完成之后，记得提醒店员重新登录，否则修改的信息无法生效');
							window.location.href = window.location.href;
						}else{
							alert('修改失败，请重新操作');
						}
					});
					$.ajaxSettings.async = true;
				}else{
					alert(resultFLg);
				}
			}else{
				alert('请输入正确的手机号');
			}
		}else{
			alert('请完善主任信息');
		}
	}
})

//检测手机号是否已经存在
function checkmobile(partnerCode, jobnum, contactWay, promoterId, partnerId){
	var result = '手机或工号已存在，请联系门店确认清楚';
	$.ajaxSettings.async = false;
	  $.post('/tmall/distributors/checkmobileisval', {jobnum:jobnum,contactWay:contactWay,partnerCode:partnerCode,partnerId:partnerId,promoterId:promoterId}, function(data){
		  if(!data || data == ''){
			  result = 'Y';
			  }else{
				  result = data;
		  }
	  });
	  $.ajaxSettings.async = true;
	  return result;
}


var phone = /^1[3456789]\d{9}$/;
//检查手机号码
function checkMobile(mobile){
	var resultFlag = false;
	if(phone.test(mobile)){
		resultFlag = true;	
	}
	return resultFlag;
}

var dateFlag;
$('.info .add').click(function(){
	$('.info').hide();
	$('.addPromoter').show();
	dateFlag = $(this).attr('dateFlag');
})

function saveButton(){
	var addName = $('#addName').val();
	var addMobile = $('#addMobile').val();
	var addJobnum = $('#addJobnum').val();
	if(dateFlag && addName && addMobile && addJobnum){
		if(checkMobile(addMobile)){
			$.ajaxSettings.async = false;
			  $.post('/tmall/distributors/checkpromotermobile', {jobnum:addJobnum,contactWay:addMobile}, function(data){
				  if(data == 'Y'){
					  var data = {jobnum:addJobnum,contactWay:addMobile,name:addName,salesmanRole:dateFlag,partnerCode:partnerCode,partnerId:partnerId};
					  $.post('/tmall/distributors/savepromoterinfo', data, function(data){
						  if(data == 'Y'){
							  window.location.href = '/tmall/distributors/partners?partnerCode='+partnerCode;
						  }else{
							  alert('保存失败，请重新操作');
						  }
					  });  
				  }else{
					  alert('手机或工号已存在，请联系门店确认清楚');
				  }
			  });
			  $.ajaxSettings.async = true;
		}else{
			alert('请输入正确的手机号');
		}
	}else{
		alert('请完善信息');
	}	
}



function goBack(data){
	var url = '/tmall/distributors/partnerindex?partnerCode='+partnerCode;
	if(data == '2'){
		url = '/tmall/distributors/partners?partnerCode='+partnerCode;
	}
	window.location.href = url;
}