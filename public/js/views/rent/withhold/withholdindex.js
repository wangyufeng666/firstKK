var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
            {checkbox : true},
			{header: "No.", dataIndex: 'R', width:'3%',sortable:false} 
			,{header: "创建日期", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
			,{header: "订单编号", dataIndex: 'ORDERNO', width:'12%',sortable:false}
           ,{header: "联系方式", dataIndex: '', width:'13%',sortable:false
            	,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['CONTACT_NAME']+'('+data['CONTACT_MOBILE']+')';
                }
              }
			,{header: "代扣编号", dataIndex: 'RENTTRADENO', width:'15%',sortable:false}
			,{header: "支付编号", dataIndex: 'RENTPAYNO', width:'15%',sortable:false}
			,{header: "扣款开始时间", dataIndex: 'WITH_STARTDATE', width:'10%',sortable:false}
			,{header: "扣款类型", dataIndex: 'PERIODNAME', width:'10%',sortable:false}
			,{header: "扣款金额", dataIndex: 'WITH_PRICE', width:'10%',sortable:false}
			,{header: "支付状态", dataIndex: 'RESULT_NAME', width:'10%',sortable:false}
			,{header:"操作", dataIndex:'', width:'20%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var orderNo = data['ORDERNO'];
					var rentTradeNo = data['RENTTRADENO'];
					var rentPayNo = data['RENTPAYNO'];
					var result_code = data['RESULT_CODE'];
                    var withType = data['WITH_TYPE'];
                    var canOrderSync = data['canOrderSync'];
					var returnText ='<a class="a_link" href="javascript:orderInfo(\''+orderNo+'\')">查看</a>';
					if(withType == '6'){
                        if(result_code == 'ORDER_INPROCESS'){
                            returnText +=' | <a class="a_link" href="javascript:newBrandWithhold(\''+rentTradeNo+'\',\''+data['WITH_PRICE']+'\')">扣款</a>';
                        }
                    }else if(withType == '7'){
                        if(result_code == 'ORDER_INPROCESS' || result_code == 'ORDER_WILLPROCESS'){
                            returnText +=' | <a class="a_link" href="javascript:canFreezeToPay(\''+rentPayNo+'\',\''+data['WITH_PRICE']+'\')">违约扣款</a>';
                        }

                    }else{
                        if(result_code == 'ORDER_INPROCESS' || (withType == '5'&&result_code == 'ORDER_WILLPROCESS')){
                            returnText +=' | <a class="a_link" href="javascript:orderWithhold(\''+rentTradeNo+'\',\''+data['WITH_PRICE']+'\')">扣款</a>';
                        }
                    }
                    if(withType != '7' && (result_code == 'ORDER_INPROCESS' || result_code == 'ORDER_WILLPROCESS')) {
                        returnText += ' | <a class="a_link" href="javascript:userrepayment(\'' + rentTradeNo + '\')">用户自行还款</a>';
                    }
                    if(canOrderSync == '2'){
					    // 可以设置履约
                        returnText += ' | <a class="a_link" href="javascript:orderSync(\'' + rentTradeNo + '\')">履约</a>';
                    }
					return returnText;
				}
			}
        ]
        ,url : '/rent/withhold/withholdpagelist'
 	    ,baseParams:initParams()
	    ,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	var params = getParams();
	params['start'] = start;
	params['limit'] = limit;
	return params;
}

function getParams(){
    return {
    	orderno:$('#orderno').val(),
    	renttradeno:$('#renttradeno').val(),
    	startdate:$('#startdate').val(),
    	enddate:$('#enddate').val(),
    	contactWay:$('#contactWay').val(),
    	result_code:$('#result_code').val(),
    	crstartdate:$('#crstartdate').val(),
    	crenddate:$('#crenddate').val()
    };
}

/**
 * 订单详情
 * @param order_no
 * @return
 */
function orderInfo(order_no){
	window.location.href = "/rent/installment/orderinfo?order_no="+order_no+"&backUrl="+backUrl;
}

/**
 * 代扣
 * @param renttradeNo
 * @param withPrice
 */
function orderWithhold(renttradeNo, withPrice){
	if(confirm('是否确认扣款'+withPrice+'元?')){
		$.post("/rent/withhold/withhold", {renttradeNo:renttradeNo}, function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				alert(data);
			}
		});
	}
}

function newBrandWithhold(rentTradeNo,withPrice){
    if(confirm('是否确认代扣'+withPrice+'元?')){
        $.post("/rent/withhold/newbrandwithhold", {rentTradeNo:rentTradeNo}, function(data){
            if(data['code'] == '1000'){
                alert('冻结转支付成功');
                doSearch();
            }else{
                alert(data['msg']);
            }
        });
    }
}

function doSearch(){
    layer.load(2, {time: 2*1000});
    grid.query(getParams());
    var resultCode = $('#result_code').val();
    if(resultCode === 'ORDER_INPROCESS'){
        $(".batchWithHold").show();
    }else{
        $(".batchWithHold").hide();
    }
}

function download(){
	var param = '';
	param += 'orderno='+$('#orderno').val();
	param += '&renttradeno='+$('#renttradeno').val();
	param += '&startdate=' + $('#startdate').val();
	param += '&enddate=' + $('#enddate').val();
	param += '&contactWay=' + $('#contactWay').val();
	param += '&result_code=' + $('#result_code').val();
	param += '&crstartdate=' + $('#crstartdate').val();
	param += '&crenddate=' + $('#crenddate').val();
	window.location.href = '/rent/withhold/withholdexport?'+param;
	return false; //截取返回false就不会保存网页了
}


function startWithhold(){
    if(confirm('确认扣款')){
        $.post("/rent/withhold/startwithhold", {}, function(data){
            if(data === 'Y'){
                layer.msg('扣款执行成功');
                grid.reload();
            }else{
                layer.msg(data.text);
            }
        });
    }
}

function orderSync(rentTradeNo){
    if(confirm('确认设置用户已履约')){
        $.post("/rent/withhold/rentordersync", {rentTradeNo:rentTradeNo}, function(data){
            if(data.code === '1000'){
                layer.msg('订单同步成功');
                grid.reload();
            }else{
                layer.msg(data.msg);
            }
        });
    }
}


function batchWithHold(){
    var sr = grid.getSelections();
    var result = [];
    var index = 0;
    var count = sr.length;
    console.log("count:"+count);
    if(sr.length>0){
        for(var i = 0 ; i < sr.length; i++){
        	if(sr[i].RESULT_CODE !=='ORDER_INPROCESS'){
        		continue;
			}
            var renttradeNo = sr[i].RENTTRADENO;
            var orderNo = sr[i].ORDERNO;
            var periodName = sr[i].PERIODNAME;
            var params = {renttradeNo:renttradeNo};
            $.ajax({
                type: 'POST',
                url: '/rent/withhold/withhold',
                data: params,
                success: function(data){
                    var orderInfo = {'orderNo':orderNo,"periodName":periodName,"message":"失败"};
                    index++;
                    if (data === 'Y') {
                        orderInfo.message = "成功";
                    }
                    result.push(orderInfo);
                    if (index >= count) {
                        showResult(result);
                    }
                }
            });
        }
    }
}

function canFreezeToPay(rentPayNo,withPrice){
    layer.confirm('是否确认违约扣款:'+withPrice+'元?', function(index){
        $.post('/rent/installment/handfreezetopay', {rentPayNo:rentPayNo}, function(data){
            if(data['code'] == '1000'){
                layer.msg("冻结转支付成功");
                setTimeout(function(){
                    window.location.reload();//刷新
                },1000);
            }else{
                layer.msg(data['msg']);
            }
        });
        layer.close(index);
    });
}

function showResult(params){
    var content ="<table border='1' align='center'><tr><th style='width:180px;'>订单编号</th><th style='width:180px;'>扣款类型</th><th style='width:80px;'>处理结果</th></tr>";
    for(var i = 0 ; i < params.length; i++){
        content += "<tr><td>"+params[i].orderNo+"</td><td>"+params[i].periodName+"</td><td>"+params[i].message+"</td></tr>";
    }
    content += "</table>";
    var index = layer.alert(content,function () {
        console.log('刷新');
        reload();
    });
}

function userrepayment(renttradeNo){
    layer.open({
        type:2,
        title:'用户自行还款',
        shadeClose:false,
        shade:0.8,
        content:'/rent/withhold/repayment?rentTradeNo='+renttradeNo,
        area:['600px','500px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function reload(){
    layer.closeAll();
    grid.reload();
}