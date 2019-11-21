var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "类型编号", dataIndex: 'CLASSIFYCODE', width:'80px',sortable:false}
		    ,{header: "类型名", dataIndex: 'CLASSIFYNAME',sortable:false}
		    ,{header: "创建时间", dataIndex: 'CREATEDATE', width:'120px',sortable:false}
           ,{header: "是否有效", dataIndex: '', width:'70px',sortable:false,
               renderer : function(value, data, rowIndex, colIndex, metadata){
                   return data['ISVALID']=='1'?'<font color="green">有效</font>':'<font color="red">作废</font>';
               }
            }
           ,{header: "获取方式", dataIndex: '', width:'70px',sortable:false,
               renderer : function(value, data, rowIndex, colIndex, metadata){
                   var acquireTypeName = "";
                   switch(data['ACQUIRETYPE']){
                       case '1':
                           acquireTypeName = "优惠码";
                           break;
                       case '2':
                           acquireTypeName = "链接";
                           break;
                   }
                   return acquireTypeName;
               }
            }
           ,{header: "合作伙伴", dataIndex: 'PARTNERNAME', width:'120px',sortable:false}
           ,{header: "活动名称", dataIndex: 'EVENTNAME', width:'120px',sortable:false}
           ,{header: "操作", dataIndex: 'CLASSIFYCODE', width:'200px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a class="a_link" href="javascript:showDesc(\''+rowIndex+'\')">查看描述</a>';
					returnText +=' | <a class="a_link" href="javascript:alterType(\''+value+'\')">修改</a>';
					if(data['ISVALID'] == '1'){
                        returnText +=' | <a class="a_link" href="javascript:destroy(\''+value+'\')">作废</a>';
					}else if(data['ISVALID'] == '0'){
                        returnText +=' | <a class="a_link" href="javascript:recover(\''+value+'\')">恢复</a>';
					}
					returnText +=' | <a class="a_link" href="javascript:delType(\''+value+'\')">删除</a>';
					return returnText;
				}
           }
	]
    ,url : '/caiwu/coupon/categorylist'
    ,baseParams:{isAll:'all'}
  });
});

function showDesc(rowNum){
    alert(grid.data.result[rowNum]['TYPEDESC']);
}
function alterType(categoryCode){
    $.layer({
        type:2,
        title:'导入',
        iframe:{src:"/caiwu/coupon/altercategory?categoryCode="+categoryCode},
        area:['500' , '400'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
        typeCode:$("#typeCode").val(),
        typeName:$("#typeName").val(),
        price:$("#price").val(),
        acquireType:$("#acquireType").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#endCreateDate").val()
    };
}

function getParamsAsThisPage(){
    return {
    	price:$("#price").val(),
        typeCode:$("#typeCode").val(),
        typeName:$("#typeName").val(),
        acquireType:$("#acquireType").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#endCreateDate").val(),
        start:(grid.getPageNumber()-1)*10
    };
}

/**
 * 删除券类型
 * @param typeCode
 * @return
 */
function delType(categoryCode){
	if(confirm('是否删除券类型？')){
	    var load1 = layer.load('请稍候...');
	    $.ajax({
	        type : 'POST'//请求方式
	        ,url : "/caiwu/coupon/delcategory"  //请求路径
	        ,data : {categoryCode:categoryCode}  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : false //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success : function(data){
	            layer.close(load1);
	            if(data == 'Y'){
	                alert("删除成功");
	            }else{
	                alert("删除失败");
	            }
	            doSearch();
	        }
	    });
	}
}


/**
 * 作废券
 * @param typeCode
 * @return
 */
function destroy(categoryCode){
	if(confirm('是否作废券类型？')){
	    var load1 = layer.load('请稍候...');
	    $.ajax({
	        type : 'POST'//请求方式
	        ,url : "/caiwu/coupon/destroycategory"  //请求路径
	        ,data : {categoryCode:categoryCode}  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : false //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success : function(data){
	            layer.close(load1);
	            if(data == 'Y'){
	                alert("作废成功");
	            }else{
	                alert("作废失败");
	            }
	            doSearchAsThisPsge();
	        }
	    });
	}
}

/**
 * 恢复券
 * @param typeCode
 * @return
 */
function recover(categoryCode){
	if(confirm('是否确认恢复？')){
	    var load1 = layer.load('请稍候...');
	    $.ajax({
	        type : 'POST'//请求方式
	        ,url : "/caiwu/coupon/recovercategory"  //请求路径
	        ,data : {categoryCode:categoryCode}  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : false //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success : function(data){
	            layer.close(load1);
	            if(data == 'Y'){
	                alert("恢复成功");
	            }else{
	                alert("恢复失败");
	            }
	            doSearchAsThisPsge();
	        }
	        ,error: function(){
	            layer.close(load1);
	            alert("恢复失败");
	            doSearchAsThisPsge();
	        }
	    });
	}
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
        area:['280px','auto'],
        dialog:{msg:msg, type:8}
    });
}

function createCoupon(){
    $.layer({
        type:2,
        title:'创建优惠券类型',
        iframe:{src:'/caiwu/coupon/createcategory'},
        area:['500','400'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}