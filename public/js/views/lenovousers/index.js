var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
           ,{header:"姓名", dataIndex:'USERNAME', width:'120px', sortable:false}
           ,{header:"手机", dataIndex:'PHONENUM', width:'120px', sortable:false}
           ,{header:"工号", dataIndex:'JOBNUM', width:'120px', sortable:false}
           ,{header:"微信", dataIndex:'WEIXIN', width:'120px', sortable:false}
           ,{header:"门店编号", dataIndex:'STOREID', width:'120px', sortable:false}
           ,{header:"门店名", dataIndex:'STORENAME', sortable:false}
           ,{header:"操作", dataIndex:'', width:'80px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editUser(\''+data['USERID']+'\')">修改</a> | ';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="delUser(\''+data['USERID']+'\')">删除</a>';
					return returnText;
				}
           }
       ]
       ,url : '/system/lenovousers/userpagelist'
	});
});

/**
 * 新增门店店员
 */
function addUser(){
	window.location.href = "/system/lenovousers/adduser?backUrl=/system/lenovousers/indx";
}
/**
 * 功能描述：修改门店
 */
function editUser(userId){
	window.location.href = "/system/lenovousers/edituser?userId="+userId+"&backUrl=/system/lenovousers/index";
}

$(document).ready(function(){
	$("#province").change(function(){
		if($('#province').val()!=""){
	        $.ajax({
	        	type:'POST'//请求方式
	            ,url:"/system/lenovousers/getcity"  //请求路径
	            ,data:{provinceid:$('#province').val()}  //发送到服务器的数据
	            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
	            ,async:true //同步请求
	            ,timeout:60000//默认超时60秒
	            ,dataType:'json' //预期服务器返回的数据类型
	            ,success:function(data){
            		$("#store").html("<option value=''>请选择门店</option>");
                    $("#city").html("<option value=''>请选择城市</option>");
                    for(i in data){
                    	$("#city").append("<option value='"+data[i]['CITYID']+"'>"+data[i]['CITYNAME']+"</option>");
                    }
	            }
	        });
    	}else{
        	$("#city").html("<option value=''>请选择城市</option>");
        	$("#store").html("<option value=''>请选择门店</option>");
        }
	});

	$("#city").change(function(){
		if($('#city').val()!=""){
	        $.ajax({
	            type:'POST'//请求方式
	            ,url:"/system/lenovousers/getstorebycity"  //请求路径
	            ,data:{cityid:$('#city').val()}  //发送到服务器的数据
	            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
	            ,async:true //同步请求
	            ,timeout:60000//默认超时60秒
	            ,dataType:'json' //预期服务器返回的数据类型
	            ,success:function(data){
                    $("#store").html("<option value=''>请选择门店</option>");
                    for(i in data){
                        $("#store").append("<option value='"+data[i]['STORENO']+"'>"+data[i]['STORENAME']+"</option>");
                    }
	            }
	        });
    	}else{
        	$("#store").html("<option value=''>请选择门店</option>");
        }
	});
});

function delUser(userId){
	$.ajax({
        type:'POST'//请求方式
        ,url:"/system/lenovousers/deluser"  //请求路径
        ,data:{userId:userId} //发送到服务器的数据
        ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async:false //同步请求
        ,timeout:60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
    		if(data == "Y"){
    			window.location.href = "/system/lenovousers/index";
            }else{
				alert("删除失败");
            }
		}
	});
}

function getParams(){
    return {
    	province:$('#province').val(), 
    	city:$('#city').val(),
    	storeNo:$('#store').val(),
    	user:$('#user').val()
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