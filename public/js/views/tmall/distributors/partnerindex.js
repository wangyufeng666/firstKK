var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		    ,{header:"所属分部", dataIndex:'COMPANYNAME', width:'100px', sortable:false}
		    ,{header:"门店名称", dataIndex:'PARTNERNAME', width:'100px', sortable:false}
		    ,{header:"取件方式", dataIndex:'VISITFLAG', width:'100px', sortable:false,
           	   renderer : function(value, data, rowIndex, colIndex, metadata){
                   return data['VISITFLAG'] == '1' ? '上门取件':(data['VISITFLAG'] == '2' ? '回收机取件': '快递取件');
                 }  
		    }
		    ,{header:"门店编号", dataIndex:'PARTNERCODE', width:'80px', sortable:false}
           ,{header:"详细地址： ", dataIndex:'ADDRESS', width:'160px', sortable:false}
           ,{header:"操作", dataIndex:'', width:'120px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editPartner(\''+data['PARTNERCODE']+'\')">修改</a>';
					returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="partners(\''+data['PARTNERCODE']+'\')">查看主任</a>';
					return returnText;
				}
           }
       ]
       ,url : '/tmall/distributors/partnerpagelist'
	});
});


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

/**
 * 新增渠道商
 */
function addStore(){
	window.location.href = "/tmall/distributors/addpartner";
}

/**
 * 查看门店所有主任
 * @returns
 */
function partners(partnerCode){
	window.location.href = "/tmall/distributors/partners?partnerCode="+partnerCode;
}

/**
 * 功能描述：修改渠道商信息
 */
function editPartner(partnerCode){
	window.location.href = "/tmall/distributors/editpartner?partnerCode="+partnerCode;
}

function getParams(){
    return {
    	partnerName:$('#partnerName').val(), 
    	partnerCode:$('#partnerCode').val(),
    	companyName:$('#companyName').val(),
    	companyCode:$('#companyCode').val(),
    	mobile:$('#mobile').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		visitFlag:$('#visitFlag').val(),
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

function exportPartners(){
	var param = '';
	param += '&partnerName=' + $('#partnerName').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&companyCode=' + $('#companyCode').val();
	param += '&companyName=' + $('#companyName').val();
	param += '&mobile=' + $('#mobile').val();
	param += '&provinceId=' + $('#provinceId').val();
	param += '&cityId=' + $('#cityId').val();
	param += '&visitFlag=' + $('#visitFlag').val();
	window.location.href = '/tmall/distributors/exprotgomepartners?'+param;
	return false; //截取返回false就不会保存网页了
}
