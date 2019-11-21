var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
      ,{header: "预约编号", dataIndex: 'CODE', width:'10%',sortable:false}
      ,{header: "预约日期", dataIndex: 'CREATETIME', width:'10%',sortable:false}
      ,{header: "真实姓名", dataIndex: 'UNAME', width:'10%',sortable:false}
      ,{header: "联系电话", dataIndex: 'TEL', width:'10%',sortable:false}
      ,{header: "机器名称", dataIndex: 'MERNAME', width:'10%',sortable:false}
      ,{header: "预约来源", dataIndex: 'SOURCECODE', width:'10%',sortable:false}
      ,{header: "预约方式", dataIndex: 'BUYWAY', width:'10%',sortable:false}
      ,{header: "预约状态", dataIndex: 'STATUS', width:'10%',sortable:false,
			renderer : function(value, data, rowIndex, colIndex, metadata){
				if(data['STATUS'] == 1){
					var returnText = '已审核';
				}else if(data['STATUS'] == 3){
					var returnText = '终止';
				}else{
					var returnText = '未审核';
				}
				return returnText;
			}
		}
      ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="info(\''+data['CODE']+'\')" class="a_link">查看</a>';
//    	  if(data['STATUS'] != 1){
//    		  returnText +=' | <a href="javascript:void(0);" onclick="gotoby(\''+data['CODE']+'\')" class="a_link">审核</a>';
//    	  }
          return returnText;
        }
      }
    ]
    ,url : '/rent/rentbespeak/pagelist'
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
 * 租赁详情
 * @param orderNo
 * @return
 */
function info(code){
	window.location.href = "/rent/rentbespeak/info?code="+code;
}

/**
 * 租赁状态
 * @param orderNo
 * @return
 */
function gotoby(code){
	if(confirm('确定审核？')){
		$.post('/rent/rentbespeak/updatestatus',{code:code,status:'1'},function(data){
			if(data == 'N'){
				alert('操作失败');
			}
			window.location.href='';
		});
	}
}

function getParams(){
    return {
    	rentNo:$('#rentNo').val(),
    	merName:$('#merName').val(),
    	status:$('#status').val(),
    	tel:$('#tel').val(),
    	uname:$('#uname').val(),
    	startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
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