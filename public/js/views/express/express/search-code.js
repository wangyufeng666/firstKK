var zzyRentGrid;//租着用租赁grid
var gomeRentGrid;//国美租赁grid
var initialcheckGrid;//回收初检grid
var offlineGrid;//线下订单grid
var layerIndex = 0;
var code = '';
$().ready(function(){
    //国美租赁归还分页
    gomeRentGrid = $('#gomeRentGrid').grid({
        pageSize:3,
        height:75
        ,cm:[
            {header:"", dataIndex:'R', width:'40PX',sortable:false}
            ,{header:"运单号", dataIndex:'EXPRESSNUM', width:'100px',sortable:false}
            ,{header:"下单日期", dataIndex:'ORDERDATE', width:'100px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var array = [];
                    array.push("下单时间："+value);
                    array.push("订单编号："+data['ORDERNO']);
                    return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
                }
            }
            ,{header:"商品名称", dataIndex:'PRODUCT_NAME', width:'160px', sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    return data['BRAND_NAME']+' '+value;
                }
            }
            ,{header:"商品串号", dataIndex:'IMEICODE', width:'120px',sortable:false}
            ,{header:"联系方式", dataIndex:'CONTACTS', width:'140px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText = value+'('+data['CONTACTWAY']+')';
                    return returnText;
                }
            }
            ,{header:"门店名称", dataIndex:'PARTNERNAME', width:'120px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var array = [];
                    array.push("订单编号："+data['ORDERNO']);
                    array.push("门店编码："+data['PARTNERCODE']);
                    array.push("门店名称："+value);
                    array.push("店长信息："+data['P_CONTACTS']+'（ '+data['P_MOBILE']+' ）');
                    array.push("归还方式："+(data['VISITFLAG'] == '1' ? '上门' : '快递'));
                    return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
                }
            }
            ,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
            ,{header:"租赁模式", dataIndex:'FROMCODE', width:'80px',sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(value == 'ZZY'){
                        return '有抵押模式';
                    }else if(value = 'GOME'){
                        return '无抵押模式';
                    }
                }
            }
            ,{header:"回收单", dataIndex:'RECYORDERNO', width:'200px',sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(value){
                        return '<a href="javascript:recyOrderInfo(\''+value+'\')" class="a_link" title="'+value+'">'+value+'</a>';
                    }
                }
            }
            ,{header:"操作", dataIndex:'ORDERNO', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText = '<a href="javascript:orderInfo(\''+value+'\')" class="a_link">查看</a>';
                    if(data['OPERSTATUS'] == 1){
                        returnText += ' | <a href="javascript:gomeOrderReceiving(\''+value+'\')" class="a_link">订单签收</a>';
                    }else {
                        returnText += ' | <a href="javascript:gomeOrderReturn(\''+value+'\')" class="a_link">鉴定</a>';
                    }
                    return returnText;
                }
            }
        ]
        ,url:'/rentrecy/rentorder/gomepagelist'
        ,baseParams:initParams()
        ,pageSizeList:[15,30,50]
        ,afterRender:function(e, grid){
//			if(grid.data.totalCount == 0){
//             zzyRentGrid.query(getParams());
//			}
        }
    });

    //租着用租赁归还列表
    zzyRentGrid = $('#zzyRentGrid').grid({
        pageSize:3,
        height:75,
        cm:[
            {header:"NO.", dataIndex:'R', width:'40px', sortable:false}

            ,{header:"运单号", dataIndex:'EXPRESSNUM', width:'100px',sortable:false}
            ,{header:"下单时间", dataIndex:'CREATE_DATE', width:'100px', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var array = [];
                    array.push("下单时间："+value);
                    array.push("订单编号："+data['ORDER_NO']);
                    array.push("订单来源："+data['ORDER_SOURCENAME']);
                    array.push("新机价格："+data['NEW_PRODUCT_PRICE']);
                    array.push("订单租金："+data['TOTAL_PRICE']);
                    return '<span title="'+array.join("\n")+'" ondblclick="showRemark(\''+array.join('<br/>')+'\')">'+value+'</span>';
                }
            }
            ,{header:"商品名称", dataIndex:'PRODUCT_NAME', width:'160px', sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    return value+' '+data['MODEL_NAME'];
                }
            }
            ,{header:"商品串号", dataIndex:'IMEI', width:'120px',sortable:false}
            ,{header: "联系方式", dataIndex: 'CONTACT_NAME', width:'140px',sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    return value+'('+data['CONTACT_MOBILE']+')';
                }
            }
            ,{header:"租赁日期", dataIndex:'TOREDATE', width:'160px', sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    var exceedFlag = data['EXCEEDFLAG'];
                    var backstatus = data['BACKSTATUS'];
                    var retrunText = data['CONTRACTS_DATE'];

                    if(exceedFlag == 'Y' && backstatus == '1'){
                        retrunText = retrunText+' ~ <span style="color:red;font-weight: bold;">'+value+'</span>';
                    }
                    return retrunText;
                }
            }
            ,{header:"订单状态", dataIndex:'STATUS_NAME', width:'70px', sortable:false}
            ,{header:"结算方式", dataIndex:'PAYTYPE', width:'80px', sortable:false,
                renderer : function(value, data, rowIndex, colIndex, metadata){
                    return value == '1' ? '乐百分' : value == '2' ? '花呗' : '支付宝';
                }
            }
            ,{header:"归还状态", dataIndex:'BACKSTATUS_NAME', width:'80px', sortable:false}
            ,{header:"催还短信", dataIndex:'SMSHITCOUNT', width:'80px', sortable:false}
            ,{header:"操作状态", dataIndex:'OPERASTATUSNAME', width:'80px', sortable:false}
            ,{header:"操作", dataIndex: 'ORDER_NO', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='<a href="javascript:zzyRentOrderInfo(\''+value+'\')" class="a_link">查看</a>';

                    if( data['OPERSTATUS'] == ""  ){
                        returnText += ' | <a href="javascript:createtRecyOrder(\''+value+'\')" class="a_link">订单签收</a>';
                    }else if (data['OPERSTATUS'] == 1 ){
                        returnText += ' | <a href="javascript:gomeOrderReceiving(\''+data['ORDERNO']+'\')" class="a_link">订单签收</a>';

                    }else{
                        returnText += ' | <a href="javascript:zzyOrderReturn(\''+value+'\')" class="a_link">鉴定</a>';
                    }
                    return returnText;
                }
            }
        ]
        ,url:'/rentrecy/rentorder/zzypagelist'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
        ,afterRender:function(e, grid1){
//			if(grid.data.totalCount == 0){
//             initialcheck.query(getParams());
//			}
        }
    });

    //检测单列表
    initialcheckGrid = $('#grid').grid({
        pageSize:3,
        height:75
        ,cm:[
            {header:"No.", dataIndex:'R', width:'35PX',sortable:false}
            ,{header:"运单号", dataIndex:'MAILNO', width:'100px',sortable:false}
            ,{header:"订单日期", dataIndex:'STRORDERDATE', width:'80px',sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    var orderNo = data['ORDERNO'];
                    var merName = data['PNAME']+' '+data['MERNAME'];
                    var orderPrice = data['ORDERPRICE']+'——'+data['SETTLEPRICE'];
                    return '<span title="'+orderNo+'" ondblclick="showRemark(\''+orderNo+'\', \''+merName+'\', \''+orderPrice+'\')">'+data['STRORDERDATE']+'</span>';
                }
            }
            ,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
            ,{header:"器材名称", dataIndex:'MERNAME',sortable:false,width:'180px'
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    return data['PNAME']+' '+data['MERNAME'];
                }
            }
            ,{header:"联系方式", dataIndex:'', width:'160px',sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    return data['LIANXIDH']+'('+data['LIANXIREN']+')';
                }
            }
            ,{header:"联系地址", dataIndex:'DIZHI', width:'140px',sortable:false}
            ,{header:"订单来源", dataIndex:'', width:'100px',sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    var channel ='';
                    if(data['ORDERTYPE']=='71'){
                        if(data['CHANNEL']=='idle'){
                            channel = '闲鱼';
                        }else if(data['CHANNEL']=='tmall'){
                            channel = '天猫';
                        }else if(data['CHANNEL']=='alipay'){
                            channel = '支付宝';
                        }else if(data['CHANNEL']=='taobao'){
                            channel = '淘宝';
                        }else if(data['CHANNEL']=='tmall-service'){
                            channel = '天猫以旧换新';
                        }
                    }
                    if(channel){
                        return data['SOURCENAME']+'('+channel+')';
                    }else{
                        return data['SOURCENAME'];
                    }
                }
            }
            ,{header:"订单价格", dataIndex:'ORDERPRICE', width:'70px',sortable:false
                ,renderer:function(value, data, rowIndex, colIndex, metadata){
                    if(data['SETTLEPRICE']){
                        return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
                    }else{
                        return data['ORDERPRICE'];
                    }
                }
            }
            ,{header:"交易方式", dataIndex:'TRADETYPENAME', width:'70px',sortable:false}
            ,{header:"订单状态", dataIndex:'STATUSNAME', width:'70px',sortable:false}
            ,{header:"操作", dataIndex:'', width:'130px', sortable:false,
                renderer:function(value, data, rowIndex, colIndex, metadata){
                    var orderNo = data['ORDERNO'];
                    var status = data['ORDERSTATUS']+'';

                    var returnText = '';
                    if(status == '1' || status =='6' || status == '7'){
                        returnText = '<a title="'+orderNo+'" href="javascript:takeGoods(\''+orderNo+'\',\''+status+'\')" class="a_link">收货</a>';
                    }
                    return returnText;
                }
            }
        ]
        ,url:'/order/initialcheck/pagelist'
        ,baseParams:getMobileParams()
        ,afterRender:function(e, grid){
            $("#mailNo").focus()
        }
    });
    
    //线下订单列表
    offlineGrid = $('#offlineGrid').grid({
		pageSize:3,
		height:75
		,cm:[
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false}
			,{header: "订单日期", dataIndex: 'STRORDERDATE', width:'80px',sortable:false}
			,{header: "商品类型", dataIndex: 'MERTYPENAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PNAME']+' '+data['MERNAME'];
				}
			}
			,{header: "所属合作商", dataIndex: 'HNAME', width:'80px',sortable:false}
			,{header: "地推人员", dataIndex: 'NAME', width:'80px',sortable:false}
			,{header: "联系方式", dataIndex: '', width:'130px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['LIANXIDH']+'('+data['LIANXIREN']+')';
				}
			}
			,{header: "联系地址", dataIndex: 'DIZHI', width:'140px',sortable:false}
			,{header: "订单来源", dataIndex: 'SOURCENAME', width:'100px',sortable:false}
			,{header: "结算类型", dataIndex: 'EVENTNAME', width:'80px',sortable:false}
			,{header: "订单价格", dataIndex: 'ORDERPRICE', width:'70px',sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['SETTLEPRICE']){
						return data['ORDERPRICE']+'<font color="green">('+data['SETTLEPRICE']+')</font>';
					}else{
						return data['ORDERPRICE'];
					}
				}
			}
			,{header: "交易方式", dataIndex: 'TRADETYPENAME', width:'70px',sortable:false}
			,{header: "订单状态", dataIndex: 'STATUSNAME', width:'70px',sortable:false}
			,{header: "操作", dataIndex: '', width:'130px', sortable:false, 
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var status = data['ORDERSTATUS']+'';
					var merType = data['MERTYPE'];
					var payFlag = data['PAYFLAG'];
					var returnText ='<a href="javascript:void(0);" title="'+orderNo+'" onclick="offlineOrderInfo(\''+orderNo+'\')" class="a_link">查看</a>';

					returnText += ' | <a href="javascript:void(0);" onclick="orderInspection(\''+orderNo+'\',\''+payFlag+'\')" class="a_link">检测</a>';



					return returnText;
				}
			}
		]
		,url:'/offline/inspection/replaypagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(){
			layer.close(layerIndex);
		}
	});
});

//国美租赁订单归还
function gomeOrderReturn(orderNo){
    layer.open({
        type:2,
        title:'租赁订单归还',
        shadeClose:false,
        shade:0.8,
        content:"/rentrecy/recyorder/orderidentify?rentRecyOrderNo="+orderNo+'&layer=Y',
        area:['100%', '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

//租着用租赁订单归还
function zzyOrderReturn(rentOrderNo){
    layer.open({
        type:2,
        title:'租赁订单归还',
        shadeClose:false,
        shade:0.8,
        content:"/rentrecy/recyorder/zzyorderreturn?rentOrderNo="+rentOrderNo+'&layer=Y',
        area:['100%', '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

//租着用租赁订单详情
function zzyRentOrderInfo(orderNo){
    layer.open({
        type:2,
        title:'租着用租赁订单详情',
        shadeClose:false,
        shade:0.8,
        content:"/rent/installment/orderinfo?order_no="+orderNo+'&layer=Y',
        area:['100%', '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 回收订单详情
 * @param recyOrderNo
 * @returns
 */
function recyOrderInfo(recyOrderNo){
    layer.open({
        type:2,
        title:'回收订单详情',
        shadeClose:false,
        shade:0.8,
        content:'/order/order/orderinfo?orderNo='+recyOrderNo+'&layer=Y',
        area:['100%', '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(data){
    layer.close(layerIndex);
    layerIndex = layer.open({
        type:1, shade:false, title:false, area:['650px', 'auto'],
        content:'<div class="layer_notice">'+data+'</div>'
    });
}

/**
 * 订单详情
 * @return
 */
function orderInfo(orderNo){
    layer.open({
        type:2,
        title:'订单详情',
        shadeClose:false,
        shade:0.8,
        content:'/rentrecy/order/orderinfo?orderNo='+orderNo,
        area:['100%', '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 订单详情
 * @return
 */
function orderImgs(orderNo){
    layer.open({
        type:2,
        title:'订单拍照留档',
        shadeClose:false,
        shade:0.8,
        content:'/rentrecy/order/orderimgs?orderNo='+orderNo,
        area:['100%', '100%'],
        close:function(index){
            layer.close(index);
        }
    });
}


function gomeOrderReceiving(orderNo) {

    if(confirm('是否进行收货？')){
        $.post('/rentrecy/order/receive', { orderNo:orderNo}, function(data){
            if(data == 'Y'){
                layer.msg('收货完成！');
                gomeRentGrid.reload();
                zzyRentGrid.reload();
            }else {
                layer.msg('收货失败');
            }
        });
    }
    
}


function createtRecyOrder(orderNo) {
    if(confirm('是否进行收货？')){
        $.post('/rentrecy/recyorder/createrecyorder', { rentOrderNo:orderNo}, function(data){
            if(data['code'] == 'Y'){
                layer.msg('收货完成！');
                gomeRentGrid.reload();
                zzyRentGrid.reload();
            }else {
                layer.msg(data['msg']);
            }
        });
    }
    
}

/**
 * 修改规则
 * @param ruleId
 * @return
 */
function videoInspect(orderNo){
    layer.open({
        type:2,
        title:'修改鉴定规则',
        shadeClose:false,
        shade:0.8,
        content:'/rentrecy/order/videoinspect?orderNo='+orderNo,
        area:['90%','90%'],
        close:function(index){
            layer.close(index);
        }
    });
}

function inwareSmsRemind(orderNo, mobile){
    if(confirm('是否进行入库短信提醒？')){
        $.post('/rentrecy/order/smsremind', {type:'2', mobile:mobile, orderNo:orderNo}, function(data){
            if(data == 'Y'){
                layer.msg('催入库短信已发送');
            }
        });
    }
}

function getParams(){
    var params = {
        initFlag:$('#initFlag').val(),
        contactWay:$('#contactWay').val(),
        imeiCode:$('#imeiCode').val(),
        mailNo:$('#mailNo').val(),
    };

    if(params.contactWay != '' || params.imeiCode != '' || params.mailNo != ''){
        params.initFlag = '';
    }
    return params;
}


function getMobileParams(){
    var params = {
        initFlag:$('#initFlag').val(),
        mobile:$('#contactWay').val(),
        imeiCode:$('#imeiCode').val(),
        mailNo:$('#mailNo').val(),
    };

    if(params.mobile != '' || params.imeiCode != '' || params.mailNo != ''){
        params.initFlag = '';
    }
    return params;
}


function initParams(){
    return getParams();
}

function doSearch(){
    gomeRentGrid.query(getParams());
    zzyRentGrid.query(getParams());
    initialcheckGrid.query(getParams());
    offlineGrid.query(getParams());
    this.code =  $('#mailNo').val();
    if($("#mailNo").val() != ''){

        getCodeMsg();
    }

}

function reload(){
    layer.closeAll('iframe');
    gomeRentGrid.reload();
}

function closeLayer(){
    layer.closeAll('iframe');
}

/**
 * 展示备注
 * @param orderNo
 */
function showRemark(orderNo, merName, orderPrice){
    layer.close(layerIndex);
    $.post('/recycle/order/jsonremark',{orderNo:orderNo}, function(data){
        layerIndex = layer.open({
            type:1, shade:false, title:false, area:['650px', 'auto'],
            content:'<div class="layer_notice">订单编码： '+orderNo+'<br/>商品名称：'+merName+'<br/>订单金额：'+orderPrice+'<br/>'+data+'</div>'
        });
    });
}

/**
 * 收货
 * @param orderNo
 */
function takeGoods(orderNo,status){
    var desc = ''
    if(confirm('是否确认收货？')){
        if(status == 1){
            desc = '待客户发货';
            initialcheck(orderNo,desc);
            if(flag){
                desc = '客户已发货，待收货';
                initialcheck(orderNo,desc);
                if(flag){
                    saveCheck(orderNo)
                }
            }
        }else if(status == 6){
            desc = '客户已发货，待收货';
            initialcheck(orderNo,desc);
            if(flag){
                saveCheck(orderNo)
            }
        }else{
            saveCheck(orderNo)
        }
    }
}

/**
 * 订单状态操作
 * @param orderNo
 */
function initialcheck(orderNo,desc){

    $.ajaxSettings.async = false;
    $.post('/order/order/saveoperation', {orderNo:orderNo, operDesc:desc, logLevel:4}, function(data){
        if(data == 'Y'){
            flag = true;
            return true;
        }else{
            alert('操作错误：'+data);
            flag = true;
            return false;
        }
    });
    $.ajaxSettings.async = true;
}

/**
 * 保存初检信息
 * @param orderNo
 */
function saveCheck(orderNo){
    layer.open({
        type:2,
        title:'订单状态修改',
        content:'/order/initialcheck/saveinitialcheck?orderNo='+orderNo,
        shadeClose:false,
        shade:0.8,
        area:['510px' , '700px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 线下订单详情
 * @returns
 */
function offlineOrderInfo(orderNo){
	layer.open({
		type:2,
		title:'订单复检',
		content: "/offline/inspection/orderinfo?orderNo="+orderNo,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 检测操作
 * @param orderId
 * @return
 */
function orderInspection(orderNo, payFlag){
	if(payFlag == 'N') {
		layer.alert('无付款信息，请联系客服人员确定！');
		return false;
	}
	layer.open({
		type:2,
		title:'订单复检',
		content: "/offline/inspection/orderinspection?orderNo="+orderNo,
		area:['95%' , '95%'],
		close:function(index){
			layer.close(index);
		}
	});
}

function keypress(e){
    if(e.which == 13) {
        doSearch();
        $('#mailNo').val('')
    }
}

function getCodeMsg()
{
    $.post('/express/express/get-express-by-id', {expressCompany:this.code}, function(data){
        if(data.code == 'Y'){
            layer.alert(data.msg, {
                time: 0 //不自动关闭
                ,btn: ['确认已操作', '忽略']
                ,icon: 6
                ,title: false //不显示标题
                ,yes: function(index){
                    layer.close(index);
                    $.post('/express/express/upexpress', {expressnumber:data.expressnumber}, function(data1){
                        if(data1 == 'Y'){
                            layer.msg('处理成功', {
                                icon: 6
                            })
                        }else {
                            layer.msg('处理失败', {
                                icon: 5
                            })
                        }

                    });

                }
            });
        }else if(data.code == 'D'){
            layer.msg(data.msg, {
                icon: 6,
                time: 0 //不自动关闭
                ,btn: ['知道了']
            })
        }
    });

}


document.onkeypress = keypress;

