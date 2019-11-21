/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-09-17 13:44:30
*/
var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"门店名称", dataIndex:'PARTNERNAME', width:'150px',sortable:false}
            ,{header:"位置", dataIndex:'ADDRESS', width:'150px',sortable:false}           
            ,{header:"联系人", dataIndex:'CONTACTS', width:'150px',sortable:false}
            ,{header:"联系人电话", dataIndex:'CONTACTWAY', width:'150px',sortable:false}
            ,{header:"门店店主", dataIndex:'LEGALPERSON', width:'150px',sortable:false}

            ,{header:"合作状态", dataIndex:'PARTNERSTATUS', width:'100px',sortable:false,
             renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['PARTNERSTATUS'] == '1'){
                       return '合作中';
                    }else{
                       return '<span style="color:red">未合作</span>';
                    }
                }
            }
                  
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['PARTNERSTATUS'] == '1'){
                         var returnText ='';
                         returnText +='<a class="a_link" href="javascript:detail(\''+data['PARTNERCODE']+'\')">店主详情</a>';
                         returnText +=' | <a class="a_link" href="javascript:unusetype(\''+data['PARTNERID']+'\')">取消合作</a>';
                         returnText +=' | <a class="a_link" href="javascript:delType(\''+data['PARTNERID']+'\')">删除</a>';
                         
                        // returnText = ' | <a class="a_link" href="javascript:editThis(\''+data['TYPE_ID']+'\')">修改</a>';
                        return returnText;
                    }else if(data['PARTNERSTATUS'] != '1'){
                         var returnText ='';
                         returnText +='<a class="a_link" href="javascript:detail(\''+data['PARTNERCODE']+'\')">店主详情</a>';
                         returnText +=' | <a class="a_link" href="javascript:usetype(\''+data['PARTNERID']+'\')">合作</a>';
                         returnText +=' | <a class="a_link" href="javascript:delType(\''+data['PARTNERID']+'\')">删除</a>';
                         returnText +=' | <a class="a_link" href="javascript:editType(\''+data['PARTNERID']+'\')">修改</a>';
                         return returnText;
                    }
                   
                }
            }
        ]
        ,url:'/offline/store/storedata'
        ,baseParams:getParams()
        ,pageSizeList:[15,30,50]
    });
});

function detail(pcode){
    window.location.href = '/offline/store/detail?pcode='+pcode;
}
/**
 * 获取查询指定参数
 * @returns {{seedeetype: (*|jQuery), seedeename: (*|jQuery)}}
 */
function getParams(){
	return {
        parentcode:$('#parentcode').val(),
        businessCode:$('#businessCode').val(),
        partnertype:$('#partnertype').val(),
        storeName:$('#storeName').val(),
        contactway:$('#contactway').val(),
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

//批量导入
function addStores(){
    window.location.href = "/offline/store/addstores";
}
//新增
function addstore(){

    layer.open({
        type:2,
        title:'新增门店类型',
        shadeClose:false,
        shade:0.8,
        content:'/offline/store/addstore',
        area:['550px','620px'],
        close:function(index){
            layer.close(index);
        }
    });
}



//修改
function editType(pid){

     layer.open({
         type:2,
        title:'门店修改',
        shadeClose:false,
        shade:0.4,
        content:'/offline/store/editstore?pid='+pid,
        area:['550px','620px'],
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
function delType(pid){

    if(layer.confirm('确认删除吗？',{btn:['确认','取消']},function(){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/offline/store/deltype"  //请求路径
            ,data:{pid:pid}  //发送到服务器的数据
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
