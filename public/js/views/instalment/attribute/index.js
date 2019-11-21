var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'10%', sortable:false}
		    ,{header:"类型", dataIndex:'TYPENAME', width:'20%', sortable:false}
           ,{header:"配置名称", dataIndex:'ATTR_NAME', width:'30%', sortable:false}
           ,{header:"创建时间", dataIndex:'CREATEDATE', width:'20%', sortable:false}
           ,{header:"序号", dataIndex:'SEQ', width:'20%', sortable:false}
           ,{header: "状态", dataIndex: 'STATUS', width:'20%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				return value == '1' ? '启用' : '停用';
			  }  
            }
           ,{header:"操作", dataIndex:'', width:'160px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		    var status = data['STATUS'];
					var returnText =' <a class="a_link" href="javascript:void(0);" onclick="attrinfo(\''+data['ID']+'\')">详情</a>';
					if(status == '1'){
						returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="operate(\''+data['ID']+'\',\'2\')">停用</a>';
					}
					if(status == '2'){
						returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="operate(\''+data['ID']+'\',\'1\')">启用</a>';
					}
					return returnText;
				}
           }
       ]
       ,url : '/instalment/attribute/pagelist'
		,baseParams:initParams()
	});
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

/**
 * 配置信息
 * @param attrId
 */
function attrinfo(attrId){
	window.location.href = "/instalment/attribute/attrinfo?attrId="+attrId;
}

/**
 * 新增配置
 * @return
 */
function addAttr(){
    layer.open({
        type:2,
        title:'添加配置',
        shadeClose:false,
        shade:0.8,
        content:'/instalment/attribute/addattr',
        area:['400px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 操作
 * @param partnerId
 */
function operate(attrId, nextStatus){
	var text = nextStatus == '1' ? '是否确认启用' : '是否确认停用？';
	layer.confirm(text,{btn:['确定','取消']},function(index) {
        $.ajax({
            type: 'POST'//请求方式
            , url: "/instalment/attribute/operateattr"  //请求路径
            , data: {attrId: attrId, nextStatus: nextStatus} //发送到服务器的数据
            , cache: false //设置为 false 将不会从浏览器缓存中加载请求信息
            , async: false //同步请求
            , timeout: 60000//默认超时60秒
            , dataType: 'json' //预期服务器返回的数据类型
            , success: function (data) {
                if (data.code === "1000") {
                    doSearch();
                } else {
                    errorBox("操作失败");
                }
            }
        });
        layer.close(index);
    });
}
function getParams(){
    return {
    	merType:$('#merType').val(), 
    	attrName:$('#attrName').val()
    };
}

// 查询
function doSearch(){
	var index = layer.load(1,{
        shade: [0.1,'#fff']
    });
	grid.query(getParams());
    layer.close(index);

}

function errorBox(msg){
    layer.msg(msg, {icon: 5});
}