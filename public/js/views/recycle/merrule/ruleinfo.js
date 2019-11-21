
function relation(detailId){
	window.location.href = "/recycle/merrule/relation?detailId="+detailId;
}

/**
 * 新增规则类型
 * @param ruleId
 * @return
 */
function addRuleType(){
	layer.open({
		type:2,
		title:'新增规则类型',
		content:'/recycle/merrule/addruletype?ruleId='+ruleId,
		area:['500px','350px']
	});
}

/**
 * 修改规则类型
 * @param ruleTypeId
 * @return
 */
function editRuleType(ruleTypeId){
	layer.open({
		type:2,
		title:'修改规则类型',
		content:'/recycle/merrule/editruletype?ruleTypeId='+ruleTypeId,
		area:['500px','350px']
	});
}

/**
 * 删除规则类型
 * @param ruleTypeId
 * @return
 */
function delRuleType(ruleTypeId){
	if(confirm('是否确认删除该规则类型？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/deleteruletype"  //请求路径
			,data:{ruleTypeId:ruleTypeId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("删除失败");
				}
			}
		});
	}
}

/**
 * 新增规则明细
 * @param ruleTypeId
 * @return
 */
function addRuleDetail(ruleTypeId){
	layer.open({
		type:2,
		title:'新增规则明细',
		content:'/recycle/merrule/addruledetail?ruleTypeId='+ruleTypeId,
		area:['500px','350px']
	});
}

/**
 * 修改规则明细
 * @param detailId
 * @return
 */
function editRuleDetail(detailId){
	layer.open({
		type:2,
		title:'修改规则明细',
		content:'/recycle/merrule/editruledetail?detailId='+detailId,
		area:['500px','350px']
	});
}

/**
 * 删除规则明细
 * @param detailId
 * @return
 */
function delRuleDetail(detailId){
	if(confirm('是否确认删除该规则明细？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merrule/deleteruledetail"  //请求路径
			,data:{detailId:detailId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("删除失败");
				}
			}
		});
	}
}