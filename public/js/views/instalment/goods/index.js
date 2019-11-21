var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "商品编号", dataIndex: 'ID', width:'20%',sortable:false}
			,{header: "商品名称", dataIndex: 'PRODUCT_NAME', width:'30%',sortable:false}
			,{header: "排序", dataIndex: 'SEQ', width:'10%',sortable:false}
			,{header: "商品分类", dataIndex: 'CATEGORY_NAME', width:'10%',sortable:false}
			,{header: "商品品牌", dataIndex: 'BRAND_NAME', width:'10%',sortable:false}
			,{header: "商品状态", dataIndex: 'STATUS', width:'10%',sortable:false,
				renderer:function (value ,data, rowIndex, colIndex, metadata) {
					var html = '';
                    if(value == '1'){
                        html = "<span style='color:blue'>启用</span>";
                    }else if(value == '2'){
                        html = "<span style='color:red'>停用</span>";
                    }else{
                        html = "<span style='color:yellow'>未知</span>";
                    }
                    return html;
                }
			}
			,{header: "操作", dataIndex: '', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var html = "<a class='a_link' href='javaScript:void(0)' onclick='modelList(\"" + data['ID'] + "\")'>型号详情</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
                    html += "<a class='a_link' href='javaScript:void(0)' onclick='editProduct(\"" + data['ID'] + "\")'>修改</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
                    var nextStatus = 2;
                    var statusText = '';
                    if(data['STATUS'] == '1'){
                    	nextStatus = 2;
                        statusText = '停用';
                    }else{
                    	nextStatus = 1;
                        statusText = '启用';
					}

                    html += "<a class='a_link' href='javaScript:void(0)'  onclick='statusControl(\"" + data['ID'] + "\"," + nextStatus + ",\"" + statusText + "\")'>" + statusText + "</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
					html += "";
                    return html;
				}
			}
		]
		,url:'/instalment/goods/goodslist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

/**
 * 获取初始化查询参数
 * @returns {*}
 */
function initParams(){
	if(backFlag === 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 获取查询参数
 * @returns {{productName: *|jQuery, status: *|jQuery, categoryCode: *|jQuery, brandCode: *|jQuery}}
 */
function getParams(){
	return {
		productName:$('#productName').val(),
		status:$('#status').val(),
        categoryCode:$('#categoryCode').val(),
        brandCode:$('#brandCode').val()
	};
}

/**
 * 查询
 */
function doSearch(){
    var index = layer.load(1,{shade: [0.1,'#fff']});
	grid.query(getParams());
    layer.close(index);
}

/**
 * 错误信息
 * @param msg
 */
function errorBox(msg){
    layer.msg(msg, {icon: 5});
}

/**
 * 获取品牌列表
 * @param categoryCode
 * @returns {Array}
 */
function getBrandList(categoryCode){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    var brandList = [];
	$.ajax({
		type: "POST",
		url: "/rent/pinpai/allbrandbytype",
		data: {categoryCode:categoryCode},
        async:false, // 同步请求
		dataType: "json",
		timeout: 30000,
		cache:false,
		success: function(result){
            layer.close(index);
			if(result.code === '1000'){
                brandList = result.data;
			}else{
                errorBox(result.msg);
			}
		},
		error: function(){
			layer.close(index);
			layer.alert('网络错误');
		}
	});
	return brandList;
}

/**
 * 添加商品页面
 */
function addGoods(){
    layer.open({
        type:2,
        title:'添加商品',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/goods/addgoods',
        area:['550px','600px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 修改商品
 * @param productId
 */
function editProduct(productId){
	var url = '/instalment/goods/editgoods?productId=' + productId;
    layer.open({
        type:2,
        title:'修改商品',
        shadeClose:false,
        shade:0.8,
        content:url,
        area:['550px','600px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 跳转到型号列表页面
 * @param productId
 */
function modelList(productId){
	var url = '/instalment/goods/modellist?productId=' + productId;
	window.location.href = url;
}

/**
 * 更改商品状态
 * @param productId
 * @param status
 * @param statusText
 */
function statusControl(productId, status,statusText){
    var index = layer.load(1,{shade: [0.1,'#fff']});
    var msg = '是否确认' +statusText;
    var params = {
        productId: productId,
        status: status
    };
    layer.confirm(msg,{btn:['确定','取消'],closeBtn:0},function(){
        $.post("/instalment/goods/statuscontrol",params,function (res) {
            layer.close(index);
            if(res.code === '1000'){
                layer.msg('状态更新成功');
                grid.reload();
            }else{
                layer.msg('状态更新失败');
            }
        },'json');
    },function(){
        layer.close(index);
	});
}