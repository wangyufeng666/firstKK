var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "NO.", dataIndex: 'R', width:'30px',sortable:false} 
		    ,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
		   ,{header: "商品品牌", dataIndex: 'PNAME', width:'80px',sortable:false}
		   ,{header: "商品名称", dataIndex: 'MERNAME',sortable:false,
		       renderer : function(value, data, rowIndex, colIndex, metadata){
		           var returnText = data['MERNAME'];
		           if(data['TYPE_ID'])
		               returnText += ' [cpu:'+data['CPU']+';内存:'+data['MEMORY']+';硬盘:'+data['HARDDISK']+';显卡'+data['VIDEOCARD']+']';
                   return returnText;
               }
		   }
		   ,{header: "操作", dataIndex: '', width:'60px', sortable:false,
		        renderer : function(value, data, rowIndex, colIndex, metadata){
		            var returnText ='<a class="a_link" href="javascript:void(0);" onclick="addProduct(\''+data['MERID']+'\',\''+data['TYPE_ID']+'\',\''+data['CPU']+'\',\''+data['MEMORY']+'\',\''+data['HARDDISK']+'\',\''+data['VIDEOCARD']+'\')">添加</a>';
		            return returnText;
		        }
		   }
		]
		,url : '/exchange/exchange/merlist'
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

function doSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'提示',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

function addProduct(merId, typeId, cpu, memory, hardDisk, videoCard){
    load1 = layer.load('请稍候...');
    var params = "";
    if(typeId != "" && typeId != "null"){
        params = "&typeId=" +typeId + "&cpu=" +cpu + "&memory=" +memory + "&hardDisk=" +hardDisk + "&videoCard=" +videoCard;
    }
    window.location.href = "/exchange/exchange/addnewproduct?merId=" + merId + params;
     
    
//    if(typeId=='null')
//        data = {merId:merId};
//    else
//        data = {merId:merId,typeId:typeId, cpu:cpu, memory:memory, hardDisk:hardDisk, videoCard:videoCard};
//    $.ajax({
//        type : 'POST'//请求方式
//        ,url : "/exchange/exchange/addnewproduct"  //请求路径
//        ,data : data  //发送到服务器的数据
//        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
//        ,async : false //同步请求
//        ,timeout :60000//默认超时60秒
//        ,dataType:'json' //预期服务器返回的数据类型
//        ,success : function(data){
//            layer.close(load1);
//            if(data == 'Y'){
//                alert("添加成功");
//                doSearch();
//            }else{
//                error("添加失败");
//            }
//        }
//        ,error: function(XMLHttpRequest, textStatus, errorThrown) {
//            layer.close(load1);
//            error("添加失败");
//        }
//    });
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
