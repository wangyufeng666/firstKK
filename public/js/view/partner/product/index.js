$(document).ready(function(){
    var width = document.body.clientWidth;
    $('#sortUl').css({'width':width+'px'});
    $('#bottomMenu').css({'width':width+'px'});
    
	$(window).resize(function(){
	    var width = document.body.clientWidth;
	    $('#sortUl').css({'width':width+'px'});
	    $('#bottomMenu').css({'width':width+'px'});
	});
});

$("#userMenu").click(function(){
	window.location.href="/offlinem/invitee/center";
    })