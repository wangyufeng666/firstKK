$('#btn_submit').click(function(){
	var datas = {};
	 datas.partnerCode = $('#partnerCode').val();
	 datas.jobNum = $('#jobNum').val();
	 datas.partnerName = $('#partnerName').html();
	 datas.createdate = $('#Date').val();
	 datas.desc = $('#desc').val();
	 if(datas.desc && datas.jobNum && datas.partnerCode){
		 $.post('/offline/areaemployee/savexundianlog',datas,function(data){
			 if(data == 'Y'){
				 alert('巡店完成');
				 window.parent.location.href = window.parent.location.href;
			 }else{
				 alert('巡店失败，请从新巡店');
			 }
		 })
	 }else{
		 alert('请输入巡店备注');
	 }
})