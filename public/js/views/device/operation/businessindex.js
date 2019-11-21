var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize :15,
		height:380
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		    ,{header:"所属代理", dataIndex:'COMPANYNAME', width:'100px', sortable:false}
		    ,{header:"门店名称", dataIndex:'PARTNERNAME', width:'100px', sortable:false}
		    ,{header:"联系方式", dataIndex:'CONTACTS', width:'120px', sortable:false,
		    	renderer : function(value, data, rowIndex, colIndex, metadata){
		    		return data['CONTACTWAY']+'('+data['CONTACTS']+')';
		    	}        	   
		    }
		    ,{header:"合作模式", dataIndex:'', width:'100px', sortable:false}
		    ,{header:"佣金比例", dataIndex:'BROKERAGEMAX', width:'80px', sortable:false}
           ,{header:"分成比例", dataIndex:'DIVIDEDMAX', width:'80px', sortable:false}
           ,{header:"结算方式 ", dataIndex:'TRADETYPENAME', width:'80px', sortable:false}
           ,{header:"回收订单", dataIndex:'', width:'80px', sortable:false}
           ,{header:"回收总金额 ", dataIndex:'', width:'80px', sortable:false}
           ,{header:"地址： ", dataIndex:'ADDRESS', width:'160px', sortable:false}
           ,{header:"是否冻结", dataIndex:'PARSTATUSNAME', width:'80px', sortable:false}
           ,{header:"状态", dataIndex:'STATUSNAME', width:'80px', sortable:false}
           ,{header:"操作", dataIndex:'', width:'120px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editPartner(\''+data['PARTNERCODE']+'\')">修改</a>';
					return returnText;
				}
           }
       ]
       ,url : '/device/business/pagelist'
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
    	contacts:$('#contacts').val(),
    	payType:$('#payType').val(),
    	agents:$('#agents').val(),
    	typeCode:$('#typeCode').val(),
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
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}
