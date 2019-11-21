var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'20PX',sortable:false} 
      ,{header: "导入日期", dataIndex: 'CREATEDATE', width:'70px',sortable:false}
      ,{header: "批次编号", dataIndex: 'BATCHNO', width:'80px',sortable:false}
      ,{header: "备注", dataIndex: 'REMARK', width:'60px',sortable:false}
      ,{header: "商品总数", dataIndex: 'NUM', width:'60px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'50px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="deleteBatch(\''+data['BATCHNO']+'\')" class="a_link">删除</a>';
          return returnText;
        }
      }
    ]
    ,url : '/report/pricecompare/batchlist'
    ,baseParams:initParams()
    ,pageSizeList:[10,15,20,30,100]
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
function orderInfo(orderNo){
	window.location.href = "/order/order/orderinfo?orderNo="+orderNo+"&backUrl="+backUrl;
}

function getParams(){
    return {
        batchNo:$('#batchNo').val(),
    };
}

function getParamsPage(){
    return {
        batchNo:$('#batchNo').val(),
        start:grid.getPageSize()*(grid.getPageNumber()-1)
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function doSearchPage(){
    layer.load('数据加载中...', 1);
    grid.query(getParamsPage());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}

function deleteBatch(batchNo){
    if(confirm('删除批次会将该批次全部详情删除，是否确认删除？')){
        layer.load('数据加载中...', 1);
        $.ajax({
            type : 'POST'//请求方式
            ,url : "/report/pricecompare/deletebatch"  //请求路径
            ,data : {batchNo:batchNo}  //发送到服务器的数据
            ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async : false //同步请求
            ,timeout :60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success : function(data){
                if('Y' == data){
                    doSearchPage();
                }else{
                    alert("删除失败"); 
                }
            }
        });
    }    
}


