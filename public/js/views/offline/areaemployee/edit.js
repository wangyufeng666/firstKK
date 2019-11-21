
	$(".btnRemoveLine").click(function(){
		$(this).parent().parent().remove();
	});
	
	
	$('#qu_1').change(function(){
		var areaId = $(this).val();
		var areaName = this.options[this.selectedIndex].text;
		var newLine = '<tr class="main">';
		newLine += '<td><input name="areaName" area_id = "'+areaId+'" value="'+areaName+'" class="input-date"/></td>';
		newLine += '<td><input type="button" class="btnRemoveLine" value="-"/></td>';
		newLine += '</tr>';
		$('#eventTable').append(newLine);
		$(".btnRemoveLine").delegate("", "click", function(){
			$(this).parent().parent().remove();
		});
	});
	
	$('#saveButton').click(function(){
		var name = $('#name').val();
		var jobNum = $('#jobNum').val();
		var mobile = $('#mobile').val();
		var address = $('#address').val();
		var details = '';
		$('#eventTable .main').each(function(){
			var areaId = $(this).find('input[name=areaName]').attr('area_id');
			details += areaId+',';
		});
		if(name && jobNum && mobile && address){
	        $.ajax({
	            type:'POST'//请求方式
	            ,url:"/offline/areaemployee/saveeditemployee"  //请求路径
	            ,data:{name:name, jobNum:jobNum, mobile:mobile, address:address, details:details}  //发送到服务器的数据
	            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
	            ,async:false //同步请求
	            ,timeout:60000//默认超时60秒
	            ,dataType:'json' //预期服务器返回的数据类型
	            ,success:function(data){
	              if(data == "Y"){
	            	  	layer.alert("修改成功",3);
	                    parent.location.href = parent.location.href;
	              }else{
	            	  	layer.alert("修改失败",3);
	                    parent.location.href = parent.location.href;
	              }
	            }
	        });
		}else{
			layer.alert('请完善信息再保存',1);
		}
	})
	

	initProvince_1();
	//省份初始化
	function initProvince_1(){
		$("#sheng_1").html("<option value=''>请选择省份</option>");
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
			success:function(data){
				var optionHtml = "", name = "";
				for(i in data){
					name = data[i]['NAME'];
					optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
				}
				$("#sheng_1").append(optionHtml);
			}
		});
	}
	
	//省动态改变
	$('#sheng_1').change(function(){
		$("#shi_1").html("<option value='' flag='N'>请选择城市</option>");
		$("#qu_1").html("<option value='' flag='N'>请选择地区</option>");
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
					$("#shi_1").append(optionHtml);
				}
			});
		}
	});
	
	//市动态改变
	$('#shi_1').change(function(){
		$("#qu_1").html("<option flag='' value=''>请选择地区</option>");
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
					$("#qu_1").append(optionHtml);
				}
			});
		}
	});
	
	function goBack(){
		 parent.location.href = parent.location.href;
	}