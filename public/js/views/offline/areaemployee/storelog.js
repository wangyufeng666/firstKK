var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:20,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'10PX',sortable:false} 
			,{header: "门店名称", dataIndex: 'PARTNERNAME', width:'30px',sortable:false}
			,{header: "巡店时间", dataIndex: 'XDDATE', width:'30px',sortable:false}
			,{header: "门店地址", dataIndex: 'P_ADDRESS', width:'30px',sortable:false}
			,{header: "巡店记录", dataIndex: 'REMARK', width:'80px',sortable:false}
		]
		,url:'/offline/areaemployee/logpagelist'
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