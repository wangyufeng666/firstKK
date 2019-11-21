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
        ,url:'/rent/pinpai/brandlistbytype'
        ,baseParams:getParam()
    });
});

/**
 * 获取查询指定参数
 * @returns {{seedeetype: (*|jQuery), seedeename: (*|jQuery)}}
 */
 function getParam(){
    return {
        typeCode:$('#typeCode').val()
    };
 }


function doSearch(){
    grid.query(getParams());
}
