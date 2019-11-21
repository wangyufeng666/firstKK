var grid;
$().ready(function(){
	grid = $('#grid').grid({
		height:250
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'140PX',sortable:false}
			,{header:"适用品类", dataIndex:'MERTYPE', width:'80PX',sortable:false}
			,{header:"适用品牌", dataIndex:'PCODE', width:'80PX',sortable:false}
			,{header:"加价策略编码", dataIndex:'STRATEGYCODE', width:'120PX',sortable:false}
			,{header:"价格下限", dataIndex:'MINPRICE', width:'80PX',sortable:false}
			,{header:"价格上线", dataIndex:'MAXPRICE', width:'80PX',sortable:false}
			,{header:"加价百分比", dataIndex:'PRECENTTEXT', width:'80PX',sortable:false}
			,{header:"加价绝对值", dataIndex:'ABSOLUTEVAL', width:'80PX',sortable:false}
			,{header:"平台补贴", dataIndex:'YDMSUBSIDY', width:'80PX',sortable:false}
			,{header:"商家补贴", dataIndex:'PARTNERSUBSIDY', width:'80PX',sortable:false}
			,{header:"策略状态", dataIndex:'STATUS', width:'80PX',sortable:false}
//			,{header:"操作", dataIndex:'', sortable:false,
//				renderer:function(value, data, rowIndex, colIndex, metadata){
//					if(data['ISVALID']=='1'){
//						var html = "<a class='a_link' href='javaScript:eventdetail(\"" + data['EVENTCODE'] + "\")'>关闭</a> | ";
//					}else{
//						var html = "<a class='a_link' href='javaScript:eventdetail(\"" + data['EVENTCODE'] + "\")'>开启</a> | ";
//					}
//					html += "<a class='a_link' href='javaScript:delBrand(\"" + data['EVENTCODE'] + "\")'>删除</a>";
//					return html;
//				}
//			}
		]
		,url:'/recycle/events/pricestrategy'
		,baseParams:initParams()
	});
});

function initParams(){
	return {eventCode:$('#eventCode').val()};
}

function addEventPriceStrategy(){
	var eventCode = $('#eventCode').val();
	$.layer({
		type:2,
		title:'新增加价策略',
		iframe:{src:'/recycle/events/addeventstrategy?eventCode='+eventCode},
		area:['500','500'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

