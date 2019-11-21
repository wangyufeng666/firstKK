var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "商品名称", dataIndex: 'PRODUCT_NAME', width:'30%',sortable:false}
			,{header: "排序", dataIndex: 'SEQ', width:'10%',sortable:false}
			,{header: "商品品牌", dataIndex: 'BRAND_NAME', width:'10%',sortable:false}
			,{header: "商品分类", dataIndex: 'PRODUCT_TYPE_NAME', width:'10%',sortable:false}
			,{header: "合作商", dataIndex: 'PARTNERNAME', width:'15%',sortable:false}
			,{header: "商品状态", dataIndex: 'STATUS', width:'10%',sortable:false,
				renderer:function (value ,data, rowIndex, colIndex, metadata) {
					var html = '';
                    if(value == '1'){
                        html = "<span style='color:blue'>启用</span>";
                    }else if(value == '2'){
                        html = "<span style='color:red'>停用</span>";
                    }else{
                        html = "<span style='color:yellow'>异常</span>";
                    }
                    return html;
                }
			}
			,{header: "操作", dataIndex: '', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				    if(data['STATUS'] == '2'){
				        statusText = '启用';
				    }else if(data['STATUS'] == '1'){
				        statusText = '停用';
				    }else{
				        statusText = '异常';
				    }
				    var html = "<a class='a_link' href='javaScript:void(0)' onclick='modelInfo(\"" + data['ID'] + "\")'>型号详情</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
				    html += "<a class='a_link' href='javaScript:void(0)' status='" + data['STATUS'] + "' onclick='statusControl(\"" + data['ID'] + "\", this)'>" + statusText + "</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
				    html += "<a class='a_link' href='javaScript:void(0)' onclick='delProduct(\"" + data['ID'] + "\")'>删除</a>";
				    return html;
				}
			}
		]
		,url:'/instalment/product/productlist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
	$("#addNewProduct").bind("click", function(){addNewProduct();});
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

function modelInfo(productId){
    window.location.href = "/instalment/product/modelinfo?productId="+productId
}

function getParams(){
	return {
		merName:$('#merName').val(),
		status:$('#status').val(),
		merType:$('#merType').val(),
		partnerCode:$('#partnerCode').val()
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

function statusControl(productId, obj){
    var index = layer.load();
    var status = $(obj).attr('status');
    if(status == '1'){
        status = '2';
        statusText = '启用';
    }else if(status == '2'){
        status = '1';
        statusText = '停用';
    }
    if(status == '1' || status == '2'){
    	if(confirm('是否确认'+statusText)){
	        $.ajax({
	            type: "POST",
	            url: "/instalment/product/statuscontrol/",
	            data: {productId:productId, status:status},
	            dataType: "json",
	            timeout: 30000,
	            cache:false,
	            success: function(data){
	                layer.close(index);
	                if(data == 'Y'){
	                    layer.alert("保存成功", '1');
	                    $(obj).attr('status', status);
	                    $(obj).text(statusText);
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
    	}else{
    		layer.close(index);
    	}
    }else{
        layer.alert("状态异常");
    }
}

function addNewProduct(){
    $.layer({
        type:2,
        title:'订单状态修改',
        iframe:{src:'/instalment/product/addnewproduct'},
        area:['550' , '550'],
        offset:['50px',''],
        close:function(index){
            layer.close(index);
        }
    });
    
}

function delProduct(productId){
    var index = layer.load();
	if(confirm('是否确认删除？')){
	    $.ajax({
	        type: "POST",
	        url: "/instalment/product/statuscontrol",
	        data: {productId:productId, status:'3'},
	        dataType: "json",
	        timeout: 30000,
	        cache:false,
	        success: function(data){
	            
	            if(data == 'Y'){
	                layer.alert("成功");
	                window.location.href = window.location.href;
	            }else{
	                layer.close(index);
	                layer.alert('失败');
	            }
	        },
	        error: function(){
	             layer.close(index);
	             layer.alert('网络错误');
	        }
	    });
	}else{
		layer.close(index);
	}
}

function syncProductList(){
    var partnerCode = $('#partnerCode').val();
    if(partnerCode){
        var isShowSync = alipayAppletList.hasOwnProperty(partnerCode);
        if(isShowSync){
            $.ajax({
                type: "POST",
                url: "/redis/rent/synchomeproducts",
                data: {sourceCode:partnerCode},
                dataType: "json",
                timeout: 30000,
                cache:false,
                success: function(data){
                    if(data == 'Y'){
                        layer.alert("成功");
                        window.location.href = window.location.href;
                    }else{
                        layer.close(index);
                        layer.alert('失败');
                    }
                },
                error: function(){
                    layer.close(index);
                    layer.alert('网络错误');
                }
            });
		}
	}
}
