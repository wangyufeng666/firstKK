var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize :10
		,height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'30PX',sortable:false}
			,{header: "设备编号", dataIndex: '', width:'120px', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var deviceId = data['DEVICEID'];
					return '<a href="javascript:void(0);" onclick="showLog(\''+deviceId+'\')" class="a_link">'+deviceId+'</a>';
				}
			}
			,{header: "二维码编码", dataIndex: 'QRCODE', width:'80px', sortable:false}
			,{header: "设备类型", dataIndex: 'TYPENAME', width:'80px',sortable:false}
			,{header: "设备地址", dataIndex: 'ADDRESS',width:'100px',sortable:false}
			,{header: "经度,纬度", dataIndex: 'LOCATION',width:'100px',sortable:false}
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
			,{header: "操作", dataIndex: '', width:'330px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="orderinfo(\''+data['DEVICEID']+'\')">订单详情</a>';
                    if(data['STATE'] == 'ok') {
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="editdetail(\'' + data['DEVICEID'] + '\')">设备维护</a>';
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="editdevice(\'' + data['DEVICEID'] + '\',\'error\')">报修</a>'
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="editdevice(\'' + data['DEVICEID'] + '\',\'offline\')">离线</a>'
                    } else {
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="editdevice(\'' + data['DEVICEID'] + '\',\'ok\')">恢复</a>'
                    }
				  	if(data['ISRELEASE'] == 2){
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="unbind(\'' + data['DEVICEID'] + '\')">解绑</a>'
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="agentChange(\'' + data['DEVICEID'] + '\')">转移代理</a>'
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="updateInfo(\'' + data['DEVICEID'] + '\')">修改经纬度</a>'
				  	} else {
                        returnText += ' | <a class="a_link" href="javascript:void(0);" onclick="del(\''+data['DEVICEID']+'\')">删除</a>';
                    }
				  	return returnText;
				}
           	}
        ]
        ,url : '/device/index/pagelist'
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
        cityId:$('#cityId').val(),
    };
}

/**
 * 展示备注
 * @param orderNo
 */
function showLog(deviceId){
	var url = "/device/index/device2?deviceId="+deviceId;
	layer.open({
		type:2,
		title:'设备运行统计',
		content:url,
		area:['40%', '60%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除
 */
function del(deviceid){
    if(confirm('确定删除选中的设备？？？')){
        $.post('/device/index/del/', {deviceid:deviceid}, function(data){
            if(data == 'Y'){
                doSearch();
            } else if(data == 'HAVEORDERS') {
                alert("检测到该设备已产生订单，删除失败！");
            }
        });
    }
}

/**
 * 解绑
 */
function unbind(deviceid){
    if(confirm('确定解除该设备与商户的绑定？？？')){
        $.post('/device/index/unbind/', {deviceid:deviceid}, function(data){
            if(data == 'Y'){
                doSearch();
            }
        });
    }
}

/**
 * 修改设备状态
 */
function editdevice(deviceid,state){
    if(confirm('确定更改此设备状态？？？')){
        $.post('/device/index/editdevice/', {deviceid:deviceid,state:state}, function(data){
            if(data == 'Y'){
                doSearch();
            }
        });
    }
}

/**
 * 查看设备订单详情
 * @param deviceid
 * @return
 */
function orderinfo(deviceid) {
    layer.open({
        type: 2,
        title: '设备订单列表',
        content: '/device/index/order?deviceid=' + deviceid,
        area: ['90%', '70%']
    });
}

/**
 * 查看修改设备信息
 * @param deviceid
 * @return
 */
function editdetail(deviceid) {
    layer.open({
        type: 2,
        title: '设备维护',
        content: '/device/index/editdetail?deviceid=' + deviceid,
        area: ['50%', '90%']
    });
}

/**
 * 添加设备信息
 * @param deviceid
 * @return
 */
function addDevice() {
    layer.open({
        type: 2,
        title: '添加设备',
        content: '/device/index/adddevice',
        area: ['50%', '75%']
    });
}

function agentChange(deviceid) {
    if(confirm('请谨慎操作，该操作会导致设备无法下单，敬请悉知！')) {
        layer.open({
            type: 2,
            title: '代理转移',
            content: '/device/index/agentchange?deviceid=' + deviceid,
            area: ['50%', '50%']
        });
    }
}

/**
 * 设备出库
 * @param deviceid
 * @return
 */
function deviceOut() {
    layer.open({
        type: 2,
        title: '设备出库',
        content: '/device/index/deviceout',
        area: ['50%', '75%']
    });
}

/**
 * 修改经纬度信息
 * @returns
 */
function updateInfo(deviceId){
	layer.open({
		title:'修改经纬度'
		,area:['300px','200px']
		,content:'<div><input type="text" name="info" id="info"><br/><sapn><font color="red">例子:111.221(经度)#11.2556(纬度)</font></span></div>'
		,yes: function(index, layero){
			var info = $('#info').val();
			if(deviceId && info){
				var flag = info.indexOf("#");
				if(flag > 0){
					$.post('/device/index/updateinfo',{deviceId:deviceId,info:info},function(data){
						if(data == 'Y'){
							layer.msg('修改成功');
							layer.close(index); //如果设定了yes回调，需进行手工关闭
							doSearch();
						}else{
							layer.msg('修改失败，重新操作');
						}
					})
				}else{
					layer.msg('请输入正确格式的经纬度');
				}
			}else{
				layer.msg('请输入经纬度，以"#"分割');
			}
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

function doSearch(){
    var index = layer.load('数据加载中...',1);
    grid.query(getParams());
    layer.close(index);
}

function reload(){
    layer.closeAll('iframe');
    grid.reload();
}

function doExport() {
    var deviceid = $('#deviceid').val();
    var createtime1 = $('#createtime1').val();
    var createtime2 = $('#createtime2').val();
    var bindtime1 =$('#bindtime1').val();
    var bindtime2 = $('#bindtime2').val();
    var partnername = $('#partnername').val();
    var agentname = $('#agentname').val();
   window.location.href = "/device/index/exportdevice?deviceid="+deviceid+"&createtime1="+createtime1+
           "&createtime2="+createtime2+"&bindtime1="+bindtime1+"&bindtime2="+bindtime2+"&partnername="+partnername+
           "&agentname="+agentname;
}