var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'3%',sortable:false} 
			,{header: "批次编号", dataIndex: 'BATCHNO', width:'190px',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATETIME', width:'90px',sortable:false}
			,{header: "操作", dataIndex: '', width:'60px', sortable:false,
        renderer : function(value, data, rowIndex, colIndex, metadata){
			var batchNo = data['BATCHNO'];
    	  var returnText ='<a href="javascript:void(0);" onclick="showbatchproducts(\''+batchNo+'\')" class="a_link">查看</a>';
          return returnText;
        }
      }
    ]
    ,url : '/rent/warehouse/productbatchlist'
  });
});



function getParams(){
	return {
		batchNo:$('#batchNo').val(),
	};
}

function doSearch(){
	var index = layer.load('数据加载中...',1);
	grid.query(getParams());
	layer.close(index);
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area : ['280px','auto'],
		dialog : {msg:msg, type:8}
	});
}

function showbatchproducts(batchNo){
	layer.open({
		type:2,
		title:'批次商品列表',
		content:'/rent/warehouse/batchproducts?batchNo='+batchNo,
		area:['90%', '90%']
	});
}