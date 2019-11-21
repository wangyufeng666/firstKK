var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'10PX',sortable:false} 
			,{header: "门店名称", dataIndex: 'PARTNERNAME', width:'35px',sortable:false}
			,{header: "门店地址", dataIndex: 'XXDZ', width:'70px',sortable:false}
			,{header: "订单总数", dataIndex: '', width:'30px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['TOTAL'] ? data['TOTAL'] : 0;
				}	
			}
			,{header: "成交订单总数", dataIndex: '', width:'30px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['STOTAL'] ? data['STOTAL'] : 0;
				}		
			}
			,{header: "未成交订单总数", dataIndex: 'FTOTAL', width:'30px',sortable:false}
		]
		,url:'/offline/areaemployee/orderpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
	params.start = start;
	params.limit = limit;
	return params;
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
		partnerName:$('#partnerName').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		jobNum:$('#jobNum').val()
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

function exprot(){
	var param = '';
	param += '&partnerName=' + $('#partnerName').val();
	param += '&startDate=' + $('#startDate').val();
	param += '&endDate=' + $('#endDate').val();
	param += '&provinceId=' + $('#provinceId').val();
	param += '&cityId=' + $('#cityId').val();
	param += '&jobNum=' + $('#jobNum').val();
	window.location.href = '/offline/areaemployee/exprot?'+param;
	return false; //截取返回false就不会保存网页了
}
