var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:30,
		height:250
		,cm:[
			{header: "排序", dataIndex: 'SEQ', width:'8%',sortable:false}
			,{header: "名称", dataIndex: 'PARAMNAME', width:'17%',sortable:false}
            ,{header: "规格", dataIndex: 'PARAMATTR', width:'50%',sortable:false}
			,{header: "是否启用", dataIndex: 'VALIDNAME', width:'15%',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['STATUS'] == '1'){
                        var returnText = '<span class="blue">启用</span>';
                    }else if(data['STATUS'] == '2'){
                        var returnText = '<span class="red">停用</span>';
                    }else{
                        var returnText = '<span class="green">异常</span>';
                    }
                    return returnText;
                }
            }
			,{header: "操作", dataIndex: '', width:'20%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					console.log(data['STATUS']);
					if(data['STATUS'] == '1'){
				        statusText = '停用';
				    }else if(data['STATUS'] == '2'){
				        statusText = '启用';
				    }else{
				        statusText = '异常';
				    }
				    var html = "<a class='a_link' href='javaScript:void(0)' onclick='editParam(\"" + data['PKID'] + "\")'>修改</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
				    html += "<a class='a_link' href='javaScript:void(0)' status='" + data['STATUS'] + "' onclick='changeStatus(\"" + data['PKID'] + "\", this)'>" + statusText + "</a>&nbsp;&nbsp;|&nbsp;&nbsp;";
				    return html;
				}
			}
		]
		,url:'/instalment/param/list'
		,baseParams:initParams()
	});
	$("#addNewLabel").bind("click", function(){addNewLabel();});
});

function initParams(){
    var params = getParams();
    return params;
	// if(backFlag == 'Y'){
	// 	var params = getParams();
	// 	return params;
	// }else{
	// 	return {};
	// }
}

function modelInfo(productId){
    window.location.href = "/instalment/product/modelinfo?productId="+productId
}

function getParams(){
	return {
        modelId:$('#modelId').val()
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


function changeStatus(pkId, obj){
    var index = layer.load(2, {time: 3*1000});
    var status = $(obj).attr('status')
    var msg = $(obj).text()
    if(status == '1'){
        status = '2';
        statusText = '停用';
    }else if(status == '2'){
        status = '1';
        statusText = '启用';
    }
    if(status == '1' || status == '2'){
        layer.confirm('是否确认'+statusText, function(index){
	        $.ajax({
	            type: "POST",
	            url: "/instalment/param/changeproductparams/",
	            data: {pkId:pkId, status:status},
	            dataType: "json",
	            timeout: 30000,
	            cache:false,
	            success: function(data){
	                layer.close(index);
	                if(data.code){
                        reload();
                        layer.msg('保存成功', {icon: 1});
	                    $(obj).attr('status', status);
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

function addParam(){
    layer.open({
        type:2,
        title:'添加标签',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/param/addparampage?isEdit=1&modelId='+modelId,
        area:['500px','385px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function addRecord(){
    layer.open({
        type:2,
        title:'导入参数',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/param/addrecord?modelId='+modelId,
        area:['500px','385px'],
        close:function(index){
            layer.close(index);
        }
    });
}



function editParam(pkid){
    layer.open({
        type:2,
        title:'修改标签',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/param/addparampage?isEdit=2&modelId='+modelId+"&pkId="+pkid,
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

function downParam(){
    window.location.href = "/instalment/param/downparam?modelId=" + modelId;
}
