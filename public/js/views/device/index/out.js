var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10
		,height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'70PX',sortable:false}
			,{header: "设备编号", dataIndex: 'DEVICEID', width:'120px', sortable:false}
			,{header: "设备类型", dataIndex: 'TYPENAME', width:'100px',sortable:false}
			,{header: "代理商", dataIndex: 'COMPANYNAME', width:'100px',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATETIME',width:'150px',sortable:false}
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
			},{header: "出库状态", dataIndex: '', width:'70px',sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = '<font color="red">已出库</font>';
                    return returnText;
                }
            }
			,{header: "操作", dataIndex: '', width:'330px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editdetail(\'' + data['DEVICEID'] + '\')">设备维护</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/device/index/outdevice'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
    if(backFlag == 'Y'){
        var params = getParams();
        params['start'] = start;
        params['limit'] = limit;
        params['isrelease'] = 1;
        params['isout'] = 3;
        return params;
    }else{
        return {};
    }
}

function getParams(){
    return {
        deviceid:$('#deviceid').val(),
        createtime1:$('#createtime1').val(),
        createtime2:$('#createtime2').val(),
        companyname:$('#companyname').val(),
        isout:3,
    };
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
 * 设备回库
 */
function deviceBack() {
    if(confirm('确定回库？？？')){
        $.post('/device/index/deviceback/', {}, function(data){
            if(data == 'Y'){
                doSearch();
            }else{
                layer.msg('暂无可回库设备');
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

function exportDevice() {
    window.location.href="/device/index/exportoutstock?isout=3";
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

function doSearch(){
    var index = layer.load('数据加载中...',1);
    grid.query(getParams());
    layer.close(index);
}

function reload(){
    layer.closeAll('iframe');
    grid.reload();
}