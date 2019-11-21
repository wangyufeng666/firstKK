var grid;
$().ready(function(){
	initProvinces();
    initProvincesr();
	grid = $('#grid').grid({
		pageSize :10
		,height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'30PX',sortable:false}
			,{header: "设备编号", dataIndex: 'DEVICEID', width:'120px', sortable:false}
			,{header: "二维码编码", dataIndex: 'QRCODE', width:'80px', sortable:false}
			,{header: "设备类型", dataIndex: 'TYPENAME', width:'80px',sortable:false}
			,{header: "设备地址", dataIndex: 'ADDRESS',width:'100px',sortable:false}
			,{header: "绑定时间", dataIndex: 'BINDDATE',width:'120px',sortable:false}
            ,{header: "代理商", dataIndex: 'COMPANYNAME',width:'120px',sortable:false}
            ,{header: "商户", dataIndex: 'PARTNERNAME',width:'100px',sortable:false}
            ,{header: "运维人员", dataIndex: 'OPSNAME',width:'100px',sortable:false}
            ,{header: "发布状态", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    if(data['ISRELEASE'] == 1){
                        var returnText = '未发布';
                    }else if(data['ISRELEASE'] == 2){
                        var returnText = '已发布';
                    }
                    return returnText;
                }
            }
			,{header: "启用状态", dataIndex: '', width:'70px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['ISENABLE'] == 1){
						var returnText = '未启用';
					}else if(data['ISENABLE'] == 2){
						var returnText = '已启用';
					}
					return returnText;
				}
			}
			,{header: "设备状态", dataIndex: '', width:'70px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['STATE'] == 'ok'){
						var returnText = '正常';
					}else if(data['STATE'] == 'error'){
						var returnText = '<font color="red">有故障</font>';
					}else if(data['STATE'] == 'offline'){
						var returnText = '<font color="#555">离线</font>';
					}
					return returnText;
				}
			}
        ]
        ,url : '/device/index/agentlist'
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
        return getParams();
    }
}

function getParams(){
    return {
        deviceid:$('#deviceid').val(),
        createtime1:$('#createtime1').val(),
        createtime2:$('#createtime2').val(),
        bindtime1:$('#bindtime1').val(),
        bindtime2:$('#bindtime2').val(),
        partnername:$('#partnername').val(),
        isrelease:2,
        isout:3,
        isrun:1,
        typecode:$('#typecode').val(),
        agentname:$('#agentname').val(),
        eventname:$('#eventname').val(),
        opsname:$('#opsname').val(),
        state:$('#state').val(),
        provinceId:$('#provinceId').val(),
        cityId:$('#cityId').val()
    };
}

/**
 * 更改代理
 */
function updateAgent(){
    var provinceId = $('#provinceId').val();
    var cityId = $('#cityId').val();
    var nowtypeCode = $('#nowtypeCode').val();
    var typeCode = $('#typeCode').val();
    if(cityId == '' || cityId == null){
        layer.msg('请选择省市');
        return false;
    }

    if(nowtypeCode == '' || nowtypeCode == null){
        layer.msg('请选转换来源!');
        return false;
    }

    if(typeCode == '' || typeCode == null){
        layer.msg('请选择代理商!');
        return false;
    }

    if (nowtypeCode == typeCode){
        layer.msg('装换来源代理和更改代理不能相同!');
        return false;
    }
    if(confirm('确定需要更换代理么？？？')){
        $.post('/device/index/editagent', {cityId:cityId,typeCode:typeCode,provinceId:provinceId,nowtypeCode:nowtypeCode}, function(data){
            if(data.code == '1000'){
                layer.msg('更改成功');
                setTimeout(function(){
                    window.location.reload();
                }, 3000);
            } else {
                layer.msg(data.info);
            }
        });
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

/**
 * 省份初始化
 * @return
 */
function initProvincesr(){
    $.ajax({type:'POST', dataType:'jsonp', jsonp:'jsonp_callback',
        url:openApiDomain+'/recycle/area/provinces',
        success:function(data){
            var optionsText = "<option value=''>请选择省份</option>";
            for(i in data){
                optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
            }
            $('#provinceIdr').html(optionsText);
            $('#provinceIdr').val(provinceId);
            $('#cityIdr').val(cityId);
        }
    });
}

/**
 * 省份change
 */
$("#provinceIdr").change(function(){
    var provinceId = $('#provinceIdr').val();
    if(provinceId != ""){
        var optionsText = "<option value=''>请选择城市</option>";
        $.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
            data:{pid:provinceId},
            url:openApiDomain+'/recycle/area/citys',
            success:function(data){
                for(i in data){
                    optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
                }
                $('#cityIdr').html(optionsText);
            }
        });
    }
});

function btnS() {
    var provinceId = $('#provinceIdr').val();
    var cityId = $('#cityIdr').val();
    var cityName = $('#cityIdr option:selected').text();
    $.post('/device/index/getagent', {cityId:cityId,provinceId:provinceId}, function(data){
        var html = '';
        if(data == '' || data == null || data =='underfine'){
            html =  cityName+'没有代理商';
            html = '<option value="">'+html+'</option>';
            $("#typeCode").html(html);
        }else{
            html = '<option value="">--请选择代理商--</option>';
            for ( i = 0; i<data.length;i++){
                html += '<option value="'+data[i].TYPECODE+'">'+data[i].COMPANYNAME+'</option>';
            }
            $("#typeCode").html(html);
        }
    });
}

function doSearch(){
    var index = layer.load('数据加载中...',1);
    grid.query(getParams());
    layer.close(index);

    var provinceId = $('#provinceId').val();
    var cityId = $('#cityId').val();
    var cityName = $('#cityId option:selected').text();
    $.post('/device/index/getagent', {cityId:cityId,provinceId:provinceId}, function(data){
        var html = '';
        if(data == '' || data == null || data =='underfine'){
            html =  cityName+'没有代理商';
            html = '<option value="">'+html+'</option>';
            $("#nowtypeCode").html(html);
        }else{
            html = '<option value="">--请选择转换--</option>';
            for ( i = 0; i<data.length;i++){
                html += '<option value="'+data[i].TYPECODE+'">'+data[i].COMPANYNAME+'</option>';
            }
            $("#nowtypeCode").html(html);
        }
    });
}


function reload(){
    layer.closeAll('iframe');
    grid.reload();
}
