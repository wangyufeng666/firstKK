var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
		   ,{header:"创建时间", dataIndex:'CREATEDATE', width:'95px', sortable:false}
		   ,{header:"订单号", dataIndex:'ORDERNO', width:'100px', sortable:false}		   
		   ,{header:"器材名", dataIndex:'SPNAME', width:'110px', sortable:false}		   
           ,{header: "联系方式", dataIndex: '', width:'110px',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACTS']+'('+data['CONTACTWAY']+')';
                }
              }		   
		   ,{header:"联系地址", dataIndex:'CONTACTADDRESS', width:'100px', sortable:false}
		   ,{header:"上门预约时间", dataIndex:'APPOINTMENT', width:'80px', sortable:false}           
           ,{header:"运单号", dataIndex:'MAILNO', width:'90px', sortable:false}
           ,{header:"已发短信", dataIndex:'SMSFLAG', width:'90px', sortable:false}
       ]
       ,url : '/dingdan/sfexpress/sfindexbilllist'
       ,baseParams:{isAll:'all'}
	});
});
function getParams(){
    return {
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	contactway:$('#contactway').val(),
    	mailno:$('#mailno').val(),
    	smsflag:$('#smsflag').val(),
    	orderno:$('#orderno').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
