$().ready(function(){
	initialselectshelfTab(code, boxCode);
	$(".git-box li").bind("click",function(){
		selectshelfTab($(this).attr("shelfcode"),$(this).attr("businesscode"),$(this).attr("shelfname"));
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
	
	//确认入库
	$('#inHoureButton').click(function(){
		var code = $(".git-box .selected").attr("shelfcode");
		var shelfname = $(".git-box .selected").attr("shelfname");
		var businesscode = $(".git-box .selected").attr("businesscode");
		var boxcode = $(".locator .selected").attr('boxcode');
		var boxname = $(".locator .selected").attr('boxname');
		var attr_mertype = $(".locator .selected").attr('mertype');
		var attr_mertypename = $(".locator .selected").attr('mertypename');
		if(orderNo==''){
			alert('单号不能为空，请返回重试！');
		}
		if(merType == attr_mertype || attr_mertype ==''){
			if(confirm('确认放入该库位下？')){
				$.post('/warehouse/warehousebox/savewarehouse',{orderNo:orderNo,businesscode:businesscode,shelfcode:code,shelfname:shelfname,boxcode:boxcode,boxname:boxname},function(data){
					if(data =='Y'){
						alert('入库成功！');
						window.location.href="/warehouse/warehousebox/warehouse?code="+code+"&boxcode="+boxcode+"&businesscode="+businesscode;
					}else if(data =='S'){
						alert('订单目前所属状态有误，不允许入库操作！');
					}else if(data =='A'){
						alert('该订单已经入库了，不允许重复入库！');
					}else{
						alert('入库失败，请返回重试！');
					}
				});
			}
		}else{
			alert('该库位被限制为【品类:'+attr_mertypename+'】库位，订单为【品类:'+merTypeName+'】请放入其他非限制库位。');
		}
	});
	
	//移库
	$("#moveout").bind('click', function(){
		var shelfcode = $(".git-box .selected").attr("shelfcode");
		var orderNos = [];
		var boxcode = $(".locator .selected").attr('boxcode');
		var attr_boxcode = boxType+'01'+'A';
		if(boxcode == attr_boxcode){
			attr_boxcode = boxType+'02'+'A';
		}
		$(".mer-boxdetail.selected").each(function(){
			orderNos.push($(this).attr('mer-orderno'));
		});
		var moveorderNo = orderNos.join(',');
		if(moveorderNo){
			layer.open({
				type:2,
				title:'移动库位',
				content:'/warehouse/warehousebox/boxmove?moveorderNo='+moveorderNo+'&businessCode='+boxType+'&shelfcode='+shelfcode+'&boxcode='+attr_boxcode+'&lastboxcode='+boxcode,
				area : ['90%', '90%'],
				close : function(index){
					layer.close(index);
				},
				end : function(index){
					window.location.href='/warehouse/warehousebox/warehouse?code='+shelfcode+'&boxcode='+boxcode+'&businesscode='+boxType;
					//window.location.reload();
				}
			});
		}else{
			alert('请选择要移库的商品');
		}
	});
	
	//出库
	$("#outwarehouse").bind('click', function(){
		var orderNos = [];
		var i = 0;
		var code = $(".git-box .selected").attr("shelfcode");
		var boxcode = $(".locator .selected").attr('boxcode');
		$(".mer-boxdetail.selected").each(function(){
			orderNos.push($(this).attr('mer-orderno'));
			i++;
		});
		var out_orders = orderNos.join(',');
		if(out_orders != ''){
			if(confirm('是否确认出库 '+i+' 个选中的商品？')){
				if(out_orders){
					layer.open({
						type:2,
						title:'出库信息',
						shadeClose:false,
						shade:0.8,
						content:'/warehouse/warehousebox/outware?out_orders='+out_orders,
						area : ['500px', '325px'],
						close : function(index){
							layer.close(index);
						},
						end : function(index){
							window.location.href='/warehouse/warehousebox/warehouse?code='+code+'&boxcode='+boxcode+'&businesscode='+boxType;
						}
					});
				}
			}
		}else{
			alert('请选中商品');
		}
	});
	
	//搜索
	$('#searchButton').click(function(){
		var orderNo = $("#search_input").val();
		if(orderNo==''){
			alert('单号不能为空，请输入查询单号！');
		}else{
			$.post('/warehouse/warehousebox/ordersearch',{orderNo:orderNo,businessCode:boxType},function(data){
				if(data.FLAG =='Y'){
					$(".git-box li").removeClass("selected");
					$(".git-box").find("li[shelfcode="+data.SHELFCODE+"]").addClass('selected');
					$(".locator .mer-box").hide();
					$(".locator").find("li[shelfcode="+data.SHELFCODE+"]").show();
					selectBoxTabAndOrder(data.BOXCODE,data.ORDERNO);
				}else if(data.FLAG =='N'){
					alert('未查询到有关该订单的信息，请确认订单号是否正确！');
				}else if(data.FLAG =='TWO'){
					alert('未能定位到订单号，请输出精准的订单号信息。');
				}else if(data.FLAG =='OUT'){
					alert('该订单已出库，不存在库位信息！');
				}else if(data.FLAG =='BN'){
					alert('该订单不属于该业务库位！请到'+data.BUSINESSNAME+'寻到。');
				}
			});
		}
	});
	
	function selectBoxTabAndOrder(id,orderNo){
		$(".locator li").removeClass("selected");
		$(".detail-box .boxdetail").hide();
		$(".locator li[boxcode="+id+"]").addClass("selected");
		$("#"+id).show();
		$(".detail-box .boxdetail .mer-boxdetail[mer-orderno="+orderNo+"]").addClass("selected");
	}
	
	function initialselectshelfTab(code,boxcode){
		$(".git-box li").removeClass("selected");
		$(".git-box").find("li[shelfcode="+code+"]").addClass('selected');
		$(".locator .mer-box").hide();
		$(".locator").find("li[shelfcode="+code+"]").show();
		selectBoxTab(boxcode);
	}
	function selectshelfTab(id,businesscode,shelfname){
		$(".git-box li").removeClass("selected");
		$(".git-box").find("li[shelfcode="+id+"]").addClass('selected');
		$(".locator .mer-box").hide();
		$(".locator").find("li[shelfcode="+id+"]").show();
		var fristBox = businesscode+'01'+shelfname;
		selectBoxTab(fristBox);
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