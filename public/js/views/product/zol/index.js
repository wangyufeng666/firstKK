var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'5%',sortable:false} 
			,{header:"中关村商品编码", dataIndex:'MERCODE', width:'8%',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'8%',sortable:false}
			,{header:"商品类型", dataIndex:'merTypeName', width:'8%',sortable:false}
			,{header:"中关村商品名称", dataIndex:'MERNAME', width:'25%',sortable:false}
			,{header:"中关村商品价格", dataIndex:'PRICE', width:'8%',sortable:false}
			,{header:"上市时间", dataIndex:'LISTDATE', width:'8%',sortable:false}
			,{header:"更新时间", dataIndex:'UPDATETIME',width:'8%',sortable:false}
			,{header:"关联的商品", dataIndex:'YDMMERNAME',width:'25%',sortable:false}
			,{header:"操作", dataIndex:'', width:'30%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="merAttr(\''+data['MERCODE']+'\')">商品属性</a>';
					if(data['YDMMERNAME']){
						returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="merMatch(\''+data['MERCODE']+'\',\''+data['MERNAME']+'\')">重新关联</a>';
					}else{
						returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="merMatch(\''+data['MERCODE']+'\',\''+data['MERNAME']+'\')">关联</a>';
					}
				  	return returnText;
				}
		   	}
		]		,url:'/product/zol/pagelist'

	});
});

/**
 * 商品详情
 * @param orderId
 * @return
 */
function merAttr(merId){
	layer.close(layerIndex);
	$.post('/product/zol/getattrs',{merId:merId}, function(data){
		layerIndex = layer.open({
			type:1, shade:false, title:false, area:['650px', 'auto'],
			content:'<div class="layer_notice">商品属性： <br/>'+data+'</div>'
		});
	});
}

/**
 * 合作商品匹配
 * @param
 * @return
 */
function merMatch(merId, partnerMerName){
	layer.open({
		type:2,
		title:'闲鱼商品关联|'+partnerMerName,
		shadeClose:false,
		shade:0.8,
		content:'/product/zol/relation?merId='+merId,
		area:['800px', '500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

function getParams(){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val()
	};
}


function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}
