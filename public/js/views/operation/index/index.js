var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false}
      ,{header: "唯一编码", dataIndex: 'PCODE', width:'80px',sortable:false}
      ,{header: "姓名", dataIndex: 'PNAME', width:'80px',sortable:false}
      ,{header: "手机号", dataIndex: 'PHONE', width:'80px',sortable:false}
      ,{header: "所在地区", dataIndex: 'ADDRESS', width:'130px',sortable:false}
      ,{header: "第三方工号", dataIndex: 'WORKNUM', width:'65px',sortable:false}
      ,{header: "人员描述", dataIndex: 'REMARK', width:'65px',sortable:false}
      ,{header: "人员状态", dataIndex: 'STATE', width:'70px',sortable:false}
      ,{header: "创建日期", dataIndex: 'CREATED_AT', width:'80px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'150px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="getInfo(\''+data['PCODE']+'\')" class="a_link">查看</a>';
            returnText +='|<a href="javascript:void(0);" onclick="operation(\''+data['PCODE']+'\',1)" class="a_link">运维设备</a>';
            returnText +='|<a href="javascript:void(0);" onclick="operation(\''+data['PCODE']+'\',2)" class="a_link">监管设备</a>';
            return returnText;
        }
      }
    ]
    ,url : '/operation/index/ajaxpage'
    ,baseParams:initParams()
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

function getInfo(code) {
    window.location.href = '/operation/index/operationman?pcode='+code;
}


function getParams(){
    return {
        orderNo:$('#orderNo').val(),
        mobile:$('#mobile').val(),
        startCreateDate:$('#startCreateDate').val(),
        endCreateDate:$('#endCreateDate').val(),

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

function downExport(){
    var param = '';
    param += '&startCreateDate='+$('#startCreateDate').val();
    param += '&endCreateDate='+$('#endCreateDate').val();
    param += '&orderNo='+$('#orderNo').val();
    param += '&mobile='+$('#mobile').val();
    window.location.href = '/thinkpad/recovery/export?v=1'+param;
    return false; //截取返回false就不会保存网页了
}

function add() {
    $.layer({
        type : 2,
        title : '新增人员',
        iframe : {src : '/operation/index/add'},
        area : ['500' , '350'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}

function operation(code,type) {
    $.layer({
        type : 2,
        title : '分配设备',
        iframe : {src : '/operation/index/distribution?code='+code+'&type='+type},
        area : ['500' , '350'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
        }
    });
}
