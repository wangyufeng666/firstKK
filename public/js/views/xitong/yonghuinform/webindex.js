var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 

			,{header:"反馈类型", dataIndex:'INFORMTYPENAME', width:'80px',sortable:false}
			,{header:"反馈内容", dataIndex:'INFORMDESC', width:'160px',sortable:false}
            ,{header:"联系方式", dataIndex:'CONTACT', width:'130px',sortable:false}
			,{header:"反馈日期", dataIndex:'CREATEDATE', width:'80px',sortable:false}
			,{header:"反馈状态", dataIndex:'INFORMSTATUSNAME', width:'140px',sortable:false}
			,{header:"处理结果", dataIndex:'OPERRESULTNAME', width:'80px',sortable:false}
			,{header:"处理描述", dataIndex:'OPERDESC', width:'130px',sortable:false}
			,{header:"操作", dataIndex:'INFORMID', width:'130px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var informId = data['INFORMID'];
					var informStatus = data['INFORMSTATUS'];
					var returnText ='<a title="'+informId+'" href="javascript:informInfo(\''+informId+'\')" class="a_link">详情</a>';
						if (informStatus != '1'){
							returnText+=' | <a href="javascript:dealInform(\''+informId+'\',\''+informStatus+'\')" class="a_link">处理</a>';
						}
					return returnText;
				}
			}
		]
		,url:'/xitong/yonghuinform/webpagelist'
		,pageSizeList:[15,30,50]
	});
});

//反馈详情
function informInfo(informId){
	$.layer({
		type : 2,
		title : '反馈详情',
		iframe : {src : '/xitong/yonghuinform/getwebinform?informId='+informId},
		area : ['500' , '600'],
		offset : ['50px',''],
	});
}

//处理反馈
function dealInform(informId,informStatus){
	if(informStatus == '1'){
		alert("该通知已处理");
		return;
	}
	$.layer({
		type : 2,
		title : '处理反馈',
		iframe : {src : '/xitong/yonghuinform/dealwebinform?informId='+informId},
		area : ['500' , '600'],
		offset : ['50px',''],
		close : function(index){
			layer.close(index);
		},
		end: function () {
			location.reload();
		}
	});
}

function getParams(){
	return {
		informType:$('#informType').val(),
		contact:$('#contact').val(),
		informStatus:$('#informStatus').val(),
		informResult:$('#informResult').val(),
		startDate:$('#startCreateDate').val(),
		endDate:$('#endCreateDate').val(),
	};
}

/**
 * 查询按钮查询动作
 * @returns
 */
function doSearch(){
	grid.query(getParams());
}
