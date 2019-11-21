var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250,
		cm : [
			{header: "No.", dataIndex: 'R', width:'40px',sortable:false} 
			,{header: "回收单号", dataIndex: 'ORDERNO', width:'120px',sortable:false}
			,{header: "商品编码", dataIndex: 'MERUNIQUECODE', width:'100px',sortable:false}
			,{header: "商品分类", dataIndex: 'CATEGORYNAME', width:'80px',sortable:false}
			,{header: "器材名称", dataIndex: 'MERNAME',sortable:false}
			,{header: "器材成本", dataIndex: 'RECYPRICE',width:'80px',sortable:false}
			,{header: "器材属性", dataIndex: 'MERFLAGNAME', width:'100px',sortable:false}
			,{header: "操作", dataIndex: '', width:'80px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var merCode = data['MERUNIQUECODE'];
					var returnText ='<a href="javascript:attrInfo(\''+merCode+'\')" class="a_link">查看</a>';
					if(presaleFlag == 'Y'){
						returnText += '| <a href="javascript:deleteMer(\''+merCode+'\')" class="a_link">删除</a>';
					}
					return returnText;
				}
			}
		]
		,url : '/sale/presalebill/merpagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
		var params = getParams();
		params['start'] = 0;
		params['limit'] = 10;
		params['presaleNo'] = $('#presaleNo').val();
		return params;
}

function attrInfo(merCode){
	var presaleNo = $('#presaleNo').val();
	backUrl = "/sale/presalebill/billinfo?presaleNo="+presaleNo
	window.location.href = "/sale/presalebill/merinfo?presaleNo="+presaleNo+"&merCode="+merCode;
}

if(presaleFlag == 'Y'){
	$('#providerList .selects .option').click(function(){
		var providerId = $(this).attr('id');
		var text = '是否分配给回收商？';
		var url = '/sale/presalebill/allotpro';
		var flag = 'Y';
		if($(this).hasClass('checked')){//解除
			text = '是否解除回收商？';
			url = '/sale/presalebill/removepro';
			flag = 'N';
		}
		var presaleNo = $("#presaleNo").val();
		if(confirm(text)){
			$.ajax({
				type:'POST'//请求方式
					,url:url//请求路径
					,data:{providerId:providerId,presaleNo:presaleNo} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
					if(data == "Y"){
						if(flag == 'Y'){
//							alert("分配成功");
							$('#'+providerId).addClass('checked');
						}else{
//							alert("解除成功");
							$('#'+providerId).removeClass('checked');
						}
					}else{
						alert("分配失败");
					}
				}
			});
		}
	});
}

function getParams(){
    return {
        merName:$('#merName').val(),
        merCode:$('#merCode').val(),
        merFlag:$('#merFlag').val()
    };
}

/**
 * 批量导入预销售单商品
 */
function importPresaleBillMer(){
	var presaleNo = $("#presaleNo").val();
    $.layer({
        type : 2,
        title : '导入预销售单商品',
        iframe : {src : '/sale/presalebill/importmer?presaleNo='+presaleNo},
        area : ['800' , '550'],
        offset : ['50px',''],
        close : function(index){
            layer.close(index);
            doSearch();
        }
    });
}

/**
 * 删除预销售单商品
 * @param merCode
 */
function deleteMer(merCode){
	var presaleNo = $("#presaleNo").val();
	if(confirm("确认删除该条记录吗？")){
		$.post("/sale/presalebill/deletemer", {merCode:merCode,presaleNo:presaleNo}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}

/**
 * 导出预销售单商品
 */
function merpageExport(){
    var param = '';
    param += 'presaleNo=' + $('#presaleNo').val();
    param += '&merName=' + $('#merName').val();
    param += '&merCode=' + $('#merCode').val();
    param += '&merFlag=' + $('#merFlag').val();
    window.location.href = '/sale/presalebill/merpageexport?'+param;
    return false; //截取返回false就不会保存网页了
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}