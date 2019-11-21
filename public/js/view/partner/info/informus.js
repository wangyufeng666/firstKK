$().ready(function(){
    //点击提交反馈
    $('#btn_submit').click(function(){
        var msg = '';
        var type = $('#informType').val();
        var desc = $('#desc').val();
        $.ajax({
            type:"POST"
            ,async:false //设置同步方式
            ,cache:false 
            ,url:"/partner/info/saveinformus"
            ,data:{informType:type, desc:desc}
            ,dataType:'json'
            ,success:function(data){
                msg = data;
                if(msg == '1'){
                    showTips('您的反馈提交成功，我们会尽快处理');
                    setTimeout(function(){
                    	window.location.href = "/partner/center";
                    },3000);
                }else if(msg == '-1'){
                    showTips('信息填写不全，请检查后再提交');
                    $('#btn_submit').attr('disabled', false);
                }else{
                    showTips('网络异常，请稍后再提交');
                    $('#btn_submit').attr('disabled', false);
                }
            }
        })
    });
});

function showTips(text){
    layer.open({content:'<div class="tiptext">'+text+'</div>',time:3});
}
