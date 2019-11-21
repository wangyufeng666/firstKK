/*
* @Author: ydm
* @Date:   2018-08-08 17:09:43
* @Last Modified by:   ydm
* @Last Modified time: 2018-08-23 15:54:36
*/
var grid;
$().ready(function(){
    grid = $('#grid').grid({
        height:375
        ,cm:[
            {header:"失败序号", dataIndex:'id', width:'80px',sortable:false}
            ,{header:"具体失败原因", dataIndex:'message', width:'500px',sortable:false}
            
        ]
        ,url:'/offline/store/savestoredata'
    });
});

function addRecord(){
    layer.open({
        type:2,
        title:'导入参数',
        shadeClose:false,
        shade:0.8,
        content:'/offline/store/addrecord',
        area:['450px','200px'],
        close: function(index){
                layer.close(index)
                location.reload();

        }
    });  
}
function back(){
    history.back();
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
