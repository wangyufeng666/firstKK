function dosearch(){
	var value = $('#'+autocomplete_id).val();
	var href = searchUrl+'&keyword='+value+'&uec='+uec;
	if(type!=''){
		href+='&type='+type;
	}
	if(pid != ''){
		href+='&pid='+pid;
	}
	location.href = href;
}

function checkSearchEnter(evt){
	evt = evt ? evt : (window.event ? window.event : null);
	var key = evt.keyCode ? evt.keyCode : evt.which;
    if (key == 13){
    	if(document.activeElement.id == autocomplete_id){
    		dosearch();
        }
    }
}



