$().ready(function(){
	//表单提交
  	$('#saveButton').bind('click', function(){save();});
  	//checkbox value get
    $('#sourcecode').click(function(){
        var thisbox='';
        var r=document.getElementsByName("sourcecode"); 
        for(var i=0;i<r.length;i++){
            if(r[i].checked){
                if(thisbox == ''){
                	thisbox = r[i].value;
                }else{
                	thisbox = thisbox + "," + r[i].value;
                }
            }
        }
        $('#sourcecodes').val(thisbox);
        if(thisbox!=''){
			$('#sourcecode .error-wraper').css('display','none');
        }else{
        	$('#sourcecode .error-wraper').css('display','inline-block');
        }
    });
    
  //表单验证
  $('#addForm').validate({
      rules:{
    	  eventname:{
          required:true
        }
        ,startdate:{
            required:true
        }
        ,enddate:{
            required:true
        }
        ,partnercode:{
        	required:true
        }
        ,sourcecodes:{
        	required:true
        }
        ,eventcontents:{
        	required:true
        }
      }
      ,messages:{
    	eventname:{
          required:"请填写活动名称"
        }
        ,startdate:{
            required:"请选择开始时间"
        }
        ,enddate:{
            required:"请选择结束时间"
        }
        ,partnercode:{
            required:"请选择渠道商"
        }
        ,sourcecodes:{
            required:"请选择端口号"
        }
        ,eventcontents:{
            required:"请填写活动介绍"
        }
      }
    });
  
    
	//渠道商对应活动端口
	$("#partnercode").change(function(){
		var partnerVal = $(this).val();
		getsourcecode(partnerVal);
	});
	function getsourcecode(val){
		$.ajax({
			type:'GET',
			dataType:'json',
			cache:false,
			async:false,
			data:{partnercode:val},
			url:'/recycle/activity/getsourcecode',
			success:function(data){
				if(data.length > 0){
					var a = '',b = '',c = '';
					
		        	for(i in data){
		        		a = a +'<label for="source'+data[i]["SOURCECODE"]+'">'+data[i]["SOURCENAME"]+'</label><input type="Checkbox" name="sourcecode" value="'+data[i]["SOURCECODE"]+'" id="source'+data[i]["SOURCECODE"]+'" /> ';
		        	}
		        	$("#sourcetxt").html(a);
				}
			}
		});
	}
});

function save(){
  $('#saveButton').unbind('click');
  if($("#addForm").valid()){
	    var startdate = $("#startdate").val();
	    var enddate = $("#enddate").val();
		var sourcecodes = $("#sourcecodes").val();
		var eventcode = $("#eventcode").val();
		$.ajax({
			type:'GET',
			dataType:'json',
			cache:false,
			async:false,
			data:{sourcecodes:sourcecodes,startdate:startdate,enddate:enddate,eventcode:eventcode},
			url:'/recycle/activity/getactivityinfos',
			success:function(data){
				if(data.length > 0){
					var a = '',b = '',c = '';
					//console.log(data);
					a = '<style>.alerttable{border-right:1px solid #ccc;border-bottom:1px solid #ccc;} .alerttable td,.alerttable th{border:1px solid #ccc;border-right:none;border-bottom:none;}</style>有以下活动已占用端口，确定继续添加当前活动？<table class="alerttable" cellspacing=0><tr><th>活动名称</th><th>开始时间</th><th>结束时间</th><th>端口号</th></tr>';
		        	for(i in data){
		        		b = b +'<tr><td>'+data[i]["EVENTNAME"]+'</td><td>'+data[i]["STARTDATE"]+'</td><td>'+data[i]["ENDDATE"]+'</td><td>'+data[i]["SOURCENAME"]+'</td></tr>';
		        	}
		        	c = '</table>';
		        	layer.alert(a+b+c);
		        	$(".xubox_botton1").click(function(){
		        		$('#addForm').submit();
		        	})
					$('#saveButton').bind('click', function(){save();});
				}else{
					$('#addForm').submit();
				}
				
			}
		});
  }else{
    $('#saveButton').bind('click', function(){save();});
  }
}
//返回端口活动列表页
function goBack(){
    window.location.href='/recycle/activity/index';
}