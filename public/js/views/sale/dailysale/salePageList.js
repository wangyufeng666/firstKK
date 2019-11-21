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
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}
            ,{header:"负责人", dataIndex:'SALER', width:'70px',sortable:false}
            ,{header:"销售时间", dataIndex:'SALEDATE', width:'80px',sortable:false}
            ,{header:"销售数量", dataIndex:'SALE_COUNT', width:'70px',sortable:false}
            ,{header:"订单总价", dataIndex:'COST_AMOUNT', width:'70px',sortable:false}
            ,{header:"运费总价", dataIndex:'EXPRESS_AMOUNT', width:'70px',sortable:false}
            ,{header:"其他费用", dataIndex:'OTHER_AMOUNT', width:'70px',sortable:false}
            ,{header:"总成本", dataIndex:'COST_AMOUNT', width:'70px',sortable:false}
            ,{header:"销售价格", dataIndex:'SALE_AMOUNT', width:'70px',sortable:false}
            ,{header:"总毛利额", dataIndex:'PROFITVALUE', width:'70px',sortable:false}
            ,{header:"毛利率(%)", dataIndex:'PROFITRATE', width:'70px',sortable:false}
            ,{header:"订单状态", dataIndex:'ORDERSTATUSNAME', width:'70px',sortable:false}
            ,{header:"操作", dataIndex:'SALEBILLNO', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                	var html = '';
            		if(data['STATUS'] == 1){
            			html += "<a class='a_link' href='javaScript:saleBillConfirm(\"" + value + "\")'>确认</a>";
                		html += " | <a class='a_link' href='javaScript:delSaleBill(\"" + value + "\")'>删除</a>";
                	}
                    return html;
                }
            }
		]
		,url:'/sale/dailysale/salepagelist'
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
		saler:$('#saler').val(),
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
		content:'/sale/dailysale/salebillinfo?saleBillNo='+saleBillNo,
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
		$.post("/sale/dailysale/delsalebill", {saleBillNo:saleBillNo}, function(data){
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
			$.post("/sale/dailysale/confirm", {saleBillNo:saleBillNo}, function(data){
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
	window.location.href = '/template/xls/sale_dailysale_template.xls';
});

/**
 * 日销售退货模板下载
 */
$('#returnTemplateDownload').click(function(){
	window.location.href = '/template/xls/sale_dailysale_return_template.xls';
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
		content:'/sale/dailysale/importpage',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 退货单数据导入
 * @returns
 */
function dataReturnImport(){
	layer.open({
		type:2,
		title:'日销售退货数据导入',
		shadeClose:false,
		shade:0.8,
		content:'/sale/dailysale/returnimportpage',
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
	var saler = $('#saler').val();
	
	var param = '?saleBillNo='+saleBillNo+'&createrId='+createrId+'&billStatus='+billStatus;
	param += '&startDate='+startDate+'&endDate='+endDate+'&saler='+saler;
	
	window.location.href = '/sale/dailysale/exportlist'+param;
}