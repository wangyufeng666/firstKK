
function changes(id,st){
	$.ajax({
		type: "POST",
		dataType:"json",
		url:'/xitong/systing/xgst',
		data:{id:id,st:st},
		success: function(data){
			if(data=='1'){
				alert('设置成功');
				window.location.href="/xitong/systing/kgsz";
			}else{
				alert("停用操作失败");
            }
		}
	});
}

function doxg(){
	var c=$("#lvz").val();

	if(c <=0 || c> 100){
		alert('请输入的值在1和100之间');
		window.location.href="/xitong/systing/kgsz";
		return ;
	}

	$.ajax({
		type: "POST",
		dataType:"json",
		url:'/xitong/systing/xgcs',
		data:{st:$("#lvz").val()},
		success: function(data){
			if(data=='1'){
				alert('设置成功');
				window.location.href="/xitong/systing/kgsz";
			}else{
				alert("停用操作失败");
			}
    	}
	});
}

/**
 * 修改所属类型利润比
 */
function updateProfit(){

	
	var load1 = layer.load('数据加载中...');
	var partn = /^([1-9]\d?(\.\d{1,2})?|0.\d{1,2}|100)$/;
	var flag = true;
	var params = [];
  
	$('.sslx').each(function(){
		var id = $(this).attr('id');
		var value = $(this).val();

		if(partn.exec(value)){
			params.push(id+":"+value);
      	}else{
      		$(this).css({border:'1px solid red'});
      		flag = false;
        	return false;
      	}
    });
	if(flag){
		$.post('/xitong/systing/saveprofit',{params:params.join(',')}, function(data){
			layer.close(load1);
		});
    }else{
    	layer.close(load1);
    }
}