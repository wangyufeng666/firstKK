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
		    ,{header:"门店编码", dataIndex:'PARTNERCODE', width:'80px', sortable:false}
		    ,{header:"设备数量", dataIndex:'', width:'80px', sortable:false,
	        	   renderer : function(value, data, rowIndex, colIndex, metadata){
	        		   var partnerName = data['PARTNERNAME'];
	        		   var deviceCounts = data['DEVICECOUNTS'];
	        		   return '<a class="a_link" href="javascript:showDevice(\''+partnerName+'\')">'+deviceCounts+'</a>';
					}
		    }
		    ,{header:"联系方式", dataIndex:'CONTACTS', width:'120px', sortable:false,
		    	renderer : function(value, data, rowIndex, colIndex, metadata){
		    		return data['CONTACTWAY']+'('+data['CONTACTS']+')';
		    	}        	   
		    }
		    ,{header:"合作模式", dataIndex:'PATTERNNAME', width:'100px', sortable:false}
		    ,{header:"佣金比例", dataIndex:'', width:'80px', sortable:false,
		    	renderer : function(value, data, rowIndex, colIndex, metadata){
		    		return data['BROKERAGEMAX']+'%';
		    	}
		    }
           ,{header:"分成比例", dataIndex:'', width:'80px', sortable:false,
		    	renderer : function(value, data, rowIndex, colIndex, metadata){
		    		return data['DIVIDEDMAX']+'%';
		    	}
           }
           ,{header:"地址： ", dataIndex:'ADDRESS', width:'160px', sortable:false}
           ,{header:"店员人数： ", dataIndex:'', width:'80px', sortable:false,
		    	renderer : function(value, data, rowIndex, colIndex, metadata){
		    		return data['COUNTS'] ? data['COUNTS'] : 0;
		    	}  
           }
           ,{header:"是否冻结", dataIndex:'PARSTATUSNAME', width:'80px', sortable:false}
           ,{header:"门店租金", dataIndex:'RENTNAME', width:'80px', sortable:false}
           ,{header:"操作", dataIndex:'', width:'120px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editBusiness(\''+data['PARTNERCODE']+'\')">编辑</a>';
					returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="addPromoter(\''+data['PARTNERCODE']+'\')">新增店员</a>';
				   	if(data['PARSTATUSNAME'] == '有效') {
						returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="frozen(\''+data['PARTNERCODE']+'\')">禁用</a>';
					}
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
		pattern:$('#pattern').val(),
		bindFlag:$('#bindFlag').val(),
		deviceFlag:$('#deviceFlag').val(),
		rental:$('#rental').val(),
    };
}

//新增店员
function addPromoter(partnerCode){
	window.location.href = '/device/promoter/addpromoter?partnerCode='+partnerCode+'&backUrl='+backUrl;
}

//编辑门店信息
function editBusiness(partnerCode){
	window.location.href = '/device/business/editbusiness?partnerCode='+partnerCode+'&backUrl='+backUrl;
}

function doSearch(){
	grid.query(getParams());
}

function showDevice(partnerName){
	$.layer({
		type:2,
		title:'运行中的设备',
		iframe : {src : '/device/index/index?partnerName='+partnerName},
		area : ['100%' , '80%'],
		close : function(index){
			layer.close(index);
			doSearch();
		}
	});
}

function doImport() {
	$.layer({
		type : 2,
		title : '导入商户信息',
		iframe : {src : '/device/business/import'},
		area : ['800' , '400'],
		offset : ['50px',''],
		close : function(index){
			layer.close(index);
			doSearch();
		}
	});
}

/**
 * 禁用商户
 * @param partnerCode
 */
function frozen(partnerCode) {
	if(confirm('禁用商户后，绑定设备则无法下单，需重新发布。请谨慎操作')){
		$.post('/device/business/frozen',{partnerCode:partnerCode},function(data){
			if(data == 'Y'){
				alert('禁用成功！');
				window.location.href = window.location.href;
			}else{
				alert('禁用失败，请重新操作');
			}
		})
	}
}