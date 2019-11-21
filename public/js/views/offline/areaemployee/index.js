var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'10PX',sortable:false} 
			,{header: "员工姓名", dataIndex: 'NAME', width:'30px',sortable:false}
			,{header: "联系电话", dataIndex: 'MOBILE', width:'30px',sortable:false}
			,{header: "工号", dataIndex: 'JOBNUM', width:'30px',sortable:false}
			,{header: "地址", dataIndex: 'ADDRESS', width:'80px',sortable:false}
			,{header: "负责门店数量", dataIndex: 'STORECOUNTS', width:'30px',sortable:false}
			,{header: "操作", dataIndex: '', width:'80px', sortable:false, 
	          renderer : function(value, data, rowIndex, colIndex, metadata){
	      	  var jobNum = data['JOBNUM'];
	      	  var districtId = data['DISTRICTID'];
	      	  
	      	  var returnText ='<a href="javascript:void(0);" onclick="showStore(\''+jobNum+'\')" class="a_link">查看门店</a>';
      	  		  returnText +=' | <a href="javascript:void(0);" onclick="orderTatol(\''+jobNum+'\')" class="a_link">订单统计</a>';
				  returnText +=' | <a href="javascript:void(0);" onclick="showStoreLogs(\''+jobNum+'\')" class="a_link">足迹</a>';
				  returnText +=' | <a href="javascript:void(0);" onclick="huanStore(\''+jobNum+'\')" class="a_link">门店互换</a>';
				  returnText +=' | <a href="javascript:void(0);" onclick="editEmployeeInfo(\''+jobNum+'\')" class="a_link">修改</a>';
				  returnText +=' | <a href="javascript:void(0);" onclick="stopEmployeeInfo(\''+jobNum+'\')" class="a_link">作废</a>';
	            return returnText;
	          }
	        }
		]
		,url:'/offline/areaemployee/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params.start = start;
		params.limit = limit;
		return params;
	}else{
		return {};
	}
}

/**
 * 功能描述：查看区域负责门店
 * added by wangbo
 */
function showStore(jobNum){
	window.location.href = '/offline/areaemployee/showstore?jobNum='+jobNum;
}

/**
 * 功能描述：足迹查看
 * added by wangbo
 */
function showStoreLogs(jobNum){
	$.layer({
		type:2,
		title:'巡店记录',
		iframe:{src:'/offline/areaemployee/storelog?jobNum='+jobNum},
		area:['1200' , '600'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 功能描述：订单统计
 * added by wangbo
 */
function orderTatol(jobNum){
	/*window.location.href = '/offline/areaemployee/ordertotal?jobNum='+jobNum;*/
	$.layer({
		type:2,
		title:'订单统计',
		iframe:{src:'/offline/areaemployee/ordertotal?jobNum='+jobNum},
		area:['1200' , '500'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	})
}

/**
 * 功能描述：新增区域人员
 * added by wangbo
 */
function addAreaEmployee(){
	window.location.href = '/offline/areaemployee/addareaemployee';
}

/**
 * 功能描述：修改区域人员 信息
 * added by wangbo
 */
function editEmployeeInfo(jobNum){
	$.layer({
		type:2,
		title:'修改区域负责人信息',
		iframe:{src:'/offline/areaemployee/editemployee?jobNum='+jobNum},
		area:['800' , '500'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 功能描述：作废区域人员
 * added by wangbo
 */
function stopEmployeeInfo(jobNum){
	if(confirm("是否确认作废该区域人员？")){
		$.post('/offline/areaemployee/stopemployee',{jobNum:jobNum},function(data){
			if(data == 'Y'){
				alert('已经成功作废该区域人员');
				window.location.href = window.location.href;
			}else{
				alert('作废失败，请从新操作');
				window.location.href = window.location.href;
			}
		})
	}
}

function huanStore(jobNum){
	$.layer({
		type:2,
		title:'区域所有负责人',
		iframe:{src:'/offline/areaemployee/jiaohuan?jobNum='+jobNum},
		area:['500' , '200'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
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
		name:$('#name').val(),
		mobile:$('#mobile').val(),
		jobNum:$('#jobNum').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}
	});
}
