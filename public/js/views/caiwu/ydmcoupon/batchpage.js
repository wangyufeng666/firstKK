var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "批次号", dataIndex: 'BATCHCODE', width:'90px',sortable:false} 
		    ,{header: "创建时间", dataIndex: 'CREATEDATE', width:'130px',sortable:false}
		    ,{header: "有效期", dataIndex: '', width:'180px',sortable:false,
		        renderer : function(value, data, rowIndex, colIndex, metadata){
	                   return data['STARTDATE']+'至'+data['ENDDATE'];
	               }
		    }
           ,{header: "券类型", dataIndex: 'TYPENAME', width:'80px',sortable:false}
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
           ,{header: "券总数", dataIndex: 'COUPONCOUNTS', width:'60px',sortable:false}
           ,{header: "有效数量", dataIndex: 'VALIDCOUPONCOUNTS', width:'60px',sortable:false}
           ,{header: "关联商品名", dataIndex: 'NICKNAME', width:'',sortable:false}
           ,{header: "操作", dataIndex: '', width:'200px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a class="a_link" href="javascript:void(0);" onclick="showRemark(\''+rowIndex+'\')">查看备注</a>';
					returnText += '&nbsp;&nbsp;|&nbsp;&nbsp;<a class="a_link" href="javascript:void(0);" onclick="exportCoupon(\''+data['BATCHCODE']+'\')">导出</a>';
					if(data['ISENABLE'] == 'Y'){
                        returnText +='&nbsp;&nbsp;|&nbsp;&nbsp;<a class="a_link" href="javascript:void(0);" onclick="destroy(\''+data['BATCHCODE']+'\')">作废</a>';
					}else if(data['ISENABLE'] == 'N')
                        returnText +='&nbsp;&nbsp;|&nbsp;&nbsp;<a class="a_link" href="javascript:void(0);" onclick="recover(\''+data['BATCHCODE']+'\')">恢复</a>';
					return returnText;
				}
           }
	]
    ,url : '/caiwu/ydmcoupon/batchlist'
    ,baseParams:{isAll:'all'}
  });
});

function showRemark(rowNum){
    alert(grid.data.result[rowNum]['REMARK']);
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
        batchCode:$("#batchCode").val(),
        couponObj:$("#couponObj").val(),
        couponFunc:$("#couponFunc").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#startCreateDate").val(),
        startDate:$("#startDate").val(),
        endDate:$("#endDate").val()
    };
}

function getParamsAsThisPage(){
    return {
        typeCode:$("#typeCode").val(),
        typeName:$("#typeName").val(),
        batchCode:$("#batchCode").val(),
        couponObj:$("#couponObj").val(),
        couponFunc:$("#couponFunc").val(),
        startCreateDate:$("#startCreateDate").val(),
        endCreateDate:$("#startCreateDate").val(),
        startDate:$("#startDate").val(),
        endDate:$("#endDate").val(),
        start:(grid.getPageNumber()-1)*10
    };
}

function exportCoupon(batchCode){
    window.location.href = "/caiwu/ydmcoupon/exportcoupon?batchCode="+batchCode;
}

function destroy(batchCode){
    var load1 = layer.load('请稍候...');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/caiwu/ydmcoupon/destroybatch"  //请求路径
        ,data : {batchCode:batchCode}  //发送到服务器的数据
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

function recover(batchCode){
    var load1 = layer.load('请稍候...');
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/caiwu/ydmcoupon/recoverbatch"  //请求路径
        ,data : {batchCode:batchCode}  //发送到服务器的数据
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
        area : ['500' , '400'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}