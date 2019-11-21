/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-14 15:43:19
*/
var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"品类名称", dataIndex:'TYPENAME', width:'200px',sortable:false}
            ,{header:"编码", dataIndex:'TYPECODE', width:'100px',sortable:false}
            ,{header:"大品类名称", dataIndex:'CATEGORY_NAME', width:'20%',sortable:false}
            ,{header:"状态", dataIndex:'', width:'20%',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['STATUS'] == '0'){
                        return '已启用';
                    }else if(data['STATUS'] == '1'){
                        return '<span style="color:red">停用</span>';
                    }
                   
                }}
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a class="a_link" href="javascript:brandList(\''+data['TYPECODE']+'\')">详情</a>';
                    if(data['STATUS'] == '0'){
                         returnText +=' | <a class="a_link" href="javascript:updateStatus(\''+data['TYPE_ID']+'\',\''+data['STATUS']+'\')">停用</a>';
                        // returnText = ' | <a class="a_link" href="javascript:editThis(\''+data['TYPE_ID']+'\')">修改</a>';

                    }else if(data['STATUS'] == '1'){
                         returnText +=' | <a class="a_link" href="javascript:updateStatus   (\''+data['TYPE_ID']+'\',\''+data['STATUS']+'\')">启用</a>';
                         returnText +=' | <a class="a_link" href="javascript:editType(\''+data['TYPE_ID']+'\')">修改</a>';
                         // returnText +=' | <a class="a_link" href="javascript:delType(\''+data['TYPE_ID']+'\')">删除</a>';
                    }
                    returnText +=' | <a class="a_link" href="javascript:editCategory(\''+data['TYPE_ID']+'\')">关联大品类</a>';
                    return returnText;
                }
            }
        ]
        ,url:'/rent/mertype/indexdata'
        ,baseParams:getParams()
        ,pageSizeList:[15,30,50]
    });
});

/**
 * 获取查询指定参数
 * @returns {{seedeetype: (*|jQuery), seedeename: (*|jQuery)}}
 */
function getParams(){
	return {
        merTypeName:$('#merTypeName').val()
	};
}

/**
 * 查询按钮
 */
function doSearch(){
    grid.query(getParams());
}

/**
 * 重新加载
 */
function reload(){
    layer.closeAll('iframe');
    grid.reload();
}

//修改
function editType(typeId){
     layer.open({
         type:2,
        title:'品类类型修改',
        shadeClose:false,
        shade:0.4,
        content:'/rent/mertype/edittype?typeId='+typeId,
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 更新商品类型状态
 * @param typeId
 * @param status
 */
function updateStatus(typeId,status) {
    var param = {};
    var msg = '';
        param.typeId = typeId;
        if(status*1){
            param.status = '0';
            msg = '确认启用?';
        }else{
            param.status = '1';
            msg = '确认停用?';
        }
        if(layer.confirm(msg,{btn:['确定','取消']},function(){
            $.post("/rent/mertype/updatestatus",param,function (res) {
                if(res.code === '1000'){
                    layer.msg('状态更新成功');
                    grid.reload();
                }else{
                    layer.msg('状态更新失败');
                }
            },'json');
        }));
}


function brandList(typeCode){
    layer.open({
         type:2,
        title:'品类品牌列表',
        shadeClose:false,
        shade:0.4,
        content:'/rent/mertype/pinpaitype?typeCode='+typeCode,
        area:['800px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}

//删除
function delType(typeId){
   if(layer.confirm('确认删除吗？',{btn:['确定','取消']},function(){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/rent/mertype/deltype"  //请求路径
            ,data:{typeId:typeId}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' 
            ,success:function(data){
                if(data.code === '1000'){
                    layer.msg('删除成功');
                    grid.reload();
                }else{
                    layer.msg(data.msg);
                }
            },
            error:function(){
                alert('网络错误');
            }

        });
     }));
    
}

/**
 *  返回
 */
function goBack(){
    window.location.href = backUrl;
}

/**
 * 添加品类
 */
function addMerType(){
    layer.open({
        type:2,
        title:'新增品类类型',
        shadeClose:false,
        shade:0.8,
        content:'/rent/mertype/addmertype',
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 显示大品类
 */
function showCategory(){
    window.location.href = '/rent/mertype/categorypage';
}

/**
 * 修改品类关联
 * @param typeId
 */
function editCategory(typeId){
    var url = '/rent/mertype/categoryrelationpage?typeId=' + typeId;
    layer.open({
        type:2,
        title:'关联大品类',
        shadeClose:false,
        shade:0.8,
        content:url,
        area:['550px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}
