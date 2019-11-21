var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize:10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'130px',sortable:false}
			,{header: "所属分部", dataIndex: 'COMPANYNAME', width:'100px',sortable:false}
			,{header: "所属门店", dataIndex: 'HNAME', width:'100px',sortable:false}
			,{header: "店员", dataIndex: 'NAME', width:'80px',sortable:false}
			,{header:"品类", dataIndex:'MERTYPE', width:'80px',sortable:false}
			,{header:"品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品型号", dataIndex:'MERNAME', width:'80px', sortable:false}
			,{header:"付款/发券日期", dataIndex:'PAYDATE', width:'130px',sortable:false}
			,{header:"联系人", dataIndex:'LIANXIREN', width:'70px',sortable:false}
			,{header:"联系电话", dataIndex:'LIANXIDH', width:'80px',sortable:false}
			,{header:"地区", dataIndex:'DISTRICT', width:'80px',sortable:false}
			,{header:"订单状态", dataIndex:'ORDERSTATUS', width:'80px',sortable:false}
			,{header:"付款方式", dataIndex:'PAYTYPE', width:'80px',sortable:false}
			,{header:"支付类型", dataIndex:'PAYTYPE1', width:'80px',sortable:false, 
				renderer : function(value, data, rowIndex, colIndex, metadata){
					return value == '3' ? '券' : '现金转账';
				}
			}
		]
		,url:'/report/gomeapp/tradereportpagelist'
		,baseParams:{isAll:'all'}
	});
});


function getParams(){
	return {
		partnerName:$('#partnerName').val(),
		partnerCode:$('#partnerCode').val(),
		startDate:$('#startDate').val(),
		endDate:$('#endDate').val(),
		startInspecDate:$('#startInspecDate').val(),
		endInspecDate:$('#endInspecDate').val(),
		category:$('#category').val(),
		companyName:$('#companyName').val(),
		branchCode:$('#branchCode').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
	};
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