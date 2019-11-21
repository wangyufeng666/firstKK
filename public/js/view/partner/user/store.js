var option =$('#store option:selected'); 
var storeNo = option.val();
var storeName = option.text();
function savePromotion(){
	$.ajax({
		type:'post'
		,url:"/offlinem/user/savepromoterinfo"
		,data:{storeNo:storeNo, mobile:mobile,storeName:storeName}
		,cache:false
		,async:false
		,timeout:60000
		,dataType:'json'
		,success:function(data){
			window.location.href = '/offlinem/user/center?storeNo='+storeNo+'&storeName='+storeName;
		}	
	})
}