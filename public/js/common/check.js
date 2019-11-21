		
/*判断为空*/
function isEmpty(o){
	return o==""?true:false;
}


/*判断是否为合适长度 6-32 位*/
function isProperLen(o){
	var len=o.replace(/[^\x00-\xff]/g,"11").length;
	if(len>32||len<6){
		return false;
	}else{
		return true;
	}
}



/*判断是否为Email*/
function isEmail(o){
	var reg=/^\w+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/i;
	return reg.test(o);
}

/*判断url是否正确*/
function isUrl(o){
	var reg=/^(http\:\/\/)?(\w+\.)+\w{2,3}((\/\w+)+(\w+\.\w+)?)?$/;
	return reg.test(o);
}

/*判断是否为电话号码 可以是手机或 固定电话*/
function isPhone(v){
	var reg=/((15[89])\d{8})|((13)\d{9})|(0[1-9]{2,3}\-?[1-9]{6,7})/i;
	if(reg.test(v)){
		return true;
	}else{
		return false;
	}
}
function isNum(o){
	var reg=/[^\d]+/;
	return reg.test(o)?false:true;
}
function isChinese(o){
	var reg=/^[\u4E00-\u9FA5]+$/;
	return reg.test(o);
}

/*去除空白字符*/
function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, "");
}

function ShowMes(o,mes,type){
	if(!o.ele){
		var Xmes=document.createElement("div");
		document.body.appendChild(Xmes);
		o.ele=Xmes;
	}
	o.ele.className=type;
	o.ele.style.display="block";
	o.ele.style.left=(XgetPosition(o).x+220)+"px";
	o.ele.style.top=XgetPosition(o).y+"px";
	o.ele.innerHTML=mes;
}

function XgetPosition(e){
	var left = 0;
	var top  = 0;
	while(e.offsetParent){
		left += e.offsetLeft;
		top  += e.offsetTop;
		e= e.offsetParent;
	}
	left += e.offsetLeft;
	top  += e.offsetTop;
	return {
		x:left, y:top
	};
}
