var grid;
var layerIndex = 0;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{checkbox:true}
			,{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "门店名称", dataIndex: 'PARTNERNAME', width:'80px',sortable:false}
			,{header: "门店负责人", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['CONTACTS']+'( '+data['CONTACTWAY']+')';
				}
			}
			,{header: "门店地址", dataIndex: 'ADDRESS', width:'150px',sortable:false}
			,{header: "库存量", dataIndex: 'MERCOUNTS', width:'80px',sortable:false}
			,{header: "库存总金额", dataIndex: 'ALLPRICE', width:'80px',sortable:false}
			,{header: "操作", dataIndex: '', width:'200px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var partnerCode = data['PARTNERCODE'];
					var inventoryStatus = data['INVENTORYSTATUS'];
					var returnText ='<a title="'+partnerCode+'" href="javascript:merInfo(\''+partnerCode+'\')" class="a_link">查看</a>';
						returnText +=' | <a title="'+partnerCode+'" href="javascript:allOutWare()" class="a_link">请求出库</a>';
					return returnText;
				}
			}
		]
		,url:'/order/gomestore/inwarepagelist'
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
	,afterRender:function(){
		layer.close(layerIndex);
	}
	});
});

function initParams(){
	return getParams();
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
			$('#cityId').val(cityId);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
	var optionsText = "<option value=''>请选择城市</option>";
	if(provinceId != ""){
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
	}else{
		$('#cityId').html(optionsText);
	}
});

/**
 * 商品详情
 * @param orderNo
 * @return
 */
function merInfo(partnerCode){
	layer.open({
		type:2,
		title:'查看门店在库商品',
		content:"/order/gomestore/orderstorage?partnerCode="+partnerCode+"&inventoryStatus=1&visitFlag=1",
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 批量请求出库
 */
function allOutWare(){
	var partnerCodes = ''; 
	var result = grid.getSelections();
	var j=0;
	if(result == ''){
		alert('请选择出库订单');
	}else{
		for(var i = 0; i < result.length ; i++){
			j++
			partnerCodes += "'"+result[i].PARTNERCODE+"',";
		}
		if(confirm('是否确定一共'+j+'家国美门店订单出暂存库')){
			$.post('/order/gomestore/outwarethedoor',{partnerCodes:partnerCodes},function(data){
				if(data == 'Y'){
					alert('国美暂存库出库单生成成功');
					grid.reload();//刷新
				}else{
					alert('国美暂存库出库单生成失败');
				}
			});
		}
	}
}

function getParams(){
	return {
		contactWay:$('#contactWay').val(),
		partnerCode:$('#partnerCode').val(),
		address:$('#address').val(),
		partnerName:$('#partnerName').val(),
		visitFlag:1,
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
	};
}

function doSearch(){
	layerIndex = layer.msg('数据加载中...', {icon:16, time:30000});
	grid.query(getParams());
}
