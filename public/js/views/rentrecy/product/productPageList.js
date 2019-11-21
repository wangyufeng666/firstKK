var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"SKU编码", dataIndex:'SKUCODE', width:'200px',sortable:false}
			,{header:"所属来源", dataIndex:'SOURCES', width:'80px', sortable:false}
			,{header:"商品品类", dataIndex:'PRODUCT_TYPE', width:'80px', sortable:false}
			,{header:"商品品牌", dataIndex:'BRAND_NAME', width:'80px', sortable:false}
			,{header:"商品名称", dataIndex:'PRODUCT_NAME', sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px',sortable:false}
			,{header:"鉴定规则", dataIndex:'RULENAME', width:'160px',sortable:false}
			,{header:"回收商品信息", dataIndex:'MERNAME', width:'160px',sortable:false}
			,{header:"操作", dataIndex:'PKID', width:'80px', sortable:false, 
				renderer :function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:skuInfo(\''+value+'\')" class="a_link">查看</a>';
				}
			}
		]
		,url:'/rentrecy/product/pagelist'
		,baseParams:{}
	});
});

/**
 * 新增鉴定规则
 * @return
 */
function skuInfo(pkId){
    layer.open({
		type:2,
		title:'租赁归还商品信息',
		shadeClose:false,
		shade:0.8,
        content:'/rentrecy/product/skuinfo?pkId='+pkId,
        area :['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
    });
}

function getParams(){
    return {
    	merType:$('#merType').val(),
    	brandName:$('#brandName').val(),
    	merName:$('#merName').val(),
    	merSource:$('#merSource').val(),
    	skuCode:$('#skuCode').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}

document.onkeypress = keypress;
