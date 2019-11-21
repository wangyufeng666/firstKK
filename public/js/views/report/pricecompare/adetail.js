var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:1220
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'20PX',sortable:false} 
      ,{header: "订单日期", dataIndex: 'DATETIME', width:'70px',sortable:false}
      ,{header: "商品名称", dataIndex: 'MERNAME', width:'80px',sortable:false}
      ,{header: "批次", dataIndex: 'BATCHNO', width:'80px',sortable:false}
      ,{header: "描述", dataIndex: 'MERDESC', width:'180px',sortable:false, 
          renderer : function(value, data, rowIndex, colIndex, metadata){
              returnText = data['MERDESC'].replace(/;/g, "</br>");
              return returnText;
          }
      }
      ,{header: "检查备注", dataIndex: 'INSPECTREMARK', width:'60px',sortable:false}
      ,{header: "报价", dataIndex: 'PROVIDERQUTO', width:'40px',sortable:false}
      ,{header: "有得卖报价", dataIndex: 'PROVIDERQUTO', width:'80px',sortable:false,
          renderer : function(value, data, rowIndex, colIndex, metadata){
              var merInfo = data['MERINFO'];
              var returnText = ""
              if(data['MERID'] == null){
                  for(var i in merInfo){
                      returnText += "<div class='item'><input type='radio' name='"+data['DETAILID']+"' value='"+merInfo[i]['MERID']+"' />"+merInfo[i]['NICKNAME']+':<font color="red">'+merInfo[i]['MAXPRICE']+"</font></div>";
                  }
                  returnText += "<div class='item'><button type='button' onclick='relate(\""+data['DETAILID']+"\",\""+data['MERNAME']+"\")'>关联</button></div>";
              }else{
                  merInfo = data['MERINFO'][0];
                  returnText = merInfo['MAXPRICE'];
              }
              return returnText;
          }
      }
      ,{header: "操作", dataIndex: '', width:'50px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
            var returnText = "";
            if(data['MERID'] != null){
                returnText += '<a href="javascript:void(0);" onclick="deRelate(\''+data['DETAILID']+'\')" class="a_link">解除关联</a>&nbsp;&nbsp;|&nbsp;&nbsp;';
            }
            returnText += '<a href="javascript:void(0);" onclick="deleteDetail(\''+data['DETAILID']+'\')" class="a_link">删除</a>';
            return returnText;
        }
      }
    ]
    ,url : '/report/pricecompare/detaillist'
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
        merName:$('#merName').val()
    };
}

function getParamsPage(){
    return {
        batchNo:$('#batchNo').val(),
        merName:$('#merName').val(),
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
 * 导入
 */
function importCoupon(){
    $.layer({
        type : 2,
        title : '导入',
        iframe : {src : '/report/pricecompare/importquto'},
        area : ['600' , '350'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function relate(detailId, merName){
    layer.load('数据加载中...', 1);
    var merId = $("input[name='"+detailId+"']:checked").val();
    if(merId != null){
        $.ajax({
            type : 'POST'//请求方式
            ,url : "/report/pricecompare/relatemer"  //请求路径
            ,data : {dedtailId:detailId, merName:merName, merId:merId}  //发送到服务器的数据
            ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async : false //同步请求
            ,timeout :60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success : function(data){
                if('Y' == data){
                    doSearchPage();
                }else if('N' == data){
                    alert("关联错误"); 
                }else{
                    alert("数据有误 "); 
                }
            }
        });
    }else{
        alert("请选择商品");
    }
}

function deRelate(detailId){
    layer.load('数据加载中...', 1);
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/report/pricecompare/derelate"  //请求路径
        ,data : {detailId:detailId}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            if('Y' == data){
                doSearchPage();
            }else{
                alert("解除失败"); 
            }
        }
    });
}

function deleteDetail(detailId){
    layer.load('数据加载中...', 1);
    $.ajax({
        type : 'POST'//请求方式
        ,url : "/report/pricecompare/deletedetail"  //请求路径
        ,data : {detailId:detailId}  //发送到服务器的数据
        ,cache : false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async : false //同步请求
        ,timeout :60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success : function(data){
            if('Y' == data){
                doSearchPage();
            }else{
                alert("解除失败"); 
            }
        }
    });
}
