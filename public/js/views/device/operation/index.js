var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'35PX',sortable:false}
      ,{header: "所属代理", dataIndex: 'COMPANYNAME', width:'100px',sortable:false}
      ,{header: "唯一编码", dataIndex: 'PCODE', width:'80px',sortable:false}
      ,{header: "姓名", dataIndex: '', width:'130px',sortable:false,
    	  renderer : function(value, data, rowIndex, colIndex, metadata){
    		  return data['PNAME']+'('+data['PHONE']+')';
    	  }
      }
      ,{header: "工号", dataIndex: 'WXNO', width:'65px',sortable:false}
      ,{header: "所在地区", dataIndex: 'ADDRESS', width:'130px',sortable:false}
      ,{header: "人员状态", dataIndex: '', width:'70px',sortable:false,
    	  renderer : function(value, data, rowIndex, colIndex, metadata){
    		  var state = data['STATE'];
    		  if(state == '有效'){
    			  return '<font color="green">'+state+'</font>';
    		  }else if(state == '无效'){
    			  return '<font color="red">'+state+'</font>';
    		  }
    	  }
      }
      ,{header: "创建日期", dataIndex: 'CREATED_AT', width:'80px',sortable:false}
      ,{header: "操作", dataIndex: '', width:'150px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    	  var returnText ='<a href="javascript:void(0);" onclick="getInfo(\''+data['PCODE']+'\')" class="a_link">查看设备</a>';
            if(data['STATE'] == '有效'){
                returnText +=' | <a href="javascript:void(0);" onclick="update(\''+data['PCODE']+'\',2)" class="a_link">停用</a>';
            }
            if(data['STATE'] == '无效') {
                returnText +=' | <a href="javascript:void(0);" onclick="update(\''+data['PCODE']+'\',1)" class="a_link">启用</a>';

            }

           returnText +=' | <a href="javascript:void(0);" onclick="delOperation(\''+data['PCODE']+'\')" class="a_link">查看运维门店</a>';

            return returnText;
        }
      }
    ]
    ,url : '/device/operation/ajaxpage'
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
    window.location.href = '/device/operation/operationman?pcode='+code;
}

function editInfo(code) {
    window.location.href = "device/operation/edit"
}


function update(code,type) {
    var msg = "";
    if(type == 2) {
        msg = '确认停用当前人员么？';
    }else if(type == 3) {
        msg = "确认删除当前人员么？";
    }else {
        msg = "确认启用当前人员么？";
    }
    layer.confirm(msg, {
        btn: ['确定','取消'] //按钮
    }, function(){
        $.ajax({
            url:'/device/operation/changestate',
            data:{pcode:code,flag:type},
            dataType:'json',
            success:function(data){
                if(data.code==200) {
                    window.location.reload();
                }
            }
        })
    });

}


function getParams(){
    return {
        name:$('#name').val(),
        phone:$('#phone').val(),
        worknum:$('#worknum').val(),
        companyName:$('#companyName').val(),
    };
}

function doSearch(){
    var index = layer.load('数据加载中...', 1);
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

/**
 * 删除运维 
 * @returns
 */
function delOperation(pcode){
	layer.open({
		type : 2,
		title : '删除运维',
		content : '/device/operation/deloperation?pcode='+pcode,
		area : ['100%' , '100%'],
		shadeClose: true,
		shade:  [0.5,'#B8B8B8'],
		end : function(index){
			layer.close(index);
		}
	});
}