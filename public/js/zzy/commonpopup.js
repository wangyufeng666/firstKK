function tipsShort(text){
    var html = '';
//    html +='<div class="tips_close"></div>';
    html +='<div class="tips_text">'+text+'</div>';
    $('.tips_box').append(html);
    var height = $('.tips_box').height();
    $('.tips_box').css('top','-'+height+'px');
    $('#slideMask').show();
    $('.tips_box').animate({top:"30%"},'slow');
}

function tips(text,val){
    var html = '';
//    html +='<div class="tips_close"></div>';
    html +='<div class="tips_text">'+text+'</div>';
    html +='<div class="tips_yes">'+val+'</div>';
    $('.tips_box').append(html);
    var height = $('.tips_box').height();
    $('.tips_box').css('top','-'+height+'px');
    $('#slideMask').show();
    $('.tips_box').animate({top:"30%"},'slow');
}

$('.tips_box').delegate('.tips_close,.left,.tips_yes','click',function(){
    var ua = window.navigator.userAgent.toLowerCase(); 
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){ 
        $('.tips_box').empty();
        $('#slideMask').hide();
        $('#mainContent').css({height:'',overflow:'auto'});
    }else{
        close();
    }
});

$('#slideMask').click(function(){
    var ua = window.navigator.userAgent.toLowerCase(); 
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
       $('.tips_box').empty();
       $('#slideMask').hide();
       $('.item_box').hide();
       $('.item_box_text').hide();
       $('#mainContent').css({height:'',overflow:'auto'});
    }else{
        close();
    }
});

/**
 * close 弹窗
 */
function close(){
    $('.tips_box').animate({top:"0"},'slow',function(){
       $('.tips_box').empty();
       $('#slideMask').hide();
       $('.item_box').hide();
       $('.item_box_text').hide();
       $('#mainContent').css({height:'',overflow:'auto'});
    })
}