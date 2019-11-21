$(document).ready(function(){
	$("#to-apply").bind('click', function(){submit();});
	note();
});

function closeFrame(){
    $('#terms').hide();
    $('.terms_box .checkbox').addClass('checked');
}

function submit(){
    $("#to-apply").unbind('click');
    $("#modelForm").submit();
}
	
function note(){
	$('.note .price').each(function(){
		var height = $(this).prev().height();
		$(this).css({'margin-top':height/2-10});
	});
}

$(".rent_question").click(function(){
	$(".installment_text").slideToggle();
});