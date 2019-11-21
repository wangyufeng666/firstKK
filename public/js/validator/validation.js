/*
 * Really easy field validation with Prototype
 * http://tetlaw.id.au/view/blog/really-easy-field-validation-with-prototype
 * Andrew Tetlaw
 *
 * Copyright (c) 2006 Andrew Tetlaw
 * http://www.opensource.org/licenses/mit-license.php
 */
Validator = Class.create();

Validator.messagesSourceEn = [
	['validation-failed' , 'Validation failed.'],
	['required' , 'This is a required field.'],
	['validate-number' , 'Please enter a valid number in this field.'],
	['validate-digits' , 'Please use numbers only in this field. please avoid spaces or other characters such as dots or commas.'],
	['validate-alpha' , 'Please use letters only (a-z) in this field.'],
	['validate-alphanum' , 'Please use only letters (a-z) or numbers (0-9) only in this field. No spaces or other characters are allowed.'],
	['validate-dateMessage' , 'Please use this date format:'],
	['validate-email' , 'Please enter a valid email address. For example fred@domain.com .'],
	['validate-url' , 'Please enter a valid URL.'],
	['validate-date-au' , 'Please use this date format: dd/mm/yyyy. For example 17/03/2006 for the 17th of March, 2006.'],
	['validate-currency-dollar' , 'Please enter a valid $ amount. For example $100.00 .'],
	['validate-one-required' , 'Please select one of the above options.'],
	['validate-date-cn' , 'Please use this date format: yyyy-mm-dd. For example 2006-03-16.'],
	['validate-integer' , 'Please enter a valid integer in this field'],
	['min-value' , 'min value is %s.'],
	['max-value' , 'max value is %s.'],
	['min-length' , 'min length is %s,current length is %s.'],
	['min-lengthB' , 'min length is %s,chinese is two character.'],
	['max-length' , 'max length is %s,current length is %s.'],
	['max-lengthB', 'max length is %s,chinese is two character.'],
	['int-range' , 'Please enter integer value between %s and %s'],
	['float-range' , 'Please enter number between %s and %s'],
	['length-range' , 'Please enter value length between %s and %s,current length is %s'],
	['lengthB-range', 'Please enter value length between %s and %s,chinese is two character.'],
	['validate-file' , 'Please enter file type in [%s]'],
	['validate-pattern' , 'Validation failed.'],
	['validate-id-number','Please enter a valid id number.'],
	['validate-chinese','Please enter chinese'],
	['validate-ip','Please enter a valid IP address'],
	['validate-phone','Please enter a valid phone number,current length is %s.'],
	['validate-mobile-phone','Please enter a valid mobile phone,For example 13910001000.current length is %s.'],
	['validate-equals','Conflicting with above value.'],
	['less-than','Input value must be less than above value.'],
	['great-than','Input value must be great than above value.'],
	['message-temp-fordate','  For example: '],
	['checkbox-min','Please min select %s of the above options.'],
	['checkbox-max','Please max select %s of the above options.'],
	['checkbox-range','Please select of the above options between %s and %s.'],
	['required-min','%s option must not be null of the above options.'],
	['validate-zip','please enter a valid zip.'],
	['integer-decimal-range','Please enter integer value length is %s decimal length is %s.']

]

Validator.messagesSourceCn = [
	['validation-failed' , '验证失败.'],
	['required' , '请输入值.'],
	['validate-number' , '请输入有效的数字.'],
	['validate-digits' , '请输入一个数字. 避免输入空格],逗号,分号等字符'],
	['validate-alpha' , '请输入英文字母.'],
	['validate-alphanum' , '请输入英文字母或是数字,其它字符是不允许的.'],
	['validate-dateMessage' , '请使用这样的日期格式:'],
	['validate-timeMessage' , '请使用这样的时间格式:'],
	['validate-dateTimeMessage' , '请使用这样的日期时间格式:'],
	['validate-email' , '请输入有效的邮件地址,如 username@example.com.'],
	['validate-url' , '请输入有效的URL地址.'],
	['validate-date-au' , 'Please use this date format: dd/mm/yyyy. For example 17/03/2006 for the 17th of March, 2006.'],
	['validate-currency-dollar' , '请输入有效的数额。例如：100.00'],
	['validate-one-required' , '在左边选项至少选择一个.'],
	['validate-date-cn' , '请使用这样的日期格式: yyyy-mm-dd. 例如:2006-03-17.'],
	['validate-integer' , '请输入正确的整数'],
	['validate-integerB' , '请输入正确的正整数'],
	['validate-integerBA' , '请输入在大于零的正整数'],
	['validate-integerC' , '请输入正确的负整数'],
	['min-value' , '最小值为%s'],
	['max-value' , '最大值为%s'],
	['min-length' , '最小长度为%s,当前长度为%s.'],
	['min-lengthB' , '最小长度为%s,中文算2个字.'],
	['max-length', '最大长度为%s,当前长度为%s.'],
	['max-lengthB', '最大长度为%s,中文算2个字.'],
	['int-range' , '输入值应该为 %s 至 %s 的整数'],
	['float-range' , '输入值应该为 %s 至 %s 的数字'],
	['length-range' , '输入值的长度应该在 %s 至 %s 之间,当前长度为%s'],
	['lengthB-range', '输入值的长度应该在 %s 至 %s 之间,中文算2个字.'],
	['validate-file' , '文件类型应该为[%s]其中之一'],
	['validate-pattern' , '输入的值不匹配'],
	['validate-id-number','请输入合法的身份证号码'],
	['validate-chinese','请输入中文'],
	['validate-ip','请输入正确的IP地址'],
	['validate-phone','请输入正确的电话号码,如:0920-29392929,当前长度为%s.'],
	['validate-mobile-phone','请输入正确的手机号码,当前长度为%s.'],
	['validate-all-phone','请输入正确的电话号码,如:0755-88888888 或者 13988888888'],
	['validate-equals','与上面不一至,请重新输入'],
	['less-than','应该小于前面的值'],
	['less-equals-than','应该小于或者等于前面的值'],
	['great-than','应该大于前面的值'],
	['great-equals-than','应该大于或者等于前面的值'],
	['message-temp-fordate','  例如: '],
	['checkbox-min','在左边选项至少选择%s个'],
	['checkbox-max','在左边选项至多选择%s个'],
	['checkbox-range','在左边选项应该在 %s 个至 %s 个之间.'],
	['required-min','在左边选项至少填写%s项'],
	['validate-zip','请输入正确的邮政编码'],
	['int-zero-right','请输入非负整数'],
	['int-right','请输入正整数'],
	['int-zero-left','请输入非正整数'],
	['int-left','请输入负整数'],
	['float-right','请输入正浮点数'],
	['float-zero-right','请输入非负浮点数'],
	['float-left','请输入负浮点数'],
	['float-zero-left','请输入非正浮点数'],
	['integer-decimal-range',"输入的值整数位长应为 %s,小数位长应为 %s"],
	['comma-format',"请输入正确格式,如:7,2,6"],
	['comma-semicolon-format',"请输入正确格式,如:3,b;anystring,anystring;39,34"],
	['percent-range',"请输入正确范围,大于0至100之间"],
	['percent-rangeB',"请输入正确范围,大于0至小于100之间"],
	['validate-time',"请输入正确的时间格式,例如：yyyy-mm-dd 13:24"],
    ['validate-floor',"请输入正确的格式,例如：1A,3 或 23"]

];
var language="";

if(navigator.language){    //mozilla, Firefor

             language = navigator.language;
	}
else if(navigator.browserLanguage){ //IE

          language = navigator.browserLanguage;
	}


if(language=='zh-cn'){


	Validator.messagesSource = Validator.messagesSourceCn;
}
else{

	Validator.messagesSource = Validator.messagesSourceEn;
}


Validator.messages = {};
//init Validator.messages
Validator.messagesSource.each(function(ms){

	Validator.messages[ms[0]] = ms[1];
});

Validator.format = function(str,args) {
	args = args || [];
	Validation.assert(args.constructor == Array,"Validator.format() arguement 'args' must is Array");
	var result = str
	for (var i = 0; i < args.length; i++){
		result = result.replace(/%s/, args[i]);
	}
	return result;
}

Validator.prototype = {
	initialize : function(className, error, test, options) {
		this.options = Object.extend({}, options || {});
		this._test = test ? test : function(v,elm){ return true };
		this._error = error ? error : Validator.messages['validation-failed'];
		this.className = className;

	},
	test : function(v, elm) {

		if(this.options.depends && this.options.depends.length > 0) {
			var dependsResult = $A(this.options.depends).all(function(depend){
				return Validation.get(depend).test(v,elm);
			});
			if(!dependsResult) return dependsResult;
		}
		if(!elm) elm = {}
		return this._test(v,elm,Validation.getArgumentsByClassName(this.className,elm.className),this);
	},
	error : function(v,elm,useTitle) {

		var dependError = null;
		$A(this.options.depends).any(function(depend){
			var validation = Validation.get(depend);
			if(!validation.test(v,elm))  {
				dependError = validation.error(v,elm,useTitle)
				return true;
			}
			return false;
		});
		if(dependError != null) return dependError;

		var args  = Validation.getArgumentsByClassName(this.className,elm.className);
		var error = this._error;
		if(typeof error == 'string') {
			if(v) args.push(v.length);
			error = Validator.format(this._error,args);
		}else if(typeof error == 'function') {
			error = error(v,elm,args,this);
		}else {
			alert('error must type of string or function');
		}
		if(!useTitle) useTitle = elm.className.indexOf('useTitle') >= 0;
		return useTitle ? ((elm && elm.title) ? elm.title : error) : error;
	}
}

var Validation = Class.create();

Validation.prototype = {
	initialize : function(form, options){
		this.options = Object.extend({
			onSubmit : true,
			stopOnFirst : false,
			immediate : false,
			focusOnError : true,
			useTitles : false,
			onFormValidate : function(result, form) {},
			onElementValidate : function(result, elm) {}
		}, options || {});
		this.form = $(form);
		this.extendElm = [];
		var id =  Validation.getElmID(this.form);
		Validation.validations[id] = this;
		if(this.options.onSubmit) Event.observe(this.form,'submit',this.onSubmit.bind(this),false);
		if(this.options.immediate) {
			var useTitles = this.options.useTitles;
			var callback = this.options.onElementValidate;
			Form.getElements(this.form).each(function(input) { // Thanks Mike!
				Event.observe(input, 'blur', function(ev) { Validation.validate(Event.element(ev),{useTitle : useTitles, onElementValidate : callback}); });
			});
		}
	},
	onSubmit :  function(ev){

		if(!this.validate()) Event.stop(ev);
	},
    addExtendElm : function(elms){
		
		var elms = elms || [];
	    Validation.assert(elms.constructor == Array,"addExtendElm() arguement 'elms' must is Array");
		var mythis = this;
		elms.each(function(value){mythis.extendElm.push(value);});
	},
	validate : function() {
		var result = false;
		var useTitles = this.options.useTitles;
		var callback = this.options.onElementValidate;
		if(this.options.stopOnFirst) {
			result = Form.getElements(this.form).all(function(elm) { return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback}); });
		} else {
			result = Form.getElements(this.form).collect(function(elm) { return Validation.validate(elm,{useTitle : useTitles, onElementValidate : callback}); }).all();
		}
		if(!result && this.options.focusOnError) {
			var first = Form.getElements(this.form).findAll(function(elm){return $(elm).hasClassName('validation-failed')}).first();
			if(first != undefined && !first.getAttribute('disabled')){//when the input field has the attribute "disabled",the select() action will fail  
			   if(first.select) first.select();
			   first.focus();
			}
		}
		this.options.onFormValidate(result, this.form);
		this.result = result;
		return result;
	},
	reset : function() {
		Form.getElements(this.form).each(Validation.reset);
	}
}

Object.extend(Validation, {
	validate : function(elm, options){
		options = Object.extend({
			useTitle : false,
			onElementValidate : function(result, elm) {}
		}, options || {});
		elm = $(elm);

		var cn = elm.classNames();
		return result = cn.all(function(value) {
			var test = Validation.test(value,elm,options.useTitle);
			options.onElementValidate(test, elm);
			return test;
		});
	},
	_getInputValue : function(elm) {

		var elm = $(elm);
		if(elm.type.toLowerCase() == 'file') {
			return elm.value;
		}else {
			return $F(elm);
		}
	},
	_getErrorMsg : function(useTitle,elm,validation) {

		return validation.error(Validation._getInputValue(elm),elm,useTitle);
	},
	test : function(name, elm, useTitle) {

		//alert('test = '+ name);
     //为了方便测试，有时input里面没有 id 或者 name 属性，这样在应用的时候会出错，所以给 ID 赋值。
		if(elm.getAttribute("name")==''&& elm.getAttribute("id")=='')
		{
			var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
            var res = "";

           for(var i = 0; i < 8 ; i ++) {

               var id = Math.ceil(Math.random()*35);
                res += chars[id];
           }
           elm.setAttribute("id",res);
		}

		var v = Validation.get(name);
		var prop = '__advice'+name.camelize();
		if(name.indexOf("validate-ajax")>-1){

			var id='"advice-validate-ajax-' + Validation.getElmID(elm) +'"';

			var ojb=Validation.getAdvice("validate-ajax", elm);;
			if(ojb!=null){
				var errorMsg = Validation._getErrorMsg(useTitle,elm,v);
				ojb.innerHTML='<img src="../images/validate/ErrorWarn.gif" width="15" height="15" style="cursor: hand" alt="'+errorMsg+'" onClick="alert(\''+errorMsg+'\');"/>';
			}

			name="validate-ajax";


		}
		if(Validation.isVisible(elm) && !v.test(Validation._getInputValue(elm),elm)) {
			var advice = Validation.getAdvice(name, elm);
			if(!elm[prop]) {

			//	if(name.indexOf("validate-ajax")>-1){
             //            name="validate-ajax";
				//	}
				//var advice = Validation.getAdvice(name, elm);
				//alert('else name=' + name + ',advice = ' + advice);
				if(elm.next('span')){
					//alert(elm.next('span').outerHTML);
					elm.next('span').hide();
				}/**/
				if(advice == null ) {

					var errorMsg = Validation._getErrorMsg(useTitle,elm,v);

					if(elm.getAttribute("cssType")!=null){
						if(elm.getAttribute("cssType")=='img')
						{
							  advice = '<span id="advice-' + name + '-' + Validation.getElmID(elm) +'" style="display:none;margin-left:10px;"><img src="../images/validate/ErrorWarn.gif" width="15" height="15" style="cursor: hand" alt="'+errorMsg+'" onClick="alert(\''+errorMsg+'\');"/></span>';
						}
						else if(elm.getAttribute("cssType")=='right')
						{
							 advice = '<span class="validation-advice-right" id="advice-' + name + '-' + Validation.getElmID(elm) +'" style="display:none;margin-left:10px;">&nbsp;&nbsp;' + errorMsg + '</span>';
						}
						else
						{
					       advice = '<div class="validation-advice" id="advice-' + name + '-' + Validation.getElmID(elm) +'" style="display:none">' + errorMsg + '</div>';
						}
					}
					else
					{

						 advice = '<span id="advice-' + name + '-' + Validation.getElmID(elm) +'" style="display:none;margin-left:10px;"><img src="../images/validate/ErrorWarn.gif" width="15" height="15" style="cursor: hand" alt="'+errorMsg+'" onClick="alert(\''+errorMsg+'\');"/></span>';

					}
					switch (elm.type.toLowerCase()) {
						case 'checkbox':
						case 'radio':
							var p = elm.parentNode;
							if(p) {
								     if(elm.afterInsert!=null){
							           new Insertion.After(elm.afterInsert, advice);
							       }else{
								      new Insertion.Bottom(p, advice);
							       }

							} else {
								  if(elm.afterInsert!=null){
							         new Insertion.After(elm.afterInsert, advice);
							      }else{
								     new Insertion.After(elm, advice);
							      }
							}
							break;
						default:
						    if(elm.afterInsert!=null){
							new Insertion.After(elm.afterInsert, advice);
							}else{
								new Insertion.After(elm, advice);
							}

				    }


					//advice = $('advice-' + name + '-' + Validation.getElmID(elm));
					advice = Validation.getAdvice(name, elm);
				}

				//advice.style.display = 'inline';

			}
				advice.show();

			//var advice = Validation.getAdvice(name, elm);
			/*if(elm.getAttribute("cssType")==null || elm.getAttribute("cssType")=='img')
			{

			}
			else
			{
				advice.innerHTML = Validation._getErrorMsg(useTitle,elm,v);
			}*/


			elm[prop] = true;
			switch (elm.type.toLowerCase()) {
				case 'checkbox':
				case 'radio':
					break;
				default:
					if(name.indexOf("required-min") ==-1)
				{
					elm.removeClassName('validation-passed');
			        elm.addClassName('validation-failed');
				}

			}

			return false;
		} else {
			var advice = Validation.getAdvice(name, elm);
				//alert('else name=' + name + ',advice = ' + advice);
			if( advice != null) {

				advice.style.display = 'none';
				//$(advice).hide();

			}

			elm[prop] = '';
			switch (elm.type.toLowerCase()) {
				case 'checkbox':
				case 'radio':
					break;
				default:
					if(name.indexOf("required-min") ==-1)
				   {
					elm.removeClassName('validation-failed');
			        elm.addClassName('validation-passed');
				   }


			}


			return true;
		}
	},
	isVisible : function(elm) {

		while(elm && elm.tagName != 'BODY') {
			if($(elm).style.display == 'none') return false;
			elm = elm.parentNode;
		}
		return true;
	},
	getAdvice : function(name, elm) {
		//alert('name = ' + name + ', elm=' + elm);
		return Try.these(
			function(){ return $('advice-' + name + '-' + Validation.getElmID(elm)) },
			function(){ return $('advice-' + Validation.getElmID(elm)) }
		);
	},
	getElmID : function(elm) {

		if(elm.type!=null){
			if(elm.type.toLowerCase()=='radio' || elm.type.toLowerCase()=='checkbox')
              return elm.name;
		}

		return elm.id ? elm.id : elm.name;
	},
	reset : function(elm) {
		
		elm = $(elm);
		var cn = elm.classNames();
		cn.each(function(value) {
			var prop = '__advice'+value.camelize();
			if(elm[prop]) {
				var advice = Validation.getAdvice(value, elm);
				advice.hide();
				elm[prop] = '';
			}
			elm.removeClassName('validation-failed');
			elm.removeClassName('validation-passed');
		});
	},
	add : function(className, error, test, options) {

		var nv = {};
		nv[className] = new Validator(className, error, test, options);
		Object.extend(Validation.methods, nv);
	},
	addAllThese : function(validators) {
		var nv = {};
		$A(validators).each(function(value) {
				nv[value[0]] = new Validator(value[0], value[1], value[2], (value.length > 3 ? value[3] : {}));
			});
		Object.extend(Validation.methods, nv);
	},
	get : function(name) {

		var resultMethodName;
		for(var methodName in Validation.methods) {
			if(name == methodName) {
				resultMethodName = methodName;
				break;
			}
			if(name.indexOf(methodName) >= 0) {
				resultMethodName = methodName;
			}
		}
		return Validation.methods[resultMethodName] ? Validation.methods[resultMethodName] : new Validator();
		//return  Validation.methods[name] ? Validation.methods[name] : new Validator();
	},
	// 通过classname传递的参数必须通过'-'分隔各个参数
	// 返回值包含一个参数singleArgument,例:validate-pattern-/[a-c]/gi,singleArgument值为/[a-c]/gi
	getArgumentsByClassName : function(prefix,className) {

		if(!className || !prefix)
			return [];
		var pattern = new RegExp(prefix+'-(\\S+)');
		var matchs = className.match(pattern);

		if(!matchs)
			return [];
		var results = [];
		results.singleArgument = matchs[1];
		var args =  matchs[1].split('-');
		for(var i = 0; i < args.length; i++) {
			if(args[i] == '') {
				if(i+1 < args.length) args[i+1] = '-'+args[i+1];
			}else{
				results.push(args[i]);
			}
		}
		return results;
	},
	addElmValidate : function(elm){

        Event.observe(elm, 'blur', function(ev) { Validation.validate(Event.element(ev),{}); });

	},
	removeElmValidate : function(elm) {
				elm = $(elm);
		var cn = elm.classNames();
		cn.each(function(value) {
			var prop = '__advice'+value.camelize();
			if(elm[prop]) {
				var advice = Validation.getAdvice(value, elm);
				advice.hide();
				elm[prop] = '';
			}
			elm.removeClassName('validation-failed');
			elm.removeClassName('validation-passed');
		});
		elm.className='';
	},
	changeElmValidate : function(elm,styleName) {

				elm = $(elm);
		var cn = elm.classNames();
		cn.each(function(value) {
			var prop = '__advice'+value.camelize();
			if(elm[prop]) {
				var advice = Validation.getAdvice(value, elm);
				advice.hide();
				elm[prop] = '';
			}
			elm.removeClassName('validation-failed');
			elm.removeClassName('validation-passed');
		});
		elm.className=styleName;
	},

    /**
	 *  为了方便Ajax验证而写的方法,用Validation.addNotFormValidate()调用,如Validation.addNotFormValidate(["hsb","hsb1"],"toDO",functionName,[1,2,4]);
	 *  ids 要验证的元素的ID的组合 (数组)
	 *  triggerId 要触发验证元素的ID (字符串)
	 *  triggerFunc 当验证通过所调用的方法 (方法名)
	 *  parameter 调用的方法的参数 (数组)
	 */
    addNotFormValidate : function(ids,triggerId,triggerFunc,parameter){
		
        var tempArray = [];
		$A(ids).each(function(id){
		  Validation.addElmValidate($(id));
		  tempArray.push($(id));
	   });
        Validation.notFormValidations[triggerId] = tempArray;
		var triggerOjb = $(triggerId);
		Event.observe(triggerOjb, 'click', function(ev) {
			var result = Validation.notFormValidations[triggerId].collect(function(elm) { return Validation.validate(Element.extend(elm),{}); }).all();
			if(result) triggerFunc.apply(window,$A(parameter));
		});

	},
	callbackValidate : function(formId,triggerId,triggerFunc,parameter){
		
	    var triggerOjb = $(triggerId);
		Event.observe(triggerOjb, 'click', function(ev){
			var validater = Validation.$(formId);
			if(validater.validate()){
		        triggerFunc.apply(window,$A(parameter));
		    }else{
			    Event.stop(ev);
		    }
		});
	},
	validateButNotSubmit : function(formId){

		var validater = Validation.$(formId);

		if(validater == undefined) return ;

		return validater.validate();
	},
	assert : function(condition,message) {

		var errorMessage = message || ("assert failed error,condition="+condition);
		if (!condition) {

			throw new Error(errorMessage);
		}else {

			return condition;
		}
	},
	isDate : function(v,dateFormat) {

		var MONTH = "mm";
		   	var DAY = "dd";
		   	var YEAR = "yyyy";
			var regex = '^'+dateFormat.replace(YEAR,'\\d{4}').replace(MONTH,'\\d{2}').replace(DAY,'\\d{2}')+'$';
			if(!new RegExp(regex).test(v)) return false;

			if(!new RegExp(regex).test(v)) return false;
			var year = v.substr(dateFormat.indexOf(YEAR),4);
			var month = v.substr(dateFormat.indexOf(MONTH),2);
			var day = v.substr(dateFormat.indexOf(DAY),2);

			var d = new Date(Validator.format('%s/%s/%s',[year,month,day]));
			return ( parseInt(month, 10) == (1+d.getMonth()) ) &&
						(parseInt(day, 10) == d.getDate()) &&
						(parseInt(year, 10) == d.getFullYear() );

		},
       isTime : function(v,timeFormat) {

			var HOUR24 = "HH";
			var HOUR12 = "hh";
		   	var MINUTE = "mm";
		   	var SECOND = "ss";

            var regex="";
            if(timeFormat.indexOf("HH")>-1){
			   regex = '^'+timeFormat.replace(HOUR24,'\\d{2}').replace(MINUTE,'\\d{2}').replace(SECOND,'\\d{2}')+'$';
			}
			else{
               regex = '^'+timeFormat.replace(HOUR12,'\\d{2}').replace(MINUTE,'\\d{2}').replace(SECOND,'\\d{2}')+'$';
			}
			if(!new RegExp(regex).test(v)) return false;

             var hour="";
            if(timeFormat.indexOf("HH")>-1){
			    hour = v.substr(timeFormat.indexOf(HOUR24),2);
			}
			else{
                hour = v.substr(timeFormat.indexOf(HOUR12),2);
			}
			var minute = v.substr(timeFormat.indexOf(MINUTE),2);
			var second = v.substr(timeFormat.indexOf(SECOND),2);

			if(timeFormat.indexOf("HH")>-1){
			    if (hour>23 || minute>59 || second>59 || hour<0 || minute<0 || second<0)
                {

                   return false
                }
			}
			else{
                if (hour>12 || minute>59 || second>59 || hour<1 || minute<0 || second<0)
                {

                    return false
                }
			}

            return true;

		},
	methods : {}
});

Validation.add('IsEmpty', '', function(v) {

				return  ((v == null) || (v.length == 0)); // || /^\s+$/.test(v));
			});

Validation.addAllThese([
	['required', Validator.messages['required'], function(v) {

				return !(Validation.get('IsEmpty').test(v) || /^\s+$/.test(v));
			}],
	['validate-number', Validator.messages['validate-number'], function(v) {

				return Validation.get('IsEmpty').test(v) || (!isNaN(v) && !/^\s+$/.test(v));
			}],
	['validate-digits', Validator.messages['validate-digits'], function(v) {
				return Validation.get('IsEmpty').test(v) ||  !/[^\d]/.test(v);
			}],
	['validate-alpha', Validator.messages['validate-alpha'], function (v) {
				return Validation.get('IsEmpty').test(v) ||  /^[a-zA-Z]+$/.test(v)
			}],
	['validate-alphanum', Validator.messages['validate-alphanum'], function(v) {
				return Validation.get('IsEmpty').test(v) ||  !/\W/.test(v)
			}],
	['validate-email', Validator.messages['validate-email'], function (v) {
				return Validation.get('IsEmpty').test(v) || /\w{1,}[@][\w\-]{1,}([.]([\w\-]{1,})){1,3}$/.test(v)
			}],
	['validate-url', Validator.messages['validate-url'], function (v) {
				return Validation.get('IsEmpty').test(v) || /^(http|https|ftp):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(v)
			}],
	['validate-date-au', Validator.messages['validate-date-au'], function(v) {
				if(Validation.get('IsEmpty').test(v)) return true;
				var regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
				if(!regex.test(v)) return false;
				var d = new Date(v.replace(regex, '$2/$1/$3'));
				return ( parseInt(RegExp.$2, 10) == (1+d.getMonth()) ) &&
							(parseInt(RegExp.$1, 10) == d.getDate()) &&
							(parseInt(RegExp.$3, 10) == d.getFullYear() );
			}],
	['validate-currency-dollar', Validator.messages['validate-currency-dollar'], function(v) {
				// [$]1[##][,###]+[.##]
				// [$]1###+[.##]
				// [$]0.##
				// [$].##
				return Validation.get('IsEmpty').test(v) ||  /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(v)
			}],
	['validate-one-required', Validator.messages['validate-one-required'], function (v,elm,args,metadata) {

					var groups = document.getElementsByName(elm.name);
					var hasChecked = 0;		          
		            for(var i=groups.length-1;i>=0;i--){
			           var opt =groups[i];
			           if(opt.checked) hasChecked++;
		             }

				return hasChecked>0;
			}],
	['required-min', Validator.messages['required-min'], function (v,elm,args,metadata) {

        		var p = elm.parentNode;
                var hasChecked = 0;
                var   min = args[0]?args[0]||1:0;

				var options = p.getElementsByTagName('INPUT');
				var result=$A(options).any(function(elm) {
					if($F(elm).replace(/[ ]/g,"")!="")hasChecked++;
				});

				return min <= hasChecked;
			}],
	['select-one-required', Validator.messages['validate-one-required'], function (v,elm,args,metadata) {
        				var hasChecked = 0;
			min = 1;
			for(var i=elm.options.length-1;i>=0;i--){
				var opt =elm[i];
				if(opt.selected&&opt.value!="") hasChecked++;
			}
			return min <= hasChecked;
			}]

]);

function validationAlert(elm, isShow, errorMsg){
	    elm = $(elm);
		if(isShow){

            var advice=$('advice-' + Validation.getElmID(elm));

			if(advice==null){

					if(elm.getAttribute("cssType")!=null){

						if(elm.getAttribute("cssType")=='right')
						{
							 advice = '<span class="validation-advice-right" id="advice-' + Validation.getElmID(elm) +'" style="display:none;margin-left:10px;">' + errorMsg + '</span>';
						}
						else
						{
					       advice = '<div class="validation-advice" id="advice-' + Validation.getElmID(elm) +'" style="display:none">' + errorMsg + '</div>';
						}
					}
					else
					{

						advice = '<span id="advice-' + Validation.getElmID(elm) +'" style="display:none;margin-left:10px;"><img src="../images/validate/ErrorWarn.gif" width="15" height="15" style="cursor: hand" alt="'+errorMsg+'" onClick="alert(\''+errorMsg+'\');"/></span>';

					}

			  
			if(elm.type!=null){
				 switch (elm.type.toLowerCase()) {
							case 'checkbox':
							case 'radio':
								var p = elm.parentNode;
								if(p) {
										 if(elm.afterInsert!=null){
										   new Insertion.After(elm.afterInsert, advice);
									   }else{
										  new Insertion.Bottom(p, advice);
									   }

								} else {
									  if(elm.afterInsert!=null){
										 new Insertion.After(elm.afterInsert, advice);
									  }else{
										 new Insertion.After(elm, advice);
									  }
								}
								break;
							default:
								if(elm.afterInsert!=null){
								new Insertion.After(elm.afterInsert, advice);
								}else{
									new Insertion.After(elm, advice);
								}

					}

			}else{
                      if(elm.afterInsert!=null){
							
                         new Insertion.After(elm.afterInsert, advice);
					}else{
							new Insertion.After(elm, advice);
					}
			}
				advice = $('advice-' + Validation.getElmID(elm));

			}

			advice.style.display = '';

        }else{
			advice = $('advice-' + Validation.getElmID(elm));
			if(advice!=null)
			advice.removeNode(true);

		}
};
//custom validate start
Validation.addAllThese([
	['validate-date-cn', Validator.messages['validate-date-cn'], function(v) {
				if(Validation.get('IsEmpty').test(v)) return true;
				var regex = /^(\d{4})-(\d{1,2})-(\d{1,2})-$/;
				if(!regex.test(v)) return false;

				var d = new Date(v.replace(regex, '$1/$2/$3'));

				return ( parseInt(RegExp.$2, 10) == (1+d.getMonth()) ) &&
							(parseInt(RegExp.$3, 10) == d.getDate()) &&
							(parseInt(RegExp.$1, 10) == d.getFullYear() );
			}],

	['validate-date',function(v,elm,args,metadata) {

		var dateFormat = args.singleArgument || 'yyyy-mm-dd';
		dateFormat=dateFormat.toLowerCase();
       tempmessage=Validator.messages['message-temp-fordate']+dateFormat.replace('yyyy','2006').replace('mm','03').replace('dd','12');
		return Validator.messages['validate-dateMessage']+dateFormat+tempmessage;
	},function(v,elm,args,metadata) {
		 if( Validation.get('IsEmpty').test(v)){return true;}

			var dateFormat = args.singleArgument || 'yyyy-mm-dd';

            dateFormat=dateFormat.toLowerCase();

			return Validation.isDate(v,dateFormat);
		}],

	['validate-time',function(v,elm,args,metadata) {

		var timeFormat = args.singleArgument || 'HH:mm:ss';
       tempmessage=Validator.messages['message-temp-fordate']+timeFormat.replace('HH','02').replace('mm','03').replace('ss','12');
		return Validator.messages['validate-timeMessage']+timeFormat+tempmessage;
	},function(v,elm,args,metadata) {
		 if( Validation.get('IsEmpty').test(v)){return true;}

			var timeFormat = args.singleArgument || 'HH:mm:ss';


			return Validation.isTime(v,timeFormat);
		}],
	['validate-dateTime',function(v,elm,args,metadata) {

		var dateTimeFormat = args.singleArgument || 'yyyy-mm-dd-HH:mm:ss';
		var dateTime = dateTimeFormat.replace('yyyy','2008').replace('mm','08').replace('dd','08').replace('-HH',' 13').replace('-hh',' 11').replace('mm','00').replace('ss','59');
           dateTimeFormat = dateTimeFormat.replace('-HH',' HH').replace('-hh',' hh');
	   tempmessage=Validator.messages['message-temp-fordate']+dateTime;
		return Validator.messages['validate-dateTimeMessage']+dateTimeFormat+tempmessage;
	},function(v,elm,args,metadata) {
		 if( Validation.get('IsEmpty').test(v)){return true;}

			var dateTimeFormat = args.singleArgument || 'yyyy-mm-dd-HH:mm:ss';
              dateTimeFormat=dateTimeFormat.replace('-HH'," HH").replace('-hh'," hh");;


			var dateFormat=dateTimeFormat.substr(0,dateTimeFormat.indexOf(" "));
			var timeFormat=dateTimeFormat.substr(dateTimeFormat.indexOf(" "),dateTimeFormat.length);
			var vDate=v.substr(0,v.indexOf(" "));
			var vTime=v.substr(v.indexOf(" "),v.length);

			return (Validation.isDate(vDate,dateFormat)) && (Validation.isTime(vTime,timeFormat));
		}],

	['validate-integer', Validator.messages['validate-integer'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/^[-+]?[\d]+$/.test(v));
			}],
	['validate-integerB', Validator.messages['validate-integerB'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/^[\d]+(\.00)?$/.test(v));
			}],
   ['validate-integerBA', Validator.messages['validate-integerBA'], function(v) {
				return Validation.get('IsEmpty').test(v) || ((/^[\d]+$/.test(v)) && parseFloat(v) > 0);
			}],
   ['validate-integerC', Validator.messages['validate-integerB'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/^-[\d]+(\.00)?$/.test(v));
			}],

	['validate-chinese', Validator.messages['validate-chinese'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/^[\u4e00-\u9fa5]+$/.test(v));
			}],

	['validate-ip', Validator.messages['validate-ip'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v));
			}],

	['validate-phone', Validator.messages['validate-phone'], function(v) {
				return Validation.get('IsEmpty').test(v) || /^((0[1-9]{3})?(0[12][0-9])?[-])?\d{6,8}$/.test(v);
			}],

	['validate-mobile-phone', Validator.messages['validate-mobile-phone'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/(^0?[1][35][0-9]{9}$)/.test(v));
			}],
	['validate-all-phone', Validator.messages['validate-all-phone'], function(v) {
				return Validation.get('IsEmpty').test(v)  ||
				        (/(^0?[1][35][0-9]{9}$)/.test(v)) ||
						(/^((0[1-9]{3})?(0[12][0-9])?[-])?\d{6,8}$/.test(v));
			}],

    ['validate-zip', Validator.messages['validate-zip'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/^[0-9]\d{5}$/.test(v));
			}],
	/**
	 * Usage : int-zero-right
	 * Example : int-zero-right
	 */
	['int-zero-right', Validator.messages['int-zero-right'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseInt(v) >= parseInt(0))
			},{depends : ['validate-integer']}],
	/**
	 * Usage : int-right
	 * Example : int-right
	 */
	['int-right', Validator.messages['int-right'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseInt(v) > parseInt(0))
			},{depends : ['validate-integer']}],
	/**
	 * Usage : int-zero-left
	 * Example : int-zero-left
	 */
	['int-zero-left', Validator.messages['int-zero-left'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseInt(v) <= parseInt(0))
			},{depends : ['validate-integer']}],
	/**
	 * Usage : int-left
	 * Example : int-left
	 */
	['int-left', Validator.messages['int-left'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseInt(v) < parseInt(0))
			},{depends : ['validate-integer']}],
	/**
	 * Usage : float-right
	 * Example : float-right
	 */
	['float-right', Validator.messages['float-right'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseFloat(v) > parseFloat(0));
			},{depends : ['validate-number']}],
	/**
	 * Usage : float-zero-right
	 * Example : float-zero-right
	 */
	['float-zero-right', Validator.messages['float-zero-right'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseFloat(v) >= parseFloat(0));
			},{depends : ['validate-number']}],
	/**
	 * Usage : float-left
	 * Example : float-left
	 */
	['float-left', Validator.messages['float-left'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseFloat(v) < parseFloat(0));
			},{depends : ['validate-number']}],
	/**
	 * Usage : float-zero-left
	 * Example : float-zero-left
	 */
	['float-zero-left', Validator.messages['float-zero-left'], function(v) {
				return Validation.get('IsEmpty').test(v) || (parseFloat(v) <= parseFloat(0));
			},{depends : ['validate-number']}],
	/**
	 * Usage : validate-equals-otherInputId
	 * Example : validate-equals-username or validate-equals-email etc..
	 */
	['validate-equals',Validator.messages['validate-equals'], function(v,elm,args,metadata) {
				return Validation.get('IsEmpty').test(v) || $F(args[0]) == v;
			}],
	/**
	 * Usage : less-than-otherInputId
	 */
	['less-than',function(v,elm,args,metadata){
		return elm.getAttribute('validateMessage') || Validator.messages['less-than'];
	}, function(v,elm,args,metadata) {
				if(Validation.get('validate-number').test(v) && Validation.get('validate-number').test($F(args[0])))
					return Validation.get('IsEmpty').test(v) || parseFloat(v) < parseFloat($F(args[0]));
				return Validation.get('IsEmpty').test(v) || v < $F(args[0]);
			}],
	['less-equals-than',function(v,elm,args,metadata){
		return elm.getAttribute('validateMessage') || Validator.messages['less-equals-than'];
	}, function(v,elm,args,metadata) {
				if(Validation.get('validate-number').test(v) && Validation.get('validate-number').test($F(args[0])))
					return Validation.get('IsEmpty').test(v) || parseFloat(v) < parseFloat($F(args[0]));
				return Validation.get('IsEmpty').test(v) || v <= $F(args[0]);
			}],
	/**
	 * Usage : great-than-otherInputId
	 */
	['great-than',function(v,elm,args,metadata){
		return elm.getAttribute('validateMessage') || Validator.messages['great-than'];
	}, function(v,elm,args,metadata) {
				if(Validation.get('validate-number').test(v) && Validation.get('validate-number').test($F(args[0])))
					return Validation.get('IsEmpty').test(v) || parseFloat(v) > parseFloat($F(args[0]));
				return Validation.get('IsEmpty').test(v) || v > $F(args[0]);
			}],
	['great-equals-than',function(v,elm,args,metadata){
		return elm.getAttribute('validateMessage') || Validator.messages['great-equals-than'];
	}, function(v,elm,args,metadata) {
				if(Validation.get('validate-number').test(v) && Validation.get('validate-number').test($F(args[0])))
					return Validation.get('IsEmpty').test(v) || parseFloat(v) >= parseFloat($F(args[0]));
				return Validation.get('IsEmpty').test(v) || v >= $F(args[0]);
			}],

	['validate-floor',Validator.messages['validate-floor'], function(v,elm,args,metadata) {
				return Validation.get('IsEmpty').test(v) || /^\d*(\w+,\d+)?$/.test(v);
			}],
	/*
	 * Usage: min-length-number
	 * Example: min-length-10
	 */
	['min-length',Validator.messages['min-length'],function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || v.length >= parseInt(args[0]);
	}],
	/*
	 * Usage: min-lengthB-number
	 * Example: min-length-10
	 */
	['min-lengthB',Validator.messages['min-lengthB'],function(v,elm,args,metadata) {
		var lenB = v.replace(/[^\x00-\xff]/g,"**").length;
		var min = args[0]?args[0]||1:0
		return Validation.get('IsEmpty').test(v) || min <= lenB;
	}],
	/*
	 * Usage: checkbox-min-number
	 * Example: checkbox-min-2
	 */
    ['checkbox-min',Validator.messages['checkbox-min'],function(v,elm,args,metadata) {

        var groups = document.getElementsByName(elm.name);
		var hasChecked = 0;
		min = args[0]?args[0]||1:0

		for(var i=groups.length-1;i>=0;i--){
			var opt =groups[i];
			if(opt.checked) hasChecked++;
		}
		return min <= hasChecked;
	}],
	/*
	 * Usage: checkbox-max-number
	 * Example: checkbox-max-8
	 */
    ['checkbox-max',Validator.messages['checkbox-max'],function(v,elm,args,metadata) {
        var groups = document.getElementsByName(elm.name);
		var hasChecked = 0;
		max = args[0]?args[0]:groups.length;
		for(var i=groups.length-1;i>=0;i--){
			var opt =groups[i];
			if(opt.checked) hasChecked++;
		}
		
		return hasChecked <= max;
	}],
	/*
	 * Usage: checkbox-range-minValue-maxValue
	 * Example: 1 to 3 : checkbox-range-1-3
	 */
	['checkbox-range',Validator.messages['checkbox-range'],function(v,elm,args,metadata){
        var groups = document.getElementsByName(elm.name);
		var hasChecked = 0;
		min = args[0]?args[0]||1:0
		max = args[1]?args[1]:groups.length;
		for(var i=groups.length-1;i>=0;i--){
			var opt =groups[i];
			if(opt.checked) hasChecked++;
		}
		return min <= hasChecked && hasChecked <= max;
	}],
	/*
	 * Usage: select-range-minValue-maxValue
	 * Example: 1 to 3 : select-range-1-3
	 */
	['select-range',Validator.messages['checkbox-range'],function(v,elm,args,metadata){
        var hasChecked = 0;
			min = args[0]?args[0]||1:0
			max = args[1]?args[1]:elm.options.length;
			//alert(min+"min\\max:==>"+groups.options.length)
			for(var i=elm.options.length-1;i>=0;i--){
				var opt =elm[i];
				if(opt.selected&&opt.value!="") hasChecked++;
			}
			return min <= hasChecked && hasChecked <= max;
	}],
	/*
	 * Usage: max-length-number
	 * Example: max-length-10
	 */
	['max-length',Validator.messages['max-length'],function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || v.length <= parseInt(args[0]);
	}],
	/*
	 * Usage: max-lengthB-number
	 * Example: max-length-10
	 */
	['max-lengthB',Validator.messages['max-lengthB'],function(v,elm,args,metadata) {
		var lenB = v.replace(/[^\x00-\xff]/g,"**").length;
			var max = args[0]?args[0]:9999;
			return lenB <= max;
		return Validation.get('IsEmpty').test(v) || lenB <= max;
	}],
	/*
	 * Usage: validate-file-type1-type2-typeX
	 * Example: validate-file-png-jpg-jpeg
	 */
	['validate-file', function(v,elm,args,metadata) {
		return Validator.format(Validator.messages['validate-file'],[args.join(',')]);
	},function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || $A(args).any(function(extentionName) {
			return new RegExp('\\.'+extentionName+'$','i').test(v);
		});
	}],
	/*
	 * Usage: integer-decimal-range-intLength-decLength
	 * Example: integer-decimal-range-2-3
	 */
	['integer-decimal-range',Validator.messages['integer-decimal-range'],function(v,elm,args,metadata){
		  if(args[1]){
		     if (args[1] < 1){
                  Validation.assert(false,"Validatoion integer-decimal-range decimal range length must lg 0");
			 }
		  }
		  var re = new RegExp("^[+-]?\\d{0,"+args[0]+"}((\\.)\\d{1,"+args[1]+"})?$");
	      return re.test(v);
	 }],
    /*
	 * Usage:comma-format
	 * Example: comma-format
	 */
	['comma-format',Validator.messages['comma-format'],function(v,elm,args,metadata){

		  var re = new RegExp("^(\\d+,)*\\d+$");
	      return re.test(v);
	 }],
    /*
	 * Usage:comma-semicolon-format
	 * Example: comma-semicolon-format
	 */
	 ['comma-semicolon-format',Validator.messages['comma-semicolon-format'],function(v,elm,args,metadata){
		  var re = new RegExp("^(\\w+,\\w+;)*\\w+,\\w+$");
	      return re.test(v);
	 }],
	/*
	 * Usage:percent-range
	 * Example: percent-range
	 */
	['percent-range',Validator.messages['percent-range'],function(v,elm,args,metadata){

	      return Validation.get('IsEmpty').test(v) ||  (parseFloat(v) > parseFloat(0) && parseFloat(v) <= parseFloat(100));
	 },{depends : ['validate-number']}],
	/*
	 * Usage:percent-rangeB
	 * Example: percent-rangeB
	 */
	['percent-rangeB',Validator.messages['percent-rangeB'],function(v,elm,args,metadata){

	      return Validation.get('IsEmpty').test(v) || (parseFloat(v) > parseFloat(0) && parseFloat(v) < parseFloat(100));
	 }],

	/*
	 * Usage: float-range-minValue-maxValue
	 * Example: -2.1 to 3 = float-range--2.1-3
	 */
	['float-range', Validator.messages['float-range'],function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || (parseFloat(v) >= parseFloat(args[0]) && parseFloat(v) <= parseFloat(args[1]))
	},{depends : ['validate-number']}],
	/*
	 * Usage: int-range-minValue-maxValue
	 * Example: -10 to 20 = int-range--10-20
	 */
	['int-range',Validator.messages['int-range'],function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || (parseInt(v) >= parseInt(args[0]) && parseInt(v) <= parseInt(args[1]))
	},{depends : ['validate-integer']}],
	/*
	 * Usage: length-range-minLength-maxLength
	 * Example: 10 to 20 = length-range-10-20
	 */
	['length-range', Validator.messages['length-range'],function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || (v.length >= parseInt(args[0]) && v.length <= parseInt(args[1]))
	}],
	/*
	 * Usage: lengthB-range-minLength-maxLength
	 * Example: 10 to 20 = length-range-10-20
	 */
	['lengthB-range', Validator.messages['lengthB-range'],function(v,elm,args,metadata) {
			var lenB = v.replace(/[^\x00-\xff]/g,"**").length;
			var min = args[0]?args[0]||1:0
			var max = args[1]?args[1]:9999;
		return Validation.get('IsEmpty').test(v) || (min <= lenB && lenB <= max)
	}],
	/*
	 * Usage: max-value-number
	 * Example: max-value-10
	 */
	['max-value',Validator.messages['max-value'] ,function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || parseFloat(v) <= parseFloat(args[0]);
	},{depends : ['validate-number']}],
	/*
	 * Usage: min-value-number
	 * Example: min-value-10
	 */
	['min-value',Validator.messages['min-value'],function(v,elm,args,metadata) {
		return Validation.get('IsEmpty').test(v) || parseFloat(v) >= parseFloat(args[0]);
	},{depends : ['validate-number']}],
	/*
	 * Usage: validate-pattern-RegExp
	 * Example: <input id='sex' class='validate-pattern-/^[fm]$/i'>
	 */
	['validate-pattern',function(v,elm,args,metadata){
		return elm.getAttribute('validateMessage') || Validator.messages['validate-pattern'];
	},function(v,elm,args,metadata) {
		var extractPattern = /validate-pattern-\/(\S*)\/(\S*)?/;
		Validation.assert(extractPattern.test(elm.className),"invalid validate-pattern expression,example: validate-pattern-/a/i");
		elm.className.match(extractPattern);
		return Validation.get('IsEmpty').test(v) || new RegExp(RegExp.$1,RegExp.$2).test(v);
	}],

	['validate-id-number',Validator.messages['validate-id-number'],function(v,elm,args,metadata) {
         if( Validation.get('IsEmpty').test(v)){return true;}
		if(!(/^\d{17}(\d|x)$/i.test(v) || /^\d{15}$/i.test(v))) return false;

		if((parseInt(v.substr(0,2)) < 11) || (parseInt(v.substr(0,2)) > 91)) return false;

		var forTestDate = v.length == 18 ? v : v.substr(0,6)+"19"+v.substr(6,15);
		var birthday = forTestDate.substr(6,8);

		if(Validation.get('validate-date-cn').test(birthday)) return false;
		if(v.length == 18) {
			v = v.replace(/x$/i,"a");
			var verifyCode = 0;
			for(var i = 17;i >= 0;i--)
            	verifyCode += (Math.pow(2,i) % 11) * parseInt(v.charAt(17 - i),11);
            if(verifyCode % 11 != 1) return false;
		}
		return true;
	}],

	/*
	 * Example: <input id='email' class='validate-ajax' validateUrl='http://localhost:8080/validate-email.jsp' validateMessage='email already exists'>
	 */
	['validate-ajax',function(v,elm,args,metadata) {
		return elm.getAttribute('validateFailedTempMessage') || Validator.messages['validation-failed'];
	},function(v,elm,args,metadata) {
		Validation.assert(elm.getAttribute('validateUrl'),'element validate by ajax must has "validateUrl" attribute');
	//	Validation.assert(elm.getAttribute('validateMessage'),'element validate by ajax must has "validateMessage" attribute');

        if(v==elm.getAttribute('tempValueIsChanged')){
            if(args.length==0){
			    elm._hasAjaxValidateResult = true;
			   elm._ajaxValidating = true;
			}

		}

		if(elm._ajaxValidating && elm._hasAjaxValidateResult) {
			elm._ajaxValidating = false;
			elm._hasAjaxValidateResult = false;

			return elm._ajaxValidateResult;
		}
      var param="";

      if(elm.getAttribute('replaceId')!=null){
	  	var replaceId=elm.getAttribute('replaceId').split(",");
		for(var ii=0;ii<replaceId.length;ii++){
			if(ii==0){
				if(replaceId[ii]=='#'){
                   param=Form.Element.serialize(elm);
				} else {
				   param=replaceId[ii]+"="+v;
				}
				continue;
			}
			if(replaceId[ii]=='#'){
                param=param+"&"+args[ii]+"="+$F(args[ii]);
			} else {
				param=param+"&"+replaceId[ii]+"="+$F(args[ii]);

			}
		}
	  }else{
       param=Form.Element.serialize(elm);

	   for(var i=0;i<args.length;i++){
            param=param+"&"+args[i]+"="+$F(args[i]);
	   }
	   }

		var sendRequest = function() {

			new Ajax.Request(elm.getAttribute('validateUrl'),{
				parameters :param ,
				asynchronous:false,
				onSuccess : function(response) {
					elm.setAttribute('tempValueIsChanged',v);

					if('true' != response.responseText.strip()  && 'false' != response.responseText.strip()){

						elm._ajaxValidateResult=false;
						elm.setAttribute('validateFailedTempMessage',response.responseText.strip());

						if(elm.onFailure!=null){

							   try{

		                           typeof(eval(elm.onFailure));

		                       }catch(ex){
								  alert("Not exist  the callback : "+elm.onFailure+"  ");
							   }
							   if(typeof(eval(elm.onFailure)) !='function'){
	                               alert("The callback type for onFailure must be function.");
							   }

							  	eval(elm.onFailure+"(response,elm);");

						   }

					}
					else{

                           elm.setAttribute('validateFailedTempMessage',elm.getAttribute('validateMessage'));
						   elm._ajaxValidateResult = eval(response.responseText);

						   if(elm.onSuccess!=null && 'true' == response.responseText.strip()){

							   try{

		                           typeof(eval(elm.onSuccess));

		                       }catch(ex){
								  alert("Not exist  the callback : "+elm.onSuccess+"  ");
							   }
							   if(typeof(eval(elm.onSuccess)) !='function'){
	                               alert("The callback type for onSuccess must be function.");
							   }

							  	eval(elm.onSuccess+"(response,elm);");

						   }

						   if(elm.onFailure!=null && 'false' == response.responseText.strip()){

							   try{

		                           typeof(eval(elm.onFailure));

		                       }catch(ex){
								  alert("Not exist  the callback : "+elm.onFailure+"  ");
							   }
							   if(typeof(eval(elm.onFailure)) !='function'){
	                               alert("The callback type for onFailure must be function.");
							   }

							  	eval(elm.onFailure+"(response,elm);");

						   }

						}

					elm._hasAjaxValidateResult = true;
					//Validation.test('validate-ajax',elm);

				}

			});

			elm._ajaxValidating = true;

			return elm._ajaxValidateResult;
		}

		return  Validation.get('IsEmpty').test(v) || sendRequest();
	}],
	['validate-time', Validator.messages['validate-time'], function(v) {
				return Validation.get('IsEmpty').test(v) || (/^\d{4}-\d{2}-\d{2}\s+2[0-3]:{1}[0-5]{1}[0-9]{1}$/.test(v)) || (/^\d{4}-\d{2}-\d{2}\s+1[0-9]:{1}[0-5]{1}[0-9]{1}$/.test(v)) || (/^\d{4}-\d{2}-\d{2}\s+0[0-9]:{1}[0-5]{1}[0-9]{1}$/.test(v));
			}]
]);

Validation.validations = {};
Validation.notFormValidations = {};
Validation.autoBind = function() {

	 var forms = document.getElementsByClassName('required-validate');
	 $A(forms).each(function(form){
		var validation = new Validation(form,{immediate:true});
		Event.observe(form,'reset',function() {validation.reset();},false);
	 });
};

Validation.$ = function(id) {

	return Validation.validations[id];
}

Validation.addExtendElm = function(id,elmIds) {
	var validation = Validation.$(id);
	var elms = [];
	elmIds.each(function(value){elms.push($(value));});
    validation.addExtendElm.call(validation,elms);
}



Event.observe(window,'load',Validation.autoBind,false);