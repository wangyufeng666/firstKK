var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'5%',sortable:false}
			,{header:"下单日期", dataIndex:'ORDERDATE', width:'10%',sortable:false}
			,{header:"奖品名称", dataIndex:'PRIZENAME', width:'10%',sortable:false}
			,{header:"用户ID", dataIndex:'USERID', width:'10%',sortable:false}
			,{header:"联系方式", dataIndex:'MOBILE', width:'10%',sortable:false}
			,{header:"所属订单", dataIndex:'ORDERNO', width:'10%',sortable:false}
			,{header:"订单状态", dataIndex:'ORDERSTATUSTXT', width:'5%',sortable:false}
			,{header:"奖品状态", dataIndex:'PRIZESTATUSTXT', width:'5%',sortable:false}
			,{header:"抽奖次数", dataIndex:'NUMS', width:'5%',sortable:false}
			,{header:"操作", dataIndex:'', width:'20%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderno = data['ORDERNO'];
					var prizeid = data['PRIZEID'];
					var userid = data['USERID'];
					var prizestatus = data['PRIZESTATUS'];
					var gotype = 'grants';
					var notype = 'stops';
					var returnText = '';
					if(prizestatus == '1' && orderno){
						returnText += ' <a href="javascript:void(0);" onclick="grantAndStop(\''+userid+'\',\''+gotype+'\',\''+prizeid+'\',\''+orderno+'\')" class="a_link">发放</a> ';
						returnText += ' | <a href="javascript:void(0);" onclick="grantAndStop(\''+userid+'\',\''+notype+'\',\''+prizeid+'\',\''+orderno+'\')" class="a_link">终止</a> ';
					}
					
					return returnText;
				}
			}
		]
		,url:'/idlefishv2/activity/userprizepagelist'
		,baseParams:initParams()
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		}
		,pageSizeList:[15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}

function getParams(){
	return {
		start:start,
		orderno:$('#orderno').val(),
		prizeStatus:$('#prizeStatus').val(),
		prizeName:$('#prizeName').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

/**
 * 发放 and 终止
 */
function grantAndStop(userid,types,prizeid,orderno){
	var hint = '';
	if(types == 'grants'){ //发放
		hint = '确认发放该奖品吗 ？';
	}else if(types == 'stops'){ //终止
		hint = '确认终止该奖品吗？';
	}
	if(hint){
		if(confirm(hint)){
			if(userid && prizeid){
				$.post('/idlefishv2/activity/grantandstop',{userid:userid,types:types,prizeid:prizeid,orderno:orderno,go:'1'},function(data){
					if(data == 'Y'){
						alert('操作成功');
					}else{
						alert('操作失败');
					}
					window.location.href=backUrl;
				});	
			}
		}
	}
}
