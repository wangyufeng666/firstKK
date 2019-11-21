var grid;
var layerIndex = 0;
$().ready(function(){
	if (number =='1' || number == '2' || number =='5' || number == '6'){
		grid = $('#grid').grid({
			pageSize:15,
			height:375
			,cm:[
				{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
				,{header:"订单编号", dataIndex:'DINGDANNO', width:'130px',sortable:false}
				,{header:"订单成交金额", dataIndex:'SETTLEPRICE', width:'80px',sortable:false}
				,{header:"入库时间", dataIndex:'INWAREDATE', width:'110px',sortable:false}
				,{header:"入库操作人", dataIndex:'USERNAME', width:'80px',sortable:false}
				,{header:"品类", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
				,{header:"品牌", dataIndex:'PNAME', width:'80px',sortable:false}
				,{header:"型号", dataIndex:'MERNAME', width:'100px',sortable:false}
				,{header:"回收来源", dataIndex:'SOURCENAME', width:'100px', sortable:false}
			]
			,baseParams:initParams()
			,url:'/recycle/warehouse/detailpagelist'
			,pageSizeList:[15,30,50]
		});
	} else if(number =='3' || number == '4' || number == '10'  ){
		grid = $('#grid').grid({
			pageSize:15,
			height:375
			,cm:[
				{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
				,{header:"订单编号", dataIndex:'DINGDANNO', width:'130px',sortable:false}
				,{header:"订单成交金额", dataIndex:'SETTLEPRICE', width:'80px',sortable:false}
				,{header:"出库时间", dataIndex:'OUTWAREDATE', width:'110px',sortable:false,}
				,{header:"出库操作人", dataIndex:'USERNAME', width:'80px',sortable:false}
				,{header:"品类", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
				,{header:"品牌", dataIndex:'PNAME', width:'80px',sortable:false}
				,{header:"型号", dataIndex:'MERNAME', width:'100px',sortable:false}
				,{header:"回收来源", dataIndex:'SOURCENAME', width:'100px', sortable:false}
				,{header:"时长", dataIndex:'DURATION', width:'50px', sortable:false}
			]
			,baseParams:initParams()
			,url:'/recycle/warehouse/detailpagelist'
			,pageSizeList:[15,30,50]
		});
	}else{
		grid = $('#grid').grid({
			pageSize:15,
			height:375
			,cm:[
				{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
				,{header:"订单编号", dataIndex:'DINGDANNO', width:'130px',sortable:false}
				,{header:"订单成交金额", dataIndex:'SETTLEPRICE', width:'80px',sortable:false}
				,{header:"入库时间", dataIndex:'INWAREDATE', width:'110px',sortable:false}
				,{header:"入库操作人", dataIndex:'USERNAME', width:'80px',sortable:false}
				,{header:"品类", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
				,{header:"品牌", dataIndex:'PNAME', width:'80px',sortable:false}
				,{header:"型号", dataIndex:'MERNAME', width:'100px',sortable:false}
				,{header:"回收来源", dataIndex:'SOURCENAME', width:'100px', sortable:false}
				,{header:"时长", dataIndex:'DURATION', width:'50px', sortable:false}
			]
			,baseParams:initParams()
			,url:'/recycle/warehouse/detailpagelist'
			,pageSizeList:[15,30,50]
		});
	}


});

function initParams(){
	var params = getParams();
	params['start'] = 0;
	params['limit'] = 15;
	return params;
}

function getParams(){
	return {
		params:params,
		where:where,
		number:number,
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.query(getParams());
}
