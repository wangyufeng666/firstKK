/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-14 15:43:39
*/
var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"品类名称", dataIndex:'TYPENAME', width:'150px',sortable:false}
            ,{header:"品牌名称", dataIndex:'PNAME', width:'150px',sortable:false}
            ,{header:"英文名", dataIndex:'ENAME', width:'200px',sortable:false}
            ,{header:"状态", dataIndex:'ISENABLE', width:'200px',sortable:false,
             renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['ISENABLE'] == 'Y'){
                       return '已启用';
                    }else{
                       return '<span style="color:red">停用</span>';
                    }
                }
            }

            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='';
                    if(data['ISENABLE'] == 'Y'){
                         returnText +='<a class="a_link" href="javascript:updateStatus(\''+data['PID']+'\',\''+data['ISENABLE']+'\')">停用</a>';
                        // returnText = ' | <a class="a_link" href="javascript:editThis(\''+data['TYPE_ID']+'\')">修改</a>';

                    }else if(data['ISENABLE'] != 'Y'){
                         returnText +='<a class="a_link" href="javascript:updateStatus(\''+data['PID']+'\',\''+data['ISENABLE']+'\')">启用</a>';
                         returnText +=' | <a class="a_link" href="javascript:editType(\''+data['PID']+'\')">修改</a>';
                    }
                    // returnText +=' | <a class="a_link" href="javascript:delType(\''+data['PID']+'\')">删除</a>';
                    return returnText;

                }
            }
        ]
        ,url:'/rent/pinpai/pinpaidata'
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
        merType:$('#merType option:selected').val(),
		brandName:$('#brandName').val()
	};
}
/**
 * 重新加载
 */
function reload(){
    layer.closeAll('iframe');
    grid.reload();
}
function doSearch(){
    grid.query(getParams());
}

function addpinpai(){

    layer.open({
        type:2,
        title:'新增品牌类型',
        shadeClose:false,
        shade:0.8,
        content:'/rent/pinpai/addpinpai',
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}



//修改
function editType(pid){

     layer.open({
         type:2,
        title:'品牌类型修改',
        shadeClose:false,
        shade:0.4,
        content:'/rent/pinpai/edittype?pid='+pid,
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}

//停用 启用
function updateStatus(pId,isEnable) {
    var param = {};
    var msg = '';
    param.pId = pId;
    if(isEnable == 'Y'){
        param.isEnable = 'N';
        msg = '确认停用?';
    }else{
        param.isEnable = 'Y';
        msg = '确认启用?';
    }
    if(layer.confirm(msg,{btn:['确定','取消']},function(){
        $.post("/rent/pinpai/updatestatus",param,function (res) {
            if(res.code === '1000'){
                layer.msg('状态更新成功');
                grid.reload();
            }else{
                layer.msg(res.msg);
            }
        },'json');
    }));

}


//删除
function delType(pid){

    if(layer.confirm('确认删除吗？',{btn:['确认','取消']},function(){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/rent/pinpai/delpinpai"  //请求路径
            ,data:{pid:pid}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' 
            ,success:function(data){
                if(data.code === '1000'){
                    layer.msg('删除成功！');
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

