var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		    ,{header:"省份", dataIndex:'PROVINCE', width:'80px', sortable:false}
		    ,{header:"城市", dataIndex:'CITY', width:'80px', sortable:false}
           ,{header:"门店编号", dataIndex:'STORENO', width:'80px', sortable:false}
           ,{header:"门店名", dataIndex:'STORENAME', sortable:false}
           ,{header:"门店地址", dataIndex:'STOREADDRESS', width:'20%', sortable:false}
           ,{header:"门店类型", dataIndex:'STORETYPE', width:'20%', sortable:false}
           ,{header:"备注", dataIndex:'REMARKS', width:'20%', sortable:false}
           ,{header:"操作", dataIndex:'', width:'100px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editStore(\''+data['STORENO']+'\')">修改</a> | ';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="delStore(\''+data['STORENO']+'\')">删除</a>';
					return returnText;
				}
           }
       ]
       ,url : '/system/lenovostore/storelist'
	});
});

/**
 * 新增门店
 */
function addStore(){
	window.location.href = "/system/lenovostore/addstore?backUrl=/system/lenovostore/index";
}
/**
 * 功能描述：修改门店
 */
function editStore(storeNo){
	window.location.href = "/system/lenovostore/editstore?storeNo="+storeNo+"&backUrl=/system/lenovostore/index";
}

$(document).ready(function(){
    $("#province").change(function(){
    	$("#city").html("<option value=''>请选择城市</option>");
    	var provinceId = $('#province').val();
    	if(provinceId != ""){
	        $.ajax({
	            type : 'POST'//请求方式
	            ,url : "/system/inspector/getcitybyprovinceid"//请求路径
	            ,data : {provinceid:provinceId}//发送到服务器的数据
	            ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	            ,async : true //同步请求
	            ,timeout :60000//默认超时60秒
	            ,dataType:'json' //预期服务器返回的数据类型
	            ,success : function(data){
                    $("#city").html("<option value=''>请选择城市</option>");
                    for(i in data){
                        $("#city").append("<option value='"+data[i]['AREA_ID']+"'>"+data[i]['AREA_NAME']+"</option>");
                    }
	            }
	        });
        }
	});
});

function delStore(storeNo){
	$.ajax({
        type : 'POST'//请求方式
        ,url : "/system/lenovostore/delstore"  //请求路径
        ,data : {storeNo:storeNo} //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
		,success : function(data){
    		if(data == "Y"){
        			window.location.href = "/system/lenovostore/index";
            }else{
				alert("删除失败");
            }
		}
	});
}

function getParams(){
    return {
    	storeName:$('#storeName').val(),
    	province:$('#province').val(),
    	city:$('#city').val()
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