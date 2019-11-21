var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false}
			,{header: "标签名称", dataIndex: 'LABEL_NAME', width:'20%',sortable:false}
            ,{header: "标签类型", dataIndex: 'LABEL_TYPE', width:'20%',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(value == '1'){
                        var returnText = '热门设备';
                    }else if(value == '2'){
                        var returnText = '职业推荐';
                    }else if(value == '3'){
                        var returnText = '案例指导';
                    }else if(value == '4'){
                        var returnText = '企业方案';
                    }else{
                        var returnText ="";
                    }
                    return returnText;
                }
            }
            ,{header: "标签来源", dataIndex: 'SOURCECODE_NAME', width:'20%',sortable:false}
			,{header: "排序", dataIndex: 'SEQ', width:'10%',sortable:false}
			,{header: "是否启用", dataIndex: 'VALIDNAME', width:'10%',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['ISVALID'] == 'Y'){
                        var returnText = '<span class="blue">启用</span>';
                    }else if(data['ISVALID'] == 'N'){
                        var returnText = '<span class="red">停用</span>';
                    }else{
                        var returnText = '<span class="green">异常</span>';
                    }
                    return returnText;
                }
            }
			,{header: "操作", dataIndex: '', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					console.log(data['ISVALID']);
					if(data['ISVALID'] == 'Y'){
				        statusText = '停用';
				    }else if(data['ISVALID'] == 'N'){
				        statusText = '启用';
				    }else{
				        statusText = '异常';
				    }
				    var html = "<a class='a_link' href='javaScript:void(0)' onclick='editLabel(\"" + data['PKID'] + "\")'>修改</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
				    html += "<a class='a_link' href='javaScript:void(0)' isValid='" + data['ISVALID'] + "' onclick='changeValid(\"" + data['PKID'] + "\", this)'>" + statusText + "</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
				    html += "<a class='a_link' href='javaScript:void(0)' onclick='showProduct(\"" + data['PKID'] + "\")'>查看商品</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
				    html += "<a class='a_link' href='javaScript:void(0)' onclick='delLabel(\"" + data['PKID'] + "\")'>删除</a>";
				    return html;
				}
			}
		]
		,url:'/instalment/label/labellist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
	$("#addNewLabel").bind("click", function(){addNewLabel();});
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
        labelName:$('#labelName').val(),
        isValid:$('#isValid').val(),
        sourceCode:$('#sourceCode').val(),
	};
}

function doSearch(){
	layer.load(2, {time: 3*1000});
	grid.query(getParams());
}

function reload(){
    layer.closeAll('iframe');
    grid.reload();
}


function changeValid(labelId, obj){
    var index = layer.load(2, {time: 3*1000});
    var isValid = $(obj).attr('isValid')
    var msg = $(obj).text()
    if(isValid == 'Y'){
        isValid = 'N';
        statusText = '停用';
    }else if(isValid == 'N'){
        isValid = 'Y';
        statusText = '启用';
    }
    if(isValid == 'Y' || isValid == 'N'){
        layer.confirm('是否确认'+statusText, function(index){
	        $.ajax({
	            type: "POST",
	            url: "/instalment/label/changelabelvalid/",
	            data: {labelId:labelId, isValid:isValid},
	            dataType: "json",
	            timeout: 30000,
	            cache:false,
	            success: function(data){
	                layer.close(index);
	                if(data.code){
                        reload();
                        layer.msg('保存成功', {icon: 1});
	                    $(obj).attr('isValid', isValid);
	                    $(obj).text(statusText);
	                }else{
	                    layer.close(index);
                        layer.msg(data.text, {icon: 2});
	                }
	            },
	            error: function(){
	                 layer.close(index);
	                 layer.alert('网络错误');
	            }
	        });
    		layer.close(index);
    	});
    }else{
        layer.alert("状态异常");
    }
}

function addNewLabel(){
    layer.open({
        type:2,
        title:'添加标签',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/label/addlabelpage',
        area:['500px','385px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 获取指定标签商品列表
 * @param labelId
 */
function showProduct(labelId){
    layer.open({
        type:2,
        title:'商品列表',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/label/labelproductlist?labelId='+labelId,
        area:['600px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function editLabel(labelId){
    layer.open({
        type:2,
        title:'修改标签',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/label/addlabelpage?isEdit=2&labelId='+labelId,
        area:['500px','385px'],
        close:function(index){
            layer.close(index);
        }
    });

}

function delLabel(labelId){
    var index = layer.load(2, {time: 3*1000});
    layer.confirm('是否确认删除?', function(index){
        $.ajax({
            type: "POST",
            url: "/instalment/label/dellabel",
            data: {labelId:labelId},
            dataType: "json",
            timeout: 30000,
            cache:false,
            success: function(data){
                if(data.code){
                    layer.msg('删除成功', {icon: 1});
                    reload();
                }else{
                    layer.close(index);
                    layer.msg(data.text, {icon: 2});
                }
            },
            error: function(){
                layer.close(index);
                layer.alert('网络错误');
            }
        });

        layer.close(index);
    });
}
