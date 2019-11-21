//====================================================================================================
// [\u63D2\u4EF6\u540D\u79F0] jQuery formValidator
//----------------------------------------------------------------------------------------------------
// [\u63CF    \u8FF0] jQuery formValidator\u8868\u5355\u9A8C\u8BC1\u63D2\u4EF6\uFF0C\u5B83\u662F\u57FA\u4E8EjQuery\u7C7B\u5E93\uFF0C\u5B9E\u73B0\u4E86js\u811A\u672C\u4E8E\u9875\u9762\u7684\u5206\u79BB\u3002\u5BF9\u4E00\u4E2A\u8868
//            \u5355\u5BF9\u8C61\uFF0C\u4F60\u53EA\u9700\u8981\u5199\u4E00\u884C\u4EE3\u7801\u5C31\u53EF\u4EE5\u8F7B\u677E\u5B9E\u73B020\u79CD\u4EE5\u4E0A\u7684\u811A\u672C\u63A7\u5236\u3002\u73B0\u652F\u6301\u4E00\u4E2A\u8868\u5355\u5143\u7D20\u7D2F\u52A0\u5F88\u591A\u79CD
//            \u6821\u9A8C\u65B9\u5F0F,\u91C7\u7528\u914D\u7F6E\u4FE1\u606F\u7684\u601D\u60F3\uFF0C\u800C\u4E0D\u662F\u628A\u4FE1\u606F\u5199\u5728\u8868\u5355\u5143\u7D20\u4E0A\uFF0C\u80FD\u6BD4\u8F83\u5B8C\u7F8E\u7684\u5B9E\u73B0ajax\u8BF7\u6C42\u3002
//----------------------------------------------------------------------------------------------------
// [\u4F5C\u8005\u7F51\u540D] \u732B\u51AC	
// [\u90AE    \u7BB1] wzmaodong@126.com
// [\u4F5C\u8005\u535A\u5BA2] http://wzmaodong.cnblogs.com
// [\u66F4\u65B0\u65E5\u671F] 2008-01-24
// [\u7248 \u672C \u53F7] ver3.3
//====================================================================================================
var jQuery_formValidator_initConfig;
(function($) {

$.formValidator = 
{
	//\u5404\u79CD\u6821\u9A8C\u65B9\u5F0F\u652F\u6301\u7684\u63A7\u4EF6\u7C7B\u578B
	sustainType : function(id,setting)
	{
		var elem = $("#"+id).get(0);
		var srcTag = elem.tagName;
		var stype = elem.type;
		switch(setting.validatetype)
		{
			case "InitValidator":
				return true;
			case "InputValidator":
				if (srcTag == "INPUT" || srcTag == "TEXTAREA" || srcTag == "SELECT"){
					return true;
				}else{
					return false;
				}
			case "CompareValidator":
				if (srcTag == "INPUT" || srcTag == "TEXTAREA")
				{
					if (stype == "checkbox" || stype == "radio"){
						return false;
					}else{
						return true;
					}
				}
				return false;
			case "AjaxValidator":
				if (stype == "text" || stype == "textarea" || stype == "file" || stype == "password" || stype == "select-one"){
					return true;
				}else{
					return false;
				}
			case "RegexValidator":
				if (srcTag == "INPUT" || srcTag == "TEXTAREA")
				{
					if (stype == "checkbox" || stype == "radio"){
						return false;
					}else{
						return true;
					}
				}
				return false;
			case "FunctionValidator":
			    return true;
		}
	},
    
	initConfig : function(controlOptions)
	{
		var settings = 
		{
			debug:false,
			validatorgroup : "1",
			alertmessage:false,
			validobjectids:"",
			forcevalid:false,
			onsuccess: function() {return true;},
			onerror:function() {},
			submitonce:false,
			formid:"",
			autotip: false,
			tidymode:false,
			errorfocus:true,
			wideword:true
		};
		controlOptions = controlOptions || {};
		$.extend(settings, controlOptions);
		//\u5982\u679C\u662F\u7CBE\u7B80\u6A21\u5F0F\uFF0C\u53D1\u751F\u9519\u8BEF\u7684\u65F6\u5019\uFF0C\u7B2C\u4E00\u4E2A\u9519\u8BEF\u7684\u63A7\u4EF6\u5C31\u4E0D\u83B7\u5F97\u7126\u70B9
		if(settings.tidymode){settings.errorfocus=false};
		if(settings.formid!=""){$("#"+settings.formid).submit(function(){return $.formValidator.pageIsValid("1");})};
		if (jQuery_formValidator_initConfig == null ){jQuery_formValidator_initConfig = new Array();}
		jQuery_formValidator_initConfig.push( settings );
	},
	
	//\u5982\u679Cvalidator\u5BF9\u8C61\u5BF9\u5E94\u7684element\u5BF9\u8C61\u7684validator\u5C5E\u6027\u8FFD\u52A0\u8981\u8FDB\u884C\u7684\u6821\u9A8C\u3002
	appendValid : function(id, setting )
	{
		//\u5982\u679C\u662F\u5404\u79CD\u6821\u9A8C\u4E0D\u652F\u6301\u7684\u7C7B\u578B\uFF0C\u5C31\u4E0D\u8FFD\u52A0\u5230\u3002\u8FD4\u56DE-1\u8868\u793A\u6CA1\u6709\u8FFD\u52A0\u6210\u529F
		if(!$.formValidator.sustainType(id,setting)) return -1;
		var srcjo = $("#"+id).get(0);   
		//\u91CD\u65B0\u521D\u59CB\u5316
		if (setting.validatetype=="InitValidator" || srcjo.settings == undefined ){srcjo.settings = new Array();}   
		var len = srcjo.settings.push( setting );
		srcjo.settings[len - 1].index = len - 1;
		return len - 1;
	},
	
	//\u5982\u679Cvalidator\u5BF9\u8C61\u5BF9\u5E94\u7684element\u5BF9\u8C61\u7684validator\u5C5E\u6027\u8FFD\u52A0\u8981\u8FDB\u884C\u7684\u6821\u9A8C\u3002
	getInitConfig : function( validatorgroup )
	{
		if(jQuery_formValidator_initConfig!=null)
		{
		    for(i=0;i<jQuery_formValidator_initConfig.length;i++)
		    {
		        if(validatorgroup==jQuery_formValidator_initConfig[i].validatorgroup)
				{
					return jQuery_formValidator_initConfig[i];
				}
		    }
		}
		return null;
	},

	//\u89E6\u53D1\u6BCF\u4E2A\u63A7\u4EF6\u4E0A\u7684\u5404\u79CD\u6821\u9A8C
	triggerValidate : function(returnObj)
	{
		switch(returnObj.setting.validatetype)
		{
			case "InputValidator":
				$.formValidator.inputValid(returnObj);
				break;
			case "CompareValidator":
				$.formValidator.compareValid(returnObj);
				break;
			case "AjaxValidator":
				$.formValidator.ajaxValid(returnObj);
				break;
			case "RegexValidator":
				$.formValidator.regexValid(returnObj);
				break;
			case "FunctionValidator":
				$.formValidator.functionValid(returnObj);
				break;
		}
	},
	
	//\u8BBE\u7F6E\u663E\u793A\u4FE1\u606F
	setTipState : function(elem,showclass,showmsg)
	{
		var setting0 = elem.settings[0];
		var initConfig = $.formValidator.getInitConfig(setting0.validatorgroup);
	    var tip = $("#"+setting0.tipid);
		if(showmsg==null || showmsg=="")
		{
			tip.hide();
		}
		else
		{
			if(initConfig.tidymode)
			{
				//\u663E\u793A\u548C\u4FDD\u5B58\u63D0\u793A\u4FE1\u606F
				$("#fv_content").html(showmsg);
				elem.Tooltip = showmsg;
				if(showclass!="onError"){tip.hide();}
			}
			tip.removeClass();
			tip.addClass( showclass );
			tip.html( showmsg );
		}
	},
		
	resetTipState : function(validatorgroup)
	{
		var initConfig = $.formValidator.getInitConfig(validatorgroup);
		$(initConfig.validobjectids).each(function(){
			$.formValidator.setTipState(this,"onShow",this.settings[0].onshow);	
		});
	},
	
	//\u8BBE\u7F6E\u9519\u8BEF\u7684\u663E\u793A\u4FE1\u606F
	setFailState : function(tipid,showmsg)
	{
	    var tip = $("#"+tipid);
	    tip.removeClass();
	    tip.addClass("onError");
	    tip.html(showmsg);
	},

	//\u6839\u636E\u5355\u4E2A\u5BF9\u8C61,\u6B63\u786E:\u6B63\u786E\u63D0\u793A,\u9519\u8BEF:\u9519\u8BEF\u63D0\u793A
	showMessage : function(returnObj)
	{
	    var id = returnObj.id;
		var elem = $("#"+id).get(0);
		var isvalid = returnObj.isvalid;
		var setting = returnObj.setting;//\u6B63\u786E:setting[0],\u9519\u8BEF:\u5BF9\u5E94\u7684setting[i]
		var showmsg = "",showclass = "";
		var settings = $("#"+id).get(0).settings;
		var intiConfig = $.formValidator.getInitConfig(settings[0].validatorgroup);
		if (!isvalid)
		{		
			showclass = "onError";
			if(setting.validatetype=="AjaxValidator")
			{
				if(setting.lastValid=="")
				{
				    showclass = "onLoad";
				    showmsg = setting.onwait;
				}
				else
				{
				    showmsg = setting.onerror;
				}
			}
			else
			{
				showmsg = (returnObj.errormsg==""? setting.onerror : returnObj.errormsg);
				
			}
			if(intiConfig.alertmessage)		
			{
				var elem = $("#"+id).get(0);
				if(elem.validoldvalue!=$(elem).val()){hiAlert(showmsg,'\u63D0\u793A\u4FE1\u606F');}   
			}
			else
			{
				$.formValidator.setTipState(elem,showclass,showmsg);
			}
		}
		else
		{		
			//\u9A8C\u8BC1\u6210\u529F\u540E,\u5982\u679C\u6CA1\u6709\u8BBE\u7F6E\u6210\u529F\u63D0\u793A\u4FE1\u606F,\u5219\u7ED9\u51FA\u9ED8\u8BA4\u63D0\u793A,\u5426\u5219\u7ED9\u51FA\u81EA\u5B9A\u4E49\u63D0\u793A;\u5141\u8BB8\u4E3A\u7A7A,\u503C\u4E3A\u7A7A\u7684\u63D0\u793A
			showmsg = $.formValidator.isEmpty(id) ? setting.onempty : setting.oncorrect;
			$.formValidator.setTipState(elem,"onCorrect",showmsg);
		}
		return showmsg;
	},

	showAjaxMessage : function(returnObj)
	{
		var setting = returnObj.setting;
		var elem = $("#"+returnObj.id).get(0);
		if(elem.validoldvalue!=$(elem).val())
		{
			$.formValidator.ajaxValid(returnObj);
		}
		else
		{
			if(setting.isvalid!=undefined && !setting.isvalid){
				elem.lastshowclass = "onError"; 
				elem.lastshowmsg = setting.onerror;
			}
			$.formValidator.setTipState(elem,elem.lastshowclass,elem.lastshowmsg);
		}
	},

	//\u83B7\u53D6\u6307\u5B9A\u5B57\u7B26\u4E32\u7684\u957F\u5EA6
    getLength : function(id)
    {
        var srcjo = $("#"+id);
		var elem = srcjo.get(0);
        sType = elem.type;
        var len = 0;
        switch(sType)
		{
			case "text":
			case "hidden":
			case "password":
			case "textarea":
			case "file":
		        var val = srcjo.val();
				var initConfig = $.formValidator.getInitConfig(elem.settings[0].validatorgroup);
				if (initConfig.wideword)
				{
					for (var i = 0; i < val.length; i++) 
					{
						if (val.charCodeAt(i) >= 0x4e00 && val.charCodeAt(i) <= 0x9fa5){ 
							len += 2;
						}else {
							len++;
						}
					}
				}
				else{
					len = val.length;
				}
		        break;
			case "checkbox":
			case "radio": 
				len = $("input[@type='"+sType+"'][@name='"+srcjo.attr("name")+"'][@checked]").length;
				break;
		    case "select-one":
		        len = elem.options ? elem.options.selectedIndex : -1;
				break;
			case "select-multiple":
				len = $("select[@name="+elem.name+"] option[@selected]").length;
				break;
	    }
		return len;
    },
    
	//\u7ED3\u5408empty\u8FD9\u4E2A\u5C5E\u6027\uFF0C\u5224\u65AD\u4EC5\u4EC5\u662F\u5426\u4E3A\u7A7A\u7684\u6821\u9A8C\u60C5\u51B5\u3002
    isEmpty : function(id)
    {
        if($("#"+id).get(0).settings[0].empty && $.formValidator.getLength(id)==0){
            return true;
        }else{
            return false;
		}
    },
    
	//\u5BF9\u5916\u8C03\u7528\uFF1A\u5224\u65AD\u5355\u4E2A\u8868\u5355\u5143\u7D20\u662F\u5426\u9A8C\u8BC1\u901A\u8FC7\uFF0C\u4E0D\u5E26\u56DE\u8C03\u51FD\u6570
    isOneValid : function(id)
    {
	    return $.formValidator.oneIsValid(id,1).isvalid;
    },
    
	//\u9A8C\u8BC1\u5355\u4E2A\u662F\u5426\u9A8C\u8BC1\u901A\u8FC7,\u6B63\u786E\u8FD4\u56DEsettings[0],\u9519\u8BEF\u8FD4\u56DE\u5BF9\u5E94\u7684settings[i]
	oneIsValid : function (id,index)
	{
		var returnObj = new Object();
		returnObj.id = id;
		returnObj.ajax = -1;
		returnObj.errormsg = "";       //\u81EA\u5B9A\u4E49\u9519\u8BEF\u4FE1\u606F
		var elem = $("#"+id).get(0);
	    var settings = elem.settings;
	    var settingslen = settings.length;
		//\u53EA\u6709\u4E00\u4E2AformValidator\u7684\u65F6\u5019\u4E0D\u68C0\u9A8C
		if (settingslen==1){settings[0].bind=false;}
		if(!settings[0].bind){return null;}
		for ( var i = 0 ; i < settingslen ; i ++ )
		{   
			if(i==0){
				if($.formValidator.isEmpty(id)){
					returnObj.isvalid = true;
					returnObj.setting = settings[0];
					break;
				}
				continue;
			}
			returnObj.setting = settings[i];
			if(settings[i].validatetype!="AjaxValidator") {
				$.formValidator.triggerValidate(returnObj);
			}else{
				returnObj.ajax = i;
			}
			if(!settings[i].isvalid) {
				returnObj.isvalid = false;
				returnObj.setting = settings[i];
				break;
			}else{
				returnObj.isvalid = true;
				returnObj.setting = settings[0];
				if(settings[i].validatetype=="AjaxValidator") break;
			}
		}
		return returnObj;
	},

	//\u9A8C\u8BC1\u6240\u6709\u9700\u8981\u9A8C\u8BC1\u7684\u5BF9\u8C61\uFF0C\u5E76\u8FD4\u56DE\u662F\u5426\u9A8C\u8BC1\u6210\u529F\u3002
	pageIsValid : function (validatorgroup)
	{
	    if(validatorgroup == null || validatorgroup == undefined){validatorgroup = "1"};
		var isvalid = true;
		var thefirstid = "",thefirsterrmsg;
		var returnObj,setting;
		var error_tip = "^"; 	

		var initConfig = $.formValidator.getInitConfig(validatorgroup);
		var jqObjs = $(initConfig.validobjectids);
		jqObjs.each(function(i,elem)
		{
			if(elem.settings[0].bind){
				returnObj = $.formValidator.oneIsValid(elem.id,1);
				if(returnObj)
				{
					var tipid = elem.settings[0].tipid;
					//\u6821\u9A8C\u5931\u8D25,\u83B7\u53D6\u7B2C\u4E00\u4E2A\u53D1\u751F\u9519\u8BEF\u7684\u4FE1\u606F\u548CID
					if (!returnObj.isvalid) {
						isvalid = false;
						if (thefirstid == ""){
							thefirstid = returnObj.id;
							thefirsterrmsg = (returnObj.errormsg==""?returnObj.setting.onerror:returnObj.errormsg)
						}
					}
					//\u4E3A\u4E86\u89E3\u51B3\u4F7F\u7528\u540C\u4E2ATIP\u63D0\u793A\u95EE\u9898:\u540E\u9762\u7684\u6210\u529F\u6216\u5931\u8D25\u90FD\u4E0D\u8986\u76D6\u524D\u9762\u7684\u5931\u8D25
					if (!initConfig.alertmessage){
						if (error_tip.indexOf("^" + tipid + "^") == -1) {
							if (!returnObj.isvalid) {
								error_tip = error_tip + tipid + "^";
							}
							$.formValidator.showMessage(returnObj);
						}
					}
				}
			}
		});
		//\u6210\u529F\u6216\u5931\u8D25\u540E\uFF0C\u8FDB\u884C\u56DE\u8C03\u51FD\u6570\u7684\u5904\u7406\uFF0C\u4EE5\u53CA\u6210\u529F\u540E\u7684\u7070\u6389\u63D0\u4EA4\u6309\u94AE\u7684\u529F\u80FD
		if(isvalid)
		{
            isvalid = initConfig.onsuccess();
			if(initConfig.submitonce){$("input[@type='submit']").attr("disabled",true);}
		}
		else
		{
			var obj = $("#"+thefirstid).get(0);
			initConfig.onerror(thefirsterrmsg,obj);
			if(thefirstid!="" && initConfig.errorfocus){$("#"+thefirstid).focus();}
		}
		return !initConfig.debug && isvalid;
	},

	//ajax\u6821\u9A8C
	ajaxValid : function(returnObj)
	{
		var id = returnObj.id;
	    var srcjo = $("#"+id);
		var elem = srcjo.get(0);
		var settings = elem.settings;
		var setting = settings[returnObj.ajax];
		var ls_url = setting.url;
	    if (srcjo.size() == 0 && settings[0].empty) {
			returnObj.setting = settings[0];
			returnObj.isvalid = true;
			$.formValidator.showMessage(returnObj);
			setting.isvalid = true;
			return;
		}
		if(setting.addidvalue)
		{
			var parm = "clientid="+id+"&"+id+"="+encodeURIComponent(srcjo.val());
			ls_url = ls_url + (ls_url.indexOf("?")>0?("&"+ parm) : ("?"+parm));
		}
		$.ajax(
		{	
			mode : "abort",
			type : setting.type, 
			url : ls_url, 
			cache : setting.cache,
			data : setting.data, 
			async : setting.async, 
			dataType : setting.datatype, 
			success : function(data){
			    if(setting.success(data))
			    {
			        $.formValidator.setTipState(elem,"onCorrect",settings[0].oncorrect);
			        setting.isvalid = true;
			    }
			    else
			    {
			        $.formValidator.setTipState(elem,"onError",setting.onerror);
			        setting.isvalid = false;
			    }
			},
			complete : function(){
				if(setting.buttons && setting.buttons.length > 0){setting.buttons.attr({"disabled":false})};
				setting.complete;
			}, 
			beforeSend : function(xhr){
				//\u518D\u670D\u52A1\u5668\u6CA1\u6709\u8FD4\u56DE\u6570\u636E\u4E4B\u524D\uFF0C\u5148\u56DE\u8C03\u63D0\u4EA4\u6309\u94AE
				if(setting.buttons && setting.buttons.length > 0){setting.buttons.attr({"disabled":true})};
				var isvalid = setting.beforesend(xhr);
				if(isvalid)
				{
					setting.isvalid = false;		//\u5982\u679C\u524D\u9762ajax\u8BF7\u6C42\u6210\u529F\u4E86\uFF0C\u518D\u6B21\u8BF7\u6C42\u4E4B\u524D\u5148\u5F53\u4F5C\u9519\u8BEF\u5904\u7406
					$.formValidator.setTipState(elem,"onLoad",settings[returnObj.ajax].onwait);
				}
				setting.lastValid = "-1";
				return isvalid;
			}, 
			error : function(){
			    $.formValidator.setTipState(elem,"onError",setting.onerror);
			    setting.isvalid = false;
				setting.error();
			},
			processData : setting.processdata 
		});
	},

	//\u5BF9\u6B63\u5219\u8868\u8FBE\u5F0F\u8FDB\u884C\u6821\u9A8C\uFF08\u76EE\u524D\u53EA\u9488\u5BF9input\u548Ctextarea\uFF09
	regexValid : function(returnObj)
	{
		var id = returnObj.id;
		var setting = returnObj.setting;
		var srcTag = $("#"+id).get(0).tagName;
		var elem = $("#"+id).get(0);
		//\u5982\u679C\u6709\u8F93\u5165\u6B63\u5219\u8868\u8FBE\u5F0F\uFF0C\u5C31\u8FDB\u884C\u8868\u8FBE\u5F0F\u6821\u9A8C
		if(elem.settings[0].empty && elem.value==""){
			setting.isvalid = true;
		}
		else 
		{
			var regexpress = setting.regexp;
			if(setting.datatype=="enum"){regexpress = eval("regexEnum."+regexpress);}
			if(regexpress==undefined || regexpress==""){
				setting.isvalid = false;
				return;
			}
			setting.isvalid = (new RegExp(regexpress, setting.param)).test($("#"+id).val());
		}
	},
	
	//\u51FD\u6570\u6821\u9A8C\u3002\u8FD4\u56DEtrue/false\u8868\u793A\u6821\u9A8C\u662F\u5426\u6210\u529F;\u8FD4\u56DE\u5B57\u7B26\u4E32\u8868\u793A\u9519\u8BEF\u4FE1\u606F\uFF0C\u6821\u9A8C\u5931\u8D25;\u5982\u679C\u6CA1\u6709\u8FD4\u56DE\u503C\u8868\u793A\u5904\u7406\u51FD\u6570\uFF0C\u6821\u9A8C\u6210\u529F
	functionValid : function(returnObj)
	{
		var id = returnObj.id;
		var setting = returnObj.setting;
	    var srcjo = $("#"+id);
		var lb_ret = setting.fun(srcjo.val(),srcjo.get(0));
		if(lb_ret != undefined) 
		{
			if(typeof lb_ret == "string"){
				setting.isvalid = false;
				returnObj.errormsg = lb_ret;
			}else{
				setting.isvalid = lb_ret;
			}
		}
	},
	
	//\u5BF9input\u548Cselect\u7C7B\u578B\u63A7\u4EF6\u8FDB\u884C\u6821\u9A8C
	inputValid : function(returnObj)
	{
		var id = returnObj.id;
		var setting = returnObj.setting;
		var srcjo = $("#"+id);
		var elem = srcjo.get(0);
		var val = srcjo.val();
		var sType = elem.type;
		var len = $.formValidator.getLength(id);
		var empty = setting.empty,emptyerror = false;
		switch(sType)
		{
			case "text":
			case "hidden":
			case "password":
			case "textarea":
			case "file":
				if (setting.type == "size") {
					empty = setting.empty;
					if(!empty.leftempty){
						emptyerror = (val.replace(/^[ \s]+/, '').length != val.length);
					}
					if(!emptyerror && !empty.rightempty){
						emptyerror = (val.replace(/[ \s]+$/, '').length != val.length);
					}
					if(emptyerror && empty.emptyerror){returnObj.errormsg= empty.emptyerror}
				}
			case "checkbox":
			case "select-one":
			case "select-multiple":
			case "radio":
				var lb_go_on = false;
				if(sType=="select-one" || sType=="select-multiple"){setting.type = "size";}
				var type = setting.type;
				if (type == "size") {		//\u83B7\u5F97\u8F93\u5165\u7684\u5B57\u7B26\u957F\u5EA6\uFF0C\u5E76\u8FDB\u884C\u6821\u9A8C
					if(!emptyerror){lb_go_on = true}
					if(lb_go_on){val = len}
				}
				else if (type =="date" || type =="datetime")
				{
					var isok = false;
					if(type=="date"){lb_go_on = isDate(val)};
					if(type=="datetime"){lb_go_on = isDate(val)};
					if(lb_go_on){val = new Date(val);setting.min=new Date(setting.min);setting.max=new Date(setting.max);};
				}else{
					stype = (typeof setting.min);
					if(stype =="number")
					{
						val = (new Number(val)).valueOf();
						if(!isNaN(val)){lb_go_on = true;}
					}
					if(stype =="string"){lb_go_on = true;}
				}
				setting.isvalid = false;
				if(lb_go_on)
				{
					if(val < setting.min || val > setting.max){
						if(val < setting.min && setting.onerrormin){
							returnObj.errormsg= setting.onerrormin;
						}
						if(val > setting.min && setting.onerrormax){
							returnObj.errormsg= setting.onerrormax;
						}
					}
					else{
						setting.isvalid = true;
					}
				}
				break;
		}
	},
	
	compareValid : function(returnObj)
	{
		var id = returnObj.id;
		var setting = returnObj.setting;
		var srcjo = $("#"+id);
	    var desjo = $("#"+setting.desid );
		var ls_datatype = setting.datatype;
	    setting.isvalid = false;
		curvalue = srcjo.val();
		ls_data = desjo.val();
		if(ls_datatype=="number")
        {
            if(!isNaN(curvalue) && !isNaN(ls_data)){
				curvalue = parseFloat(curvalue);
                ls_data = parseFloat(ls_data);
			}
			else{
			    return;
			}
        }
		if(ls_datatype=="date" || ls_datatype=="datetime")
		{
			var isok = false;
			if(ls_datatype=="date"){isok = (isDate(curvalue) && isDate(ls_data))};
			if(ls_datatype=="datetime"){isok = (isDateTime(curvalue) && isDateTime(ls_data))};
			if(isok){
				curvalue = new Date(curvalue);
				ls_data = new Date(ls_data)
			}
			else{
				return;
			}
		}
		
	    switch(setting.operateor)
	    {
	        case "=":
	            if(curvalue == ls_data){setting.isvalid = true;}
	            break;
	        case "!=":
	            if(curvalue != ls_data){setting.isvalid = true;}
	            break;
	        case ">":
	            if(curvalue > ls_data){setting.isvalid = true;}
	            break;
	        case ">=":
	            if(curvalue >= ls_data){setting.isvalid = true;}
	            break;
	        case "<": 
	            if(curvalue < ls_data){setting.isvalid = true;}
	            break;
	        case "<=":
	            if(curvalue <= ls_data){setting.isvalid = true;}
	            break;
	    }
	},
	
	localTooltip : function(e)
	{
		e = e || window.event;
		var mouseX = e.pageX || (e.clientX ? e.clientX + document.body.scrollLeft : 0);
		var mouseY = e.pageY || (e.clientY ? e.clientY + document.body.scrollTop : 0);
		$("#fvtt").css({"top":(mouseY+2)+"px","left":(mouseX-40)+"px"});
	}
};

//\u6BCF\u4E2A\u6821\u9A8C\u63A7\u4EF6\u5FC5\u987B\u521D\u59CB\u5316\u7684
$.fn.formValidator = function(cs) 
{
	var setting = 
	{
		validatorgroup : "1",
		empty :false,
		submitonce : false,
		automodify : false,
		onshow :"\u8BF7\u8F93\u5165\u5185\u5BB9",
		onfocus: "\u8BF7\u8F93\u5165\u5185\u5BB9",
		oncorrect: "\u8F93\u5165\u6B63\u786E",
		onempty: "\u8F93\u5165\u5185\u5BB9\u4E3A\u7A7A",
		defaultvalue : null,
		bind : true,
		validatetype : "InitValidator",
		tipcss : 
		{
			"left" : "10px",
			"top" : "1px",
			"height" : "20px",
			"width":"250px"
		},
		triggerevent:"blur",
		forcevalid : false
	};

	//\u83B7\u53D6\u8BE5\u6821\u9A8C\u7EC4\u7684\u5168\u5C40\u914D\u7F6E\u4FE1\u606F
	cs = cs || {};
	if(cs.validatorgroup == undefined){cs.validatorgroup = "1"};
	var initConfig = $.formValidator.getInitConfig(cs.validatorgroup);

	//\u5982\u679C\u4E3A\u7CBE\u7B80\u6A21\u5F0F\uFF0Ctipcss\u8981\u91CD\u65B0\u8BBE\u7F6E\u521D\u59CB\u503C
	if(initConfig.tidymode){setting.tipcss = {"left" : "2px","width":"22px","height":"22px","display":"none"}};
	
	//\u5148\u5408\u5E76\u6574\u4E2A\u914D\u7F6E(\u6DF1\u5EA6\u62F7\u8D1D)
	$.extend(true,setting, cs);

	return this.each(function(e)
	{
		var jqobj = $(this);
		var setting_temp = {};
		$.extend(true,setting_temp, setting);
		var tip = setting_temp.tipid ? setting_temp.tipid : this.id+"Tip";
		//\u81EA\u52A8\u5F62\u6210TIP
		if(initConfig.autotip)
		{
			//\u83B7\u53D6\u5C42\u7684ID\u3001\u76F8\u5BF9\u5B9A\u4F4D\u63A7\u4EF6\u7684ID\u548C\u5750\u6807
			if($("body [id="+tip+"]").length==0)
			{
				aftertip = setting_temp.relativeid ? setting_temp.relativeid : this.id;
				var obj = getTopLeft(aftertip);
				var y = obj.top;
				var x = getElementWidth(aftertip) + obj.left;
				$("<div class='formValidateTip'></div>").appendTo($("body")).css({left: x+"px", top: y+"px"}).prepend($('<div id="'+tip+'"></div>').css(setting_temp.tipcss));
			}
			if(initConfig.tidymode){jqobj.showTooltips()};
		}
		
		//\u6BCF\u4E2A\u63A7\u4EF6\u90FD\u8981\u4FDD\u5B58\u8FD9\u4E2A\u914D\u7F6E\u4FE1\u606F
		setting.tipid = tip;
		$.formValidator.appendValid(this.id,setting);

		//\u4FDD\u5B58\u63A7\u4EF6ID
		var validobjectids = initConfig.validobjectids;
		if(validobjectids.indexOf("#"+this.id+" ")==-1){
			initConfig.validobjectids = (validobjectids=="" ? "#"+this.id : validobjectids + ",#" + this.id);
		}

		//\u521D\u59CB\u5316\u663E\u793A\u4FE1\u606F
		if(!initConfig.alertmessage){
			$.formValidator.setTipState(this,"onShow",setting.onshow);
		}

		var srcTag = this.tagName.toLowerCase();
		var stype = this.type;
		var defaultval = setting.defaultvalue;
		//\u5904\u7406\u9ED8\u8BA4\u503C
		if(defaultval){
			jqobj.val(defaultval);
		}

		if(srcTag == "input" || srcTag=="textarea")
		{
			//\u6CE8\u518C\u83B7\u5F97\u7126\u70B9\u7684\u4E8B\u4EF6\u3002\u6539\u53D8\u63D0\u793A\u5BF9\u8C61\u7684\u6587\u5B57\u548C\u6837\u5F0F\uFF0C\u4FDD\u5B58\u539F\u503C
			jqobj.focus(function()
			{	
				if(!initConfig.alertmessage){
					//\u4FDD\u5B58\u539F\u6765\u7684\u72B6\u6001
					var tipjq = $("#"+tip);
					this.lastshowclass = tipjq.attr("class");
					this.lastshowmsg = tipjq.html();
					$.formValidator.setTipState(this,"onFocus",setting.onfocus);
				}
				if (stype == "password" || stype == "text" || stype == "textarea" || stype == "file") {
					this.validoldvalue = jqobj.val();
				}
			});
			//\u6CE8\u518C\u5931\u53BB\u7126\u70B9\u7684\u4E8B\u4EF6\u3002\u8FDB\u884C\u6821\u9A8C\uFF0C\u6539\u53D8\u63D0\u793A\u5BF9\u8C61\u7684\u6587\u5B57\u548C\u6837\u5F0F\uFF1B\u51FA\u9519\u5C31\u63D0\u793A\u5904\u7406
			jqobj.bind(setting.triggerevent, function(){
				var settings = this.settings;
				var returnObj = $.formValidator.oneIsValid(this.id,1);
				if(returnObj==null){return;}
				if(returnObj.ajax >= 0) 
				{
					$.formValidator.showAjaxMessage(returnObj);
				}
				else
				{
					var showmsg = $.formValidator.showMessage(returnObj);
					if(!returnObj.isvalid)
					{
						//\u81EA\u52A8\u4FEE\u6B63\u9519\u8BEF
						var auto = setting.automodify && (this.type=="text" || this.type=="textarea" || this.type=="file");
						if(auto && !initConfig.alertmessage)
						{
							hiAlert(showmsg,'\u63D0\u793A\u4FE1\u606F');
							$.formValidator.setTipState(this,"onShow",setting.onshow);
						}
						else
						{
							if(initConfig.forcevalid || setting.forcevalid){
								hiAlert(showmsg,'\u63D0\u793A\u4FE1\u606F');this.focus();
							}
						}
					}
				}
			});
		} 
		else if (srcTag == "select")
		{
			//\u83B7\u5F97\u7126\u70B9
			jqobj.bind("focus", function(){	
				if(!initConfig.alertmessage){
					$.formValidator.setTipState(this,"onFocus",setting.onfocus);
				}
			});
			//\u5931\u53BB\u7126\u70B9
			jqobj.bind("blur",function(){jqobj.trigger("change")});
			//\u9009\u62E9\u9879\u76EE\u540E\u89E6\u53D1
			jqobj.bind("change",function()
			{
				var returnObj = $.formValidator.oneIsValid(this.id,1);	
				if(returnObj==null){return;}
				if ( returnObj.ajax >= 0){
					$.formValidator.showAjaxMessage(returnObj);
				}else{
					$.formValidator.showMessage(returnObj); 
				}
			});
		}
	});
}; 

$.fn.inputValidator = function(controlOptions)
{
	var settings = 
	{
		isvalid : false,
		min : 0,
		max : 99999999999999,
		type : "size",
		onerror:"\u8F93\u5165\u9519\u8BEF",
		validatetype:"InputValidator",
		empty:{leftempty:true,rightempty:true,leftemptyerror:null,rightemptyerror:null},
		wideword:true
	};
	controlOptions = controlOptions || {};
	$.extend(true, settings, controlOptions);
	return this.each(function(){
		$.formValidator.appendValid(this.id,settings);
	});
};

$.fn.compareValidator = function(controlOptions)
{
	var settings = 
	{
		isvalid : false,
		desid : "",
		operateor :"=",
		onerror:"\u8F93\u5165\u9519\u8BEF",
		validatetype:"CompareValidator"
	};
	controlOptions = controlOptions || {};
	$.extend(true, settings, controlOptions);
	return this.each(function(){
		$.formValidator.appendValid(this.id,settings);
	});
};

$.fn.regexValidator = function(controlOptions)
{
	var settings = 
	{
		isvalid : false,
		regexp : "",
		param : "i",
		datatype : "string",
		onerror:"\u8F93\u5165\u7684\u683C\u5F0F\u4E0D\u6B63\u786E",
		validatetype:"RegexValidator"
	};
	controlOptions = controlOptions || {};
	$.extend(true, settings, controlOptions);
	return this.each(function(){
		$.formValidator.appendValid(this.id,settings);
	});
};

$.fn.functionValidator = function(controlOptions)
{
	var settings = 
	{
		isvalid : true,
		fun : function(){this.isvalid = true;},
		validatetype:"FunctionValidator",
		onerror:"\u8F93\u5165\u9519\u8BEF"
	};
	controlOptions = controlOptions || {};
	$.extend(true, settings, controlOptions);
	return this.each(function(){
		$.formValidator.appendValid(this.id,settings);
	});
};

$.fn.ajaxValidator = function(controlOptions)
{
	var settings = 
	{
		isvalid : false,
		lastValid : "",
		type : "GET",
		url : "",
		addidvalue : true,
		datatype : "html",
		data : "",
		async : true,
		cache : false,
		beforesend : function(){return true;},
		success : function(){return true;},
		complete : function(){},
		processdata : false,
		error : function(){},
		buttons : null,
		onerror:"\u670D\u52A1\u5668\u6821\u9A8C\u6CA1\u6709\u901A\u8FC7",
		onwait:"\u6B63\u5728\u7B49\u5F85\u670D\u52A1\u5668\u8FD4\u56DE\u6570\u636E",
		validatetype:"AjaxValidator"
	};
	controlOptions = controlOptions || {};
	$.extend(true, settings, controlOptions);
	return this.each(function()
	{
		$.formValidator.appendValid(this.id,settings);
	});
};

$.fn.defaultPassed = function(onshow)
{
	return this.each(function()
	{
		var settings = this.settings;
		for ( var i = 1 ; i < settings.length ; i ++ )
		{   
			settings[i].isvalid = true;
			if(!$.formValidator.getInitConfig(settings[0].validatorgroup).alertmessage){
				var ls_style = onshow ? "onShow" : "onCorrect";
				$.formValidator.setTipState(this,ls_style,settings[0].oncorrect);
			}
		}
	});
};

$.fn.unFormValidator = function(unbind)
{
	return this.each(function()
	{
		this.settings[0].bind = !unbind;
		if(unbind){
			$("#"+this.settings[0].tipid).hide();
		}else{
			$("#"+this.settings[0].tipid).show();
		}
	});
};

$.fn.showTooltips = function()
{
	if($("body [id=fvtt]").length==0){
		fvtt = $("<div id='fvtt' style='position:absolute;z-index:56002'></div>");
		$("body").append(fvtt);
		fvtt.before("<iframe src='about:blank' class='fv_iframe' scrolling='no' frameborder='0'></iframe>");
		
	}
	return this.each(function()
	{
		jqobj = $(this);
		s = $("<span class='top' id=fv_content style='display:block'></span>");
		b = $("<b class='bottom' style='display:block' />");
		this.tooltip = $("<span class='fv_tooltip' style='display:block'></span>").append(s).append(b).css({"filter":"alpha(opacity:95)","KHTMLOpacity":"0.95","MozOpacity":"0.95","opacity":"0.95"});
		//\u6CE8\u518C\u4E8B\u4EF6
		jqobj.mouseover(function(e){
			$("#fvtt").append(this.tooltip);
			$("#fv_content").html(this.Tooltip);
			$.formValidator.localTooltip(e);
		});
		jqobj.mouseout(function(){
			$("#fvtt").empty();
		});
		jqobj.mousemove(function(e){
			$("#fv_content").html(this.Tooltip);
			$.formValidator.localTooltip(e);
		});
	});
}

})(jQuery);

function getElementWidth(objectId) {
	x = document.getElementById(objectId);
	return x.offsetWidth;
}

function getTopLeft(objectId) {
	obj = new Object();
	o = document.getElementById(objectId);
	oLeft = o.offsetLeft;
	oTop = o.offsetTop;
	while(o.offsetParent!=null) {
		oParent = o.offsetParent;
		oLeft += oParent.offsetLeft;
		oTop += oParent.offsetTop;
		o = oParent;
	}
	obj.top = oTop;
	obj.left = oLeft;
	return obj;
}
/*
 * //校验职级
//伙伴职级levelmap_A
var levelmap_A = [];
levelmap_A['NAC1']=1;
levelmap_A['NAC2']=2;
levelmap_A['AM']=3;
levelmap_A['UM']=4;
levelmap_A['OM1']=5;
levelmap_A['OM2']=6;
//金英职级levelmap_L 
var levelmap_L = [];
levelmap_L['SL']=3;
levelmap_L['SM']=4;
levelmap_L['SD']=5;
//获取职级对应的级别数
//agentlevelcode:本人职级
//不同基本法的职级
function getlevelseq(agentlevelcode,levelmap){
	var result=0;
	for(var key in levelmap){
		if(key==agentlevelcode){result=levelmap[key]; break;}
	}
	return result;
};
//校验职级：上级管理人是否合法
//agentlevelcode:本人职级
//mgrlevelcode:上级职级 
function checkAgentlevelcode_M(agentlevelcode,mgrlevelcode){
//	alert('agentlevelcode:'+agentlevelcode+',mgrlevelcode:'+mgrlevelcode)
	if(agentlevelcode=='SL'||agentlevelcode=='SM'||agentlevelcode=='SD'){//金英:总监皆可
//		alert('jinying');
		return mgrlevelcode=='OM1'||mgrlevelcode=='OM2'?true:false;
	}	
	if(getlevelseq(agentlevelcode,levelmap_A)!=0){//上级管理人职级高于该代理人职级且不为顾问
//		alert('huoban');
//		alert('getlevelseq(mgrlevelcode,levelmap_A):'+getlevelseq(mgrlevelcode,levelmap_A));
//		alert('getlevelseq(agentlevelcode,levelmap_A):'+getlevelseq(agentlevelcode,levelmap_A));
			return getlevelseq(mgrlevelcode,levelmap_A)>getlevelseq(agentlevelcode,levelmap_A)
			&&getlevelseq(mgrlevelcode,levelmap_A)>=3?true:false;
	}

}
//校验职级：育成人是否合法
//agentlevelcode:本人职级
//mgrlevelcode:上级职级 
function checkAgentlevelcode_C(agentlevelcode,curlevelcode){
//	if(getlevelseq(agentlevelcode,levelmap_A)!=0){//不高于且非顾问.顾问没有管理人
//		return getlevelseq(curlevelcode,levelmap_A)>=getlevelseq(agentlevelcode,levelmap_A)
//		&&getlevelseq(agentlevelcode,levelmap_A)>=3
//		&&getlevelseq(curlevelcode,levelmap_A)>=3?true:false;
//		
//	}else if(getlevelseq(agentlevelcode,levelmap_L)!=0){//金英:是个主管就行
//		return curlevelcode!='NAC1' && curlevelcode!='NAC2'?true:false;
//	}
	if(agentlevelcode=='SL'||agentlevelcode=='SM'||agentlevelcode=='SD'){//金英:是个主管就行
		return curlevelcode!='NAC1' && curlevelcode!='NAC2'?true:false;
	}	
	if(getlevelseq(agentlevelcode,levelmap_A)!=0){//不高于且非顾问.顾问没有管理人
			return getlevelseq(curlevelcode,levelmap_A)>=getlevelseq(agentlevelcode,levelmap_A)
			&&getlevelseq(agentlevelcode,levelmap_A)>=3
			&&getlevelseq(curlevelcode,levelmap_A)>=3?true:false;
	}
}
 * */

//利用正确的身份证id，获取出生日期和性别这两个信息
function getIdcardMSG(idno,gender,birthday){
		$('#'+gender).attr('value',getGender(idno));
		$('#'+birthday).attr('value',getBirthday(idno));
}
//验证是否中国大陆的身份证
function isChinaIDCard(strIdno){
	  if(null==strIdno||jQuery.trim(strIdno)==''){
		  //alert('身份证格式不对');//alert('idno不能为空');
            return false;
	  }
	  strIdno = strIdno.toString();
	  if(strIdno.length == 15){        
	   if(!isValidDate("19"+strIdno.substr(6,2),strIdno.substr(8,2),strIdno.substr(10,2))){
            return false;}      
	  }else if(strIdno.length == 18){     
	   if (!isValidDate(strIdno.substr(6,4),strIdno.substr(10,2),strIdno.substr(12,2))){
            return false;}   
	   }else{   
	   //alert('身份证格式不对');//alert("输入的身份证号码必须为15位或者18位！");   
	   
            return false;
	   }
	  
	if (strIdno.length==18)   
	  {   
	var a,b,c  ; 
	if (!isNumber(strIdno.substr(0,17))){//alert('身份证格式不对');//alert("身份证号码错误,前17位不能含有英文字母！");
            return false;}   
//	a=parseInt(strIdno.substr(0,1))*7+parseInt(strIdno.substr(1,1))*9+parseInt(strIdno.substr(2,1))*10;   
//	a=a+parseInt(strIdno.substr(3,1))*5+parseInt(strIdno.substr(4,1))*8+parseInt(strIdno.substr(5,1))*4;   
//	a=a+parseInt(strIdno.substr(6,1))*2+parseInt(strIdno.substr(7,1))*1+parseInt(strIdno.substr(8,1))*6;     
//	a=a+parseInt(strIdno.substr(9,1))*3+parseInt(strIdno.substr(10,1))*7+parseInt(strIdno.substr(11,1))*9;     
//	a=a+parseInt(strIdno.substr(12,1))*10+parseInt(strIdno.substr(13,1))*5+parseInt(strIdno.substr(14,1))*8;     
//	a=a+parseInt(strIdno.substr(15,1))*4+parseInt(strIdno.substr(16,1))*2;   
//	b=a%11;   
//	if (b==2)   //最后一位为校验位   
//	{   
//	  c=strIdno.substr(17,1).toUpperCase();   //转为大写X   
//	}   
//	else   
//	{   
//	  c=parseInt(strIdno.substr(17,1));   
//	}   
//	switch(b)   
//	{   
//	  case 0: if ( c!=1 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:1");
//            return false;}break;   
//	  case 1: if ( c!=0 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:0");
//            return false;}break;   
//	  case 2: if ( c!="X") {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:X");
//            return false;}break;   
//	  case 3: if ( c!=9 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:9");
//            return false;}break;   
//	  case 4: if ( c!=8 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:8");
//            return false;}break;   
//	  case 5: if ( c!=7 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:7");
//            return false;}break;   
//	  case 6: if ( c!=6 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:6");
//            return false;}break;   
//	  case 7: if ( c!=5 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:5");
//            return false;}break;   
//	  case 8: if ( c!=4 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:4");
//            return false;}break;   
//	  case 9: if ( c!=3 )  {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:3");
//            return false;}break;   
//	  case 10: if ( c!=2 ) {//alert('身份证格式不对');//alert("身份证好号码校验位错:最后一位应该为:2");
//            return false;}   
//	}   
	  } else {//15位身份证号   
	if (!isNumber(strIdno)) {//alert('身份证格式不对');//alert("身份证号码错误,前15位不能含有英文字母！");
            return false;}     
	  }  
//	  alert('身份证格式不对');//alert('身份证格式正确'); 
	  return true;
} 
	/**
	 * 检验是不是合法日期
	 */
	  function isValidDate(iY, iM, iD) {
	   if (iY>2200 || iY<1900 || !isNumber(iY)){
	            alert("输入身份证号,年度"+iY+"非法！");
	            return false;
	        }
	   if (iM>12 || iM<=0 || !isNumber(iM)){
	            alert("输入身份证号,月份"+iM+"非法！");
	            return false;
	        }
	   if (iD>31 || iD<=0 || !isNumber(iD)){
	            alert("输入身份证号,日期"+iD+"非法！");
	            return false;
	        }
	  return true;
	  }  
	/**
	* 验证是不是数字
	*/
	function isNumber(oNum) { 
	  if(!oNum) return false; 
	  var strP=/^\d+(\.\d+)?$/; 
	  if(!strP.test(oNum)) return false; 
	  try{ 
	  if(parseFloat(oNum)!=oNum) return false; 
	  } 
	  catch(ex) 
	  { 
	   return false; 
	  } 
	  return true; 
	}
	
	//根据正确的身份证，获取生日
	function getBirthday(strIdno){
		var birthday="";
		var num=0;
		if(strIdno.length==15){//15位
			birthday = strIdno.charAt(6)+strIdno.charAt(7);
			if(parseInt(birthday)<=10){
				 birthday = '20'+birthday;
			}else {
				birthday = '19'+birthday;
			}
		}else{//18位
			birthday=strIdno.charAt(6)+strIdno.charAt(7)+strIdno.charAt(8)+strIdno.charAt(9);
			num=2;
		}
		birthday=birthday+'-'+strIdno.charAt(num+8)+strIdno.charAt(num+9)+'-'+strIdno.charAt(num+10)+strIdno.charAt(num+11);
		return birthday;
	}
	//根据正确的身份证，获取性别
	function getGender(strIdno){
	    var MALE='GENDER_1';
		var FEMALE='GENDER_2';
		var num = strIdno.length==18?2:0;
		if(parseInt(strIdno.charAt(num+14)/2)*2!=strIdno.charAt(num+14)){
			return MALE;//男
		}else{
			return FEMALE;//女
		}
	}
	
	function isEmpty(value){//如果value值是null值或者空字符串，返回false，否则返回true
		return 	(null!=value&&''!=jQuery.trim(value));
	}
	 
	
	
