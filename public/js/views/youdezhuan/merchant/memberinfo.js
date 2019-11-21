var withdrawal;
var dealorder;
var subdistributer;
var funds;
var layerIndex = 0;


$().ready(function(){

	withdrawal = $('#withdrawal').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'80px',sortable:false}
			,{header:"流水号", dataIndex:'ORDERCODE', width:'100px',sortable:false}
			,{header:"申请时间", dataIndex:'CREATETIME', width:'80px',sortable:false}
			,{header:"提现金额", dataIndex:'PRICE', width:'80px',sortable:false}
			,{header:"账号类型", dataIndex:'TYPES', width:'80px',sortable:false
				,renderer:function(value,data,rowIndex,colIndex,metadata) {
					if(value == '1'){
						return '微信';
					}else if(value == '2') {
						return '支付宝';
					}else {
						return '银行卡'
					}
				}
			}
			,{header:"收款人", dataIndex:'PAYEE',width:'80px',sortable:false}
			,{header:"到账时间", dataIndex:'MODIFYTIME', width:'80px',sortable:false}
			,{header:"状态", dataIndex:'STATUS', width:'80px',sortable:false
				,renderer:function(value,data,rowIndex,colIndex,metadata) {
					if(value == '1'){
						return '待审';
					}else if(value == '2') {
						return '成功';
					}else if(value == '7') {
						return '支付中'
					}else {
						return '失败'
					}
				}
			}
		]
		,url:'/youdezhuan/distribute/userwithdrawal'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[10,15,20,30,50]
	});
	dealorder = $('#dealorder').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'80px',sortable:false}
			,{header:"订单编号", dataIndex:'ORDERNO', width:'100px',sortable:false}
			,{header:"日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"器材名称", dataIndex:'', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}}
			,{header:"联系人", dataIndex:'LIANXIREN', width:'80px',sortable:false}
			,{header:"联系方式", dataIndex:'LIANXIDH',width:'80px',sortable:false}
			,{header:"联系地址", dataIndex:'DIZHI', width:'80px',sortable:false}
			,{header:"订单价格", dataIndex:'', width:'80px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}}
			,{header:"订单佣金", dataIndex:'PRICE', width:'80px',sortable:false}
			,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'130px',sortable:false}
			,{header:"订单状态", dataIndex:'STATUSNAME', width:'140px',sortable:false}
		]
		,url:'/youdezhuan/distribute/userdealorder'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[10,15,20,30,50]
	});
	subdistributer = $('#subdistributer').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'80px',sortable:false}
			,{header:"用户姓名", dataIndex:'CONTACTS', width:'100px',sortable:false}
			,{header:"手机号", dataIndex:'MOBILE', width:'80px',sortable:false}
			,{header:"状态", dataIndex:'DELETEFLAG', width:'140px',sortable:false
				,renderer:function(value,data,rowIndex,colIndex,metadata) {
					if(value == 'Y'){
						return '冻结';
					}else {
						return '正常';
					}
				}
			}
		]
		,url:'/youdezhuan/merchant/subdistributer'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[10,15,20,30,50]
	});
	funds = $('#funds').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'80px',sortable:false}
			,{header:"资金", dataIndex:'PRICE', width:'100px',sortable:false}
			,{header:"资金状态", dataIndex:'STATUS', width:'80px',sortable:false
				,renderer:function(value,data,rowIndex,colIndex,metadata) {
					if(value == '1'){
						return '可提现';
					}else if(value == '2'){
						return '已提现';
					}else if(value == '3') {
						return '提现中'
					}else if(value == '4') {
						return '已作废'
					}else {
						return '冻结中'
					}
				}
			}
			,{header:"资金类型", dataIndex:'TYPE', width:'140px',sortable:false
				,renderer:function(value,data,rowIndex,colIndex,metadata) {
					if(value == '1'){
						return '佣金';
					}else {
						return '分成';
					}
				}
			}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'140px',sortable:false}
			,{header:"冻结解冻时间", dataIndex:'REWARDDATE', width:'140px',sortable:false}
		]
		,url:'/youdezhuan/distribute/fundslist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
	return params;
}


function getParams(){
	return {
		userId:userId,
	};
}

