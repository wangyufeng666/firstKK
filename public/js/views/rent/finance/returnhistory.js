var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'3%',sortable:false}
			,{header: "创建时间", dataIndex: '', width:'15%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					return '<span title="点击查看备注" ondblclick="showRemark(\''+pkid+'\')">'+data['CREATEDATE']+'</span>';
				}
			}
			,{header: "流水编号", dataIndex: 'TRADENO', width:'15%',sortable:false}
			,{header:"退货单号", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var recode = data['RE_CODE'];
					if(recode){
						return "<a class='a_link' href='javaScript:returninfo(\""+recode+"\")'>"+recode+"</a>";
					}
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
            ,{header: "打款金额", dataIndex: 'PRICE', width:'8%',sortable:false}
            ,{header: "打款时间", dataIndex: 'FULFIL_DATE', width:'15%',sortable:false}
            ,{header: "打款人", dataIndex: '', width:'7%',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					return '<span title="'+data['JOBNUM']+'" ondblclick="showRemark(\''+pkid+'\')">'+data['USERNAME']+'</span>';
				}
			}
            ,{header: "状态", dataIndex: 'STATUSTXT', width:'5%',sortable:false}
            ,{header:"操作", dataIndex:'', width:'10%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var imgUrl = data['IMGURL'];
					var html = "<a class='a_link' href='javaScript:showRemark(\""+pkid+"\")'>备注</a>";
					if(imgUrl){
						html += "  |  <a class='a_link' href='javaScript:voucher(\""+imgUrl+"\")'>凭证</a>";
					}
				    return html;
				}
			}
		]
		,url : '/rent/finance/purchasereturnpage'
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
		params['status'] = $('#status').val();
		return params;
	}else{
		var params = [];
		params['status'] = $('#status').val();
		return params;
	}
}

function getParams(){
	return {
		reCode:$('#reCode').val(),
		puCode:$('#puCode').val(),
		partnerCode:$('#partnerCode').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		tradeNo:$('#tradeNo').val(),
		fulfilStart:$('#fulfilStart').val(),
		fulfilEnd:$('#fulfilEnd').val(),
		status:$('#status').val()
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
	var reCode = $('#reCode').val();
	var puCode = $('#puCode').val();
	var partnerCode = $('#partnerCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var tradeNo = $('#tradeNo').val();
	var fulfilStart = $('#fulfilStart').val();
	var fulfilEnd = $('#fulfilEnd').val();
	var status = $('#status').val();
	var param = '?reCode='+reCode+'&puCode='+puCode+'&partnerCode='+partnerCode+'&startDate='+startDate+'&endDate='+endDate;
	param += '&tradeNo='+tradeNo+'&fulfilStart='+fulfilStart+'&fulfilEnd='+fulfilEnd+'&status='+status;
	window.location.href = '/rent/finance/exportpurchasereturn'+param;
});

$('#exportlistinfo').on('click',function(){
	var reCode = $('#reCode').val();
	var puCode = $('#puCode').val();
	var partnerCode = $('#partnerCode').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var tradeNo = $('#tradeNo').val();
	var fulfilStart = $('#fulfilStart').val();
	var fulfilEnd = $('#fulfilEnd').val();
	var status = $('#status').val();
	var param = '?reCode='+reCode+'&puCode='+puCode+'&partnerCode='+partnerCode+'&startDate='+startDate+'&endDate='+endDate;
	param += '&tradeNo='+tradeNo+'&fulfilStart='+fulfilStart+'&fulfilEnd='+fulfilEnd+'&status='+status;
	window.location.href = '/rent/finance/exportpurchasereturninfo'+param;
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

//备注
function showRemark(pkid){
	var title = '采购退货追款备注';
	var url = '/rent/finance/returnremark?pkid='+pkid;
	var x = '500px';
	var y = '450px';
	layeriframe(title,url,x,y,0);
}

/**
 * 查看凭证
 */
function voucher(img){
	if(img){
		layer.open({
		  type: 1,
		  skin: '', //边框
		  area: ['600px', '400px'], //宽高
		  content: '<div style="text-align:center;"><a href="'+img+'" download="凭证" target="_blank">下载图片</a><br><img src="'+img+'"></div>'
		});
	}else{
		layer.alert('没有找到图片');
	}
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

//退货单详情
function returninfo(reCode){
	if(reCode){
		var title = '退货单详情';
		var url = '/rent/purchase/inforeturn?flag=Y&reCode='+reCode;
		var x = '800px';
		var y = '600px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
}

//采购单详情
function purchaseinfo(puCode){
	if(puCode){
		var title = '采购单详情';
		var url = '/rent/purchase/info?flag=Y&puCode='+puCode;
		var x = '800px';
		var y = '600px';
		layeriframe(title,url,x,y,0);
	}else{
		layer.alert('没有找到相关信息！', {skin: 'layui-layer-lan',closeBtn: 0,anim: 1});
	}
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
