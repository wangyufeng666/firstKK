var grid;
$().ready(function(){
	grid = $('#grid').grid({
		showSummaryBar:true
		,height:325
		,cm:[
		   {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		   ,{header:"所属代理", dataIndex:'COMPANYNAME', width:'80px', sortable:false}
		   ,{header:"商户名称", dataIndex:'PARTNERNAME', width:'120px', sortable:false}
		   ,{header:"设备数量", dataIndex:'DEVICECOUNTS', width:'60px', sortable:false}
		   ,{header:"商户负责人", dataIndex:'', width:'120px', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'('+data['CONTACTWAY']+")";
				}
		   }
		   ,{header:"运维人员", dataIndex:'', width:'120px', sortable:false
			   ,renderer:function(value, data, rowIndex, colIndex, metadata){
				   return data['PNAME']+'('+data['PHONE']+")";
			   }
		   }
		   ,{header:"商户地址", dataIndex:'ADDRESS', width:'120px', sortable:false}
		   ,{header:"询价时间", dataIndex:'INQUIRYDATE', width:'150px', sortable:false}
		   ,{header:"询价量", dataIndex:'INQUERYCOUNTS', width:'60px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"订单数", dataIndex:'ORDERCOUNTS', width:'60px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交订单数", dataIndex:'SUCCESSCOUNTS', width:'60px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"成交金额", dataIndex:'SETTLECOUNTPRICES', width:'60px', sortable:false,summaryConfig:{calculation:'sum'}}
		   ,{header:"询价下单率", dataIndex:'', width:'60px', sortable:false
	        	,renderer : function(value, data, rowIndex, colIndex, metadata){
	        		return data['ORDERCOUNTS'] <= 0 ? "0%" : (Math.round(data['ORDERCOUNTS']/data['INQUERYCOUNTS'] * 10000) / 100.00 + "%");
	              }
		   }
		   ,{header:"询价成交率", dataIndex:'', width:'60px', sortable:false
	        	,renderer : function(value, data, rowIndex, colIndex, metadata){
	        		return data['SUCCESSCOUNTS'] <= 0 ? "0%" : (Math.round(data['SUCCESSCOUNTS']/data['INQUERYCOUNTS'] * 10000) / 100.00 + "%");
	              }
		   }
       ]
       ,url:'/report/devicereport/pagelist'
       ,baseParams:{dateFlag:'2'}
	});
	
	$('input[name="dateFlag"]').click(function(){
		if($(this).val() == '5'){
			$('#otherDateSpan').show();
		}else{
			$('#startDate').val('');
			$('#endDate').val('');
			$('#otherDateSpan').hide();
			doSearch();
		}
	});
});

function getParams(){
    return {
    	startDate:$('#startDate').val(),
    	endDate:$('#endDate').val(),
    	dateFlag:$('input[name="dateFlag"]:checked').val(),
    	partnerCode:$('#partnerCode').val(),
    	typeCode:$('#typeCode').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 2);
    grid.query(getParams());
}

function downloadinquiryexport(){
	var param = '';
	param += '&startDate='+$('#startDate').val();
	param += '&endDate='+$('#endDate').val();
	param += '&dateFlag='+$('input[name="dateFlag"]:checked').val();
	param += '&partnerCode='+$('#partnerCode').val();
	param += '&typeCode='+$('#typeCode').val();
	window.location.href = '/report/devicereport/inquiryexport1?v=1'+param;
	return false; //截取返回false就不会保存网页了
}