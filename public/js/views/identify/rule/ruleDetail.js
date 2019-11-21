/**
 * 新增规则类型
 * @param ruleId
 * @return
 */
function addQuestion(){
	layer.open({
		type:2,
		title:'新增检测项',
		content:'/identify/rule/addquestion?ruleId='+ruleId,
		area:['650px','400px']
	});
}

/**
 * 修改规则类型
 * @param ruleTypeId
 * @return
 */
function editQuestion(questionId){
	layer.open({
		type:2,
		title:'修改检测项',
		content:'/identify/rule/editquestion?questionId='+questionId,
		area:['650px','400px']
	});
}

/**
 * 删除规则类型
 * @param ruleTypeId
 * @return
 */
function delQuestion(questionId){
	if(confirm('是否确认删除该检测项？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/delquestion" //请求路径
			,data:{questionId:questionId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = window.location.href;
				}else{
					alert("删除失败");
				}
			}
		});
	}
}

/**
 * 启用规则类型
 * @param ruleTypeId
 * @return
 */
function enableQuestion(questionId){
	if(confirm('是否确认启用该检测项？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/enablequestion" //请求路径
			,data:{questionId:questionId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = window.location.href;
				}else{
					alert("启用失败");
				}
			}
		});
	}
}

/**
 * 停用规则类型
 * @param ruleTypeId
 * @return
 */
function disableQuestion(questionId){
	if(confirm('是否确认删除该检测项？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/disablequestion" //请求路径
			,data:{questionId:questionId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = window.location.href;
				}else{
					alert("停用失败");
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
function addAnswer(questionId){
	layer.open({
		type:2,
		title:'新增检测项明细',
		content:'/identify/rule/addanswer?questionId='+questionId,
		area:['700px','450px']
	});
}

/**
 * 修改规则明细
 * @param detailId
 * @return
 */
function editAnswer(answerId){
	layer.open({
		type:2,
		title:'修改检测项明细',
		content:'/identify/rule/editanswer?answerId='+answerId,
		area:['700px','450px']
	});
}

/**
 * 删除规则明细
 * @param detailId
 * @return
 */
function delAnswer(answerId){
	if(confirm('是否确认删除该检测项明细？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/deleteanswer" //请求路径
			,data:{answerId:answerId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = window.location.href;
				}else{
					alert("删除失败");
				}
			}
		});
	}
}

/**
 * 启用答案
 * @returns
 */
function enableAnswer(answerId){
	if(confirm('是否启用该检测项明细？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/enableanswer" //请求路径
			,data:{answerId:answerId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = window.location.href;
				}else{
					alert("启用失败");
				}
			}
		});
	}
}

/**
 * 停用答案
 * @returns
 */
function disableAnswer(answerId){
	if(confirm('是否停用该检测项明细？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/disableanswer" //请求路径
			,data:{answerId:answerId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = window.location.href;
				}else{
					alert("停用失败");
				}
			}
		});
	}
}

function enableAllRule(){
	if(confirm('是否确认一键启用规则以及鉴定模板？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/identify/rule/enableallrule" //请求路径
			,data:{ruleId:ruleId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000 //默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					parent.reload();
				}else{
					alert("启用失败："+data);
				}
			}
		});
	}
}

function reload(){
	layer.closeAll('iframe');
	window.location.href = window.location.href;
}
