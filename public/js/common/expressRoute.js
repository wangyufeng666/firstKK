var layerIndex = layerIndex || '';
function expressRoute(mailNo, orderNo){
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,data:{mailNo:mailNo},
		url:'http://112.124.53.140:8866/gomestore/rentrecyapi/exproute',
		success:function(data){
			var html = '';
			if(data){
				for(var i in data){
					html += '【'+data[i].accept_time+'】'+data[i].remark+'<br/>';
				}
			}
			layer.close(layerIndex);
			html += '<a href="http://www.sf-express.com/cn/sc/dynamic_function/waybill/#search/bill-number/'+mailNo+'" target="_blank">官网查询</a><br/>';
			layerIndex = layer.open({
				type:1, shade:false, title:false, area:['800px', 'auto'],
				content:'<div class="layer_notice">单号：'+orderNo+'<br/>'+html+'</div>'
			});
		}
	});
}