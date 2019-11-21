
var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "序号", dataIndex: 'R', width:'30px',sortable:false}
			,{header:"创建时间", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var createdate = data['CREATEDATE'];
					var remark = data['REMARK'] ? data['REMARK'] : '暂无备注';
					return "<a class='' href='javaScript:remarks(\""+remark+"\")'>"+createdate+"</a>";
				}
			}
			,{header:"模型昵称", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var nickname = data['NICKNAME'];
					var mould_no = data['MOULD_NO'];
					return "<a class='' href='javaScript:mouldPartners(\""+mould_no+"\")' title='模型下的所有商户'>"+nickname+"</a>";
				}
			}
			,{header:"模型编号", dataIndex:'', width:'130px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var mould_no = data['MOULD_NO'];
					return "<a class='' href='javaScript:mouldTpls(\""+mould_no+"\")' title='模型下的所有模版'>"+mould_no+"</a>";
				}
			}
			,{header: "模版金额", dataIndex: 'TOTAL_AMOUNT', width:'60px',sortable:false}
			,{header: "模版余额", dataIndex: 'REMNANT', width:'60px',sortable:false}
			,{header: "支付状态", dataIndex:'', width:'60px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var paystatustxt = data['PAYSTATUSTXT'];
					var paystatus = data['PAY_STATUS'];
					var status = data['STATUS'];
					var template_id = data['TEMPLATE_ID'];
					var payUrl = data['CONFIRM_URI'] ? data['CONFIRM_URI'] : '';
					if(status == '2' && paystatus == '1'){
						return " <a class='a_link' href='javaScript:payInfo(\""+payUrl+"\")'>"+paystatustxt+"</a>";
					}else{
						return paystatustxt;
					}
				}
			}
			,{header: "红包发放结束时间", dataIndex: 'PUBLISH_END_TIME', width:'100px',sortable:false}
			,{header:"模型状态", dataIndex:'', width:'60px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var statustxt = data['STATUSTXT'];
					var status = data['STATUS'];
					if(status == '1'){
						return " <font color='red'>"+statustxt+"</font>";
					}else if(status == '2'){
						return statustxt;
					}else{
						return " <font color='#999'>"+statustxt+"</font>";
					}
				}
			}
			,{header: "操作", dataIndex: '',  width:'80px', sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                	var paystatus = data['PAY_STATUS'];
                	var payUrl = data['CONFIRM_URI'] ? data['CONFIRM_URI'] : '';
                	var status = data['STATUS'];
                	var template_no = data['TEMPLATE_NO'] ? data['TEMPLATE_NO'] : '';
                	var html = "<a class='a_link' href='javaScript:templateInfo(\""+template_no+"\")'>详情</a> ";
                	if(status == 1){
                		html += " | <a class='a_link' href='javaScript:audits(\"" + data['MOULD_NO'] + "\",\"YY\")'>开启</a> ";
                		//html += " | <a class='a_link' href='javaScript:dels(\"" + data['PKID'] + "\")'>删除</a> ";
                	}else if(status == 2){
                		if(paystatus == 1){
                			html += " | <a class='a_link' href='javaScript:payInfo(\""+payUrl+"\")'>去支付</a>";
                		}else if(paystatus == 2){
                			html += " | <a class='a_link' href='javaScript:addAliTpl(\"" + data['MOULD_NO'] + "\",\"" + data['TEMPLATE_NO'] + "\",\"" + data['TYPES'] + "\")'>充值</a> ";
                    		html += " | <a class='a_link' href='javaScript:audits(\"" + data['MOULD_NO'] + "\",\"N\")'>停用</a> ";
                		}
                	}else if(status == 3){
                		html += " | <a class='a_link' href='javaScript:audits(\"" + data['MOULD_NO'] + "\",\"Y\")'>启用</a> ";
                	}
                    return html;
                }
            }
		]
		,url : '/device/alipaycoupon/mouldpagelist'
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
		params['status'] = status;
		return params;
	}else{
		var params = [];
		params['status'] = status;
		return params;
	}
}

function getParams(){
	return {
		mouldName:$('#mouldName').val(),
		mouldNo:$('#mouldNo').val(),
		status:$('#status').val(),
		templateId:$('#templateId').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		payStatus:$('#payStatus').val()
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
	var mouldName = $('#mouldName').val();
	var mouldNo = $('#mouldNo').val();
	var status = $('#status').val();
	var templateId = $('#templateId').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var payStatus = $('#payStatus').val();
	var param = '?mouldName='+mouldName+'&mouldNo='+mouldNo+'&status='+status+'&templateId='+templateId;
	param += '&startDate='+startDate+'&endDate='+endDate+'&payStatus='+payStatus;
	window.location.href = '/device/alipaycoupon/mouldexport'+param;
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

//门店匹配模型
function storeOptMould(){
	var url = '/device/alipaycoupon/storelist';
	window.location.href=url ;
}

// 删除模版
function dels(pkid){
	if(pkid){
		layer.confirm('确定删除当前模型？', {
			btn: ['确定','取消'] //按钮
		}, function(){
			$.post('/device/alipaycoupon/delmould',{pkid:pkid},function(data){
				if(data == 'Y'){
					layer.alert('成功', {icon: 1, skin: 'layer-ext-moon' });
					setTimeout("doSearch()",2000);
				}else{
					layer.alert('失败', {icon: 2, skin: 'layer-ext-moon' });
				}
			})
		}, function(){
			
		});
	}else{
		layer.alert('刷新重试', {skin: 'layui-layer-lan', closeBtn: 0, anim: 1 });
	}
}

// 备注
function remarks(remark){
	layer.close(layerIndex);
	layerIndex = layer.open({
		type:1, shade:false, title:false, area:['650px', 'auto'],
		content:'<div class="layer_notice">'+remark+'</div>'
	});
}

// 模型下的所有模版
function mouldTpls(mouldNo){
	$.post('/device/alipaycoupon/mouldtpls',{mouldNo:mouldNo},function(data){
		console.log(data);
		var msg = '没有获取到数据';
		if(data != 'N'){
			msg = '<div style="border-bottom:1px dotted #999">';
			msg += '<span style="display:inline-block;width:200px;margin-right:20px">模版编号</span>';
			msg += '<span style="display:inline-block;width:200px;margin-right:20px">模版ID</span>';
			msg += '<span style="display:inline-block;width:60px;margin-right:20px;">启用状态</span>';
			msg += '<span style="display:inline-block;width:150px;margin-right:20px;">启用时间</span>';
			msg += '<span style="display:inline-block;width:60px;margin-right:20px;">模版余额</span>';
			msg += '<span style="display:inline-block;width:80px;">模版是否删除</span></div>';
			for(var i in data){
				msg += '<div style="border-bottom:1px dotted #999">';
				msg += '<span style="display:inline-block;width:200px;margin-right:20px">'+data[i].TEMPLATE_NO+'</span>';
				msg += '<span style="display:inline-block;width:200px;margin-right:20px">'+data[i].TEMPLATE_ID+'</span>';
				msg += '<span style="display:inline-block;width:60px;margin-right:20px;">'+data[i].STATUS_TXT+'</span>';
				msg += '<span style="display:inline-block;width:150px;margin-right:20px;">'+data[i].CREATEDATE+'</span>';
				msg += '<span style="display:inline-block;width:60px;margin-right:20px;">'+data[i].REMNANT+'</span>';
				msg += '<span style="display:inline-block;width:80px;">'+data[i].DELFLAG+'</span>';
				msg += '</div>';
			}
		}
		layer.close(layerIndex);
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['900px', 'auto'],
			content:'<div class="layer_notice">'+msg+'</div>'
		});
	},'json');
}

// 模型下的所有门店
function mouldPartners(mouldNo){
	$.post('/device/alipaycoupon/mouldpartners',{mouldNo:mouldNo},function(data){
		var msg = '没有获取到数据';
		if(data != 'N'){
			msg = '<div style="border-bottom:1px dotted #999">';
			msg += '<span style="display:inline-block;width:150px;margin-right:20px;">门店名称</span>';
			msg += '<span style="display:inline-block;width:100px;margin-right:20px;">门店编号</span>';
			msg += '<span style="display:inline-block;width:100px;margin-right:20px;">结算方式</span>';
			msg += '<span style="display:inline-block;width:50px;margin-right:20px;">启用状态</span>';
			msg += '<span style="display:inline-block;width:150px;">启用时间</span></div>';
			for(var i in data){
				msg += '<div style="border-bottom:1px dotted #999">';
				msg += '<span style="display:inline-block;width:150px;margin-right:20px;overflow:hidden">'+data[i].PARTNERNAME+'</span>';
				msg += '<span style="display:inline-block;width:100px;margin-right:20px;overflow:hidden">'+data[i].PARTNERCODE+'</span>';
				msg += '<span style="display:inline-block;width:100px;margin-right:20px;overflow:hidden">'+data[i].WAY_TXT+'</span>';
				msg += '<span style="display:inline-block;width:50px;overflow:hidden;margin-right:20px;">'+data[i].STATUS_TXT+'</span>';
				msg += '<span style="display:inline-block;width:150px;overflow:hidden">'+data[i].CREATEDATE+'</span>';
				msg += '</div>';
			}
		}
		layer.close(layerIndex);
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['700px', 'auto'],
			content:'<div class="layer_notice">'+msg+'</div>'
		});
	},'json')
}

// 支付链接
function payInfo(payUrl){
	var url = payUrl ? '支付链接：'+payUrl : '暂未找到支付链接';
	var btn = payUrl ? '<br><a href="'+payUrl+'" target="_blank" ><font color="blue">去支付-></font></a>' : '';
	layer.close(layerIndex);
	layerIndex = layer.open({
		type:1, shade:false, title:false, area:['700px', 'auto'],
		content:'<div class="layer_notice">'+url+btn+'</div>'
	});
}

//模版信息

function templateInfo(template_no){
	var title = '模版信息';
	var url = '/device/alipaycoupon/templateinfo?pkid='+template_no;
	var x = '900px';
	var y = '550px';
	layeriframe(title,url,x,y,0);
}

// 充值（更换支付宝模版）
function addAliTpl(mouldNo,templateNo,types){
	if(mouldNo == null || mouldNo == '' || mouldNo == 0){
    	alert('模型编号不能为空');return false;
    }
	if(templateNo == null || templateNo == '' || templateNo == 'undefined'){
    	alert('模版编号不能为空');return false;
    }
	$.post('/device/alipaycoupon/backuptpl',{mouldNo:mouldNo},function(data){
		if(data){
			payInfo(data.CONFIRM_URI);
		}else{
			var price = window.prompt("请输入金额，单位元", "");
		    if(price != null){
		    	if(price > 0){
		    		$.post('/device/alipaycoupon/addalitpl',{mouldNo:mouldNo,templateNo:templateNo,types:types,price:price},function(data){
		    			if(data == 'Y'){
		    				layer.alert('预充成功，请立即付款', {icon: 1, skin: 'layer-ext-moon' });
		    				setTimeout("doSearch()",2000);
		    			}else{
		    				layer.alert('预充失败', {icon: 2, skin: 'layer-ext-moon' });
		    			}
		    		})
		    	}else{
		    		alert('金额不能为空');
		    	}
		    }
		}
	},'json')
	/**/
}

//审计
function audits(mouldNo,type){
	var type = type == 'Y' || type == 'YY' ? type : 'N';
	var text = type == 'Y' || type == 'YY' ? '确定启用当前模型？' : '确定停用当前模型？';
	if(mouldNo){
		layer.confirm(text, {
			btn: ['确定','取消'] //按钮
		}, function(){
			$.post('/device/alipaycoupon/auditsmould',{mouldNo:mouldNo,type:type},function(data){
				if(data == 'YY'){
					layer.alert('启用成功，请立即支付', {icon: 1, skin: 'layer-ext-moon' });
					setTimeout("doSearch()",2000);
				}else if(data == 'Y'){
					layer.alert('操作成功', {icon: 1, skin: 'layer-ext-moon' });
					setTimeout("doSearch()",2000);
				}else{
					layer.alert('操作失败', {icon: 2, skin: 'layer-ext-moon' });
				}
			})
		}, function(){
			
		});
	}else{
		layer.alert('刷新重试', {skin: 'layui-layer-lan', closeBtn: 0, anim: 1 });
	}
}
