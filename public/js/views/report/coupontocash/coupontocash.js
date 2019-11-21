var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"新单编号", dataIndex:'NEWORDERNO', width:'95px', sortable:false}
		   ,{header:"新单时间", dataIndex:'NEWORDERTIME', width:'100px', sortable:false}		   
           ,{header: "新单联系方式", dataIndex: '', width:'100px',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['NEWCONTACTS']+'('+data['NEWCONTACTWAY']+')';
                }
              }		   
		   ,{header:"新单地址", dataIndex:'NEWADDRESS', sortable:false}
		   ,{header:"新单金额", dataIndex:'NEWORDERPRICES', width:'60px', sortable:false}
           ,{header: "新单成交金额", dataIndex: 'NEWSETTLEPRICE', width:'60px',sortable:false} 
           ,{header:"新单支付日期", dataIndex:'NEWPAYDATE', width:'85px', sortable:false}
           ,{header:"新单支付金额", dataIndex:'NEWPAYPRICE', width:'85px', sortable:false}
           ,{header:"新单状态", dataIndex:'NEWSTATUSNAME', width:'60px', sortable:false}
           ,{header:"新单来源", dataIndex:'NEWSOURCENAME', width:'60px', sortable:false}
           ,{header:"旧单编号", dataIndex:'OLDORDERNO', width:'70px', sortable:false}
           ,{header:"旧单时间", dataIndex:'OLDORDERTIME', width:'85px', sortable:false}
           ,{header: "旧单联系方式", dataIndex: '', width:'100px',sortable:false
           	,renderer : function(value, data, rowIndex, colIndex, metadata){
                 return data['OLDCONTACTS']+'('+data['OLDCONTACTWAY']+')';
               }
             }
           ,{header:"旧单地址", dataIndex:'OLDADDRESS', sortable:false}
           ,{header:"旧单下单金额", dataIndex:'OLDORDERPRICES', width:'70px', sortable:false}
           ,{header:"旧单检测金额", dataIndex:'OLDSETTLEPRICE', width:'70px', sortable:false}
           ,{header:"旧单状态", dataIndex:'OLDSTATUSNAME', width:'70px', sortable:false}
           ,{header:"旧单来源", dataIndex:'OLDSOURCENAME', width:'70px', sortable:false}
       ]
       ,url : '/report/coupontocash/coupontocashbilllist'
       ,baseParams:{isAll:'all'}
	});
});
function getParams(){
    return {
    	partnerCode:$('#partnerCode').val(),
    	sourceCode:$('#sourceCode').val(),
    	oldOrderno:$.trim($('#oldOrderno').val()),
    	newOrderno:$.trim($('#newOrderno').val()),
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val()    	
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
function downloadcoupontocashexport(){
	var param = '';
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&sourceCode=' + $('#sourceCode').val();
	param += '&oldOrderno=' + $.trim($('#oldOrderno').val());
	param += '&newOrderno=' + $.trim($('#newOrderno').val());
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();	
	window.location.href = '/report/coupontocash/coupontocashexport?'+param;
	return false; //截取返回false就不会保存网页了
}

$("#partnerCode").change(function(){
	var partnerCode = $(this).val();
	if(partnerCode){
		$.post('/order/partner/getsources', {partnerCode:partnerCode}, function(data){
			$("#sourceCode").html("<option value=''>请选择来源</option>");
			for(i in data){
				$("#sourceCode").append("<option value='"+data[i]['SOURCECODE']+"'>"+data[i]['SOURCENAME']+"</option>");
			}
		}, 'json');
	}else{
		$("#sourceCode").html("<option value=''>请选择来源</option>");
	}
});