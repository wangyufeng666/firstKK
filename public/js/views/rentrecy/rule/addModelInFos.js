$().ready(function(){
    $('.saveModelBtn').bind('click', function(){saveModelInFo($(this).attr('id'));});
	//表单验证
	$('#bindBankForm').validate({
		rules:{
			textDesc:{maxlength:100}//规则备注
		}
		,messages:{
			textDesc:{maxlength:"规则备注不能超过100字符"}//规则备注
		}
	});
});
/**
 * @param operFlag 	保存并新增标记
 * @returns
 */
function saveModelInFo(thisAttrId){
	if($("#bindBankForm").valid()){
		var params = {};
        params.imgPath = $('#imgPath').val();
        if (params.imgPath == '' || params.imgPath == null || params.imgPath == undefined){
            alert('请上传图片');
            return false;
        }else{
            params.textDesc = $("#textDesc").val();
            params.seq = $("#seq").val();
            $.ajax({
                type:'POST'//请求方式
                ,url:"/rentrecy/rule/addmodeltext"  //请求路径
                ,data:params  //发送到服务器的数据
                ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
                ,async:false //同步请求
                ,timeout:60000//默认超时60秒
                ,dataType:'json' //预期服务器返回的数据类型
                ,success:function(data){
                    if(data == "Y"){
                        if(thisAttrId == 'saveAndAddBtn'){
                            $('.fjinp').css('margin-top','0');
                            $("#imageId").attr("src",'');
                            $('#imgPath').val('');
                            $('#seq').val(parseInt(params.seq)+1);
                            $('#textDesc').val('');
                        }else{
                            parent.reload();
                        }
                    }
                }
            });
        }
	}else{
		$('.saveModelBtn').bind('click', function(){saveQuestion($(this).attr('id'));});
	}
}

/**
 * 	上传图片
 * @returns {boolean}
 */
function upload(){
    var animateimg = $('#uploadsc').val(); //获取上传的图片名 带//
    var imgarr=animateimg.split('\\'); //分割
    var myimg=imgarr[imgarr.length-1]; //去掉 // 获取图片名
    var houzui = myimg.lastIndexOf('.'); //获取 . 出现的位置
    var ext = myimg.substring(houzui, myimg.length).toUpperCase();  //切割 . 获取文件后缀
    var file = $('#uploadsc').get(0).files[0]; //获取上传的文件
    if (file == undefined || file == '' || file == null) {return false;}
    var fileSize = file.size;           //获取上传的文件大小
    var maxSize = 10240000;              //最大10MB
    if(ext !='.PNG' && ext !='.GIF' && ext !='.JPG' && ext !='.JPEG'){
        alert('文件类型错误,请重新上传');
        return false;
    }else if(parseInt(fileSize) >= parseInt(maxSize)){
        alert('上传的文件不能超过20MB,对您造成的不便敬请谅解,谢谢!');
        return false;
    }else{
        var data = new FormData($('#bindBankForm')[0]);
        $.ajax({
            url: "/instalment/file/rentrecyupload/",
            type: 'POST',
            data: data,
            dataType: 'JSON',
            beforeSend: function () {
                layer.msg('加载中', {
                    icon: 16
                    ,shade: 0.01
                });
            },
            complete: function () {

            },
            cache: false,
            processData: false,
            contentType: false
        }).done(function(ret){
            if(ret.code == true){
                console.log(ret);
                alert('上传成功');
                $('.fjinp').css('margin-top','-65px');
                $("#imageId").attr("src",ret.data.path);
                $("#imgPath").val(ret.data.path);
            }else{
                alert('上传失败');
            }
        });
        return false;
    }
}

/**
 * 删除图文信息
 */
$('.checked .bd-item').dblclick(function(){
    var pkId = $(this).attr('id');
    if(confirm('是否确认删除图文描述？')){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/rentrecy/rule/deldetailimgtextmodel"  //请求路径
            ,data:{pkId:pkId}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success:function(data){
                if(data == "Y"){
                    alert('删除成功');
                    window.location.href = window.location.href;
                }
            }
        });
    }
});


function goBack(){
	parent.reload();
}