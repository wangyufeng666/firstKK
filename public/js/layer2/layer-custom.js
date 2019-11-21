/**
 * 错误对话框
 * @param msg
 * @return
 */
function errorBox(msg){
	layer.alert(msg,{icon:2, title:'提示'});
}
/**
 * 提示对话框
 * @param msg
 * @return
 */
function tipsBox(msg){
    $.layer({
        title:'提示',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}
    });
}

function successBox(msg){
    $.layer({
        title:'成功',
        area : ['280px','auto'],
        dialog : {msg:msg, type:1}    
    });
}
