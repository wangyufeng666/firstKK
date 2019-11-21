$().ready(function(){
	$('#saveButton').bind('click', function(){saveMerInfo();});

});

/**
 * 保存商品信息
 * @param thisAttrId
 * @returns
 */
function saveMerInfo(thisAttrId){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var params = {
				merId:$('#merId').val(),
				merCode:$('#merCode').val()
		};
		
		if(params.merId == ''){
			alert('请选择商品');
			$('#saveButton').bind('click', function(){saveMerInfo();});
			return;
		}
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/product/zol/updatemer" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data.code == "Y"){
					parent.reload();
				}else{
					alert(data.data)
				}
			},
			error:function(){
				alert('修改保存失败，请重新修改');
				$('#saveButton').bind('click', function(){saveMerInfo();});
			}
		});
	}else{
		$('#saveButton').bind('click', function(){saveMerInfo();});
	}
}

/**
 * 选择商品
 * @returns
 */
function selectMerInfo(){
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/product/cooperate/merlist',
		area:['99%','99%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){
	
	var merName = '', merType = '', brandCode = '', ruleId = '';
	ruleId = p_merInfo['SSLXID'];
	merType = p_merInfo['MERTYPE'];
	merName = p_merInfo['PNAME']+' '+p_merInfo['MERNAME'];
	brandCode = p_merInfo['PCODE'];
	
	layer.closeAll('iframe');
	var thisMerType = $('#merType').val();
	if(thisMerType != merType){
		$('#brandCode').val(brandCode);
		$('#merType').val(merType).trigger('change', [brandCode]);
	}
	$('#merId').val(merId);
	$('#merName').html(merName);
}

function goBack(){
	parent.reload();
}