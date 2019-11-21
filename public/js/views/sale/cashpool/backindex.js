var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :15,
		height:375,
		cm : [
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
			,{header: "合作商名称", dataIndex: 'PROVIDERNAME', width:'15%',sortable:false}
			,{header: "商品名称", dataIndex: 'MERNAME', width:'20%',sortable:false}
			,{header: "商品来源", dataIndex: 'SOURCECODE', width:'10%',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '1' ? '线上' : value == '2' ? '线下':'未知';
				}
			}
			,{header: "回收单号", dataIndex: 'ORDERNO', width:'10%',sortable:false}
			,{header: "销售单号", dataIndex: 'SALENO', width:'10%',sortable:false}
			,{header: "回收原价", dataIndex: 'RECYPRICE', width:'10%',sortable:false}
			,{header: "竞拍报价", dataIndex: 'SALEPRICE', width:'10%',sortable:false}
			,{header: "状态", dataIndex: 'STATUSNAME', width:'10%',sortable:false}
			,{header: "操作", dataIndex: '', width:'15%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var meruniqueCode = data['MERUNIQUECODE'];
					var saleNo = data['SALENO'];
					var status = data['STATUS'];
					var returnText ='<a href="javascript:void(0);" onclick="approve(\''+saleNo+'\',\''+meruniqueCode+'\')" class="a_link">查看</a>';
					if(status == '2'){//审批
						returnText+=' | <a href="javascript:void(0);" onclick="approve(\''+saleNo+'\',\''+meruniqueCode+'\')" class="a_link">审批</a>';
					}
					if(status == '3'){//退回
						returnText+=' | <a href="javascript:void(0);" onclick="giveback(\''+saleNo+'\',\''+meruniqueCode+'\')" class="a_link">确认退回</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/sale/cashpool/backpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
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

/**
 * 订单详情
 * @param orderNo
 * @return
 */
function accountInfo(providerId){
	window.location.href = "/sale/cashpool/accountinfo?providerId="+providerId+"&backUrl="+backUrl;
}

/**
 * 取消订单
 * @param orderId
 * @return
 */
function approve(saleNo,meruniqueCode){
	window.location.href = "/sale/cashpool/toapprove?meruniqueCode="+meruniqueCode+"&saleNo="+saleNo;
}

/**
 * 批量退回
 * @param saleNo
 * @param meruniqueCode
 */
function togivebacks(){
	window.location.href = "/sale/cashpool/togivebacks";
}

/**
 * 退回
 * @param roleId
 */
function giveback(saleNo,meruniqueCode){
	if(confirm("是否确认已寄回？")){
		$.post("/sale/cashpool/giveback", {saleNo:saleNo,meruniqueCode:meruniqueCode}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert(data);
				doSearch();
			}
		});
	}
}

function getParams(){
    return {
    	providerName:$('#providerName').val(),
    	merName:$('#merName').val(),
    	orderNo:$('#orderNo').val(),
    	saleNo:$('#saleNo').val(),
    	status:$('#status').val()
    };
}

/**
 * 下载销售商品
 * @returns {Boolean}
 */
function downloadMer(){
	var param = '';
	param += 'saleNo=' + $('#saleNo').val();
	param += '&providerName=' + $('#providerName').val();
	param += '&merName=' + $('#merName').val();
	param += '&status=' + $('#status').val();
	param += '&orderNo=' + $('#orderNo').val();
	window.location.href = '/sale/cashpool/merexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}