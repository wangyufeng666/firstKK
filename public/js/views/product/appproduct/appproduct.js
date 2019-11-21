var grid;
$().ready(function() {
	grid = $('#grid').grid({
		pageSize:15
		,height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'40px', sortable:false}
			,{header:"app商品品牌", dataIndex:'APPPNAME', width:'150PX', sortable:false}
			,{header:"app商品名称", dataIndex:'', width:'150PX', sortable:false
				,renderer:function(value, data, rowIndex, colIndex, metadata){
					var appName = data['SPTYPE'];
					return '<span title="'+appName+'" ondblclick="seachMer(\''+appName+'\')">'+appName+'</span>';
				}
			}
			,{header:"商品名称", dataIndex:'SPNAME', width:'150PX', sortable:false}
			,{header:"商品ID", dataIndex:'', width:'150PX', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var spId = data['SPID'] ? data['SPID'] : '';
					return '<input type="text" class="spidFlag" width="200px" value="'+spId+'"/>';
				}
			}
			,{header:"有效状态", dataIndex:'BINDFLAG', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['BINDFLAG'] == 'Y' ? '<font color="greend">有效</font>' : '<font color="red">无效</font>';
				}
			}
			,{header:"是否为热门商品", dataIndex:'HOTFLAG', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['HOTFLAG'] == 'Y' ? '<font color="red">否</font>' : '<font color="greend">是</font>';
				}
			}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var pkId = data['PKID'];
					var bindFlag = data['BINDFLAG'];
					var hotFlag = data['HOTFLAG'];
					var returnText = '';
					var jcFlag = '';
					if(bindFlag == 'Y'){
						returnText += '<a href="javascript:void(0);" onclick="jiechu(\''+pkId+'\')" class="a_link">解除绑定</a>';
					}else{
						returnText += '<a href="javascript:void(0);" onclick="bindProduct(\''+pkId+'\',\''+rowIndex+'\')" class="a_link">绑定</a>';
					}
					
					if(hotFlag == 'Y'){
						jcFlag = 'N';
						returnText += ' | <a href="javascript:void(0);" onclick="editProductHot(\''+pkId+'\', \''+jcFlag+'\')" class="a_link">绑定热门</a>';
					}else{
						jcFlag = 'Y';
						returnText += ' | <a href="javascript:void(0);" onclick="editProductHot(\''+pkId+'\', \''+jcFlag+'\')" class="a_link">解除热门</a>';
					}
					return  returnText;
				}
			}
		]
		,url:'/product/appproduct/pagelist'
		,baseParams:getParams()
		,pageSizeList:[15,30,50]
	});
});


function getParams(){
	return {
		bindFlag:$('#bindFlag').val(),
		merName:$('#merName').val(),
		appName:$('#appName').val(),
	};
}

function doSearch(){
	grid.query(getParams());
}

/**
 *绑定商品 
 * @param pkId
 */
function bindProduct(pkId, rowIndex) {
	var spId = '';
	$('input.spidFlag').each(function(index){
		if(index == rowIndex){
			spId = $(this).val();
		}
	});
	if(spId){
		if((spId.length == '32')){
			$.post('/product/appproduct/bindproduct', {spId:spId,pkId:pkId}, function(data) {
				if(data == 'Y'){
					layer.msg('保存成功');
					window.location.href = window.location.href;
				}else{
					layer.msg('产品ID错误，请重新输入');
				}
			}, 'json');
		}else{
			layer.msg('产品ID必须是32位');
		}
	}else{
		layer.msg('产品ID不可以为空');
	}
}

/**
 * 解除商品绑定
 */
function jiechu(pkId){
	if(pkId){
		$.post('/product/appproduct/jiechu', {pkId:pkId}, function(data) {
			if(data == 'Y'){
				layer.msg('保存成功');
				window.location.href = window.location.href;
			}else{
				layer.msg('产品ID错误，请重新输入');
			}
		}, 'json');
	}
}

/**
 * 解除热门商品绑定
 * @param pkId
 * @returns
 */
function editProductHot(pkId, hotFlag){
	if(pkId){
		$.post('/product/appproduct/editproducthot',{pkId:pkId,hotFlag :hotFlag}, function(data){
			if(data == 'Y'){
				layer.msg('操作成功');
				window.location.href = window.location.href;
			}else{
				layer.msg('操作失败，请重新操作');
			}
		})
	}
}

/**
 * 从中关村查找手机型号
 * @returns
 */
function seachMer(appName){
	layer.open({
		type:2,
		title:'商品查询',
		content:'http://detail.zol.com.cn/index.php?keyword='+appName+'&c=SearchList',
		shadeClose:false,
		shade:0.8,
		area:['100%' , '100%'],
		close:function(index){
			layer.close(index);
		}
	});
}
