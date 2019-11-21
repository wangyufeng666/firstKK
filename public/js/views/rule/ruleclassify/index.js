var grid;
$().ready(function(){
  grid = $('#grid').grid({
    pageSize :10,
    height:250
    ,cm : [
      {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
      ,{header: "商品分类", dataIndex: 'MERTYPE', width:'100px',sortable:false}
      ,{header: "规则名称", dataIndex: 'RULENAME', width:'100px',sortable:false}
      ,{header: "创建时间", dataIndex: 'CREATEDATE', width:'100px',sortable:false}
      ,{header: "规则排序", dataIndex: 'SEQ', width:'40px',sortable:false}
      ,{header: "自定义选项名称", dataIndex: 'OPTIONNAME', width:'100px',sortable:false}
      ,{header: "是否已设置默认选项", dataIndex: '', width:'70px',sortable:false,
    	  renderer : function(value, data, rowIndex, colIndex, metadata){
    		  return data['OPTIONFLAG'] ? '<font color="green">已设置</font>' : '<font color="red">未设置</font>';
    	  }
      }
      ,{header: "操作", dataIndex: '', width:'240px', sortable:false, 
        renderer : function(value, data, rowIndex, colIndex, metadata){
    		var returnText = '<a href="javascript:void(0);" onclick="fenpei(\''+data['OPTIONCODE']+'\',\''+data['RULEID']+'\')" class="a_link">分配默认选项</a> | ';
    		returnText += '<a href="javascript:void(0);" onclick="editName(\''+data['OPTIONCODE']+'\')" class="a_link">修改自定义选项</a> | ';
    		returnText += '<a href="javascript:void(0);" onclick="stopClassify(\''+data['OPTIONCODE']+'\')" class="a_link">作废</a>';
          return returnText;
        }
      }
    ]
    ,url : '/rule/ruleclassify/pagelist'
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

function getParams(){
    return {
        ruleName:$('#ruleName').val(),
        merType:$('#merType').val()
    };
}

function fenpei(optionCode, ruleId){
	window.location.href = '/rule/ruleclassify/fenpei?optionCode='+optionCode+'&ruleId='+ruleId;
/*	$.layer({
		type:2,
		title:'自定义选项分配默认选择项',
		iframe:{src:'/rule/ruleclassify/fenpei?classifyCode='+classifyCode+'&ruleId='+ruleId},
		area:['1000' , '500'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});*/
}

function editName(optionCode){
	$.layer({
		type:2,
		title:'修改自定义选项',
		iframe:{src:'/rule/ruleclassify/editcustom?optionCode='+optionCode},
		area:['500' , '350'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

function stopClassify(optionCode){
	if(optionCode){
		if(confirm('作废此分类名称，此默认选项将会失效。是否确认作废？')){
			$.post('/rule/ruleclassify/stopclassify',{optionCode:optionCode},function(data){
				if(data == 'Y'){
					layer.load('数据加载中...', 1);
				    grid.query(getParams());
				}else{
					alert('作废失败');
				}
			});
		}
	}
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