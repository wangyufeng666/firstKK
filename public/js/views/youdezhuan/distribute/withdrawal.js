var grid;
var layerIndex = 0;


$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'80px',sortable:false}
			,{header:"流水号", dataIndex:'ORDERCODE', width:'100px',sortable:false}
			,{header:"申请时间", dataIndex:'CREATETIME', width:'80px',sortable:false}
			,{header:"提现金额", dataIndex:'PRICE', width:'80px',sortable:false}
			,{header:"账号类型", dataIndex:'TYPES', width:'80px',sortable:false
			,renderer:function(value,data,rowIndex,colIndex,metadata) {
				if(data == '1'){
					return '微信';
				}else if(data == '2') {
					return '银行卡';
				}else {
					return '支付宝'
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
						return '提现成功';
					}else if(value == '7') {
						return '支付中'
					}else {
						return '失败'
					}
				}
			}
		]
		,url:'/youdezhuan/distribute/withdrawallist'
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
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}


function getParams(){
	return {
		start:start,
		name:$('#name').val(),
		mobile:$('#mobile').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.paras.start = '1';
	grid.query(getParams());
}

//回车事件
document.onkeypress = keypress;
function keypress(e){
	var currKey = 0, e = e || event;
	if(e.keyCode == 13){
		doSearch();
	}
}


//下载
function exportMember() {
	var name = $('#name').val();
	var	mobile = $('#mobile').val();
	var	parentName = $('#parentName').val();
	var	startDate = $('#startDate').val();
	var	endDate = $('#endDate').val();
	var url = "/youdezhuan/distribute/exportmember?name="+name+"&mobile="+mobile+"&parentNmae="+parentName;
		  url	+= "&startDate="+startDate+"&endDate="+endDate;
	 window.location.href = url;

}
