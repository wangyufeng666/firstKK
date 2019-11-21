var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize:15,
        height:375
        ,cm:[
            {header:"NO.", dataIndex:'R', width:'40px',sortable:false}
            ,{header:"发票编码", dataIndex:'INVOICEID', width:'300px',sortable:false}
            ,{header:"发票名称", dataIndex:'INVOICENAME', width:'300px',sortable:false}
            ,{header:"申请时间", dataIndex:'CREATEDATE', width:'150px',sortable:false}
            ,{header:"开票时间", dataIndex:'INVOICEOPENDATE', width:'150px',sortable:false}
            ,{header:"发票代码", dataIndex:'FPDM', width:'100px',sortable:false}
            ,{header:"发票号码", dataIndex:'FPHM', width:'100px',sortable:false}
            ,{header:"发票类型", dataIndex:'KPLX', width:'100px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['KPLX'] == '1'){
                        var returnText = '<span class="blue">正票</span>';
                    }else if(data['KPLX'] == '2'){
                        var returnText = '<span class="red">红票</span>';
                    }
                    return returnText;
                }
            }
            ,{header:"状态", dataIndex:'STATUS',width:'80px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['STATUS'] == '1'){
                        var returnText = '<span class="green">待开票</span>';
                    }else if(data['STATUS'] == '2'){
                        var returnText = '<span class="blue">已开票</span>';
                    }else if(data['STATUS'] == '3'){
                        var returnText = '<span class="red">已冲红</span>';
                    }else if(data['STATUS'] == '4'){
                        var returnText = '<span class="red">开票中（正）</span>';
                    }else if(data['STATUS'] == '5'){
                        var returnText = '<span class="red">开票中（红）</span>';
                    }
                    return returnText;
                }
            }
            ,{header:"操作", dataIndex:'INVOICEID', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a class="a_link" href="javascript:invoiceDetails(\''+value+'\')">销售明细</a>';
                    if(data['LPDFURL'] !== '' && data['LPDFURL'] !== null && data['LPDFURL'] !== undefined){
                        returnText += ' | <a class="a_link" href="'+ data['LPDFURL'] +'" target="_blank">查看发票</a>';
                    }
                    if(data['STATUS'] == '1'){
                        returnText += ' | <a class="a_link" href="javascript:editThis(\''+value+'\')">修改</a>';
                        returnText += ' | <a class="a_link" href="javascript:opensThis(\''+value+'\')">开票</a>';
                        returnText += ' | <a class="a_link" href="javascript:deleteThis(\''+value+'\')">删除</a>';
                    }
                    if(data['STATUS'] == '2'){
                        if((data['FPDM'] === '' || data['FPDM'] === null) && (data['FPHM'] === '' || data['FPHM'] === null)){
                            returnText += ' | <a class="a_link" href="javascript:deleteThis(\''+value+'\')">删除</a>';
                        }
                        if(data['LPDFURL'] === '' || data['LPDFURL'] === null || data['LPDFURL'] === undefined) {
                            returnText += ' | <a class="a_link" href="javascript:download(\'' + value + '\')">下载</a>';
                        }else{
                            returnText += ' | <a class="a_link" href="javascript:openRedThis(\''+value+'\')">冲红</a>';
                            returnText += ' | <a class="a_link" href="javascript:emailPush(\''+value+'\')">邮箱推送</a>';
                        }
                    }
                    if(data['STATUS'] == '3'){
                        if(data['KPLX'] == 2){
                            if(data['LPDFURL'] === '' || data['LPDFURL'] === null || data['LPDFURL'] === undefined) {
                                returnText += ' | <a class="a_link" href="javascript:download(\'' + value + '\')">下载</a>';
                            }else{
                                returnText += ' | <a class="a_link" href="javascript:emailPush(\''+value+'\')">邮箱推送</a>';
                            }
                        }
                    }
                    if(data['STATUS'] == '4' || data['STATUS'] == '5'){
                        returnText += ' | <a class="a_link" href="javascript:queryOpenStatus(\'' + value + '\')">查询开票状态</a>';
                    }
                    return returnText;
                }
            }
        ]
        ,url:'/caiwu/invoice/pagelistbyinvoice'
        ,baseParams:getParams()
        ,pageSizeList:[15,30,50]
    });
});

function getParams(){
    return {
        status:$('#status').val()
    };
}
function closeLayer(){
    layer.closeAll('iframe');
}


function reload(){
    layer.closeAll('iframe');
    grid.reload();
}

/**
 * 跳转到新增发票界面
 */
function addInvoiceRecord(){
    layer.open({
        type:2,
        title:'新增开票记录',
        shadeClose:false,
        shade:0.8,
        content:'/caiwu/invoice/addrecord',
        area:['600px','300px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 跳转到发票详情界面
 * @param $invoiceId
 */
function invoiceDetails($invoiceId){
    if($invoiceId != '' && $invoiceId != null && $invoiceId != undefined){
        layer.open({
            type:2,
            title:'销售明细',
            shadeClose:false,
            shade:0.8,
            content:'/caiwu/invoice/invoicedetails?invoiceId='+$invoiceId,
            area:['90%','520px'],
            close:function(index){
                layer.close(index);
            }
        });
    }else{
        layer.msg("发票ID为空！")
    }
}

/**
 * 删除
 */
function deleteThis(invoiceId){
    layer.confirm('是否确认删除选中的发票记录？', function(index){
        $.post('/caiwu/invoice/deleteinvoice', {invoiceId:invoiceId}, function(data){
            if(data.code == 'Y'){
                layer.msg('删除发票成功');
                grid.reload();
            }else{
                layer.msg(data.text);
            }
        });
        layer.close(index);
    });
}

function queryOpenStatus(invoiceId){
    $.post('/caiwu/invoice/queryopenstatus', {invoiceId:invoiceId}, function(data){
        if(data.code == 'Y'){
            layer.msg('开票成功');
            grid.reload();
        }else{
            layer.msg(data.text);
        }
    });
}

/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function editThis(invoiceId){
    layer.open({
        type:2,
        title:'修改发票信息',
        shadeClose:false,
        shade:0.8,
        content:"/caiwu/invoice/editrecord?invoiceId="+invoiceId,
        area:['550px','240px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 开正票
 * @param invoiceId
 */
function opensThis(invoiceId){
    layer.confirm('是否确认开票?', function(index){
        $.post('/caiwu/invoice/openinvoice', {invoiceId:invoiceId}, function(data){
            if(data.code == 'Y'){
                layer.msg("开票成功！");
                grid.reload();
            }else{
                layer.msg(data.text);
            }
        });
        layer.close(index);
    });
}

/**
 * 开红票
 * @param invoiceId
 */
function openRedThis(invoiceId){
    layer.open({
        type:2,
        title:'发票冲红',
        shadeClose:false,
        shade:0.8,
        content:'/caiwu/invoice/redinvoice?invoiceId=' + invoiceId,
        area:['550px','280px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 下载发票
 * @param invoiceId
 */
function download(invoiceId){
    $.post('/caiwu/invoice/downloadinvoice', {invoiceId:invoiceId}, function(data){
        if(data.code == 'Y'){
            layer.msg("下载发票成功！")
            grid.reload();
        }else{
            layer.msg(data.text)
        }
    });
}

/**
 * 推送发票
 * @param invoiceId
 */
function emailPush(invoiceId){
    var email = $('#pushEmail').val();
    var msg = '是否发送到邮箱：'+ email +'？';
    layer.confirm(msg, function(index){
        $.post('/caiwu/invoice/pushinvoice', {invoiceId: invoiceId}, function (data) {
            if (data.code == 'Y') {
                layer.msg("邮箱推送成功！")
                grid.reload();
            } else {
                layer.msg(data.text)
            }
        });
        layer.close(index);
    });
}