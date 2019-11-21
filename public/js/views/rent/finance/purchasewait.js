var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "创建时间", dataIndex: 'PUCODE', width:'12%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					return '<span title="点击查看备注" ondblclick="showRemark(\''+pkid+'\')">'+data['CREATEDATE']+'</span>';
				}
			}
			,{header:"采购单号", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pucode = data['PU_CODE'];
					if(pucode){
						return "<a class='a_link' href='javaScript:purchaseinfo(\""+pucode+"\")'>"+pucode+"</a>";
					}
				}
			}
			,{header: "采购商", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var partnerCode = data['PARTNER_CODE'];
					var partnerName = data['PARTNERNAME'];
					var html = "<a class='a_link' href='javaScript:partner(\""+partnerCode+"\")'>"+partnerName+"</a>";
				    return html;
				}
			}
			,{header: "收款账号", dataIndex: 'BANKCODE', width:'12%',sortable:false}
			,{header: "开户行", dataIndex: 'BANK', width:'10%',sortable:false}
			,{header: "采购人", dataIndex: 'MERUSER', width:'7%',sortable:false}
            ,{header: "打款金额", dataIndex: 'PRICE', width:'7%',sortable:false}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'7%',sortable:false}
            ,{header: "采购备注", dataIndex: 'PUREMARK', width:'7%',sortable:false}
            ,{header: "财务备注", dataIndex: 'REMARK', width:'7%',sortable:false}
            ,{header:"操作", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var puCode = data['PU_CODE'];
					var html = "<a class='a_link' href='javaScript:audit(\""+pkid+"\")'>打款</a>";
						//html += "  |  <a class='a_link' href='javaScript:stop(\""+pkid+"\")'>终止</a>";
						html += "  |  <a class='a_link' href='javaScript:showRemark(\""+pkid+"\")'>备注</a>";
				    return html;
				}
			}
		]
		,url : '/rent/finance/purchasepage'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			var pageNum = grid.getPageNumber();
			limit = grid.getPageSize();
			start = (pageNum-1) * limit;
		},
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
		puCode:$('#puCode').val(),
		bank:$('#bank').val(),
		bankCode:$('#bankCode').val(),
		partnerCode:$('#partnerCode').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
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
	var puCode = $('#puCode').val();
	var partnerCode = $('#partnerCode').val();
	var bank = $('#bank').val();
	var bankCode = $('#bankCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?puCode='+puCode+'&partnerCode='+partnerCode+'&bank='+bank+'&bankCode='+bankCode+'&startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/rent/finance/exportpurchase'+param;
});

$('#exportlistinfo').on('click',function(){
	var puCode = $('#puCode').val();
	var partnerCode = $('#partnerCode').val();
	var bank = $('#bank').val();
	var bankCode = $('#bankCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var param = '?puCode='+puCode+'&partnerCode='+partnerCode+'&bank='+bank+'&bankCode='+bankCode+'&startDate='+startDate+'&endDate='+endDate;
	window.location.href = '/rent/finance/exportpurchaseinfo'+param;
});

//layer iframe
function layeriframe(title,url,x,y,s){
	var index = layer.open({
		type:2,
		title:title,
		shadeClose:false,
		shade:0.8,
		content:url,
		area:[x , y],
		close:function(index){
			layer.close(index);
		},
		end: function () {
			if(s == 1){
				location.reload();
			}
        }
	});
}

//审核打款
function audit(pkid){
	var title = '采购打款操作';
	var url = '/rent/finance/purchaseaudit?pkid='+pkid;
	var x = '500px';
	var y = '450px';
	layeriframe(title,url,x,y,1);
}


//终止
function stop(pkid){
	layer.confirm('确定终止当前打款记录？', {
	  btn: ['确定','取消'] //按钮
	}, function(){
		$.post('/rent/finance/purchasestop',{pkid:pkid,status:'3'},function(data){
			var msg = '';
			if(data == 'Y'){
				msg = '操作成功';
			}else{
				msg = '操作失败';
			}
			layer.alert(msg, {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
			setTimeout("location.reload()", 2500);
		},'json');
	}, function(){
	 
	});
}

//备注
function showRemark(pkid){
	var title = '采购打款备注';
	var url = '/rent/finance/purchaseremark?pkid='+pkid;
	var x = '500px';
	var y = '450px';
	layeriframe(title,url,x,y,0);
}

//采购商详情
function partner(partnerCode){
	if(partnerCode){
		var title = '采购商详情';
		var url = '/rent/purchase/partnerinfo?partnerCode='+partnerCode;
		var x = '450px';
		var y = '500px';
		layeriframe(title,url,x,y,'');
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}

//采购单详情
function purchaseinfo(puCode){
	if(puCode){
		var title = '采购单详情';
		var url = '/rent/purchase/info?flag=N&puCode='+puCode;
		var x = '800px';
		var y = '600px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}