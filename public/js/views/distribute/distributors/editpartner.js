  $('#saveButton').bind('click', save);
  //表单验证
  $('#addForm').validate({
		rules:{
			partnerName:{required:true}//门店名称
			,qu:{required:true}//区域ID
			,partnerCode:{required:true,maxlength:4}//门店编码
			,branchCode:{required:true}//所属分部
			,address:{required:true}//地址
		}
		,messages:{
			partnerName:{required:"请输入门店名称"}//渠道商名称
			,qu:{required:"请选择地区"}//地区
			,partnerCode:{required:"请输入门店编码",maxlength:"门店编码是4位"}//门店编码
			,branchCode:{required:"请选择所属分部"}//所属分部
			,address:{required:"请填写地址"}//地址
		}
    });
    
function save(){
	  $('#saveButton').unbind('click');
	  if($("#addForm").valid()){
		  var partnerCode = $('#partnerCode').val();
		  if(partnerCode){
			  alert('修改完成之后，记得提醒店员重新登录，否则修改的信息无法生效');
			  $('#addForm').submit();
		  }else{
			  alert('参数错误');
			  $('#saveButton').bind('click', save);
		  }
	  }else{
	    $('#saveButton').bind('click', save);
	  }
	}

function goBack(){
  window.location.href = "/tmall/distributors/partnerindex";
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


