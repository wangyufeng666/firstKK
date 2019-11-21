var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "活动编号", dataIndex: 'EVENTCODE', width:'120px',sortable:false}
		    ,{header: "活动名称", dataIndex: 'EVENTNAME',sortable:false}
		    ,{header: "创建时间", dataIndex: 'CREATEDATE', width:'120px',sortable:false}
           ,{header: "开始时间", dataIndex: 'STARTDATE', width:'120px',sortable:false}
           ,{header: "终止时间", dataIndex: 'STOPDATE', width:'120px',sortable:false}
           ,{header: "活动类型", dataIndex: 'EVENTTYPE', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var text = '';
                    if(value == '0'){
                    	text = '分类券';
					}else if(value == '1'){
                        text = '品牌券';
					}else if(value == '2'){
                        text = '产品券';
                    }else{
                        text = '全场返利';
                    }
                    return text;
                }
            }
            ,{header: "返利百分比", dataIndex: 'REBATERATE', width:'70px',sortable:false}
            ,{header: "返利绝对值", dataIndex: 'REBATEVALUE', width:'70px',sortable:false}
            ,{header: "是否有效", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    return data['ISVALID']=='1'?'<font color="green">有效</font>':'<font color="red">作废</font>';
                }
            }
            ,{header: "活动状态", dataIndex: 'EVENTSTATUS', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    return value=='2'?'<font color="green">已启用</font>':'<font color="red">未启用</font>';
                }
            }
            // ,{header: "活动类型", dataIndex: 'EVENTTYPE', width:'70px',sortable:false,
            //     renderer : function(value, data, rowIndex, colIndex, metadata){
            //         return data['ISVALID']=='1'?'<font color="green">有效</font>':'<font color="red">作废</font>';
            //     }
            // }
           // ,{header: "获取方式", dataIndex: '', width:'70px',sortable:false,
           //     renderer : function(value, data, rowIndex, colIndex, metadata){
           //         var acquireTypeName = "";
           //         switch(data['ACQUIRETYPE']){
           //             case '1':
           //                 acquireTypeName = "优惠码";
           //                 break;
           //             case '2':
           //                 acquireTypeName = "链接";
           //                 break;
           //         }
           //         return acquireTypeName;
           //     }
           //  }
           ,{header: "合作伙伴", dataIndex: 'PARTNERNAME', width:'120px',sortable:false}
           ,{header: "优惠券分类", dataIndex: 'CLASSIFYCODE', width:'120px',sortable:false}
           ,{header: "操作", dataIndex: '', width:'200px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a class="a_link" href="javascript:showDesc(\''+rowIndex+'\')">查看描述</a>';
					returnText +=' | <a class="a_link" href="javascript:alterType(\''+data['EVENTCODE']+'\')">修改</a>';
					if(data['ISVALID'] == '1'){
                        returnText +=' | <a class="a_link" href="javascript:destroy(\''+data['EVENTCODE']+'\')">作废</a>';
					}else if(data['ISVALID'] == '0'){
                        returnText +=' | <a class="a_link" href="javascript:recover(\''+data['EVENTCODE']+'\')">恢复</a>';
					}
                    if(data['EVENTSTATUS'] == '1'){
                        returnText +=' | <a class="a_link" href="javascript:eventStatus(\''+data['EVENTCODE']+'\',\'2\')">启用</a>';
                    }else if(data['EVENTSTATUS'] == '2'){
                        returnText +=' | <a class="a_link" href="javascript:eventStatus(\''+data['EVENTCODE']+'\',\'1\')">停用</a>';
                    }
					returnText +=' | <a class="a_link" href="javascript:delType(\''+data['EVENTCODE']+'\')">删除</a>';
					return returnText;
				}
           }
	]
    ,url : '/caiwu/coupon/eventlist'
    ,baseParams:{isAll:'all'}
  });
});

function showDesc(rowNum){
    alert(grid.data.result[rowNum]['EVENTDESC']);
}
function alterType(eventCode){
    $.layer({
        type:2,
        title:'导入',
        iframe:{src:"/caiwu/coupon/alterevent?eventCode="+eventCode},
        area:['500' , '750'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}

function getParams(){
    return {
        eventName:$("#eventName").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#endCreateDate").val()
    };
}

function getParamsAsThisPage(){
    return {
        eventName:$("#eventName").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#endCreateDate").val(),
        start:(grid.getPageNumber()-1)*10
    };
}

/**
 * 活动状态
 * @param typeCode
 * @return
 */
function eventStatus(eventCode,status){
	var text = '';
	if(status =='1'){
		text = '停用';
	}else{
        text = '启用';
	}
    if(confirm('是否'+text+'券活动？')){
        var load1 = layer.load('请稍候...');
        $.ajax({
            type : 'POST'//请求方式
            ,url : "/caiwu/coupon/eventstatus"  //请求路径
            ,data : {eventCode:eventCode,status:status}  //发送到服务器的数据
            ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async : false //同步请求
            ,timeout :60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success : function(data){
                layer.close(load1);
                if(data == 'Y'){
                    alert(text+"成功");
                }else{
                    alert(text+"失败");
                }
                doSearch();
            }
        });
    }
}

/**
 * 删除券类型
 * @param typeCode
 * @return
 */
function delType(eventCode){
	if(confirm('是否删除券活动？')){
	    var load1 = layer.load('请稍候...');
	    $.ajax({
	        type : 'POST'//请求方式
	        ,url : "/caiwu/coupon/delevent"  //请求路径
	        ,data : {eventCode:eventCode}  //发送到服务器的数据
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
function destroy(eventCode){
	if(confirm('是否作废券活动？')){
	    var load1 = layer.load('请稍候...');
	    $.ajax({
	        type : 'POST'//请求方式
	        ,url : "/caiwu/coupon/destroyevent"  //请求路径
	        ,data : {eventCode:eventCode}  //发送到服务器的数据
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
function recover(eventCode){
	if(confirm('是否确认恢复？')){
	    var load1 = layer.load('请稍候...');
	    $.ajax({
	        type : 'POST'//请求方式
	        ,url : "/caiwu/coupon/recoverevent"  //请求路径
	        ,data : {eventCode:eventCode}  //发送到服务器的数据
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

function createEvents(){
    $.layer({
        type:2,
        title:'创建优惠券类型',
        iframe:{src:'/caiwu/coupon/createevent'},
        area:['600','750'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}