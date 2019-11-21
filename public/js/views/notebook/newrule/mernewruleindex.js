var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'80px',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'260px',sortable:false}
			,{header:"旧规则名称", dataIndex:'SUXINGNAME', width:'200px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var renderHtml = '';
					if(data['SUXINGNAME']){
						renderHtml = '<a class="a_link" href="javascript:showRuleInfo(\''+data['SSLXID']+'\')">'+data['SUXINGNAME']+'</a>';
					}
					return renderHtml;
				}
			}
			,{header:"新规则名称", dataIndex:'RULENAME', width:'200px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var renderHtml = '';
					if(value){
						renderHtml = '<a class="a_link" href="javascript:showRuleInfo(\''+data['RULEID']+'\')">'+data['RULENAME']+'</a>';
					}else{
						renderHtml = '<a class="a_link" href="javascript:initRuleInfo(\''+data['MERID']+'\')">初始化新规则</a>';
					}
					return renderHtml;
				}
			}
			,{header:"状态", dataIndex:'CHULIREN1',width:'80px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ENABLED'] == 'Y'){
						var returnText = '<span class="green">已启用</span>';
					}else if(data['ENABLED'] == 'N'){
						var returnText = '<span class="red">已停用</span>';
					}else if(data['ENABLED'] == 'C'){
						var returnText = '<span class="blue">新增未启用</span>';
					}else if(data['ENABLED'] == 'H'){
						var returnText = '<span class="red">已隐藏</span>';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'MERID', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:recycleMerInfo(\''+data['MERID']+'\')">详情</a>';
				  	return returnText;
				}
		   	}
		]
		,url:'/notebook/newrule/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
	});
	
	$.post('/common/brands/getbrandslist', {merType:'L'}, function(data){
		$("#brandCode").html("<option value=''>全部</option>");
		for(i in data){
			$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

/**
 * 商品详情
 * @param orderId
 * @return
 */
function recycleMerInfo(merId){
	layer.open({
		type:2,
		title:'商品详情',
		shadeClose:false,
		shade:0.8,
		content:"/recycle/product/merinfo?merId="+merId,
		area:['600px','400px'],
		close:function(index){
			layer.close(index);
		}
   });
}

/**
 * 闲鱼商品规则初始化
 * @param ruleId
 * @param merId
 * @returns
 */
function initRuleInfo(merId){
	if(confirm('是否确认生成该笔记本的新规则？')){
		$.post('/notebook/newrule/initmerrule', {merId:merId}, function(data){
			if(data == 'Y'){
				grid.reload();
			}else{
				alert(data);
			}
		});
	}
}

function getParams(){
	return {
		merName:$('#merName').val(), 
		brandCode:$('#brandCode').val(),
		relationStatus:$('#relationStatus').val(),
		status:$('#status').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function closeLayer(){
	layer.closeAll('iframe');
}

/**
 * 规则展示
 * @param ruleId
 * @returns
 */
function showRuleInfo(ruleId){
	layer.open({
		type:2,
		title:'商品规则展示',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/merrule/ruledetail?ruleId='+ruleId,
		area:['90%','90%'],
		close:function(index){
			layer.close(index);
		}
   });
}
