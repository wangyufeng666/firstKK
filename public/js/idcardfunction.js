
//利用正确的身份证id，获取出生日期和性别这两个信息
function getIdcardMSG(idno, gender, birthday) {
	$('#' + gender).attr('value', getGender(idno));
	$('#' + birthday).attr('value', getBirthday(idno));
}

// 验证是否中国大陆的身份证
function isChinaIDCard(strIdno) {
	if (null == strIdno || jQuery.trim(strIdno) == '') {
		alert('idno不能为空');
		return false;
	}
	strIdno = strIdno.toString();
	if (strIdno.length == 15) {
		if (!isValidDate("19" + strIdno.substr(6, 2), strIdno.substr(8, 2),
				strIdno.substr(10, 2))) {
			return false;
		}
	} else if (strIdno.length == 18) {
		if (!isValidDate(strIdno.substr(6, 4), strIdno.substr(10, 2), strIdno.substr(12, 2))) {
			return false;
		}
	} else {
		alert("输入的身份证号码必须为15位或者18位！");
		return false;
	}

	if (strIdno.length == 18) {
		var a, b, c
		if (!isNumber(strIdno.substr(0, 17))) {
			alert("身份证号码错误,前17位不能含有英文字母！");
			return false;
		}
		a = parseInt(strIdno.substr(0, 1)) * 7 + parseInt(strIdno.substr(1, 1)) * 9 + parseInt(strIdno.substr(2, 1)) * 10;
		a = a + parseInt(strIdno.substr(3, 1)) * 5 + parseInt(strIdno.substr(4, 1)) * 8 + parseInt(strIdno.substr(5, 1)) * 4;
		a = a + parseInt(strIdno.substr(6, 1)) * 2 + parseInt(strIdno.substr(7, 1)) * 1 + parseInt(strIdno.substr(8, 1)) * 6;
		a = a + parseInt(strIdno.substr(9, 1)) * 3 + parseInt(strIdno.substr(10, 1)) * 7 + parseInt(strIdno.substr(11, 1)) * 9;
		a = a + parseInt(strIdno.substr(12, 1)) * 10 + parseInt(strIdno.substr(13, 1)) * 5 + parseInt(strIdno.substr(14, 1)) * 8;
		a = a + parseInt(strIdno.substr(15, 1)) * 4 + parseInt(strIdno.substr(16, 1)) * 2;
		b = a % 11;
		if (b == 2) {// 最后一位为校验位
			c = strIdno.substr(17, 1).toUpperCase(); // 转为大写X
		} else {
			c = parseInt(strIdno.substr(17, 1));
		}
		switch (b) {
		case 0:
			if (c != 1) {
				alert("身份证好号码校验位错:最后一位应该为:1");
				return false;
			}
			break;
		case 1:
			if (c != 0) {
				alert("身份证好号码校验位错:最后一位应该为:0");
				return false;
			}
			break;
		case 2:
			if (c != "X") {
				alert("身份证好号码校验位错:最后一位应该为:X");
				return false;
			}
			break;
		case 3:
			if (c != 9) {
				alert("身份证好号码校验位错:最后一位应该为:9");
				return false;
			}
			break;
		case 4:
			if (c != 8) {
				alert("身份证好号码校验位错:最后一位应该为:8");
				return false;
			}
			break;
		case 5:
			if (c != 7) {
				alert("身份证好号码校验位错:最后一位应该为:7");
				return false;
			}
			break;
		case 6:
			if (c != 6) {
				alert("身份证好号码校验位错:最后一位应该为:6");
				return false;
			}
			break;
		case 7:
			if (c != 5) {
				alert("身份证好号码校验位错:最后一位应该为:5");
				return false;
			}
			break;
		case 8:
			if (c != 4) {
				alert("身份证好号码校验位错:最后一位应该为:4");
				return false;
			}
			break;
		case 9:
			if (c != 3) {
				alert("身份证好号码校验位错:最后一位应该为:3");
				return false;
			}
			break;
		case 10:
			if (c != 2) {
				alert("身份证好号码校验位错:最后一位应该为:2");
				return false;
			}
		}
	} else {// 15位身份证号
		if (!isNumber(strIdno)) {
			alert("身份证号码错误,前15位不能含有英文字母！");
			return false;
		}
	}
	// alert('身份证格式正确');
	return true;
}
/**
 * 检验是不是合法日期
 */
function isValidDate(iY, iM, iD) {
	if (iY > 2200 || iY < 1900 || !isNumber(iY)) {
		alert("输入身份证号,年度" + iY + "非法！");
		return false;
	}
	if (iM > 12 || iM <= 0 || !isNumber(iM)) {
		alert("输入身份证号,月份" + iM + "非法！");
		return false;
	}
	if (iD > 31 || iD <= 0 || !isNumber(iD)) {
		alert("输入身份证号,日期" + iD + "非法！");
		return false;
	}
	return true;
}
/**
 * 验证是不是数字
 */
function isNumber(oNum) {
	if (!oNum)
		return false;
	var strP = /^\d+(\.\d+)?$/;
	if (!strP.test(oNum))
		return false;
	try {
		if (parseFloat(oNum) != oNum)
			return false;
	} catch (ex) {
		return false;
	}
	return true;
}

// 根据正确的身份证，获取生日
function getBirthday(strIdno) {
	var birthday = "";
	var num = 0;
	if (strIdno.length == 15) {// 15位
		birthday = strIdno.charAt(6) + strIdno.charAt(7);
		if (parseInt(birthday) <= 10) {
			birthday = '20' + birthday;
		} else {
			birthday = '19' + birthday;
		}
	} else {// 18位
		birthday = strIdno.charAt(6) + strIdno.charAt(7) + strIdno.charAt(8) + strIdno.charAt(9);
		num = 2;
	}
	birthday = birthday + '-' + strIdno.charAt(num + 8) + strIdno.charAt(num + 9) + '-' + strIdno.charAt(num + 10) + strIdno.charAt(num + 11);
	return birthday;
}
// 根据正确的身份证，获取性别
function getGender(strIdno) {
	var MALE = 'GENDER_1';
	var FEMALE = 'GENDER_2';
	var num = strIdno.length == 18 ? 2 : 0;
	if (parseInt(strIdno.charAt(num + 14) / 2) * 2 != strIdno.charAt(num + 14)) {
		return MALE;// 男
	} else {
		return FEMALE;// 女
	}
}

function isEmpty(value) {// 如果value值是null值或者空字符串，返回false，否则返回true
	return (null != value && '' != jQuery.trim(value));
}
