var grid;
var layerIndex = 0;


$().ready(function(){

	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'80px',sortable:false}
			,{header:"用户姓名", dataIndex:'CONTACTS', width:'100px',sortable:false}
			,{header:"手机号", dataIndex:'MOBILE', width:'80px',sortable:false}
			,{header:"下级数量", dataIndex:'SUBTOTAL', width:'80px',sortable:false}
			,{header:"下级销售量", dataIndex:'SUBORDERNUM', width:'80px',sortable:false}
			,{header:"个人销售量", dataIndex:'ORDERNUM', width:'80px',sortable:false}
			,{header:"总销售量", dataIndex:'ORDERTOTALNUM',width:'80px',sortable:false}
			,{header:"待解冻佣金", dataIndex:'FROZEN', width:'80px',sortable:false}
			,{header:"可提现佣金", dataIndex:'CASHOUT', width:'80px',sortable:false}
			,{header:"提现总佣金", dataIndex:'CASHTOTAL', width:'80px',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'130px',sortable:false}
			,{header:"审核状态", dataIndex:'STATUS', width:'50px',sortable:false
				,renderer:function(value,data,rowIndex,colIndex,metadata) {
					if(value == '1'){
						return '待审核';
					}else if(value == '2') {
						return '审核失败';
					}else if(value == '3') {
						return '审核成功';
					}else {
						return '未审核';
					}
				}
			}
			,{header:"状态", dataIndex:'DELETEFLAG', width:'40px',sortable:false
				,renderer:function(value,data,rowIndex,colIndex,metadata) {
					if(value == 'D'){
						return '冻结';
					}else {
						return '正常';
					}
				}
			}
			,{header:"操作", dataIndex:'', width:'300px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = "";

					if(data['DELETEFLAG'] == 'D') {
						returnText+=' <a href="javascript:void(1)" onclick="operation(\''+data['USERID']+'\',\'N\')" class="a_link">解冻</a>';
					}else {
						returnText+=' <a href="javascript:void(1);" onclick="operation(\''+data['USERID']+'\',\'D\')" class="a_link">冻结</a>';
					}
					returnText+=' |<a href="javasrcript:void(1);" onclick="edit(\''+data['USERID']+'\')" class="a_link">编辑</a>';
					returnText+=' |<a href="javasrcript:void(1);" onclick="memberInfo(\''+data['USERID']+'\')" class="a_link">详情</a>';
					returnText+=' |<a href="javasrcript:void(1);" onclick="operation(\''+data['USERID']+'\',\'Y\')" class="a_link">删除</a>';
					if(data['FROZEN'] > 0) {
						returnText+=' |<a href="javasrcript:void(1);" onclick="thawFunds(\''+data['USERID']+'\')" class="a_link">资金解冻</a>';
					}
					if(data['STATUS'] == '1') {
						returnText +=' |<a href="javascript:verify(\''+data['USERID']+'\')" class="a_link">审核</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/youdezhuan/distribute/memberlist'
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
		parentName:$('#parentName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		status:$('#checkFlag').val(),
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
		area:['800px' , '550px'],
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
		area:['800px' , '550px'],
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

//资金解冻
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

//冻结or解冻分销商
function operation(userId,flag) {
	if(confirm('操作后可能导致无法下单、无法提现。请谨慎操作')){
		$.post('/youdezhuan/distribute/frozen',{userId:userId,flag:flag},function(data){
			if(data == 'Y'){
				alert('操作成功！');
				window.location.href = window.location.href;
			}else{
				alert('操作失败，请重新操作');
			}
		})
	}
}
