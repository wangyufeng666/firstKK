$(document).ready(function(){
	
	//全选
	$("#ckall").click(function(){
		var check=$(this).attr("checked");
		$("input[type='checkbox'][name='Affixid[]']").each(function(){
			$(this).attr("checked",check);
		});
	});

	//反选
	$("#ckReserve").click(function(){
		var check=$(this).attr("checked");
		$("input[type='checkbox'][name='Affixid[]']").each(function(){
			$(this).attr("checked",!$(this).attr("checked"));
		});
	});

	//省机构
	$('#Branchid').change(//省机构联动市机构
			function(){
				$.ajax({
					url:'/agent/agentbroker/findcitycodes',
					type:'POST',
					data:{Branchid:$.trim($('#Branchid').val())},
					dataType:'json',
					timeout:5000,
					error: function(){ alert('服务器错误, 请与管理员联系!', '提示信息'); },
					success: function(result){
						$("#Cbranchid").empty();
						$("#Ubranchid").empty();						
						jQuery("#Cbranchid").append("<option value=''>－－请选择：－－</option>");
						jQuery("#Ubranchid").append("<option value=''>－－请选择：－－</option>");
						if (result!=null){
				           	for(var i in result){
								opt = window.Option(result[i][1],result[i][0]);
								jQuery("#Cbranchid").append("<option value="+result[i][0]+">"+result[i][1]+"</option>");
				           	}
			            }
					}
				});
			}	
		);
	//市机构
	$('#Cbranchid').change(
			function(){
				$.ajax({
					url:'/agent/agentbroker/findsaledepartmentcodes',
					type:'POST',
					data:{Citycode:$('#Cbranchid').val()},
					dataType:'json',
					timeout:5000,
					error: function(){ alert('服务器错误, 请与管理员联系!', '提示信息'); },
					success: function(result){ 
						$("#Ubranchid").empty();
						jQuery("#Ubranchid").append("<option value=\"\">－－请选择：－－</option>");
			            if (result!=null){
		                	for(var i in result){
								opt = window.Option(result[i][1],result[i][0]);
								jQuery("#Ubranchid").append("<option value="+result[i][0]+">"+result[i][1]+"</option>");
		                	}
			        	}
					}
				});
			}	
		);

	//数据提交按钮
	$("#commit").click(function(){
		var collerdesc="";
		var customerdesc="";
		var isnullflag=false;
		
		$("input[isnull='Y'],select[isnull='Y']").each(function(){			
			if($(this).val()=='' || $(this).val().length<=0){
				customerdesc = "不可为空!";
				if(typeof($(this).attr("customdescribe"))!="undefined"){
					customerdesc = $(this).attr("customdescribe");
				}				
				if(typeof($(this).attr("describe"))!="undefined"){
					collerdesc=$(this).attr("describe")+customerdesc;
				}else{
					collerdesc = "请输入完整信息!";
				}
				isnullflag=true;
				$(this).focus();	
				return false;
			}
		});
		//判断是否有未完整填写的属性
		if(isnullflag){
			alert(collerdesc);		
			return;				
		}
		//检查生效日
		if(false==checkdate($.trim($('#Qualificationeffectivedate').val()),$.trim($('#Qualificationeffenddate').val())))
		{
			alert("证书的生效日期应早于截止日期");
			$("#Qualificationeffectivedate").focus();    
			return;
		}
		
		//如果控件存在
		if($("#Contactmobile").length>0){
			if($.trim($("#Contactmobile").val())!=''){				
				mobilereg=/^1[0-9]{10}$/;
				if(!mobilereg.test($.trim($("#Contactmobile").val()))){
					alert("手机号格式不正确，请重新输入!")
					return;
				}
			}
		}
		
		//如果控件存在
		if($("#Contactemail").length>0){
			if($.trim($("#Contactemail").val())!=''){				
				emailereg=/^|\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$/;
				if(!emailereg.test($.trim($("#Contactemail").val()))){
					alert("邮件格式不正确，请重新输入!")
					return;
				}
			}
		}
		//$(document).progressDialog.showDialog("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;正在执行操作,请稍候………");
		//提交数据		
		$("#addform").submit();

		
	});

    //通过身份证获得性别和生日
	$("#Idno").blur(function(){
		var idno=$(this).val();
		if(idno != '' && idno.length>0  ){
			if($("#Idtype").val()=='IDTYPE_01'){
				if(isChinaIDCard(idno)){
                    var  cardinfo = cardTOInfo(idno);
                    $('#Gender').attr('value', cardinfo[1]);   
                    $('#Birthday').attr('value', cardinfo[0]);  
                 }else{
                     alert("身份证格式不正确!");
                     $(this).focus();
                 }
			}
		}
	});

	//基本法联动职级 
	$('#Channelcaseid').change(
			function(){ 
				$.ajax({
					url:'/agent/agentbroker/findagentlevel',
					type:'POST',
					data:{CasemainId:$('#Channelcaseid').val()},
					dataType:'json',
					timeout:5000,
					error: function(){ alert('服务器错误, 请与管理员联系!', '提示信息'); },
					success: function(result){ 
						$("#Agentlevelcode").empty();
						jQuery("#Agentlevelcode").append("<option value=\"\">－－请选择：－－</option>");
			            if (result!=null){
		                	for(var i in result){
								opt = window.Option(result[i][1],result[i][0]);
								$("#Agentlevelcode").append("<option value="+result[i][0]+">"+result[i][1]+"</option>");
	                		}
		                }
					}
				});
		}	
	);

	//推荐人编码活动
	$('#Recommendagentcode').change(//通过销售代码找出该推荐人的资料	    
		function(){
			var type="Recommend";
			resetagentbytype(type);//清空推荐人资料				
			if(""!=$.trim($('#Recommendagentcode').val())){
				findInfo(type,$.trim($('#Recommendagentcode').val()),"","");
			}
		}
	);
	//管理人编码活动
	$('#Manageragentcode').change(//通过销售代码找出该推荐人的资料	    
		function(){			
			var type="Manager";
			resetagentbytype(type);//清空推荐人资料				
			if(""!=$.trim($('#Manageragentcode').val())){
				findInfo(type,$.trim($('#Manageragentcode').val()),"","");
			}
		}
	);


	//清空人员的资料
	function resetagentbytype(type){
		$("#"+type+"agentid").attr('value', '');
		$("#"+type+"agentname").attr('value', '');
		$("#"+type+"agentlevelname").attr('value', '');
		$("#"+type+"agentlevelcode").attr('value', '');
		$("#"+type+"agentempstatus").attr('value', '');
		$("#"+type+"agentcontactphone").attr('value', '');
		$("#"+type+"agenttype").attr('value','');
		$("#"+type+"agentidno").attr('value','');
		$("#"+type+"Directoragentid").attr('value','');	
		$("#"+type+"Directoragentcode").attr('value','');	
		$("#"+type+"Directoragentidno").attr('value','');	
		$("#"+type+"Directoragentname").attr('value','');	
	};

	
	//查找代理人信息
	function findInfo(type,code,idno,agentid) {
		var agenttype=$("#Agenttype").val();
		$.ajax({
			url:'/agent/thagentbroker/findAgentInfo',
			type:'POST',//参数说明
			data:{Agentcode:code,
				  Agentid:agentid,
				  Agentidno:idno,
				  Agenttype:agenttype
			      },
			dataType:'json',
			timeout:20000,
			error: function(){ alert('服务器错误, 请与管理员联系!', '提示信息'); }, 
			success: function(result) {// B版 变动原有的总监 OM2 为BR OM2 为 BD				
				if(result.length>0){
					setInfo(type,result[0]); //设置查找出的信息
				}
			}
		});
	};

	//填充推荐人信息
	function setInfo(type,result) {//填入信息				   
			$("#"+type+"agentid").attr('value', result.AGENTID);
			$("#"+type+"agentcode").attr('value', result.AGENTCODE);
			$("#"+type+"agentidno").attr('value', result.IDNO);
			$("#"+type+"agentname").attr('value', result.AGENTNAME);
			$("#"+type+"agentlevelname").attr('value', result.AGENTLEVELNAME);
			$("#"+type+"agentlevelcode").attr('value', result.AGENTLEVELCODE);
			$("#"+type+"agentempstatus").attr('value', result.AGENTSTATUSNAME);
			$("#"+type+"agentcontactphone").attr('value', result.CONTACTPHONE);
			$("#"+type+"agenttype").attr('value', result.AGENTTYPE);
			if(result.DIRECTORAGENTID!=null && result.DIRECTORAGENTID.length>0){
				$("#"+type+"Directoragentid").attr('value',result.DIRECTORAGENTID);	
				$("#"+type+"Directoragentcode").attr('value',result.DIRECTORAGENTCODE);	
				$("#"+type+"Directoragentidno").attr('value',result.DIRECTORAGENTIDNO);	
				$("#"+type+"Directoragentname").attr('value',result.DIRECTORAGENTNAME);	
			}
			
	};
	
	$('#Qualificationeffenddate').blur(//提交按钮							
			function() {
				if(false==checkdate($.trim($('#Qualificationeffectivedate').val()),$.trim($('#Qualificationeffenddate').val())))
					{
						alert("证书的生效日期应早于截止日期");
						document.getElementById("Qualificationeffectivedate").focus();    
						return ;
				}
			}				
	);
	
	function checkdate(before,after){//前日期大于后日期，返回TRUE，否则返回false
		var result=true;
		if('' != $.trim(before) && '' != $.trim(after)){
			before=new Date(before.substr(0,4),before.substr(5,2),before.substr(8,2));
			after=new Date(after.substr(0,4),after.substr(5,2),after.substr(8,2));
			if(before.getTime()>after.getTime()){
				result= false;
			}
		}
		return result;
	};	

	
});