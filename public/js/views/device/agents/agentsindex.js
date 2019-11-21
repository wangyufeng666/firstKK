var grid;
$().ready(function(){
	//initProvinces();
	grid = $('#grid').grid({
		pageSize :15,
		height:375
		,cm : [
			{checkbox:true}
			,{header: "No.", dataIndex: 'R', width:'',sortable:false}
			,{header: "代理商名称", dataIndex: 'COMPANYNAME', width:'', sortable:false}
			,{header: "代理商编码", dataIndex: 'TYPECODE', width:'', sortable:false}
			,{header: "姓名", dataIndex: 'CONTACTS', width:'',sortable:false}
			,{header: "手机号", dataIndex: 'MOBILE',width:'',sortable:false}
			,{header: "代理等级", dataIndex: 'GRADE',width:'',sortable:false}
            ,{header: "佣金上限", dataIndex: '',width:'',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	return data['BROKERAGEMAX']+'%';
				}
            }
            ,{header: "分成上限", dataIndex: '',width:'',sortable:false,
            	renderer : function(value, data, rowIndex, colIndex, metadata){
				  	return data['DIVIDEDMAX']+'%';
				}
            }
            ,{header: "上级", dataIndex: '',width:'',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	return data['PCOMPANYNAME'] ? data['PCOMPANYNAME'] : '---';
				}
            }
			,{header: "地址", dataIndex: 'ADDRESS', width:'150px',sortable:false}
			,{header: "代理商状态", dataIndex: 'FROZENFLAG', width:'',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['FROZENFLAG'] == 'N' ? '<font color="green">正常</font>' : '<font color="red">冻结中</font>';
				}
			}
			,{header: "是否允许发展下级", dataIndex: 'AGENTFLAG', width:'',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['AGENTFLAG'] == '2' ? '<font color="green">允许</font>' : '<font color="red">不允许</font>';
				}
			}
			,{header: "是否运维共享", dataIndex: 'OPERATIONFLAG', width:'',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return data['OPERATIONFLAG'] == '1' ? '<font color="green">允许</font>' : '<font color="red">不允许</font>';
				}
			}
			,{header: "操作", dataIndex: '', width:'250px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText = '右键点击';
					//var typeCode = data['TYPECODE'];
					if(data['FROZENFLAG'] == 'N') {
						returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="upAgentStatus(1)">冻结账户</a>';
						if (data['AUDITSTATUS'] == '1') {
							returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="audit(\'' + typeCode + '\')">审核</a>';
						}
					//	returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="editAgent(\''+typeCode+'\')">编辑</a>';
					//	returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="addBusiness(\''+typeCode+'\')">新增商户</a>';
					//	returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="delAgent(\''+typeCode+'\')">删除代理</a>';
					//	returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="addOperation(\''+typeCode+'\')">新增运维</a>';
					}else if(data['FROZENFLAG'] == 'Y'){
						returnText ='<a class="a_link" href="javascript:void(0);" onclick="upAgentStatus(2)">解除冻结</a>';
					}
				  	return returnText;
				}
           	}
        ]
		,contextMenuSingle : [{text: '编辑',icon: '/js/uiwidget/menu/images/ico-add.gif'
			,handler: function(e){
				var selections = grid.getSelections();
				editAgent(selections[0]['TYPECODE']);
				//alert( '新增,选择的ID = ' + selections[0]['id']);
			}}
			,{text: '新增商户',icon: '/js/uiwidget/menu/images/ico-add.gif'
				,handler: function(e){
					var selections = grid.getSelections();
					addBusiness(selections[0]['TYPECODE']);
					//console.log(selections);
				}}
			,{text: '删除代理',icon: '/js/uiwidget/menu/images/ico-add.gif'
				,handler: function(e){
					var selections = grid.getSelections();
					delAgent(selections[0]['TYPECODE']);
				}}
			,{text: '新增运维',icon: '/js/uiwidget/menu/images/ico-add.gif'
				,handler: function(e){
					var selections = grid.getSelections();
					addOperation(selections[0]['TYPECODE']);
				}}
		]
        ,url : '/device/agents/agentpagelist'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
     return getParams();
}


function bindDevice() {
	$.layer({
		type : 2,
		title : '导入关联设备信息',
		iframe : {src : '/device/agents/devicebind'},
		area : ['800' , '400'],
		offset : ['50px',''],
		close : function(index){
			layer.close(index);
			doSearch();
		}
	});
}

/**
 * 省份初始化
 * @return
 */
function initProvinces(){
	$.ajax({type:'POST', dataType:'jsonp', jsonp:'jsonp_callback',
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var optionsText = "<option value=''>请选择省份</option>";
			for(i in data){
				optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
			}
			$('#provinceId').html(optionsText);
			$('#provinceId').val(provinceId);
			$('#cityId').val(cityId);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
	if(provinceId != ""){
		var optionsText = "<option value=''>请选择城市</option>";
		$.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
			data:{pid:provinceId},
			url:openApiDomain+'/recycle/area/citys',
			success:function(data){
				for(i in data){
					optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
				}
				$('#cityId').html(optionsText);
				}
			});
		}
});


function getParams(){
    return {
    	companyName:$('#companyName').val(),
        auditStatus:$('#auditStatus').val(),
        businessType:$('#businessType').val(),
        provinceId:$('#provinceId').val(),
        cityId:$('#cityId').val(),
        grade:$('#grade').val(),
        typeCode:$('#typeCode').val(),
        contacts:$('#contacts').val()
    };
}

/**
 * 新增代理商
 */
function addAgents(){
	layer.open({
		type:2,
		title:'新增代理商',
		content:'/device/agents/addagents',
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 编辑代理商
 */
function editAgent(typeCode){
	layer.open({
		type:2,
		title:'编辑代理商',
		content: '/device/agents/editagents?backFlag=Y&typeCode='+typeCode,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function delAgent(typeCode){
	if(confirm('删除代理之后，代理下所有设备解除绑定。请谨慎操作')){
		$.post('/device/agents/delagent',{typeCode:typeCode},function(data){
			if(data == 'Y'){
				alert('删除成功，改代理下所有设备已解除关联');
				window.location.href = window.location.href;
			}else{
				alert('删除失败，请重新操作');
			}
		})
	}
}


function addOperation(typeCode) {
	layer.open({
		type:2,
		title:'新增运维人员',
		content:'/device/operation/addoperation?backFlag=Y&typeCode='+typeCode,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}



/**
 * 新增商户
 * @param typeCode
 * @returns
 */
function addBusiness(typeCode){
	layer.open({
		type:2,
		title:'新增商户',
		content:'/device/business/addbusiness?backFlag=Y&typeCode='+typeCode,
		area:['100%', '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function audit(typeCode){
	if(confirm("是否确认审批该合作商？")){
		$.ajax({
		type:'POST'//请求方式
		,url:"/device/agents/audit"  //请求路径
		,data:{typeCode:typeCode} //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					doSearch();
				}else{
					alert("该代理商没有佣金策略或分成策略，无法审批");
				}
			}
		});
	}	
}
/**
 * 批量改变代理商的状态
 */
function upAgentStatus(data){
	var typeCodes = ''; 
	var result = grid.getSelections();
	if(result == ''){
		var mag = '请选择需要冻结的代理商';
		if(data == 2 || data == 4){
			mag = '请选择需要解冻的代理商';
		}
		alert(mag);
	}else{
		for(var i = 0; i < result.length ; i++){
			typeCodes += result[i].TYPECODE+",";
		}
		if(confirm('是否确定操作')){
			$.post('/device/agents/updateagentstatus',{typeCodes:typeCodes, statusFlag:data},function(data){
				if(data == 'Y'){
					alert('操作成功');
					doSearch();//刷新
				}else{
					alert('操作失败');
				}
			});
		}
	}
}

function doSearch(){
    var index = layer.load('数据加载中...',1);
    grid.query(getParams());
    layer.close(index);
}

function exprotAgents(){
	var param = '';
	param += '&companyName=' + $('#companyName').val();
	param += '&auditStatus=' + $('#auditStatus').val();
	param += '&businessType=' + $('#businessType').val();
	param += '&provinceId=' + $('#provinceId').val();
	param += '&cityId=' + $('#cityId').val();
	param += '&grade=' + $('#grade').val();
	param += '&typeCode=' + $('#typeCode').val();
	window.location.href = '/device/agents/exprotagents?'+param;
	return false; //截取返回false就不会保存网页了
}