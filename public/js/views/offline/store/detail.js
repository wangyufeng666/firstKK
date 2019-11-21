/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-20 17:23:44
*/

var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"店主", dataIndex:'LEGALPERSON', width:'150px',sortable:false}
            ,{header:"用户名", dataIndex:'USERNAME', width:'150px',sortable:false}
            ,{header:"联系方式", dataIndex:'LEGALPERSONMOBILE', width:'150px',sortable:false}
            ,{header:"注册类型", dataIndex:'registype', width:'150px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['REGISTTYPE'] == '1'){
                         return '公司注册';
                    }else{
                        return '个人注册';
                    }
                }
            }
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false, 
                renderer:function(value, data, rowIndex, colIndex, metadata){
                   
                         var returnText ='';
                         returnText +='<a class="a_link" href="javascript:editorder(\''+data['PKID']+'\')">编辑</a>';

                         returnText += ' | <a class="a_link" href="javascript:resetpwd(\''+data['PKID']+'\')">重置密码</a>';
                        return returnText;
                                
            }
        }
        ]
        ,url:'/offline/store/detaildata'
        ,baseParams:getParams()
        ,pageSizeList:[15,30,50]
    });
});
/**
 * 重新加载
 */
function reload(){
    layer.closeAll('iframe');
    grid.reload();
}
function back(){
    window.location.href = '/offline/store/storelist';
}
function getParams(){

    return {
        partnercode:$('#partnercode').val()
    };
}
//添加店主
function addorder(pcode){
     layer.open({
         type:2,
        title:'添加店主',
        shadeClose:false,
        shade:0.4,
        content:'/offline/store/addorder?partnercode='+pcode,
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}
//重置密码
function resetpwd(pkid){
    layer.open({
        type:2,
        title:'重置密码',
        shadeClose:false,
        shade:0.4,
        content:'/offline/store/resetpwd?pkid='+pkid,
        area:['450px','200px'],
        close:function(index){
            layer.close(index);
        }
    });
}
//修改店主
function editorder(pkid){
     layer.open({
        type:2,
        title:'修改店主',
        shadeClose:false,
        shade:0.4,
        content:'/offline/store/editorder?pkid='+pkid,
        area:['550px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}



function unusetype(pid){
    if(layer.confirm('确认取消合作吗？',{btn:['确认','取消']},function(){  
        $.ajax({
                type:'POST'//请求方式
                ,url:"/offline/store/unusetype"  //请求路径
                ,data:{pid:pid}  //发送到服务器的数据
                ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
                ,async:false //同步请求
                ,timeout:60000//默认超时60秒
                ,dataType:'json' 
                ,success:function(data){
                    if(data == 'Y'){
                        layer.msg('取消合作更新成功');
                        grid.reload();
                    }else{
                        layer.msg('取消合作更新失败！');
                    }
                },
                error:function(){
                    alert('网络错误');
                }

            });
        }));
}

function usetype(pid){
    if(layer.confirm('确认合作吗？',{btn:['确认','取消']},function(){   
        $.ajax({
                type:'POST'//请求方式
                ,url:"/offline/store/unusetype"  //请求路径
                ,data:{pid:pid}  //发送到服务器的数据
                ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
                ,async:false //同步请求
                ,timeout:60000//默认超时60秒
                ,dataType:'json' 
                ,success:function(data){
                    if(data == 'Y'){
                        layer.msg('合作更新成功');
                        grid.reload();
                    }else{
                        layer.msg('合作更新失败！');
                    }
                },
                error:function(){
                    alert('网络错误');
                }

            });
        }));
}

//删除
function delorder(pkid){

    if(layer.confirm('确认删除吗？',{btn:['确认','取消']},function(){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/offline/store/delorder"  //请求路径
            ,data:{pkid:pkid}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' 
            ,success:function(data){
                if(data == 'Y'){
                    layer.msg('删除成功！');
                    grid.reload();
                }else{
                    layer.msg('删除失败！');
                }
            },
            error:function(){
                alert('网络错误');
            }

        });
    }));
    
}
