var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:500
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"优惠券名称", dataIndex:'COUPONNAME', width:'10rem', sortable:false}
		   ,{header:"来源", dataIndex:'sourceCodeName', width:'8rem', sortable:false}
            ,{header:"类型编号", dataIndex:'TYPECODE', width:'15rem', sortable:false}
           ,{header: "是否满减", dataIndex: 'ISLIMIT', width:'4rem',sortable:false
               ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = '未知';
					 if(value == 1){
                         returnText = '是'
					 }else if(value == 2){
                         returnText = '否'
					 }
					 return returnText;
               }
            }
           	,{header: "满减金额", dataIndex: 'LIMITED_AMOUNT', width:'5rem',sortable:false}
            ,{header:"优惠金额", dataIndex:'DISCOUNT', width:'4rem', sortable:false}
            ,{header:"有效期（天）", dataIndex:'PERIOD', width:'5.5rem', sortable:false}
            ,{header: "限制类型", dataIndex: 'TYPE', width:'4rem',sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = '未知';
                    if(value == 1){
                        returnText = '无限制'
                    }else if(value == 2){
                        returnText = '指定品类'
                    }else if(value == 3){
                        returnText = '指定商品'
                    }else if(value == 4){
                        returnText = '指定配置'
                    }
                    return returnText;
                }
            }
            ,{header: "指定类型值", dataIndex: 'TYPE', width:'15rem',sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = '';
            		if(value == 1){

					}else if(value == 2){
                        returnText = '';
                        var productType = data['PRODUCTTYPE'];
					}else if(value == 3){
                        returnText = data['PRODUCTID'];
					}else if(value == 4){
                        returnText = data['MODELID'];
					}
                    return returnText;
                }
            }
            ,{header:"商品名称", dataIndex:'productName', width:'8rem', sortable:false}
            ,{header: "抵扣方式", dataIndex: 'MODES', width:'5rem',sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = '未知';
                    if(value == 1){
                        returnText = '总租金'
                    }else if(value == 2){
                        returnText = '首月租金'
                    }else if(value == 3){
                        returnText = '保障服务费'
                    }
                    return returnText;
                }
            }
		   ,{header:"开始时间", dataIndex:'STARTTIME', width:'8rem', sortable:false}
		   ,{header:"结束时间", dataIndex:'ENDTIME', width:'8rem', sortable:false}
            ,{header: "状态", dataIndex: 'STATUS', width:'2.8rem',sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                    var returnText = '未知';
                    if(value == 1){
                        returnText = '<span style="color:blue">启用</span>'
                    }else if(value == 2){
                        returnText = '<span style="color:red">禁用</span>'
                    }
                    return returnText;
                }
            }
            ,{header:"发放数量", dataIndex:'sendCouponNum', width:'5rem', sortable:false}
            ,{header:"使用数量", dataIndex:'useCouponNum', width:'5rem', sortable:false}
           ,{header: "操作", dataIndex: '', width:'15%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
                    var returnText ='';
                    var status = data['STATUS'];
                    var typeCode = data['TYPECODE'];
                    if(status === '1'){
                        returnText+=' <a href="javascript:void(0);" onclick="changeStatus(\''+typeCode+'\',\'禁用\')" class="a_link" style="color:red;">禁用</a>';
                    }else if(status === '2'){
                        returnText+=' <a href="javascript:void(0);" onclick="changeStatus(\''+typeCode+'\',\'启用\')" class="a_link">启用</a>';
                    }
                    returnText+=' | <a href="javascript:void(0);" onclick="editCoupon(\''+typeCode+'\')" class="a_link">修改</a>';
                    // 	var order_no = data['ORDER_NO'];
				// 	var order_source = data['ORDER_SOURCE'];
				// 	var returnText ='<a href="javascript:void(0);" title="'+order_no+'" onclick="orderInfo(\''+order_no+'\')" class="a_link">查看</a>';
                //
				// 	if(status === '1'){//未付款终止
                 //        returnText+=' | <a href="javascript:void(0);" onclick="confirmOrder(\''+order_no+'\')" class="a_link">确认</a>';
				// 		returnText+=' | <a href="javascript:void(0);" onclick="stopOrder(\''+order_no+'\')" class="a_link">终止</a>';
				// 	}
					return returnText;
				}
			}       
		]
       ,url : '/rent/coupon/modellist'
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

function getParams(){
    return {
        typeCode:$('#typeCode').val(),
        couponName:$('#couponName').val(),
        type:$('#type').val(),
        modes:$('#modes').val(),
        isLimit:$('#isLimit').val(),
        status:$('#status').val(),
        sourceCode:$('#sourceCode').val(),
        productId:$('#productId').val()
    };
}

function doSearch(){
    var index = layer.load(2, {time: 3*1000});
    grid.query(getParams());
    layer.close(index);
}

function closeView(){
    layer.closeAll();
}

function reload(){
    layer.closeAll();
    grid.reload();
}

function addModel(){
    layer.open({
        type:2,
        title:'添加优惠券类型',
        shadeClose:false,
        shade:0.8,
        content:'/rent/coupon/addmodelpage',
        area:['600px' , '700px'],
        close:function(index){
            layer.close(index);
        }
    });
}

function changeStatus(typeCode,msg){
    msg = '确认'+ msg;
    layer.confirm(msg,function (data) {
        $.ajax({
            type: 'POST',
            url: '/rent/coupon/changemodelstatus',
            data: {'typeCode':typeCode},
            success: function (data) {
                if (data.code) {
                    layer.msg('更新成功');
                    reload();
                } else {
                    layer.msg(data.text);
                }
            },
            error: function (data) {
                layer.msg('请求失败');
            }
        });
    })

}


function editCoupon(typeCode){
    layer.open({
        type:2,
        title:'修改优惠券类型',
        shadeClose:false,
        shade:0.8,
        content:'/rent/coupon/editcouponmodelpage?typeCode='+typeCode,
        area:['600px' , '700px'],
        close:function(index){
            layer.close(index);
        }
    });
}

// /**
//  * 订单详情
//  * @param order_no
//  * @return
//  */
// function orderInfo(order_no){
// 	window.location.href = "/rent/businessrent/orderdetail?orderNo="+order_no+"&backUrl="+backUrl;
// }
//


