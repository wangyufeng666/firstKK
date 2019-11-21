var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:50,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"采购渠道", dataIndex:'IMPORTSOURCENAME', width:'90px',sortable:false}
			,{header:"采购渠道关联", dataIndex:'', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var sourceName = data['SOURCENAME'];
					var sourceCode = data['SOURCECODE'];
					var sourceText ='';
					if(sourceName){
						if(data['ORDERNO']){
							sourceText = sourceName;
						}else{
							sourceText ='<a href="javascript:outbuySourceAssociation(\''+pkid+'\',\''+sourceCode+'\')" class="a_link">'+sourceName+'</a>';
						}
					}else{
						sourceText ='<a href="javascript:outbuySourceAssociation(\''+pkid+'\',\''+sourceCode+'\')" style="color:red;" class="a_link">请关联</a>';
					}
					return sourceText;
				}
			}
			,{header:"商品型号", dataIndex:'IMPORTMERNAME', width:'80px',sortable:false}
			,{header:"型号关联", dataIndex:'', width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var merId = data['MERID'];
					var pkid = data['PKID'];
					var merNameText ='';
					if(merId){
						var pname = data['PNAME'];
						var mername = data['MERNAME'];
						var mer = pname+' '+mername;
						if(data['ORDERNO']){
							merNameText = mer;
						}else{
							merNameText ='<a href="javascript:outbuyMerAssociation(\''+pkid+'\',\''+data['IMPORTMERNAME']+'\')" class="a_link">'+mer+'</a>';
						}
					}else{
						merNameText ='<a href="javascript:outbuyMerAssociation(\''+pkid+'\',\''+data['IMPORTMERNAME']+'\')" style="color:red;" class="a_link">请关联</a>';
					}
					return merNameText;
				}
			}
			,{header:"设备IMEI编码", dataIndex:'IMEI', width:'80px',sortable:false}
			,{header:"采购价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false}
			,{header:"备注", dataIndex:'', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var remarks ='无';
					if(data['REMARKS']){
						remarks = data['REMARKS'];
					}
					if(data['ORDERNO']){
					}else{
						remarks ='<a href="javascript:outbuySourceRemarks(\''+pkid+'\',\''+data['REMARKS']+'\')" class="a_link">'+remarks+'</a>';
					}
					return remarks;
				}
			}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkid = data['PKID'];
					var returnText ='';
					if(data['ORDERNO']){
						returnText ='<a href="javascript:orderQrCode(\''+data['ORDERNO']+'\')" class="a_link">打印二维码</a>';
						if(data['INSPECTFLAG'] ==='N'){
							returnText +=' | <a href="javascript:orderInspection(\''+data['ORDERNO']+'\')" class="a_link">检测</a>';
						}
					}else{
						if(data['SOURCENAME'] && data['MERNAME']){
							returnText ='<a href="javascript:saveRecyOrder(\''+pkid+'\')" class="a_link">导入生成订单</a> |';
						}
						returnText +=' <a href="javascript:deleteOrder(\''+pkid+'\')" class="a_link">删除</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/outbuy/outbuyorders/pagelist'
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,pageSizeList:[50,100,150,200]
	});
});

/**
 * 关联采购渠道
 */
function outbuySourceAssociation(pkid,sourceCode){
	layer.open({
		type:2,
		title:'添加采购渠道',
		content:'/outbuy/outbuyorders/sourceassociationpage?pkid='+pkid+'&sourceCode='+sourceCode,
		shadeClose:false,
		shade:0.8,
		area:['500px' , '170px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 关联商品
 */
function outbuyMerAssociation(pkid,importMerName){
	layer.open({
		type:2,
		title:'选择关联商品',
		content:'/outbuy/outbuyorders/merassociationpage?pkid='+pkid+'&importMerName='+importMerName,
		shadeClose:false,
		shade:0.8,
		area:['1150px' , '450px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除来源
 * @param pkid
 * @return
 */
function deleteOrder(pkid){
	if(confirm('是否确认删除该订单！')){
		if(pkid){
			$.post('/outbuy/outbuyorders/deleteorder', {pkid:pkid}, function(data){
				if(data == 'Y'){
					alert("删除成功");
					window.location.href = window.location.href;
				}else{
					alert('删除失败：'+data);
				}
			});
		}
	}
}

/**
 * 导入订单
 * @param pkid
 * @return
 */
function saveRecyOrder(pkid){
	if(pkid){
		$.post('/outbuy/outbuyorders/saverecyorder', {pkid:pkid}, function(data){
			if(data == 'Y'){
				alert('导入成功！');
				window.location.reload();
				//window.location.href = '/outbuy/outbuyorders/index?backFlag=Y';
			}else{
				alert('失败请重试！'+data);
			}
		});
	}
}

/**
 * 检测
 * @param pkid
 * @return
 */
function orderInspection(orderNo){
	if(orderNo){
		layer.open({
			type:2,
			title:'请质检',
			content:'/order/order/orderinspection?orderNo='+orderNo,
			shadeClose:false,
			shade:0.8,
			area:['100%' , '100%'],
			close:function(index){
				layer.close(index);
			}
		});
	}
}

/**
 * 添加备注
 */
function outbuySourceRemarks(pkid,remarks){
	layer.open({
		type:2,
		title:'添加备注',
		content:'/outbuy/outbuyorders/addoutbuyremarks?pkid='+pkid+'&remarks='+remarks,
		shadeClose:false,
		shade:0.8,
		area:['550px' , '220px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 二维码
 * @param orderNo
 * @return
 */
function orderQrCode(orderNo){
	if(orderNo){
		var url = '/order/order/qrcode?orderNo='+orderNo;
		layer.open({
			type:2,
			title:'二维码打印',
			shadeClose:false,
			shade:0.8,
			content:url,
			area:['350px','380px'],
			close:function(index){
				layer.close(index);
			}
		});
	}
}

function reload(){
	layer.closeAll();
	grid.reload();
}
