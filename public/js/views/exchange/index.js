var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "NO", dataIndex: 'R', width:'18px',sortable:false} 
		   ,{header: "商品品牌", dataIndex: 'BRANDNAME', width:'40px',sortable:false}
		   ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'40px',sortable:false}
		   ,{header: "商品名称", dataIndex: 'MERNAME', width:'190px',sortable:false,
		       renderer : function(value, data, rowIndex, colIndex, metadata){
                   var returnText = data['MERNAME'];
                   if(data['TYPEDESC'])
                       returnText += ' ['+data['TYPEDESC']+']';
                   return returnText;
               }
		   }
		   ,{header: "1", dataIndex: '', width:'100px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var text = "暂无";
                    if(data['SORTLIST'] != "" && data['SORTLIST'] != null){
                        if(data['SORTLIST'][0]['PRICE']){
                            text = "【"+ data['SORTLIST'][0]['ESHOPTYPENAME'] + ":" + data['SORTLIST'][0]['SHOPNAME']+ "】" + data['SORTLIST'][0]['PRICE'];
                        }
                    }
                    return text;
                }
		   }
		   ,{header: "2", dataIndex: 'YHDPRICE', width:'100px',sortable:false,
		       renderer : function(value, data, rowIndex, colIndex, metadata){
                   var text = "暂无";
                   if(data['SORTLIST'] != "" && data['SORTLIST'] != null){
                       if(data['SORTLIST'][1] && data['SORTLIST'][1]['PRICE']){
                           text = "【"+ data['SORTLIST'][1]['ESHOPTYPENAME'] + ":" + data['SORTLIST'][1]['SHOPNAME']+ "】" + data['SORTLIST'][1]['PRICE'];
                       }
                   }
                   return text;
               }
		   }
		   ,{header: "3", dataIndex: 'SUNINGPRICE', width:'100px',sortable:false,
		       renderer : function(value, data, rowIndex, colIndex, metadata){
                   var text = "暂无";
                   if(data['SORTLIST'] != "" && data['SORTLIST'] != null){
                       if(data['SORTLIST'][2] && data['SORTLIST'][2]['PRICE']){
                           text = "【" + data['SORTLIST'][2]['ESHOPTYPENAME'] + ":" + data['SORTLIST'][2]['SHOPNAME']+ "】" + data['SORTLIST'][2]['PRICE'];
                       }
                   }
                   return text;
               }
		   }
		   ,{header: "操作", dataIndex: '', width:'90px', sortable:false,
			   renderer : function(value, data, rowIndex, colIndex, metadata){
				   var returnText ='<a class="a_link" href="javascript:void(0);" onclick="configure(\''+data['MERID']+'\')">配置</a>';
				   returnText += '|<a class="a_link" href="javascript:void(0);" onclick="control(\''+data['MERID']+'\')">店铺控制</a>';
				   if(data['ISENABLE'] == 'Y')
					   returnText += '|<a class="a_link" href="javascript:void(0);" onclick="hideInWeb(\''+data['MERID']+'\')">隐藏</a>';
				   else
					   returnText += '|<a class="a_link" href="javascript:void(0);" onclick="showInWeb(\''+data['MERID']+'\')">显示</a>';
				   returnText += '|<a class="a_link" href="javascript:void(0);" onclick="updateAllEbusiness(\''+data['MERID']+'\')">更新</a>';
				   returnText += '|<a class="a_link" href="javascript:void(0);" onclick="del(\''+data['MERID']+'\')">删除</a>';
				   return returnText;
				}
		   }
		 ]
		,url : '/exchange/exchange/ebusinessdatalist'
		,baseParams:{isAll:'all'}
	});
	$("#merType").change(function(){fillbrand();});
});

function getParams(){
	return {
        merType:$('#merType').val(),
        pcode:$('#pcode').val(), 
        keywords:$('#keywords').val()
    };
}

function getParamsAsThisPage(){
	return {
		start:(grid.getPageNumber()-1)*10,
        merType:$('#merType').val(),
        pcode:$('#pcode').val(), 
        keywords:$('#keywords').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function doSearchAsThisPsge(){
	layer.load('数据加载中...', 1);
	grid.query(getParamsAsThisPage());
}

function errorBox(msg){
    $.layer({
        title:'错误	',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

function addProduct(){
    window.location.href = "/exchange/exchange/addproduct";
}

function control(merId){
    $.layer({
        type : 2,
        title : '订单终止',
        iframe : {src : '/exchange/exchange/shopcontrol?merId='+merId},
        area : ['500' , '350'],
        offset : ['50px',''],
        close : function(index){
            window.location.href = "/exchange/exchange";
            layer.close(index);
        }
    });
}

function updateAllEbusiness(merId){
    var load1 = layer.load('更新中...');
    var EbusinessName;
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/exchange/exchange/updateallebusiness"  //请求路径
        ,data : {merId:merId}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            layer.close(load1);
            alert(data);
            doSearchAsThisPsge();
        }
        ,error: function(XMLHttpRequest, textStatus, errorThrown) {
            layer.close(load1);
            alert('未知错误');
        }
    });
}


function fillbrand(){
	var merType = $("#merType").val();
	$("#pcode").html("<option value=''>--未选择--</option>");
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/exchange/exchange/getbrand"  //请求路径
        ,data : {merType:merType}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            for(key in data){
            	$("#pcode").append("<option value='"+data[key]['PCODE']+"'>"+data[key]['PNAME']+"</option>");
            }
        }
    });
}

function del(merId){
	var load1 = layer.load('正在删除...');
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/exchange/exchange/delproduct"  //请求路径
        ,data : {merId:merId}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
        	layer.close(load1);
            if(data == 'Y')
            	alert("删除成功");
            else
            	alert("删除失败");
            doSearch();
        }
    });
}

function configure(merId){
	window.location.href = "/exchange/exchange/configure?merId="+merId;
}

function refresh(){
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/exchange/exchange/updateallinfo"  //请求路径
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : true //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
    });
    alert("后台已经开始更新，更新过程耗时较长，请勿频繁点击");
}

function hideInWeb(merId){
	var load1 = layer.load('请稍候...');
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/exchange/exchange/hideinweb"  //请求路径
        ,data : {merId:merId}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
        	layer.close(load1);
            if(data == 'Y')
            	alert("隐藏成功");
            else
            	alert("隐藏失败");
            doSearchAsThisPsge();
        }
    });
}

function showInWeb(merId){
	var load1 = layer.load('请稍候...');
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/exchange/exchange/showinweb"  //请求路径
        ,data : {merId:merId}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
        	layer.close(load1);
            if(data == 'Y'){
            	alert("显示成功");
            }else
            	alert("显示失败");
            doSearchAsThisPsge();
        }
    });
}

function changeEbusinessStatus(werId, EbusinessID, status){
    var load1 = layer.load('请稍候...');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/exchange/exchange/changeebusinessstatus"  //请求路径
        ,data : {werId:werId,EbusinessID:EbusinessID,status:status}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            layer.close(load1);
            if(data == 'Y'){
                alert("成功");
            }else
                alert("失败");
            doSearchAsThisPsge();
        }
    });
}