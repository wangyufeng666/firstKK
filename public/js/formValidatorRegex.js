var regexEnum = 
{
	intege:"^-?[1-9]\\d*$",					//整数
	intege1:"^[1-9]\\d*$",					//正整数
	intege2:"^-[1-9]\\d*$",					//负整数
	num:"^([+-]?)\\d*\\.?\\d+$",			//数字
	num1:"^[1-9]\\d*|0$",					//正数（正整数 + 0）
	num2:"^-[1-9]\\d*|0$",					//负数（负整数 + 0）
	decmal:"^([+-]?)\\d*\\.\\d+$",			//浮点数
	decmal1:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*$",	//正浮点数
	decmal2:"^-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*)$",//负浮点数
	decmal3:"^-?([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0)$",//浮点数
	decmal4:"^[1-9]\\d*.\\d*|0.\\d*[1-9]\\d*|0?.0+|0$",//非负浮点数（正浮点数 + 0）
	decmal5:"^(-([1-9]\\d*.\\d*|0.\\d*[1-9]\\d*))|0?.0+|0$",//非正浮点数（负浮点数 + 0）
	//如果格式校验不允许空，那么使用此校验格式的同时也要求了非空
	email:"^|\\w+((-\\w+)|(\\.\\w+))*\\@[A-Za-z0-9]+((\\.|-)[A-Za-z0-9]+)*\\.[A-Za-z0-9]+$", //邮件
	color:"^[a-fA-F0-9]{6}$",				//颜色
	url:"^http[s]?:\\/\\/([\\w-]+\\.)+[\\w-]+([\\w-./?%&=]*)?$",	//url
	chinese:"^[\\u4E00-\\u9FA5\\uF900-\\uFA2D]+$",					//仅中文
	ascii:"^[\\x00-\\xFF]+$",				//仅ACSII字符
	zipcode:"^\\d{6}$",						//邮编
	mobile:"^(13|15)[0-9]{9}$",				//手机
	ip4:"^(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)\\.(25[0-5]|2[0-4]\\d|[0-1]\\d{2}|[1-9]?\\d)$",	//ip地址
	notempty:"^\\S+$",						//非空
	picture:"(.*)\\.(jpg|bmp|gif|ico|pcx|jpeg|tif|png|raw|tga)$",	//图片
	rar:"(.*)\\.(rar|zip|7zip|tgz)$",								//压缩文件
	date:"^\\d{4}(\\-|\\/|\.)\\d{1,2}\\1\\d{1,2}|$",					//日期
	qq:"^[1-9]*[1-9][0-9]*$",				//QQ号码
	tel:"^(([0\\+]\\d{2,3}-)?(0\\d{2,3})-)?(\\d{7,8})(-(\\d{3,}))?$",	//电话号码的函数(包括验证国内区号,国际区号,分机号)
	username:"^\\w+$",						//用来用户注册。匹配由数字、26个英文字母或者下划线组成的字符串
	letter:"^[A-Za-z]+$",					//字母
	letter_u:"^[A-Z]+$",					//大写字母
	letter_l:"^[a-z]+$",					//小写字母
	idcard:"^[1-9]([0-9]{14}|[0-9]{17})$"	//身份证
}

var aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"} 

function isCardID(sId){ 
	var iSum=0 ;
	var info="" ;
	if(!/^\d{17}(\d|x)$/i.test(sId)) return   false;  //"你输入的身份证长度或格式错误"; 
	sId=sId.replace(/x$/i,"a"); 
	if(aCity[parseInt(sId.substr(0,2))]==null) return  false;  //"你的身份证地区非法"; 
	sBirthday=sId.substr(6,4)+"-"+Number(sId.substr(10,2))+"-"+Number(sId.substr(12,2)); 
	var d=new Date(sBirthday.replace(/-/g,"/")) ;
	if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))return  false;  //"身份证上的出生日期非法"; 
	for(var i = 17;i>=0;i --) iSum += (Math.pow(2,i) % 11) * parseInt(sId.charAt(17 - i),11) ;
	if(iSum%11!=1) return  false;  //"你输入的身份证号非法"; 
	return true;//aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女") 
} 
//获取身份证里：出生日期，性别
function cardTOInfo(sId){
	var iSum=0 ;
	var info="" ; 
	sId=sId.replace(/x$/i,"a");  
	sBirthday=sId.substr(6,4)+"-"+sId.substr(10,2)+"-"+sId.substr(12,2);  
	gender = (sId.substr(16,1)%2?"GENDER_1":"GENDER_2")//GENDER_2为女性,GENDER_1为男性,依据数据库syscode定义 
	
	var splitArr = sBirthday.split('-'); //确保日期格式：yyyy-MM-dd
//	if(  splitArr[1].length=1)
//	{ splitArr[1] = '0'+splitArr[1];}
//	if(  splitArr[2].length=1)
//	{	splitArr[2]  = '0'+splitArr[2];}
	var brithday = splitArr[0]+'-'+splitArr[1]+'-'+splitArr[2]; 
	
	var arr = new Array();
	arr[0] = brithday;
	arr[1] = gender;
	return arr;
}

//短时间，形如 (13:04:06)
function isTime(str)
{
	var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
	if (a == null) {return false}
	if (a[1]>24 || a[3]>60 || a[4]>60)
	{
		return false;
	}
	return true;
}

//短日期，形如 (2003-12-05)
function isDate(str)
{
	var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/); 
	if(r==null)return false; 
	var d= new Date(r[1], r[3]-1, r[4]); 
	return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]);
}

//长时间，形如 (2003-12-05 13:04:06)
function isDateTime(str)
{
	var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/; 
	var r = str.match(reg); 
	if(r==null) return false; 
	var d= new Date(r[1], r[3]-1,r[4],r[5],r[6],r[7]); 
	return (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4]&&d.getHours()==r[5]&&d.getMinutes()==r[6]&&d.getSeconds()==r[7]);
} 
//金额校验 
function isDigit(data) 
{ 
	  if   (data   ==   "")   return   true;   
	  var   re   =   /^[\-\+]?([0-9]\d*|0|[1-9]\d{0,2}(,\d{3})*)(\.\d+)?$/;   
      if(re.test(data))
    	  return true;
      else  {
    	  this.focus();
    	  alert("请输入数字类型字符！");
    	  return false;
      }
} 
//将小数转换为千分位 如：899，211，33.00
function num3du(num){ 
 if(num != '' ){
	    var  re=/(-?\d+)(\d{3})/     ;
	    if(num.indexOf('.')==-1){   //整数类 
	    	if(num.indexOf(',') !=-1 ){
		    	 num = num.replace(',','');
		     }
	    	 while(re.test(num)){     
	    	              num=num.replace(re,"$1,$2");     
	    	    }   
	        num = num + '.00';
	    }else{                     //小数类
	    	 var intvalue = '';
	         numvalue = num.split('.');	 
	         if(numvalue[0].indexOf(',') !=-1 ){
	        	 intvalue = numvalue[0].replace(',',''); 
	        }else{
		    	 intvalue = numvalue[0];
		     }
	         while(re.test(intvalue))
	        	             intvalue=intvalue.replace(re,"$1,$2");
	        if(intvalue == '')
	        {
	        	num = 0 + '.' +numvalue[1]; 	//小于1的要在前面加个0        	
	        } 
	        else
	        {
	        	num = intvalue + '.' +numvalue[1]; 
	      	}
	        
	    } 
 } 
 return num;
}
//千分位转小数
function cancle3du(num){
       if(num!='' )
       { 
    	   while(num.indexOf(',') != -1)
    	    	  num = num.replace(',',''); 
       } 
       return num;
}
//日期判断
function checkDate(value)
{ 
    if((/^\d{4}-\d{1,2}-\d{1,2}$/).test(value) == false)
    {

        alert("错误的日期格式，日期格式如：2008-8-8");
        return false;
    }
    
    dateArr = value.split("-");
    monthPerDays = new Array(31,28,31,30,31,30,31,31,30,31,30,31);    
    year = dateArr[0];
    month = dateArr[1];
    day = dateArr[2];

    if(month >12 || month<0)
    {
        alert("错误的日期月份");
        return false;
    }

    if(day>31 || day<0 )
    {
        alert("错误的日期天数");
        return false;
    }

    if(year%100 == 0)
    {
        if(year%400 == 0)
            monthPerDays[1] = 29;
    }
    else
    {
        if(year%4 == 0)
            monthPerDays[1] = 29;
    }

    if(monthPerDays[month-1] < day)
    {
        alert("错误的日期天数");
        return false;
    }
     
    return true;
}
