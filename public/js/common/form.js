
//获取form 表单值
function getFormData(form){
	var data = form.serialize();
		data = decodeURI(data);
	var arr = data.split('&');
	var item,key,value,newData={};
	for(var i=0;i<arr.length;i++){
		item = arr[i].split('=');
		key = item[0];
		value = item[1];
		if(key.indexOf('[]')!=-1){
			key = key.replace('[]','');
			if(!newData[key]){
				newData[key] = [];
			}
			value = value.replace(/\+/g, ' ');
			newData[key].push(value);
		}else{
			value = value.replace(/\+/g, ' ');
			newData[key] = value;
		}
	}
	return newData;
}