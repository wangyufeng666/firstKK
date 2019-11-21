var grid;
var layerIndex = 0;


$().ready(function(){

	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'30px',sortable:false}
			,{header:"用户姓名", dataIndex:'USERNAME', width:'30px',sortable:false}
			,{header:"手机号", dataIndex:'MOBILE', width:'150px',sortable:false}
			,{header:"订单数", dataIndex:'ORDERNO', width:'80px',sortable:false}
		]
		,url:'/youdezhuan/user/pagelist'
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
		start:start,
		contact:$('#contact').val(),
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

//新增分销成员
function addMember(parentId) {
	layer.open({
		type:2,
		title:'新增成员',
		content:'/youdezhuan/distribute/addmember?parent='+parentId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['40%' , '30%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function edit(userId) {
	layer.open({
		type:2,
		title:'编辑成员',
		content:'/youdezhuan/distribute/editmember?userid='+userId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['40%' , '30%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function memberInfo(userId) {
	layer.open({
		type:2,
		title:'分销成员详情',
		content:'/youdezhuan/distribute/memberinfo?userid='+userId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}


/**
 * 审核用户真实信息
 * @param userId
 */
function verify(userId) {
	layer.open({
		type:2,
		title:'审核信息',
		content:'/youdezhuan/distribute/usertureinfo?userid='+userId+'&layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['50%' , '50%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function thawFunds(userId) {
	var index = layer.load();
	$.ajax({
		url:'/youdezhuan/distribute/thawfunds',
		type:'post',
		data:{userid:userId},
		dataType:'json',
		success:function(res) {
			layer.close(index);
			if(res == 'Y') {
				doSearch();
			}else {
				alert(res);
			}
		}
	})
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(userId, userName, orderPrice){
	layer.close(layerIndex);
	$.post('/youdezhuan/distribute/jsonremark',{userId:userId}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">用户备注： <br/>'+data+'</div>'
		});
	});
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
