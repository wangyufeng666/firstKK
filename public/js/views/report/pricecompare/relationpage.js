var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:950
    ,cm : [
      {header: "日期", dataIndex: 'RELATIONDATE', width:'70px',sortable:false}
      ,{header: "商品名称", dataIndex: 'MERNAME', width:'70px',sortable:false}
      ,{header: "商品ID", dataIndex: 'MERID', width:'70px',sortable:false}
      ,{header: "有得卖商品名称", dataIndex: 'YDMNAME', width:'70px',sortable:false}
      ,{header: "品牌", dataIndex: 'PNAME', width:'70px',sortable:false}
      ,{header: "类型", dataIndex: 'MERTYPENAME', width:'70px',sortable:false}
      ,{header: "品牌", dataIndex: 'PNAME', width:'70px',sortable:false}
      ,{header: "报价", dataIndex: '', width:'70px',sortable:false,
          renderer : function(value, data, rowIndex, colIndex, metadata){
              var prices = data['NEWPRICE'];
              var returnText ='';
              for(var i in prices){
                  if(prices[i]['PROVIDERQUTO'] != null){
                      returnText += prices[i]['PROVIDERQUTO']+"</br>";
                  }
              }
              return returnText;
          }
       }
      ,{header: "有得卖报价", dataIndex: '', width:'70px',sortable:false,
          renderer : function(value, data, rowIndex, colIndex, metadata){
              return data['YDMMERINFO'][0]['MAXPRICE'];
          }
       }
      ,{header: "操作", dataIndex: '', width:'50px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='';
	      returnText += '<a href="javascript:void(0);" onclick="deleteRelation(\''+data['MERID']+'\', \''+data['MERNAME']+'\')" class="a_link">删除</a>';
          return returnText;
        }
      }
    ]
    ,url : '/report/pricecompare/relationlist'
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

function getParams(){
    return {
        merName:$('#merName').val()
    };
}

function getParamsPage(){
    return {
        merName:$('#merName').val(),
        start:grid.getPageSize()*(grid.getPageNumber()-1)
    };
}

function doSearchPage(){
	layer.load('数据加载中...', 1);
    grid.query(getParamsPage());
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
/**
 * 删除联系
 */
function deleteRelation(merId, merName){
    layer.load('数据加载中...', 1);
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/report/pricecompare/deleterelation"  //请求路径
        ,data : {merId:merId, merName:merName}  //发送到服务器的数据
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
