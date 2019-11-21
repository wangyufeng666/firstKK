var grid;
	$().ready(function(){
		grid = $('#grid').grid({
			pageSize :10,
			height:250
			,cm : [
			   {header:"NO.", dataIndex:'R', width:'30px', sortable:false}
			   ,{header:"日期", dataIndex:'DATE', width:'80px', sortable:false}
			   ,{header:"检测地区", dataIndex:'AREA_NAME', width:'60px', sortable:false}
			   ,{header:"检测员", dataIndex:'WORKERNAME', width:'60px', sortable:false}
	           ,{header:"检测数量", dataIndex:'EXPRESSDELIVERYSHU', width:'65px', sortable:false}
	           ,{header:"检测总价值", dataIndex:'COUNT', width:'75px', sortable:false}
	           ,{header:"成功数量", dataIndex:'SUCCESSSHU', width:'65px', sortable:false}
	           ,{header:"成功总价值", dataIndex:'TOTALPRICE', width:'75px', sortable:false}
	           ,{header:"手机数量", dataIndex:'SUCCESSMOBILEPHONE', width:'65px', sortable:false}
	           ,{header:"平板数量", dataIndex:'SUCCESSPINGBAN', width:'65px', sortable:false}
	           ,{header:"笔记本数量", dataIndex:'SUCCESSNOTEBOOK', width:'72px', sortable:false}
	           ,{header:"机身数量", dataIndex:'SUCCESSJS', width:'65px', sortable:false}
	           ,{header:"镜头数量", dataIndex:'SUCCESSJT', width:'65px', sortable:false}
	           ,{header:"套机数量", dataIndex:'SUCCESSJT', width:'65px', sortable:false}
	           ,{header:"废弃手机数量", dataIndex:'UNSUCCESSMOBILEPHONE', width:'80px', sortable:false}
	           ,{header:"废弃平板数量", dataIndex:'UNSUCCESSPINGBAN', width:'80px', sortable:false}
	           ,{header:"废弃笔记本数量", dataIndex:'UNSUCCESSNOTEBOOK', width:'80px', sortable:false}
	           ,{header:"开始检测时间", dataIndex:'STARTDETECTION', width:'85px', sortable:false}
	           ,{header:"结束检测时间", dataIndex:'ENDDETECTION', width:'85px', sortable:false}
	       ]
	       ,url : '/report/Expressdelivery/expressdeliverylist'
	       ,baseParams:{isAll:'all'}
		});
	});
	function getParams(){
	    return {
	    	startCreateDate:$('#startCreateDate').val(),
	    };
	}

	function doSearch(){
		layer.load('数据加载中...', 1);
	    grid.query(getParams());
	}

	function errorBox(msg){
	    $.layer({
	        title:'错误',
	        area : ['280px','auto'],
	        dialog : {msg:msg, type:8}    
	    });
	}
	function downloaddeliveryexport(){
		var param = '';
		param += '&startCreateDate=' + $('#startCreateDate').val();
		window.location.href = '/report/expressdelivery/expressdeliveryexport?'+param;
		return false; //截取返回false就不会保存网页了
	}