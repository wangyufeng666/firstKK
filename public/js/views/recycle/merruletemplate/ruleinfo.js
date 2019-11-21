$('#btnGoback').click(function(){
	window.location.href = "/recycle/merruletemplate/index?backFlag=Y";
});

function relation(detailId){
	window.location.href = "/recycle/merruletemplate/relation?detailId="+detailId;
}

/**
 * 新增通用模板规则类型
 * @param ruleId
 * @return
 */
function addRuleType(ruleId){
	$.layer({
		type:2,
		title:'新增通用模板规则类型',
		iframe:{src:'/recycle/merruletemplate/addruletype?ruleId='+ruleId},
		area:['500','350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 修改规则类型
 * @param ruleTypeId
 * @return
 */
function editRuleType(ruleTypeId){
	$.layer({
		type:2,
		title:'修改通用模板规则类型',
		iframe:{src:'/recycle/merruletemplate/editruletype?ruleTypeId='+ruleTypeId},
		area:['500','350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除通用模板规则类型
 * @param ruleTypeId
 * @return
 */
function delRuleType(ruleTypeId){
	var ruleId = $('#ruleId').val();
	if(confirm('是否确认删除该通用模板规则类型？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merruletemplate/deleteruletype"  //请求路径
			,data:{ruleTypeId:ruleTypeId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = "/recycle/merruletemplate/ruleinfo?ruleId="+ruleId;
				}else{
					alert("删除失败");
				}
			}
		});
	}
}

/**
 * 新增通用模板规则明细
 * @param ruleTypeId
 * @return
 */
function addRuleDetail(ruleTypeId){
	$.layer({
		type:2,
		title:'新增通用模板规则明细',
		iframe:{src:'/recycle/merruletemplate/addruledetail?ruleTypeId='+ruleTypeId},
		area:['500','350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 修改通用模板规则明细
 * @param detailId
 * @return
 */
function editRuleDetail(detailId){
	$.layer({
		type:2,
		title:'修改通用模板规则明细',
		iframe:{src:'/recycle/merruletemplate/editruledetail?detailId='+detailId},
		area:['500','350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除规则明细
 * @param detailId
 * @return
 */
function delRuleDetail(detailId){
	if(confirm('是否确认删除该通用模板规则明细？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/merruletemplate/deleteruledetail"  //请求路径
			,data:{detailId:detailId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					var ruleId = $('#ruleId').val();
					window.location.href = "/recycle/merruletemplate/ruleinfo?ruleId="+ruleId;
				}else{
					alert("删除失败");
				}
			}
		});
	}
}