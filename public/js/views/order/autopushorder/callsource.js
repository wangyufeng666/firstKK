var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "来源名称", dataIndex: 'SOURCENAME', width:'80px',sortable:false}
      ,{header: "电话状态", dataIndex: '', width:'80px',sortable:false,
          renderer : function(value, data, rowIndex, colIndex, metadata){
              return returnText = data['ISCALL'] == 'Y' ? "<font color='green'>启用</font>":"<font color='red'>未启用</font>";
            }
      }
      ,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText = data['ISCALL'] == 'Y' ? "停用" : "启用";
    	  var sourcode = data['SOURCECODE'];
    	  var iscall = data['ISCALL'] == 'Y'?'N':'Y';
    	  returnText = "<a class='a_link' href='javascript:void(0);' onclick='switchCall(\""+sourcode+"\", \""+iscall+"\")'>"+returnText+"</a>";
    	  return returnText;
        }
      }
    ]
    ,url : '/order/autopushorder/callsourcelist'
    ,baseParams:initParams()
    ,pageSizeList:[10,15,20,30,50]
  });
  $('#synSource').bind('click', function(){synSource();});
});

function synSource(){
    $('#synSource').unbind('click');
    var load1 = layer.load('请稍等....');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/order/autopushorder/synsource"  //请求路径
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            layer.close(load1);
            if(data == "Y"){
                window.location.href = "/order/autopushorder/callsource";
            }
        }
    });
}

function switchCall(sourceCode, status){
    var load1 = layer.load('请稍等....');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/order/autopushorder/switchcall"  //请求路径
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,data : {sourceCode:sourceCode, status:status}
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            layer.close(load1);
            if(data == "Y"){
                window.location.href = "/order/autopushorder/callsource";
            }
        }
    });
}

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}


function getParams(){
    return {
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}