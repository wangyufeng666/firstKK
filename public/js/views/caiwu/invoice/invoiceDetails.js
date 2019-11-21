var grid;
$().ready(function(){
    grid = $('#grid').grid({
        showSummaryBar : true,
        height:375
        ,cm:[
            {header:"序号", dataIndex:'SEQ', width:'50px',sortable:false}
            ,{header:"商品名称", dataIndex:'DETAILNAME', width:'100px',sortable:false}
            ,{header:"计量单位", dataIndex:'UNIT', width:'45px',sortable:false}
            ,{header:"规格型号", dataIndex:'SPEC', width:'60px',sortable:false}
            ,{header:"数量", dataIndex:'NUM', width:'40px',sortable:false}
            ,{header:"金额", dataIndex:'AMOUNT', width:'110px',summaryConfig:{calculation:'sum'},sortable:false}
            ,{header:"税率", dataIndex:'TAXRATE', width:'40px',sortable:false}
            ,{header:"商品税目", dataIndex:'TAXACCOUNTS', width:'60px',sortable:false}
            ,{header:"折扣金额", dataIndex:'DISCOUNTAMOUNT', width:'100px',sortable:false}
            ,{header:"税额", dataIndex:'TAX', width:'60px',summaryConfig:{calculation:'sum'},sortable:false}
            ,{header:"折扣税额", dataIndex:'DISCOUNTTAX', width:'60px',sortable:false}
            ,{header:"折扣率", dataIndex:'DISCOUNTRATE', width:'60px',sortable:false}
            ,{header:"单价", dataIndex:'UNITPRICE', width:'100px',sortable:false}
            ,{header:"价格方式", dataIndex:'PRICETYPE', width:'60px',sortable:false}
            ,{header:"税收分类编码版本号", dataIndex:'TAXONOMYVERSION', width:'110px',sortable:false}
            ,{header:"税收分类编码", dataIndex:'TAXONOMYCODING', width:'140px',sortable:false}
            ,{header:"企业商品编码", dataIndex:'COMMODITYCODING', width:'140px',sortable:false}
            ,{header:"使用优惠政策标识", dataIndex:'FAVOUREDPOLICY', width:'85px',sortable:false}
            ,{header:"零税率标识", dataIndex:'ZEROTAXMARKER', width:'60px',sortable:false}
            ,{header:"优惠政策说明", dataIndex:'FAVOUREDPOLICYNOTE', width:'70px',sortable:false}
            ,{header:"中外合作油气田标识", dataIndex:'COOPERATIONMARKER', width:'100px',sortable:false}
        ]
        ,url:'/caiwu/invoice/pagelistbydetails'
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
        invoiceId:$('#invoiceId').val(),
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
