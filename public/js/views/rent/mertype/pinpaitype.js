/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-14 09:58:39
*/
var grid;
$().ready(function(){
    grid = $('#grid').grid({
        height:375
        ,width:500
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"品牌名", dataIndex:'PNAME', width:'50px',sortable:false}
            ,{header:"英文名", dataIndex:'ENAME', width:'50px',sortable:false}  
            ,{header:"品牌编码", dataIndex:'PCODE', width:'50px',sortable:false}
            ,{header:"排序", dataIndex:'SEQ', width:'50px',sortable:false}          
        ]
        ,url:'/rent/mertype/pinpailist'
        ,baseParams:getParam()
    });
});

/**
 * 获取查询指定参数
 * @returns {{seedeetype: (*|jQuery), seedeename: (*|jQuery)}}
 */
 function getParam(){
    return {
        typecode:$('#typecode').val()
    };
 }
function getParams(){
	return {
		mertypeName:$('#mertypeName').val()
	};
}

function doSearch(){
    grid.query(getParams());
}

function unusetype(typeid){
    $.ajax({
            type:'POST'//请求方式
            ,url:"/rent/mertype/unusetype"  //请求路径
            ,data:{typeid:typeid}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' 
            ,success:function(data){
                if(data == 'Y'){
                    rid.reload();
                }else{
                    alert('启用失败！');
                }
            },
            error:function(){
                alert('网络错误');
            }

        });
}

function pinpaiList(typecode){
    layer.open({
         type:2,
        title:'品类品牌类型',
        shadeClose:false,
        shade:0.4,
        content:'/rent/mertype/pinpaitype?typecode='+typecode,
        area:['500px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}
//删除
function delType(typeid){

    if(confirm('确认删除此项品类吗？')){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/rent/mertype/deltype"  //请求路径
            ,data:{typeid:typeid}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:false //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' 
            ,success:function(data){
                if(data == 'Y'){
                    rid.reload();
                }else{
                    alert('删除失败！');
                }
            },
            error:function(){
                alert('网络错误');
            }

        });
    }
    
}
function addmerType(){

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
