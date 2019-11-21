/*
 * Translated default messages for the jQuery validation plugin.
 * Language: CN
 * Author: Fayland Lam <fayland at gmail dot com>
 */
jQuery.extend(jQuery.validator.messages, {
    	required: "必填字段",		
		email: "请输入正确格式的电子邮件",
		url: "请输入合法的网址",
		date: "请输入合法的日期.例如:2006-03-16",
		dateISO: "请输入合法的日期 (ISO).例如：2006-03-16",
		dateTimeSecond: "请输入合法的日期.例如：2006-03-16 10:11:12",
		dateTime: "请输入合法的日期.例如：2006-03-16 10:11",
		number: "请输入合法的数字",
		digits: "只能输入整数",
		creditcard: "请输入合法的信用卡号",
		equalTo: "请再次输入相同的值",
		accept: "请输入拥有合法后缀名的字符串.例如：'jpeg|gif|png'",
		maxlength: jQuery.format("请输入长度最多是 {0} 的值"),
		minlength: jQuery.format("请输入长度最少是 {0} 的值"),
		rangelength: jQuery.format("请输入长度介于 {0} 和 {1} 之间的值"),
		range: jQuery.format("请输入介于 {0} 和 {1} 之间的值"),
		max: jQuery.format("请输入最大为 {0} 的值"),
		min: jQuery.format("请输入最小为 {0} 的值"),
		less_than_date: "输入的日期应小于等于选定的日期.",
		great_than_date: "输入的日期应大于等于选定的日期.",
		less_than_number: "输入的值应小于等于选定的值.",
		great_than_number: "输入的值应大于等于选定的值.",
		decimal_number: jQuery.format("输入的值小数位数最大为{0}"),
		integer_decimal_range:jQuery.format("输入的值整数位数最大为{0},小数位数最大为{1}"),
		pattern: "无效格式"
});
//修改错误显示方式
(function($){
	if($.validator) {
		$.extend($.validator.defaults, {
			 highlight: function(element, errorClass, validClass) {
			  var el = element.element || element;
			  var errorWraperParent = getErrorWraperParent(el);
			  var forAttr = el.id || el.name;
			  var errorWraper = errorWraperParent.find('label[for=' + forAttr + ']');
			  if(errorWraper.length < 1) {
				  errorWraper = '<label for="' + forAttr + '" class="error-wraper"><span class="error-ico"></span><span class="error-msg"></span></label>';
				  $(errorWraperParent).append(errorWraper);
			  }
			  $(errorWraperParent).find('label[for=' + forAttr + ']' + ' .error-msg').text(element.message);
			  $(el).removeClass(validClass);
			  $(el).addClass(errorClass);
		  },
		  unhighlight: function(element, errorClass, validClass) {
			  if(typeof  element == 'string' ) {
				  element = $(element);
				  if(element.length > 0) {
					  element = element[0];
				  }
			  }
			  errorClass = errorClass || this.errorClass;
			  validClass = validClass || this.validClass;
			  var el = element.element || element;
			  var forAttr = el.id || el.name;
			  var errorWraperParent = getErrorWraperParent(el);
			  $(errorWraperParent).find('label[for=' + forAttr + ']').remove();
			  $(el).removeClass(errorClass);
			  $(el).addClass(validClass);
		  }
		});
	}
	function getErrorWraperParent(el) {
		//包含错误信息元素的id可以用form元素的data-error-parent指定, 否则是有error-wraper-parent class的父元素, 否则只是父元素.
		var errorWraperParent = $('#' + $(el).attr('data-error-parent'));
		if(errorWraperParent.length < 1) {
			errorWraperParent = $(el).parents('span.error-wraper-parent');
		}
		if(errorWraperParent.length < 1) {
			errorWraperParent = $(el).parent();
		}
		return errorWraperParent;
	}
})(jQuery);