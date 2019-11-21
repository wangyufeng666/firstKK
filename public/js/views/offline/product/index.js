var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'3%',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'8%',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'8%',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'8%',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'20%',sortable:false}
			,{header:"商品别称", dataIndex:'NICKNAME', width:'20%',sortable:false}
			,{header:"热度", dataIndex:'REDU', width:'6%',sortable:false}
			,{header:"关键词", dataIndex:'KEYWORDS', width:'24%',sortable:false}
			,{header:"状态", dataIndex:'CHULIREN1',width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ENABLED'] == 'Y'){
						var returnText = '已启用';
					}else if(data['ENABLED'] == 'N'){
						var returnText = '已删除';
					}else if(data['ENABLED'] == 'C'){
						var returnText = '未启用';
					}else if(data['ENABLED'] == 'H'){
						var returnText = '已隐藏';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', width:'180px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="recycleMerInfo(\''+data['MERID']+'\')">详情</a>';
				  	
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="addReport(\''+data['MERID']+'\')">加入报表</a>';
				  	return returnText;
				}
		   	}
		]
		,url:'/product/product/pagelist'
		,baseParams:{merType:$('#merType').val(), merName:$('#merName').val(),pinpai:$('#pinpai').val()}
	});
});

/**
 * 商品详情
 * @param orderId
 * @return
 */
function recycleMerInfo(merId){
	window.location.href = "/product/product/recyclemerinfo?merId="+merId+'&backUrl='+backUrl;
}

/**
 * 新增回收商品
 * @return
 */
function addRecycleMer(){
	window.location.href = "/product/product/addrecyclemer";
}

/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function edit(merId){
	window.location.href = "/product/product/editrecyclemer?merId="+merId;
}

/**
 * 删除
 */
function deleteThis(merId){
	if(confirm('是否确认删除选中的商品？')){
		$.post('/product/product/deleterecyclemer', {merId:merId}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}
/**
 * 启用
 */
function opensThis(merId){
if(confirm("你确定要启用吗？？？")){
		statusUpdate(merId,'Y');
	}
}
/**
 * 停用
 */
function closeThis(merId){
	if(confirm("你确定要停用吗？？？")){
		statusUpdate(merId,'C');
	}
}

/**
 * 同步
 */
function syncRedis(merId){
	if(confirm("是否要更新缓存数据？")){
		$.post('/redis/recycle/removelike',{keyword:merId},function(data){
			if(data == 'Y'){
				alert('清空成功');
			}else{
				alert('清空失败');
		 	}
		});
	}
}

/**
 * 修改状态
 */
function statusUpdate(merId,status){
	$.post("/product/product/updatestatus/",{merId:merId,status:status,submit:'1'},function(data){
		if(data == 'Y'){
			doSearch();
		}else{
			doSearch();
			alert('操作失败');
		}
	});
}

/**
 * 加入报表
 * create by zhuhaili
 * createdate 2017-6-16
 */
function addReport(merId){
	$.post("/report/merquote/savemer/",{merId:merId,submit:'1'},function(data){
		alert(data);
	});
}

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#pinpai").html("<option value=''>全部</option>");
		for(i in data){
			$("#pinpai").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function getParams(){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val(),
		pinpai:$('#pinpai').val(),
		merSource:$('#merSource').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}