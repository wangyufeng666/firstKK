var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250,
		cm : [
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
			,{header: "旧机单号", dataIndex: 'ORDERNO', width:'15%',sortable:false}
			,{header: "商品编码", dataIndex: 'MERUNIQUECODE', width:'15%',sortable:false}
			,{header: "商品分类", dataIndex: 'CATEGORYNAME', width:'10%',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',width:'25%',sortable:false}
			,{header: "旧机成本", dataIndex: 'RECYPRICE',width:'10%',sortable:false}
			,{header: "销售价格", dataIndex: 'SALEPRICE',width:'10%',sortable:false}
			,{header: "器材属性", dataIndex: 'MERFLAGNAME', width:'10%',sortable:false}
			,{header: "操作", dataIndex: '', width:'10%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var merCode = data['MERUNIQUECODE'];
					var status = $("#status").val();
					var returnText ='<a href="javascript:void(0);" onclick="attrInfo(\''+data['MERATTR']+'\')" class="a_link">查看</a>';
					if(status == '1'){
						returnText += ' | <a href="javascript:void(0);" onclick="delmer(\''+data['MERUNIQUECODE']+'\')" class="a_link">删除</a>';
						returnText += ' | <a href="javascript:void(0);" onclick="changePrice(\''+data['MERUNIQUECODE']+'\',\''+data['SALEPRICE']+'\')" class="a_link">调价</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/sale/salebill/merpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
		,afterRender:function(e, grid){
			$("#totalsalepric").html(grid.data.totalPrice['TOTALSALEPRIC']);
			$("#totalrecyprice").html(grid.data.totalPrice['TOTALRECYPRICE']);
		}
	});
});

function initParams(){
		var params = getParams();
		params['start'] = 0;
		params['limit'] = 10;
		params['saleNo'] = $('#saleNo').val();
		params['presaleNo'] = $('#presaleNo').val();
		return params;
}

function attrInfo(merattr){
	var reg = new RegExp(";","g");//g,表示全部替换。
	var newmerattr = merattr.replace(reg,"\n");
	alert(newmerattr);
}

function getParams(){
    return {
        merName:$('#merName').val(),
        merCode:$('#merCode').val(),
        merFlag:$('#merFlag').val(),
        orderNo:$('#orderNo').val()
    };
}

/**
 *删除商品
 * @param merCode
 * @return
 */
function delmer(merCode){
	if(confirm('是否确认终止销售此商品？')){
		$.post("/sale/salebill/delmer", {merCode:merCode,saleNo:$("#saleNo").val()}, function(data){
			if(data == 'Y'){
				alert('终止成功');
				doSearch();
			}
		});
	}
}

/**
 * 调价
 * @param merCode
 * @returns
 */
function changePrice(merCode,saleprice){
	$('#merPrice').val(saleprice);
	$('#changemerCode').val(merCode);
	$('.changePrice').show();
}

function num(obj){
	obj.value = obj.value.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
	obj.value = obj.value.replace(/^\./g,""); //验证第一个字符是数字
	obj.value = obj.value.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
	obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
	obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
}

/**
 *调价
 * @param merCode
 * @return
 */
function savePrice(){
	var price = $('#merPrice').val();
	var changemerCode = $('#changemerCode').val();
	if(price){
		if(confirm('是否确认调整选中商品价格为'+price+'元？')){
			$.post("/sale/salebill/changeprice", {merCode:changemerCode,saleNo:$("#saleNo").val(),merPrice:price}, function(data){
				if(data == 'Y'){
					alert('修改成功');
					$('.changePrice').hide();
					$('#merPrice').val('');
					$('#merCode').val('');
					doSearch();
				}
			});
		}
	}else{
		alert('价格不能为空');
	}
}

/**
 * 匹配数据
 */
function matchMer(){
	var saleNo = $("#saleNo").val();
    $.layer({
        type : 2,
        title : '导入销售单商品',
        iframe : {src : '/sale/salebill/importmer?saleNo='+saleNo},
        area : ['800' , '550'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
            doSearch();
        }
    });
}

/**
 * 下载销售商品
 * @returns {Boolean}
 */
function downloadMer(){
	var param = '';
	param += 'saleNo=' + $('#saleNo').val();
	param += '&presaleNo=' + $('#presaleNo').val();
	param += '&merFlag=' + $('#merFlag').val();
	param += '&merCode=' + $('#merCode').val();
	param += '&merName=' + $('#merName').val();
	param += '&orderNo=' + $('#orderNo').val();
	window.location.href = '/sale/salebill/merexport?'+param;
	return false; //截取返回false就不会保存网页了
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}