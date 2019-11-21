
//自定义的验证规则
/**
 * 只能填入ascii中的字符
 */
jQuery.validator.addMethod("ascii", function(value, element, param) {
	if (this.optional(element)) {
		return true;
	}
	value = "" + value;
	if(value.length > 0) {
		for(var i=0; i < value.length; i++){
			if(value.charCodeAt(i) > 127) {
				return false;
			}
		}
	}
	return true;
}, "请输入非中文字符,当前输入包含中文");

/**
 * 特殊字符
 */
jQuery.validator.addMethod('specialChars',function(value, element){
	value = ''+value;
	var reg = /[~!#$%^&*()_+<>?:"{},\/;'[\]]/im;
	return this.optional(element) || !reg.test(value);
}, jQuery.format("输入格式不正确"));


/**
 * 只能填入条码code 128中的字符
 */
jQuery.validator.addMethod("barcode", function(value, element, param) {
	if (this.optional(element)) {
		return true;
	}
	value = "" + value;
	if(value.length > 0) {
		for(var i=0; i < value.length; i++){
			if(value.charCodeAt(i) > 127) {
				return false;
			}
		}
		 
	}
	return true;
}, "输入不能包含中文");


/**
 * 中文占两个字节
 */
jQuery.validator.addMethod("maxlength2", function(value, element, param) {
	if (this.optional(element)) {
		return true;
	}
	var l = 0;
	value = "" + value;
	if(value.length > 0) {
		for(var i=0; i < value.length; i++){
			if(value.charCodeAt(i) > 127) {
				l+=2;
			}else{
				l+=1;
			}
		}
	}
	return l<=param;
}, "输入不能包含中文");

/**
 * 时分秒时间格式00:00:00
 */
jQuery.validator.addMethod("fullTime", function(value, element) {
	return this.optional(element) || /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(value);
}, "输入有效的时间, 例如：13:20:00");

/**
 * money格式, 最多两位小数
 */
jQuery.validator.addMethod("money", function(value, element, param) {
	return this.optional(element) || /^[1-9](\d?)+(\.\d{1,2})?$/.test(value);
}, "输入有效的数额, 最多两位小数");

/**
 * 邮政编码验证
 */
jQuery.validator.addMethod("postcode", function(value, element, param) {
	return this.optional(element) || /^[1-9]\d{5}?$/.test(value);
}, "请输入有效邮政编码");

/**
 * 本元素的值大于某个元素的值
 * param指出对应的元素, 如:
 * $("#myform").validate({
 *    rules: {
 *      ele: {largerThan: "#eleTwo"}
 *   }
 *  });
 */
jQuery.validator.addMethod("largerThan", function(value, element, param) {
	var target = $(param).unbind(".validate-largerThan").bind("blur.validate-largerThan", function() {
		$(element).valid();
	});
	return value > target.val();
}, "输入值需要大于开始值");

/**
 * 本元素的值大于等于某个元素的值
 * param指出对应的元素, 如:
 * $("#myform").validate({
 *    rules: {
 *      ele: {largerEqThan: "#eleTwo"}
 *   }
 *  });
 */
jQuery.validator.addMethod("largerEqThan", function(value, element, param) {
	var target = $(param).unbind(".validate-largerEqThan").bind("blur.validate-largerEqThan", function() {
		$(element).valid();
	});
	return value >= target.val();
}, "输入值需要大于或等于开始值");

/**
 * 浮点数,验证规则, 指定整数位及小数位. 例如: floatNumber : [7,4]
 */
jQuery.validator.addMethod("floatNumber", function(value, element, param) { 
    value = '' + value; //确保是字符串;  
    var intPart = param[0] - 1; 
    var numPart = param[1] ;
    var patternIntPart = "^(-)?([1-9]\\d{0," + intPart + "}|0)";
    var patternNumPart = '';
    if(numPart > 0) {
    	patternNumPart = "(\\.\\d{1," + numPart + "})?";
    }
   	//var pattern = "^(-)?([1-9]\\d{0," + intPart + "}|0)(\\.\\d{1," + numPart + "})?$" ;
    var pattern = patternIntPart + patternNumPart + "$";
    return this.optional(element) || (new RegExp(pattern)).test(value);
     
}, jQuery.format("请输入正确的数值！整数位不超过{0}位,小数位不超过{1}位！"));

/**
 * 浮点数,验证规则, 指定整数位及小数位. 例如: floatNumber : [7,4]
 */
jQuery.validator.addMethod("intNumber", function(value, element) { 
    value = '' + value; //确保是字符串;  
    var pattern = "^(-)?([1-9]\\d*|0)$";
    return this.optional(element) || (new RegExp(pattern)).test(value);
     
}, jQuery.format("请输入整数值！"));

/**
 * 验证(手机号码) 11位
 */
jQuery.validator.addMethod('mobile',function(value, element){
	value = ''+value;
	var mobile = '^[1][34578][0-9]{9}$';//手机号
	return this.optional(element) ||(new RegExp(mobile)).test(value);
}, jQuery.format("手机号码不符合规范"));

/**
 * 验证电话号码
 */
jQuery.validator.addMethod('telephone',function(value, element){
	value = ''+value;
	var filter=/^(((\d{3,4}-)?(\d{6,7,8})))(-(\d{3,4}))?$/; 
	return this.optional(element) || filter.test(value);
}, jQuery.format("电话号码不符合规范"));

/**
 * 验证联系电话
 */
jQuery.validator.addMethod('phoneOrMobile',function(value, element){
	value = ''+value;
	var mobile = '^0?[1][0-9]{10}$';//手机号
	var telephone = /^(((\d{3,4}-)?(\d{6,8})))(-(\d{3,4}))?$/;//电话号码
	return this.optional(element) || (new RegExp(telephone)).test(value)||(new RegExp(mobile)).test(value);
	
}, jQuery.format("联系电话不符合规范"));

/**
 * QQ号码验证
 */
 jQuery.validator.addMethod('qqNumber',function(value, element){
 	value = ''+value;
 	var qqNumber = '^[1-9][0-9]{4,10}$';//QQ号码
 	return this.optional(element) || (new RegExp(qqNumber)).test(value);
 }, jQuery.format("请输入正确的QQ号码"));