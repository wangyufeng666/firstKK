
var slide_mark = $('.pop_slide');
var popup = $('.popup_box');
if(slide_mark.length == 0){
    $('body').append('<div class="pop_slide closepop hide"></div>');
}
if(popup.length == 0){
    $('body').append('<div class="popup_box showpop"></div>');
}

//底部左右可点击（已调整...）
function selectBtm(text,left_class,left_text,right_class,right_text,popClose){
    if(text != ''){
        if(left_text == '' || left_text == undefined || left_text == null){
            left_text = '确认';
        }
        if(right_text == '' || right_text == undefined || right_text == null){
            right_text = '取消';
        }
        if(left_class == '' || left_class == undefined || left_class == null){
            left_class = '';
        }
        var rightClass = ''
        if(right_class == '' || right_class == undefined || right_class == null){
            rightClass = 'cancel';
        }else{
            rightClass = right_class;
        }
        $('.popup_box').html('');
//      $api.html($api.dom('.popup_box'),'');
        var boxHtml = '';
        boxHtml+='<div class="text">'+text+'</div>';
        boxHtml+='<div class="pop_btm clearfix">';
            boxHtml+='<div class="no left '+rightClass+'">'+right_text+'</div>';
            boxHtml+='<div class="yes right '+left_class+'">'+left_text+'</div>';
        boxHtml+='</div>';
        if(popClose == 'hidepop'){
            $('.pop_slide').addClass('no_pop');
//          $api.addCls($api.dom('.pop_slide'),'no_pop'); //阻止点击遮罩层隐藏弹窗
        }
        if(right_class == '' || right_class == undefined || right_class == null){
            _thisShowPop(boxHtml,rightClass);
        }else{
            _thisShowPop(boxHtml,'');
        }
    }else{
        toast('点击信息有误');
    }
}

function short_tips(text,time,hide){
    if(text != ''){
//      $api.html($api.dom('.popup_box'),'');
        $('.popup_box').html('');
        var boxHtml = '';
        boxHtml += '<div class="text">'+text+'</div>';
        _thisShowPop(boxHtml);
        if(time == '' || time == undefined || time == null){
            time = 2;
        }
        if(hide != 'no'){
            setTimeout('autoClose()',time*1000);
        }else{
            $('.pop_slide').addClass('no_pop');
//          $api.addCls($api.dom('.pop_slide'),'no_pop'); //阻止点击遮罩层隐藏弹窗
        }
    }else{
        toast('提示信息有误');
    }
}

//底部单独按钮（已调整...）
function bottomBtm(text,verclss,btmText){
    if(text != ''){
        var ver_clss = '';
        if(verclss == '' || verclss == undefined || verclss == null){
            ver_clss = 'btmcancel';
        }else{
            ver_clss = verclss;
        }
        if(btmText == '' || btmText == undefined || btmText == null){
            btmText = '确认';
        }
        $('.popup_box').html('');
//      $api.html($api.dom('.popup_box'),'');
        var boxHtml = '';
        boxHtml+='<div class="text">'+text+'</div>';
        boxHtml+='<div class="pop_btm line_btm">';
            boxHtml+='<div class="yes '+ver_clss+'">'+btmText+'</div>';
        boxHtml+='</div>';
        if(verclss != '' && verclss != undefined && verclss != null){
            $('.pop_slide').addClass('no_pop');
//          $api.addCls($api.dom('.pop_slide'),'no_pop'); //阻止点击遮罩层隐藏弹窗
            _thisShowPop(boxHtml,'');
            btmConfirm();
        }else{
            _thisShowPop(boxHtml,ver_clss);
        }
    }
}

//创建订单-生成图片验证码
function createImgCode(code){
    $('.popup_box').html('');
//  $api.html($api.dom('.popup_box'),'');
    $('.popup_box').css('padding-top','0.48rem');
//  $api.css($api.dom('.popup_box'),'padding-top:0.48rem');
    var boxHtml = '';
    boxHtml += '<div class="semcodebox">';
        boxHtml+='<div class="code_tips">请输入验证码</div>';
        boxHtml += '<div class="sem_code">';
            boxHtml += '<div class="in_code">'+code+'</div>';
            boxHtml += '<div class="input"><input type="tel" pattern="[0-9]*" maxlength="4" id="imgcode" name="imgcode" placeholder="请输入右侧验证码" /></div>';
        boxHtml += '</div>';
        
        boxHtml+='<div class="code_btm clearfix">';
            boxHtml+='<div class="code_cancel left">取消</div>';
            boxHtml+='<div class="code_yes right">验证</div>';
        boxHtml+='</div>';
        
    boxHtml += '</div>';
    $('.pop_slide').addClass('no_pop');
//  $api.addCls($api.dom('.pop_slide'),'no_pop'); //阻止点击遮罩层隐藏弹窗
    _thisShowPop(boxHtml,'');
    confirmCode();
}

//显示图片
function showImg(src,text){
    $('.popup_box').html('');
//  $api.html($api.dom('.popup_box'),'');
    var boxHtml = '';
    boxHtml+='<div class="closepopimg img closepop hide"><img src="https://alicdn01.youdemai.com/images/ydmapp/common/icon/new_popimg_close.png" /></div>';
    if(text!='' && text!=null && text!=undefined){
        boxHtml+='<div class="popimgbox img"><img src="'+src+'" /></div>';
        boxHtml+='<div class="abs_text" class="text">'+text+'</div>';
    }else{
        boxHtml+='<div class="popimgbox img popredius"><img src="'+src+'" /></div>';
    }
    _thisShowPop(boxHtml,'showImg');
    closePopUp();
    setTimeout('showClosepopimg()',350);
}

function showClosepopimg(){
    $('.closepopimg').removeClass('hide');
//  $api.removeCls($api.dom('.closepopimg'),'hide');
}

//微信分享...
function wxShare(val){
    var boxHtml = '';
    boxHtml += '<div class="wxshare">';
        for(var v in val){
            boxHtml += '<div class="wx_list '+val[v]['class']+'" type="'+val[v]['type']+'">'+val[v]['name']+'</div>';
        }
    boxHtml += '</div>';
    $('.pop_slide').removeClass('hide');
//  $api.removeCls($api.dom('.pop_slide'),'hide');
    $('.share_box').html(boxHtml)
//  $api.html($api.dom('.share_box'),boxHtml);
    wxShareConfirm();
}

function closePopUp(){
    $('.closepop').click(function(){
        if(!$(this).hasClass('.no_hide')){
            _thisHidePop();
        }
    })
}

function _thisShowPop(html,_class){
    $('.pop_slide').removeClass('hide');
    $('.popup_box').removeClass('showpop');
    $('.popup_box').html(html);
    donHidePop(_class);
}

function donHidePop(_class){
    if(_class == 'showImg'){
        $('.popup_box').css('background','none');
//      $api.css($api.dom('.popup_box'),'background:none');
    }else{
        $('.popup_box').css('background','#fff');
//      $api.css($api.dom('.popup_box'),'background:#fff');
        
        $('.pop_slide').click(function(){
            if(!$(this).hasClass('no_pop')){
                _thisHidePop();
            }
        })
        
//      $api.addEvt($api.dom('.pop_slide'),'click',function(){
//          if(!$api.hasCls(this,'no_pop')){
//              _thisHidePop();
//          }
//      })

        if(_class != '' && _class != undefined && _class != null){
            
            $('.'+_class).click(function(){
                _thisHidePop();
            })
            
//          $api.addEvt($api.dom('.'+_class+''),'click',function(){
//              _thisHidePop();
//          })
        }
    }
}

function autoClose(){
    _thisHidePop();
}

function _thisHidePop(){
//  $api.css($api.dom('.popup_box'),'top:27%');
//  $api.addCls($api.dom('.pop_slide'),'hide');
//  $api.addCls($api.dom('.popup_box'),'showpop');
    $('.popup_box').css({'top':'27%','padding-top':''});
    $('.pop_slide').addClass('hide');
    $('.popup_box').addClass('showpop');
}

//toast
function toast(mess){
    var str='<div class="mess"><span></span></div>';
    $('.mess').remove();
    $("body").append(str);
    $(".mess").fadeIn().find("span").html(mess);
    setTimeout(function(){
        $(".mess").fadeOut();
    },2000)
}