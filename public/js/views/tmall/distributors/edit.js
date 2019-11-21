  $('#saveButton').bind('click', save);
  //表单验证
  $('#addForm').validate({
      rules:{
	    partnerName:{//渠道商名称
          required:true
        }
        ,qu:{//地区
          required:true
        }
        ,auditStatus:{//审批状态
            required:true
        }
        ,partnerStatus:{//渠道商合作状态
            required:true
        }
        ,payType:{//结算方式
        	required:true
        }
        ,contacts:{//联系人
            required:true
        }
        ,contactWay:{//联系电话
            required:true,
            phoneOrMobile:true
        }
        ,address:{//地址
        	required:true
        }
        ,remarks:{//备注
        	maxlength:200
        }        
      }
      ,messages:{
    	  partnerName:{//渠道商名称
          required:"请输入渠道商名称"
        }
        ,qu:{//地区
          required:"请选择地区"
        }
        ,auditStatus:{//审批状态
        	required:"请选择审批状态"
        }
        ,partnerStatus:{//渠道商合作状态
        	required:"请选择渠道商合作状态"
        }
        ,payType:{//结算类型
        	required:"请选择结算方式"
        }
        ,contacts:{//联系人
        	required:"请填写联系人"
        }
        ,contactWay:{//联系电话
        	required:"请填写来联系电话"
            ,phoneOrMobile:"联系电话格式不正确"	
        }
        ,address:{//地址
        	required:"请填写地址"
        }
        ,remarks:{//备注
            maxlength:"评价内容最多200字符"
        }        
      }
    });
  
  //获取复选框选中的值
  var checkBoxArray = dividedFlag.split(",");
  console.log(checkBoxArray);
  for(var i=0;i<checkBoxArray.length;i++){  
      $("input[name='dividedFlag[]']").each(function(){  
          if($(this).val()==checkBoxArray[i]){  
              $(this).attr("checked","checked");  
          }  
      })  
  } 
  
function save(){
	  $('#saveButton').unbind('click');
	  if($("#addForm").valid()){
			var partnerId = $('#partnerId').val();
			var contactWay = $('#contactWay').val();
			$.post('/tmall/distributors/checknewpartner', {partnerId:partnerId,contactWay:contactWay}, function(data){
				if(data == false){
					$('#addForm').submit();
				}else{
					alert('已存在的联系电话和登录名，不能保存');
					$('#saveButton').bind('click', function(){save();});
				}
			});
	  }else{
	    $('#saveButton').bind('click', save);
	  }
	}

function goBack(){
  window.location.href = "/tmall/distributors/index";
}

/*省市级联*/
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

