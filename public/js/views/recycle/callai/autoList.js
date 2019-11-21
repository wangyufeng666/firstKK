var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
			{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
			,{header: "手机号", dataIndex: 'MOBILE',width:'100px', sortable:false}
			,{header: "姓名", dataIndex: 'NAME',width:'100px', sortable:false}
			,{header: "订单号", dataIndex: 'ORDERNO', width:'200px',sortable:false}
			,{header: "创建时间", dataIndex: 'CREATETIME',width:'180px',sortable:false}
			,{header: "下发时间", dataIndex: 'CALLTIME',width:'150px',sortable:false}
			,{header: "状态", dataIndex: '',width:'100px',sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS'] == 1){
						var returnText = '未下发';
					}else if(data['STATUS'] == 2){
						var returnText = '已下发';
					}
					return returnText;
				}}
			,{header: "任务ID", dataIndex: 'TASKID', width:'200', sortable:false,}
			,{header: "拨打时间", dataIndex: 'CALLBACKTIME', width:'200', sortable:false,}
        ]
        ,url : '/recycle/callai/autopagelist'
        ,baseParams:{mobile:$('#mobile').val(),orderno:$('#orderno').val()}
	});
});

function getParams(){
    return {
    	mobile:$('#mobile').val(),
    	orderno:$('#orderno').val(),
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

function doCall() {
	layer.load('下发中.....',1);
	$.post('http://inspection.youdemai.com/callai/callai/autocall',{},function(data){
		if(data['code'] == 200) {
			alert('下发成功');
			window.reload();
		}else {
			alert('下发失败，请检查是否有可下发数据！');
			window.reload();
		}
	})
}

function doImport() {
	$.layer({
		type:2,
		title:'专项拨打记录导入',
		iframe:{src:'/recycle/callai/autoimport'},
		area:['500', '350'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}