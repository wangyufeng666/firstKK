$(document).ready(function(){
    checkPlatform();
});
function checkPlatform(){
    if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
        $('.header').removeClass('androidFlag');
    }
}