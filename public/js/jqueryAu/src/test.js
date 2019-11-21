	$('.standard-demo').select2Buttons();
	
	$('select[name=js-callback-select]').change(function() {
	  alert('Changed to ' + $(this).val());
	});
	
	$('select[name=no-default-select]').select2Buttons({noDefault: true});
