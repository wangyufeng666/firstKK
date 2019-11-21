$().ready(function(){
	initialselectshelfTab(code, boxCode);
	$(".git-box li").bind("click",function(){
		selectshelfTab($(this).attr("shelfcode"));
	});
	$(".locator li").bind("click",function(){
		selectBoxTab($(this).attr("boxcode"));
	});
	$(".detail-box .boxdetail .mer-boxdetail").bind('click', function(){
		if($(this).attr('mer-orderno')){
			if($(this).attr('class').indexOf('selected') == '-1'){
				$(this).addClass('selected');
			}else{
				$(this).removeClass('selected');
			}
		}
	});
	
	//老入库
	$("#storage").bind('click', function(){
		var code = $(".git-box .selected").attr("shelfcode");
		var boxcode = $(".locator .selected").attr('boxcode');
		var orderNos = [];
		$(".mer-boxdetail.selected").each(function(){
			orderNos.push($(this).attr('mer-orderno'));
		});
		var storderNo = orderNos.join(',');
		if(storderNo != ''){
			$.post('/mershelf/rank/putinstorage',{storderNo:storderNo},function(data){
				alert(data);
				window.location.href="/mershelf/rank/index?code="+code+"&boxcode="+boxcode;
			});
		}else{
			alert('请选择订单');
		}
	});
	
	//新入库
//	$("#storage").bind('click', function(){
//		var code = $(".git-box .selected").attr("shelfcode");
//		var boxcode = $(".locator .selected").attr('boxcode');
//		var orderNos = [];
//		$(".mer-boxdetail.selected").each(function(){
//			orderNos.push($(this).attr('mer-orderno'));
//		});
//		if(orderNos.length>1){
//			alert('一次最多入库一单，请一单单操作！');
//		}else{
//			if(orderNos.length>0){
//				layer.open({
//					type:2,
//					title:'入库',
//					content:'/warehouse/warehousebox/warehouse?orderNo='+orderNos,
//					area : ['100%', '100%'],
//					close : function(index){
//						layer.close(index);
//					},
//					end : function(index){
//						window.location.reload();
//					}
//				});
//			}else{
//				alert('请选择订单');
//			}
//		}
//	});
	
	//批量入库
	$("#withStorages").bind('click', function(){
		var code = $(".git-box .selected").attr("shelfcode");
		var boxcode = $(".locator .selected").attr('boxcode');
		var orderNos = [];
		var businessCodes = [];
		$(".mer-boxdetail.selected").each(function(){
			orderNos.push($(this).attr('mer-orderno'));
			businessCodes.push($(this).attr('businessCode'));
		});
		var orderNos = orderNos.join(',');
		console.log(businessCodes);
		var businessCodeFlag ='N';
		if(orderNos.length>0){
			if(Math.max.apply(null, businessCodes) === Math.min.apply(null, businessCodes)){//判断是否相等
				businessCodeFlag ='Y';
			}
			if(businessCodeFlag =='Y'){
				layer.open({
					type:2,
					title:'入库',
					content:'/warehouse/warehousebox/warehouse?orderNo='+orderNos,
					area : ['100%', '100%'],
					close : function(index){
						layer.close(index);
					},
					end : function(index){
						window.location.reload();
					}
				});
			}else{
				alert('非法，库位业务不一致！请选择一致的业务订单');
			}
		}else{
			alert('请选择订单');
		}
	});
	
	//取出清空
	$("#stopback").bind('click', function(){
		var orderNos = [];
		var i = 0;
		var code = $(".git-box .selected").attr("shelfcode");
		var boxcode = $(".locator .selected").attr('boxcode');
		$(".mer-boxdetail.selected").each(function(){
			orderNos.push($(this).attr('mer-orderno'));
			i++;
		});
		var moorderNo = orderNos.join(',');
		if(moorderNo != ''){
			if(confirm('是否确认取出 '+i+' 个选中的商品？')){
				$.post('/mershelf/rank/stopback',{moorderNo:moorderNo},function(data){
					if(data == 'Y'){
						alert('成功取出');
						window.location.href="/mershelf/rank/index?code="+code+"&boxcode="+boxcode;
					}
				});
			}
		}else{
			alert('请选中商品');
		}
	});
	//移库
	$("#moveout").bind('click', function(){
		var code = $(".git-box .selected").attr("shelfcode");
		var boxcode = $(".locator .selected").attr('boxcode');
		var orderNos = [];
		$(".mer-boxdetail.selected").each(function(){
			orderNos.push($(this).attr('mer-orderno'));
		});
		var moveorderNo = orderNos.join(',');
		if(moveorderNo){
			layer.open({
				type:2,
				title:'移动库位',
				content:'/mershelf/rank/boxmove?moveorderNo='+moveorderNo+'&boxType='+boxType,
				area : ['800px', '500px'],
				close : function(index){
					layer.close(index);
				},
				end : function(index){
					window.location.reload();
				}
			});
		}else{
			alert('请选择要移库的商品');
		}
	});
	
	//全部入库
	$("#storageAll").bind('click', function(){
		if(confirm('确认所有商品全部入库？')){
			$.post('/mershelf/rank/allstorage',{},function(data){
				if(data == 'Y'){
					alert('入库成功');
				}else{
                	alert('操作失败');
				}
				window.location.reload();//刷新
			});
		}
	});
	
	//待入库列表
	$('#inwareOrderList').click(function(){
		layer.open({
			type:2,
			title:'待入库列表',
			content:'/mershelf/rank/orders?status=5&boxType='+boxType,
			area:['600px', '450px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	//待退回列表
	$('#returnOrderList').click(function(){
		layer.open({
			type:2,
			title:'待退回列表',
			content:'/mershelf/rank/orders?status=98&boxType='+boxType,
			area:['600px', '450px'],
			close:function(index){
				layer.close(index);
			}
		});
	});
	
	function initialselectshelfTab(code,boxcode){
		$(".git-box li").removeClass("selected");
		$(".git-box").find("li[shelfcode="+code+"]").addClass('selected');
		$(".locator .mer-box").hide();
		$(".locator").find("li[shelfcode="+code+"]").show();
		selectBoxTab(boxcode);
	}
	function selectshelfTab(id){
		$(".git-box li").removeClass("selected");
		$(".git-box").find("li[shelfcode="+id+"]").addClass('selected');
		$(".locator .mer-box").hide();
		$(".locator").find("li[shelfcode="+id+"]").show();
		selectBoxTab(id+'01');
	}
	function selectBoxTab(id){
		$(".locator li").removeClass("selected");
		$(".detail-box .boxdetail").hide();
		$(".locator li[boxcode="+id+"]").addClass("selected");
		$("#"+id).show();
	}
	$(".flash").click(function(){
		window.location.reload();
	})
});