var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header:"NO.", dataIndex:'R', width:'40px', sortable:false}
			,{header:"检测时间", dataIndex:'CREATEDATE', width:'90px', sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'60px', sortable:false}
			,{header:"器材名称", dataIndex:'MERNAME', width:'80px', sortable:false}
			,{header:"订单价格", dataIndex: 'DINGDANPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['DINGDANPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['DINGDANPRICE'];
					}
				}
			}
			,{header: "联系方式", dataIndex: 'LIANXIREN', width:'130px',sortable:false
				,renderer : function(value, data, rowIndex, colIndex, metadata){
					return value+'('+data['LIANXIDH']+')';
				}
			}
			,{header:"订单地址", dataIndex:'DIZHI', width:'90px', sortable:false}
			,{header:"订单来源", dataIndex:'SOURCENAME', width:'90px', sortable:false}
			,{header:"交易方式", dataIndex:'CHULITYPE', width:'70px', sortable:false}
			,{header:"预约时间", dataIndex:'CHULIBEIZHU', width:'85px', sortable:false}
			,{header:"检测地区", dataIndex:'AREA_NAME', width:'60px', sortable:false}
			,{header:"检测员", dataIndex:'WORKERNAME', width:'60px', sortable:false}
			,{header:"订单状态", dataIndex:'DINGDANSTATUS', width:'65px', sortable:false}
		]
		,url : '/report/inspection/inspectionbilllist'
	});
});

function getParams(){
    return {
    	inspectDate:$('#inspectDate').val()
    };
}

function doSearch(){
    grid.query(getParams());
}

function downloadInspectionbill(){
	window.location.href = '/report/inspection/inspectionexport?inspectDate='+$('#inspectDate').val();
	return false; //截取返回false就不会保存网页了
}

function inspectionbillStatistics(){
    window.location.href = '/report/inspection/inspectionstatistics?inspectDate='+$('#inspectDate').val();
    return false;
}
