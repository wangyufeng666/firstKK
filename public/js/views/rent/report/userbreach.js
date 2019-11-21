var backUrl = '/rent/report/userbreach';
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "订单时间", dataIndex: 'CREATE_DATE', width:'10%',sortable:false}
			,{header: "订单编号", dataIndex: '', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return '<a href="javascript:orderInfo(\''+data['ORDER_NO']+'\');" class="a_link">'+data['ORDER_NO']+"</a>";
				}
			}
            ,{header: "姓名/电话", dataIndex: '', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACT_NAME']+" / "+data['CONTACT_MOBILE'];
				}
			}
            ,{header: "地址", dataIndex: 'ADDRESS', width:'5%',sortable:false}
            ,{header: "来源", dataIndex: 'SOURCENAME', width:'5%',sortable:false}
            ,{header: "渠道", dataIndex: 'PARTNERNAME', width:'5%',sortable:false}
            ,{header: "商品品类", dataIndex: 'TYPENAME', width:'5%',sortable:false}
            ,{header: "商品名称/类型", dataIndex: '', width:'10%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PRODUCTNAME']+" / "+data['PRODUCTMODEL'];
				}
			}
            ,{header: "新机价格", dataIndex: 'NEWPRICE', width:'5%',sortable:false}
            ,{header: "实际押金", dataIndex: 'FREEZEPRICE', width:'5%',sortable:false}
            ,{header: "第一次违约时间", dataIndex: 'ENDDATE', width:'10%',sortable:false}
            ,{header: "违约期数", dataIndex: 'NOCOUNT', width:'5%',sortable:false}
            ,{header: "违约总金额", dataIndex: 'NOPRICE', width:'5%',sortable:false}
            ,{header: "已交期数", dataIndex: 'NOCOUNT', width:'5%',sortable:false}
            ,{header: "已交期数总金额", dataIndex: 'YESPRICE', width:'5%',sortable:false}
            ,{header: "保险金额", dataIndex: 'INSURANCEPRICE', width:'5%',sortable:false}
		]
		,url : '/rent/report/userbreachpage'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		var params = [];
		return params;
	}
}

function getParams(){
	return {
		merType:$('#merType').val(),
		sourceCode:$('#sourceCode').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		orderNo:$('#orderNo').val(),
		merName:$('#merName').val(),
		noCount:$('#noCount').val(),
		mobile:$('#mobile').val()
	};
}


function doSearch(){
	layer.msg('加载中', {icon:16,shade:0.1});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

$('#exportlist').on('click',function(){
	var merType = $('#merType').val();
	var sourceCode = $('#sourceCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var orderNo = $('#orderNo').val();
	var merName = $('#merName').val();
	var noCount = $('#noCount').val();
	var mobile = $('#mobile').val();
	var param = '?merType='+merType+'&sourceCode='+sourceCode+'&startDate='+startDate+'&endDate='+endDate;
	param += '&orderNo='+orderNo+'&merName='+merName+'&mobile='+mobile+'&noCount='+noCount;
	window.location.href = '/rent/report/exportuserbreach'+param;
});

function orderInfo(orderNo){
	if(orderNo){
		window.location.href='/rent/installment/orderinfo?order_no='+orderNo+'&backUrl='+backUrl;
	}
}