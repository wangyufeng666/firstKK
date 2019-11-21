$('#saveButton').bind('click', function(){save();});
//表单验证
$('#addForm').validate({
	rules:{
		companyName:{required:true}
		,agents:{required:true}
		,loginName:{required:true,maxlength:15}
		,password:{required:true,maxlength:20}
		,brokerageMax:{required:true,maxlength:3, number:true}
		,dividedMax:{required:true,maxlength:3, number:true}
		,agentFlag:{required:true}
		,contacts:{required:true,maxlength:20}
		,mobile:{required:true,phoneOrMobile:true}
		,qu:{required:true}
		,address:{required:true}
		,oneAgents:{required:true}
		,operationFlag:{required:true}
	}
	,messages:{
		companyName:{required:"请输入代理商名称"}
		,agents:{required:"请选择代理等级"}
		,loginName:{required:"请输入登录名",maxlength:"登录名最大长度为15"}
		,password:{required:"请输入登录密码",maxlength:"登录密码最大长度为20"}
		,brokerageMax:{required:"请输入佣金上限",maxlength:"佣金上限最大长度为3",number:"佣金上限格式不对"}
		,dividedMax:{required:"请输入分成上限",maxlength:"分成上限最大长度为3",number:"分成上限格式不对"}
		,agentFlag:{required:"请选择代理层级",phoneOrMobile:"请选择代理层级"}
		,contacts:{required:"请输入联系人",maxlength:"联系人最大长度为20"}
		,mobile:{required:"请输入手机号",phoneOrMobile:"手机号格式不对"}
		,saleSmanRole:{required:"请选择主任类型"}
		,qu:{required:"请选择所在地区"}
		,address:{required:"请输入详细地址"}
		,oneAgents:{required:"请选择一级代理"}
		,operationFlag:{required:"请选择是否共享运维"}
	}
});

function save(){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var mobile = $('#mobile').val();
		$.post('/device/agents/checkagents', {mobile:mobile,typeCode:typeCode}, function(data){
			if(data == 'Y'){
				$('#addForm').submit();
			}else{
				alert('登录名或手机号已存在，请重新输入');
				$('#saveButton').bind('click', function(){save();});
			}
		});
	}else{
		$('#saveButton').bind('click', function(){save();});
	}
}

$('input[name="grade"]').change(function(){
	if($("input[name='grade']:checked").val() == '2'){
		$('.agentFlag').hide();
		$('.oneAgents').show();
	}else{
		$('.agentFlag').show();
		$('.oneAgents').hide();
	}
})

$('input[name="grade"]').each(function(){
	if($(this).val() == grade){
		$(this).prop( "checked", true );
	}
})

$('input[name="agentFlag"]').each(function(){
	if($(this).val() == agentFlag){
		$(this).prop( "checked", true );
	}
})

$('input[name="operationFlag"]').each(function(){
	if($(this).val() == operationFlag){
		$(this).prop( "checked", true );
	}
})

function goBack(){
	window.location.href = backUrl+'?backFlag=Y';
}

//省份初始化
function initArea(province,city, district){
$("#sheng").html("<option value=''>请选择省份</option>");
$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
  success:function(data){
    var optionHtml = "", name = "";
    for(i in data){
      name = data[i]['NAME'];
      optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
    }
    $("#sheng").append(optionHtml);
    $("#sheng option:contains('"+province+"')").attr("selected", true);
    $("#shi").html("<option value='' flag='N'>请选择城市</option>");
      var thisVal = $("#sheng").val();
      if(thisVal != ''){
          $.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
              success:function(data){
                  var optionHtml = '', id = '', name = '';
                  for(i in data){
                      id = data[i]['ID'];
                      name = data[i]['NAME'];
                      optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
                  }
                  $("#shi").append(optionHtml);
                  $("#shi option:contains('"+city+"')").attr("selected", true);
                  
                  $("#qu").html("<option flag='' value=''>请选择地区</option>");
                  var thisVal = $("#shi").val();
                  if(thisVal != ''){
                      $.ajax({type:'GET',dataType:'jsonp',cache:false,jsonp:'jsonp_callback',data:{cityId:thisVal},url:openapiUrl+'/util/util/getdistrict',
                          success:function(data){
                              var optionHtml = '',id = '',name = '';
                              for(i in data){
                                  id = data[i]['ID'];
                                  name = data[i]['NAME'];
                                  optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
                              }
                              $("#qu").append(optionHtml);
                              $("#qu option:contains('"+district+"')").attr("selected", true);
                          }
                      });
                  }
              }
          });
      }
  }
});
}

//省动态改变
$('#sheng').change(function(){
$("#shi").html("<option value='' flag='N'>请选择城市</option>");
$("#qu").html("<option value='' flag='N'>请选择地区</option>");
var thisVal = $(this).val();
if(thisVal != ''){
  $.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
    success:function(data){
      var optionHtml = '', id = '', name = '';
      for(i in data){
        id = data[i]['ID'];
        name = data[i]['NAME'];
        optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
      }
      $("#shi").append(optionHtml);
    }
  });
}
});

//市动态改变
$('#shi').change(function(){
  $("#qu").html("<option flag='' value=''>请选择地区</option>");
  var thisVal = $(this).val();
  if(thisVal != ''){
      $.ajax({type:'GET',dataType:'jsonp',cache:false,jsonp:'jsonp_callback',data:{cityId:thisVal},url:openapiUrl+'/util/util/getdistrict',
          success:function(data){
              var optionHtml = '',id = '',name = '';
              for(i in data){
                  id = data[i]['ID'];
                  name = data[i]['NAME'];
                  optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
              }
              $("#qu").append(optionHtml);
          }
      });
  }
});