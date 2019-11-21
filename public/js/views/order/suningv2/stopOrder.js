$().ready(function(){
	
	//表单验证
	$('#saveForm').validate({
		rules:{
			stopCaseOption:{//终止备注
				required:true
			}
			,stopDesc:{//终止备注
				required:true
			}
			,contacts:{//联系人
				maxlength:20
			}
			,contactWay:{//联系电话
				maxlength:20
			}
			,expressNum:{
				maxlength:20
			}
			,address:{//地址
				maxlength:200
			}
		}
		,messages:{
		}
	});
	
	$('#btnSubmit').bind('click', function(){formSubmit();});
	$('#stopCaseOption').change(function(){
		if($(this).val() != ''){
			$('#stopDesc').val($(this).val());
		}
	});
	
	//活动配图类型
	$('input:radio[name="returnFlag"]').change(function(){
		
		var thisVal = $(this).val();
		
		if(thisVal == '1'){
			$('#returnTr').show();
		}else{
			$('#returnTr').hide();
			$('#expressPartner').val('');
			$('#expressNum').val('');
			$('#contacts').val('');
			$('#contactWay').val('');
			$('#address').val('');
		}
	});
});

/**
 * 保存信息
 */
function formSubmit(){
	
	if(!$('#saveForm').valid()){
		return;
	}
	
	$('#btnSubmit').unbind('click');
	$('#btnSubmit').val('保存中...');
	
	var params = {};
	
	params.returnFlag = $('input:radio[name="returnFlag"]:checked').val();
	
	if(params.returnFlag == '1'){//退回标记-需要退回
		params.returnPayType = $('input:radio[name="returnPayType"]:checked').val();
		params.expressPartner = $('#expressPartner').val();
		params.expressNum = $('#expressNum').val();
		params.contacts = $('#contacts').val();
		params.contactWay = $('#contactWay').val();
		params.address = $('#address').val();
	}
	params.stopDesc = $('#stopDesc').val();
	params.orderNo = orderNo;
	$.post('/order/suningv2/stoporder', params, function(data){
		if(data == 'Y'){
			parent.reload();
	   }else{
		   $('#btnSubmit').val('确认');
		   $('#btnSubmit').bind('click', function(){formSubmit();});
		   alert(data);
	   }
	});
}

