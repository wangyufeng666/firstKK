var series_grid;
var attributes_grid;

$().ready(function(){
	$('#attrType').change(function(){
		attributesSearch();
	});
	attributes_grid = $('#attributes_grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header: "属性编号", dataIndex: 'ATTRID', width:'60px',sortable:false} 
			,{header: "属性名称", dataIndex: 'ATTRNAME', width:'150px',sortable:false}
			,{header: "属性类型", dataIndex: 'ATTRTYPE', width:'150px',sortable:false}
			,{header: "备注", dataIndex: 'REMARK', width:'150px',sortable:false}
			,{header: "价格", dataIndex: 'PRICES', width:'150px',sortable:false}
			,{header: "创建日期", dataIndex: 'CREATEDATE', width:'150px',sortable:false}
		]
		,url : '/notebook/attributes/attributepagelist'
		,onRowDblclick : function(){
	    	data = attributes_grid.getSelections()[0];
	    	switch(data['ATTRTYPE']){
		    	case 'CPU型号':
		    		$('#s_cpu').attr('value',data['ATTRID']);
		    		$('#s_cpu').text(data['ATTRNAME']);
		    		break;
		    	case '内存容量':
		    		$('#s_memory').attr('value',data['ATTRID']);
		    		$('#s_memory').text(data['ATTRNAME']);
		    		break;
		    	case '硬盘容量':
		    		$('#s_hhd').attr('value',data['ATTRID']);
		    		$('#s_hhd').text(data['ATTRNAME']);
		    		break;
		    	case '显卡类型':
		    		$('#s_videoCard').attr('value',data['ATTRID']);
		    		$('#s_videoCard').text(data['ATTRNAME']);
		    		break;
		    	default:
		    		alert('错误');
	    	}
	   	}
	});
});

function attributesSearch(){
	layer.load('数据加载中...', 1);
	attributes_grid.query(getAttributesParams());
}

function doSearch(){
	attributesSearch();
}

function getAttributesParams(){
    return {
    	attrType:$('#attrType').val(), 
    	attrName:$('#attrName').val()
    };
}

function cleanSelect(){
	$('#s_cpu').attr('value','');
	$('#s_cpu').text('未选择');
	$('#s_memory').attr('value','');
	$('#s_memory').text('未选择');
	$('#s_hhd').attr('value','');
	$('#s_hhd').text('未选择');
	$('#s_videoCard').attr('value','');
	$('#s_videoCard').text('未选择');
	$('#s_seq').attr('value','');
}

function doSave(){
	if($('#s_series').attr("value")!='' && $('#s_cpu').attr("value")!='' && $('#s_memory').attr("value")!='' && $('#s_hhd').attr("value")!='' && $('#s_videoCard').attr("value")!=''){
		$.ajax({
	        type : 'POST'//请求方式
	        ,url : "/notebook/product/saveproduct"  //请求路径
	        ,data : getParams()  //发送到服务器的数据
	        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
	        ,async : false //同步请求
	        ,timeout :60000//默认超时60秒
	        ,dataType:'json' //预期服务器返回的数据类型
	        ,success : function(data){
	            if('Y' == data){
	            	if(confirm('是否继续添加型号？')){
	            		cleanSelect();
	            	}else{
	            		window.location.href = "/notebook/seriesproduct/";
	            	}
	            }else{
	                alert("数据有误 "); 
	            }
	        }
	    });
	}else{
		alert('有未选项');
	}
}

function getParams(){
	var typeName = $('#s_cpu').text()+" /";
	typeName += " "+$('#s_memory').text()+" /";
	typeName += " "+$('#s_hhd').text()+" /";
	typeName += " "+$('#s_videoCard').text()+" /";
	
	var attrsText ='0,'+$('#s_cpu').attr("value");
	attrsText +=','+$('#s_memory').attr("value");
	attrsText +=','+$('#s_hhd').attr("value");
	attrsText +=','+$('#s_videoCard').attr("value")+',0';
	
	return {
		typeName:typeName,
		attrsText:attrsText,
		seriesId:$('#s_series').attr("value"),
		seq:$('#s_seq').attr("value")
	};
}

