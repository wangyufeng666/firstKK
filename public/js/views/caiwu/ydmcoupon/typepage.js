var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "类型号", dataIndex: 'TYPECODE', width:'70px',sortable:false} 
		    ,{header: "类型名", dataIndex: 'TYPENAME', width:'70px',sortable:false}
		    ,{header: "创建时间", dataIndex: 'CREATEDATE', width:'130px',sortable:false}
		    ,{header: "业务类型", dataIndex: 'COUPONOSCOPENAME', width:'130px',sortable:false}
           ,{header: "券类型", dataIndex: '', width:'80px',sortable:false,
               renderer : function(value, data, rowIndex, colIndex, metadata){
                   return data['COUPONOBJNAME']+data['COUPONFUNCNAME'];
               }
           }
           ,{header: "是否有效", dataIndex: '', width:'60px',sortable:false,
               renderer : function(value, data, rowIndex, colIndex, metadata){
                   return data['ISENABLE']=='Y'?'<font color="green">有效</font>':'<font color="red">作废</font>';
               }
            }
           ,{header: "限额", dataIndex: '', width:'70px',sortable:false,
               renderer : function(value, data, rowIndex, colIndex, metadata){
                   return data['LIMITPRICE']=='0'?'不限':data['LIMITPRICE'];
               }
           }
           ,{header: "优惠", dataIndex: 'PRICE', width:'70px',sortable:false}
           ,{header: "折扣", dataIndex: 'DISCOUNT', width:'70px',sortable:false,
               renderer : function(value, data, rowIndex, colIndex, metadata){
                   return parseFloat(data['DISCOUNT'])*100+'%';
               }
           }
           ,{header: "关联商品名", dataIndex: 'NICKNAME', width:'',sortable:false}
           ,{header: "操作", dataIndex: '', width:'290px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a class="a_link" href="javascript:void(0);" onclick="showDesc(\''+rowIndex+'\')">查看描述</a>';
					returnText +='&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="alterType(\''+data['TYPECODE']+'\')">修改</a>';
					if(data['ISENABLE'] == 'Y'){
					    returnText +='&nbsp;&nbsp;|&nbsp;&nbsp;<a class="a_link" href="javascript:void(0);" onclick="createCoupon(\''+data['TYPECODE']+'\')">生成</a>';
                        returnText +='&nbsp;&nbsp;|&nbsp;&nbsp;<a class="a_link" href="javascript:void(0);" onclick="destroy(\''+data['TYPECODE']+'\')">作废</a>';
					}else if(data['ISENABLE'] == 'N')
                        returnText +='&nbsp;&nbsp;|&nbsp;&nbsp;<a class="a_link" href="javascript:void(0);" onclick="recover(\''+data['TYPECODE']+'\')">恢复</a>';
					returnText +='&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="delType(\''+data['TYPECODE']+'\')">删除</a>';
					return returnText;
				}
           }
	]
    ,url : '/caiwu/ydmcoupon/typelist'
    ,baseParams:{isAll:'all'}
  });
});

function showDesc(rowNum){
    alert(grid.data.result[rowNum]['TYPEDESC']);
}
function alterType(typeCode){
    //window.location.href = "/caiwu/coupon/altertype?typeCode="+typeCode;
    $.layer({
        type : 2,
        title : '导入',
        iframe : {src : "/caiwu/ydmcoupon/altertype?typeCode="+typeCode},
        area : ['500' , '400'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function createCoupon(typeCode){
    $.layer({
        type : 2,
        title : '生成优惠券',
        iframe : {src : "/caiwu/ydmcoupon/createcoupon?typeCode="+typeCode},
        area : ['500' , '400'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
        typeCode:$("#typeCode").val(),
        typeName:$("#typeName").val(),
        couponObj:$("#couponObj").val(),
        couponFunc:$("#couponFunc").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#startCreateDate").val()
    };
}

function getParamsAsThisPage(){
    return {
        typeCode:$("#typeCode").val(),
        typeName:$("#typeName").val(),
        couponObj:$("#couponObj").val(),
        couponFunc:$("#couponFunc").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#endCreateDate").val(),
        start:(grid.getPageNumber()-1)*10
    };
}

function delType(typeCode){
    
    var load1 = layer.load('请稍候...');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/caiwu/ydmcoupon/deltype"  //请求路径
        ,data : {typeCode:typeCode}  //发送到服务器的数据
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
    });;
}

function destroy(typeCode){
    var load1 = layer.load('请稍候...');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/caiwu/ydmcoupon/destroytype"  //请求路径
        ,data : {typeCode:typeCode}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            layer.close(load1);
            if(data == 'Y')
                alert("作废成功");
            else
                alert("作废失败");
            doSearchAsThisPsge();
        }
    });;
}

function recover(typeCode){
    var load1 = layer.load('请稍候...');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/caiwu/ydmcoupon/recovertype"  //请求路径
        ,data : {typeCode:typeCode}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            layer.close(load1);
            if(data == 'Y')
                alert("恢复成功");
            else
                alert("恢复失败");
            doSearchAsThisPsge();
        }
        ,error: function(){
            layer.close(load1);
            alert("恢复失败");
            doSearchAsThisPsge();
        }
    });
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
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

function addType(){
    $.layer({
        type : 2,
        title : '新建类型',
        iframe : {src : '/caiwu/ydmcoupon/addtype'},
        area : ['700' , '400'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}