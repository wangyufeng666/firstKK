$('#btnGoback').click(function(){
	parent.closeLayer();
});

/**
 * 新增规则类型
 * @param ruleId
 * @return
 */
function addQuestion(){
	layer.open({
		type:2,
		title:'新增检测项',
		content:'/rentrecy/rule/addquestion?ruleId='+ruleId,
		area:['600px','400px']
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
		content:'/rentrecy/rule/editquestion?questionId='+questionId,
		area:['600px','400px']
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
			,url:"/rentrecy/rule/delquestion"  //请求路径
			,data:{questionId:questionId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("删除失败："+data);
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
			,url:"/rentrecy/rule/enablequestion"  //请求路径
			,data:{questionId:questionId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("启用失败："+data);
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
			,url:"/rentrecy/rule/disablequestion"  //请求路径
			,data:{questionId:questionId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("停用失败："+data);
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
		content:'/rentrecy/rule/addanswer?questionId='+questionId,
		area:['600px','450px']
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
		content:'/rentrecy/rule/editanswer?answerId='+answerId,
		area:['600px','450px']
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
			,url:"/rentrecy/rule/deleteanswer"  //请求路径
			,data:{answerId:answerId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("删除失败："+data);
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
			,url:"/rentrecy/rule/enableanswer"  //请求路径
			,data:{answerId:answerId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("启用失败："+data);
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
			,url:"/rentrecy/rule/disableanswer"  //请求路径
			,data:{answerId:answerId} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.reload();
				}else{
					alert("停用失败："+data);
				}
			}
		});
	}
}

/**
 * 新增问题图文信息
 */
function questionTuWen(questionId,ruleId) {
    layer.open({
        type:2,
        title:'新增/修改问题图文信息',
        content:'/rentrecy/rule/questiontuwen?questionId='+questionId+'&ruleId='+ruleId,
        area:['800px','450px']
    });
}

/**
 * 新增答案图文信息
 */
function answerTuWen(answerId,ruleId){
    layer.open({
        type:2,
        title:'新增/修改答案图文信息',
        content:'/rentrecy/rule/answertuwen?answerId='+answerId+'&ruleId='+ruleId,
        area:['800px','450px']
    });
}

/**
 * 批量处理
 */
function batchOper(questionId){
    layer.open({
        type:2,
        title:'批量操作',
        content:'/rentrecy/rule/batchoperpage?questionId='+questionId,
        area:['900px','400px']
    });
}


function reload(){
	layer.closeAll('iframe');
	window.location.reload();
}
