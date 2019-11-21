var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"序号", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"销售单号", dataIndex:'SALEBILLNO', width:'120px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return "<a class='a_link' href='javaScript:saleInfo(\"" + value + "\")'>"+value+"</a> ";
				}
			}
			,{header:"完成日期", dataIndex:'SALEDATE', width:'100px',sortable:false}
			,{header:"企业名称", dataIndex:'FIRM_NAME', width:'70px',sortable:false}
			,{header:"联系人", dataIndex:'CONTACTS', width:'70px',sortable:false}
	/*		,{header:"联系电话", dataIndex:'MOBILE', width:'70px',sortable:false}
			,{header:"客户省份", dataIndex:'PROVINCE', width:'70px',sortable:false}
			,{header:"客户城市", dataIndex:'CITY', width:'70px',sortable:false}*/
			,{header:"所属BD", dataIndex:'SPONSOR', width:'70px',sortable:false}
			,{header:"品类", dataIndex:'CATEGORYNAME', width:'70px',sortable:false}
			,{header:"数量", dataIndex:'SALE_COUNT', width:'70px',sortable:false}
			,{header:"销售总价", dataIndex:'SALE_PRICE', width:'70px',sortable:false}
			,{header:"回收总价", dataIndex:'RECY_PRICE', width:'70px',sortable:false}
			,{header:"毛利", dataIndex:'RECY_PROFIT', width:'70px',sortable:false}
			,{header:"物流打包费用", dataIndex:'EXPRESS_PRICE', width:'70px',sortable:false}
			,{header:"佣金", dataIndex:'BROKERAGE_PRICE', width:'70px',sortable:false}
			,{header:"其他费用", dataIndex:'OTHER_PRICE', width:'70px',sortable:false}
			,{header:"税费", dataIndex:'TAX_FEE', width:'70px',sortable:false}
			,{header:"业务毛净利", dataIndex:'FIRM_PROFIT', width:'70px',sortable:false}
			,{header:"备注", dataIndex:'REMARK', width:'70px',sortable:false}
            ,{header:"操作", dataIndex:'SALEBILLNO', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                	var html = '';
            		if(data['STATUS'] == 1){
						html += " | <a class='a_link' href='javaScript:dataImportDetail(\"" + value + "\")'>导入详细</a>";
						html += " | <a class='a_link' href='javaScript:modifySaleBill(\"" + value + "\")'>修改</a>";
						html += "|<a class='a_link' href='javaScript:saleBillConfirm(\"" + value + "\")'>确认</a>";
                		html += " | <a class='a_link' href='javaScript:delSaleBill(\"" + value + "\")'>删除</a>";
                	}
                    return html;
                }
            }
		]
		,url:'/sale/dailysalefirm/salepagelist'
		,baseParams:initParams()
		,pageSizeList:[30,50]
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
	});
	
	//日期验证
	$('#startDate').click(function(){
		WdatePicker({
			onpicked:function(){$('#endDate').trigger('click');},
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
	$('#endDate').click(function(){
		WdatePicker({
			dateFmt:'yyyy-MM-dd',
			doubleCalendar:true,
			maxDate:'%y-%M-%d',
			startDate:'%y-{%M-1}-%d'
		});
	});
});

function initParams(){
	return getParams();
}

function getParams(){
	return {
		saleBillNo:$('#saleBillNo').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		billStatus:$('#billStatus').val(),
		sponsor:$('#sponsor').val(),
		createrId:$('#createrId').val()
	};
}

function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, shade: 0.1, time:30000});
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

/**
 * 详情
 */
function saleInfo(saleBillNo){
	layer.open({
		type:2,
		title:'详情',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysalefirm/salebillinfo?saleBillNo='+saleBillNo,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除
 */
function delSaleBill(saleBillNo){
	if(confirm('是否确定删除销售单？')){
		$.post("/sale/dailysalefirm/delsalebill", {saleBillNo:saleBillNo}, function(data){
	        if(data == 'Y'){
	            layer.msg('删除成功');
	            grid.reload();
	        }else{
	        	layer.alert('删除失败：'+data);
	        }
	    });
	}
}

/**
 * 修改状态
 */
function saleBillConfirm(saleBillNo){
	if(saleBillNo){
		if(confirm('是否确定进行确认操作？')){
			$.post("/sale/dailysalefirm/confirm", {saleBillNo:saleBillNo}, function(data){
		        if(data == 'Y'){
		            layer.msg('操作成功');
		            grid.reload();
		        }else{
		        	layer.alert('操作失败：'+data);
		        }
		    },'json');
		}
	}else{
		layer.alert('无效的销售单号');
	}
}

/**
 * 日销售模版下载
 */
$('#templateDownload').on('click',function(){
	window.location.href = '/template/xls/sale_dailysalefirm_template.xls';
});

/**
 * 日销售退货模板下载
 */
$('#returnTemplateDownload').click(function(){
	window.location.href = '/template/xls/sale_dailysalefirm_return_template.xls';
});

/**
 * 销售单数据导入
 * @returns
 */
function dataImport(){
	layer.open({
		type:2,
		title:'日销售报表导入',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysalefirm/importpage',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 销售详细数据导入
 * @returns
 */
function dataImportDetail(salebillno){
	layer.open({
		type:2,
		title:'日销售报表导入',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysalefirm/importdetailpage?salebillno='+salebillno,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 修改数据
 * @returns
 */
function modifySaleBill(salebillno){
	layer.open({
		type:2,
		title:'日销售数据更新',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysalefirm/modifysalebillpage'+"?salebillno="+salebillno,
		area:['600px', '90%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function saleBillExport(){
	var saleBillNo = $('#saleBillNo').val();
	var startDate = $('#startDate').val();
	var endDate = $('#endDate').val();
	var createrId = $('#createrId').val();
	var billStatus = $('#billStatus').val();
	var sponsor = $('#sponsor').val();
	
	var param = '?saleBillNo='+saleBillNo+'&createrId='+createrId+'&billStatus='+billStatus;
	param += '&startDate='+startDate+'&endDate='+endDate+'&sponsor='+sponsor;
	
	window.location.href = '/sale/dailysalefirm/exportlist'+param;
}