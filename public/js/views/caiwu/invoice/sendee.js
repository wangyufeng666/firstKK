var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"收票人ID", dataIndex:'SENDEEID', width:'250px',sortable:false}
            ,{header:"收票人类型", dataIndex:'SENDEETYPE',width:'80px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['SENDEETYPE'] == '1'){
                        var returnText = '<span class="green">个人</span>';
                    }else if(data['SENDEETYPE'] == '2'){
                        var returnText = '<span class="red">企业</span>';
                    }
                    return returnText;
                }
            }
            ,{header:"名称", dataIndex:'SENDEENAME', width:'400px',sortable:false}
            ,{header:"创建时间", dataIndex:'CREATEDATE', width:'150px',sortable:false}
            ,{header:"操作", dataIndex:'', width:'30%', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a class="a_link" href="javascript:invoiceSendeeInfo(\''+data['SENDEEID']+'\')">详情</a>';
                    returnText += ' | <a class="a_link" href="javascript:editThis(\''+data['SENDEEID']+'\')">修改</a>';
                    returnText += ' | <a class="a_link" href="javascript:deleteThis(\''+data['SENDEEID']+'\')">删除</a>';
                    return returnText;
                }
            }
        ]
        ,url:'/caiwu/invoice/pagelistbysendee'
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
        sendeetype:$('#sendeeType').val(),
        sendeename:$('#sendeeName').val()
    };
}

/**
 * 根据条件查询收票人
 */
function doSearch(){
    grid.query(getParams());
}

/**
 * 关闭弹框
 */
function closeLayer(){
    layer.closeAll('iframe');
}

/**
 * 重新加载
 */
function reload(){
    layer.closeAll('iframe');
    grid.reload();
}

/**
 * 添加收票人
 */
function addInvoiceSendee(){
    layer.open({
        type:2,
        title:'新增收票人',
        shadeClose:false,
        shade:0.8,
        content:'/caiwu/invoice/addsendee',
        area:['800px','430px'],
        close:function(index){
            layer.close(index);
        }
    });
}


/**
 * 收票人详情
 * @param sendeeid
 */
function invoiceSendeeInfo(sendeeid){
    layer.open({
        type:2,
        title:'收票人详情',
        shadeClose:false,
        shade:0.8,
        content:'/caiwu/invoice/sendeeinfo?sendeeid=' + sendeeid,
        area:['550px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 删除
 */
function deleteThis(sendeeId){
    layer.confirm('是否确认删除选中的收票人?', function(index){
        $.post('/caiwu/invoice/deletesendee', {sendeeId:sendeeId}, function(data){
            if(data.code == 'Y'){
                layer.msg("删除收票人成功：" + sendeeId);
                grid.reload();
            }else{
                layer.msg(data.text);
            }
        });
        layer.close(index);
    });
}


/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function editThis(sendeeId){
    layer.open({
        type:2,
        title:'修改收票人信息',
        shadeClose:false,
        shade:0.8,
        content:"/caiwu/invoice/editsendee?sendeeId="+sendeeId,
        area:['800px','450px'],
        close:function(index){
            layer.close(index);
        }
    });
}