var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize:10,
    height:250
    ,cm:[
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
      ,{header: "旧机单号", dataIndex: 'ORDERNO', width:'130px',sortable:false
          ,renderer : function(value, data, rowIndex, colIndex, metadata){
            return '<a href="javascript:void(0)" onclick="newMerorderInfo(\''+data['NEWMERID']+'\')" title="'+value+'" class="a_link">'+value+'</a>';
          }
      }
      ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'80px',sortable:false}
      ,{header: "新机名称", dataIndex: 'NEWMERNAME' ,sortable:false}
      ,{header: "新机价格", dataIndex: 'NEWMERPRICE', width:'80px',sortable:false}
      ,{header: "新机单号", dataIndex: 'NEWMERORDERNO', width:'130px',sortable:false}
      ,{header: "旧机名称", dataIndex: 'MERNAME',sortable:false
    	  ,renderer : function(value, data, rowIndex, colIndex, metadata){
    		  return data['PNAME']+' '+data['MERNAME'];
    	  }
      }
      ,{header: "旧机价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
			,renderer:function(value, data, rowIndex, colIndex, metadata){
				if(data['SETTLEPRICE']){
					return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
				}else{
					return data['ORDERPRICE'];
				}
			}
		}
	  ,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
			,renderer:function(value, data, rowIndex, colIndex, metadata){
				return data['CONTACTWAY']+'('+data['CONTACTS']+')';
			}
		}
      ,{header: "联系地址", dataIndex: 'ADDRESS', sortable:false}
      ,{header: "操作人", dataIndex: 'OPERATORNAME', width:'80px',sortable:false}
      ,{header: "新机状态", dataIndex: 'MERSTATUSNAME', width:'8%',sortable:false}
      ,{header: "操作", dataIndex: '',  sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
		  var returnText = '';
          var status = data['MERSTATUS'];
          if(status == '1'){//待审核
        	  returnText+='<a class="a_link" href="javascript:orderOperation(\''+data['NEWMERID']+'\')">确认</a>';
        	  returnText+=' | <a class="a_link" href="javascript:stopNewOrder(\''+data['NEWMERID']+'\')">终止</a>';
        	  returnText+=' | <a class="a_link" href="javascript:editNewOrder(\''+data['NEWMERID']+'\',\''+data['ORDERNO']+'\')">修改</a>';
          }
          if(status == '2'){//待采购
        	  returnText+='<a class="a_link" href="javascript:orderOperation(\''+data['NEWMERID']+'\')">确认采购</a>';
        	  returnText+=' | <a class="a_link" href="javascript:stopNewOrder(\''+data['NEWMERID']+'\')">终止</a>';
          }
          if(status == '3'){//
        	  returnText+='<a class="a_link" href="javascript:orderOperation(\''+data['NEWMERID']+'\')">发货</a>';
        	  returnText+=' | <a class="a_link" href="javascript:stopNewOrder(\''+data['NEWMERID']+'\')">终止</a>';
          }
          return returnText;
        }
      }
    ]
    ,url : '/order/newmachine/pagelist'
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
 * @param newmerId
 * @return
 */
function newMerorderInfo(newmerId){
	window.location.href = "/order/newmachine/newmerorderinfo?newmerId="+newmerId+"&backUrl="+backUrl;
}

function orderOperation(newmerId){
	$.layer({
		type:2,
		title:'订单状态修改',
		iframe:{src:'/order/newmachine/operation?newmerId='+newmerId},
		area:['500' , '320'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

//修改新机信息
function editNewOrder(newmerId,orderNo){
	$.layer({
	    type : 2,
	    title : '修改新机',
	    iframe : {src : '/order/newmachine/editnewmachine?newmerId='+newmerId+'&orderNo='+orderNo},
	    area : ['480' , '320'],
	    offset : ['50px',''],
	    close : function(index){
			layer.close(index);
		}
	});
}

/**
 * 终止新机订单
 * @param orderId
 * @return
 */
function stopNewOrder(newmerId){
	$.layer({
		type:2,
		title:'订单终止',
		iframe:{src:'/order/newmachine/stopnewmerorder?newmerId='+newmerId},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
    return {
        merName:$('#merName').val(),
        newmerName:$('#newmerName').val(),
        orderNo:$('#orderNo').val(),
        contactWay:$('#contactWay').val(),
        merStatus:$('#merStatus').val(),
        startDate:$('#startDate').val(),
        endDate:$('#endDate').val(),
        address:$('#address').val()
    };
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