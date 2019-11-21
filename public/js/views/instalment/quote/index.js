var grid;
var editModel = false;//价格修改模式关闭
var dragFlag = false;//报价修改框拖动标志
var _x,_y;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10
		,onRowDblclick : function(obj, target){
		    if(editModel)
		        addEditQuote(target.getSelections()[0]);
        }
		,height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'25px',sortable:false}
			,{header: "商品名称", dataIndex: 'PRODUCT_NAME', width:'100px',sortable:false}
			,{header: "型号名称", dataIndex: 'MODEL_NAME', width:'150px',sortable:false} 
			,{header: "型号属性", dataIndex: 'ATTR_NAMES', width:'150px',sortable:false} 
			,{header: "启用时间", dataIndex: 'START_TIME', width:'130px',sortable:false} 
			,{header: "新机价格", dataIndex: 'NEW_PRODUCT_PRICE', width:'70px',sortable:false}
			,{header: "旧机价格", dataIndex: 'OLD_PRODUCT_PRICE', width:'70px',sortable:false}
			,{header: "期数", dataIndex: 'TOTAL_PERIODS', width:'70px',sortable:false} 
			,{header: "每期天数", dataIndex: 'PERIOD_DAYS', width:'70px',sortable:false} 
			,{header: "手续费%", dataIndex: 'FEE_RATE', width:'70px',sortable:false} 
			,{header: "操作", dataIndex: '', width:'', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
				    var html = "<a class='a_link' href='javaScript:void(0)' onclick='historyQuote(\"" + data['MODEL_ID'] + "\", \""+ data['RULE_ID'] + "\");'>历史报价</a>";
				    return html;
				}
			}
		]
		,url:'/instalment/quote/qutolist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
	
	
	$("#addNewRule").bind("click", function(){addNewRule();});
	$("#editQuote").bind("click", function(){editQuto()});
	$("#product-type").change(function(){fillBrands();});
	$("#search").click(function(){doSearch()});
});

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

function fillBrands(initBrand){
    var productType = $("#product-type").val();
    if(productType != null && productType != ""){
        $("#brand-code").html("<option value=''>请选择</option>");
        $.ajax({
            type: "POST",
            url: "/common/brands/getbrandslist/",
            data: {merType:productType},
            dataType: "json",
            timeout: 30000,
            cache:false,
            success: function(data){
                htmlStr = "";
                for(var i in data){
                    data[''];
                    htmlStr += "<option value='"+ data[i]['PCODE'] +"'>" +  data[i]['PNAME'] + "</option>";
                }
                $("#brand-code").append(htmlStr);
                $("#brand-code").val(initBrand);
            }
        });
    }
}

function getParams(){
	return {
	    productType:$('#product-type').val(),
	    brandCode:$('#brand-code').val(),
	    productName:$('#product-name').val(),
	    modelName:$('#model-name').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}

function addNewRule(){
    //window.location.href = "/instalment/rule/addnewrule";
    $.layer({
        type:2,
        title:'订单状态修改',
        iframe:{src:'/instalment/rule/addnewrule'},
        area:['450' , '400'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
    
}

var numSelectQuto = 0;

function editQuto(){
	if(editModel){
		$("#editQuote").text("修改报价");
		editModel = false;
		$("#edit-quot-list").remove();
		numSelectQuto = 0;
	}else{
	    numSelectQuto = 0;
		$("#editQuote").text("取消修改");
		editModel = true;
		htmlStr = "<div id='edit-quot-list' class='edit-quot-list'>" +
    			    "<div class='list-tl'>修改报价列表</div>" +
        				"<div>" +
            				"<span>新机价格：</span><input id='newProductPrice' class='price-input' onkeyup='value=value.replace(/[^\\d]/g,\"\")' />" +
            				"<span>旧机价格：</span><input id='oldProductPrice' class='price-input' onkeyup='value=value.replace(/[^\\d]/g,\"\")' />" +
            				"<button id='update-quote'>确定</button>" +
        				"</div>" +
        				"<table class='list'></table>" +
    			  "</div>";
		$("body").append(htmlStr);
	}
	$(".list-tl").mousedown(function(e){
	    dragFlag = true;
	    _x=parseInt($("#edit-quot-list").css("right")) + e.pageX;  
        _y=parseInt($("#edit-quot-list").css("bottom")) + e.pageY;
	});
	
	$("#update-quote").bind('click', function(){updateQuote()});
	
    $(".list-tl").mouseup(function(){dragFlag = false;});
	$("#edit-quot-list .list").delegate(".del-edt-quote", "click", function(){delQuote($(this))});
}

$(document).mousemove(function(e){ 
    if(dragFlag){  
        var x=_x - e.pageX;//移动时根据鼠标位置计算控件左上角的绝对位置  
        var y=_y - e.pageY;
        $("#edit-quot-list").css({bottom:y,right:x});//控件新位置  
    }  
}).mouseup(function(){ dragFlag=false;});

function addEditQuote(quoteInfo){
    var msg = "";
    do{
        if(numSelectQuto > 10){
            msg = "最多同时修改10条报价";
            break;
        }
        
        if($("#"+quoteInfo["QUOTE_ID"]).attr('id') != null){
            msg = "报价已存在";
            break;
        }
        htmlStr = "<tr class='edit-quote-item' id='" + quoteInfo["QUOTE_ID"] + "' modelid='" + quoteInfo["MODEL_ID"] + "' ruleid='" + quoteInfo["RULE_ID"] + "' >" +
        "<td title='"+ quoteInfo['PRODUCT_NAME'] + " " +quoteInfo["ATTR_NAMES"] + "' class='quto-tl'>"+ quoteInfo['PRODUCT_NAME'] + " " + quoteInfo["ATTR_NAMES"] +"</td>" +
        "<td>新："+ quoteInfo["NEW_PRODUCT_PRICE"] +"</td>" +
        "<td>旧："+ quoteInfo["OLD_PRODUCT_PRICE"] +"</td>" +
        "<td><button class='del-edt-quote' quoteid='"+ quoteInfo["QUOTE_ID"] + "'>删除</button></td>"
        "</tr>";
        $("#edit-quot-list .list").append(htmlStr);
        numSelectQuto = numSelectQuto +1;
        return true;
        
    }while(0)
    layer.msg(msg);
}

function delQuote(obj){
    numSelectQuto = numSelectQuto - 1;
    quoteid = obj.attr('quoteid');
    $("#"+quoteid).remove();
}

function updateQuote(){
    var index = layer.load();
    var quotes = [];
    var nullFlag = true;
    $(".edit-quote-item").each(function(){
        nullFlag = false;
        var quoteId = $(this).attr('id');
        var quote = {quoteId:quoteId, modelid:$(this).attr('modelid'), ruleid:$(this).attr('ruleid')};
        quotes.push(quote);
    });
    do{
        if(nullFlag){
            layer.alert("请选择要修改的报价");
            break;
        }
        
        var newPrice = $("#newProductPrice").val();
        
        if(newPrice == ""){
            layer.alert("请填写新机价格");
            break;
        }
        console.log(data);
        var oldPrice = $("#oldProductPrice").val();
        
        if( oldPrice == ""){
            layer.alert("请填写旧机价格");
            break;
        }
        $.ajax({
            type: "POST",
            url: "/instalment/quote/updatequotes/",
            data: {quotes:quotes, newPrice:newPrice, oldPrice:oldPrice},
            dataType: "json",
            timeout: 30000,
            cache:false,
            success: function(data){
                layer.close(index);
                if(data == 'Y'){
                    layer.alert("保存成功", '1');
                    window.location.href = window.location.href;
                }else{
                    layer.close(index);
                    layer.alert(data);
                }
            },
            error: function(){
                 layer.close(index);
                 layer.alert('网络错误');
            }
        });
        
    }while(0)
    layer.close(index);
}

function historyQuote(modelId, ruleId){
    $.layer({
        type:2,
        title:'订单状态修改',
        iframe:{src:'/instalment/quote/historyquote?modelId=' + modelId + '&ruleId=' + ruleId},
        area:['450' , '350'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
}
