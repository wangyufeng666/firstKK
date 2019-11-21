var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    
{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
,{header: "订单编号", dataIndex: 'ORDERNO', width:'150px',sortable:false}
,{header: "创建日期", dataIndex: 'CREATEDATE', width:'100px',sortable:false}
,{header: "用户昵称", dataIndex: 'USERNAME',width:'100px',sortable:false}
,{header: "联系方式", dataIndex: 'MOBILE',width:'100px',sortable:false}
,{header: "产品名称", dataIndex: 'MERNAME',width:'150px',sortable:false}
,{header: "回收金额", dataIndex: 'PRICE',width:'80px',sortable:false}
,{header: "订单来源", dataIndex: 'SOURCE', width:'80px',sortable:false,
	renderer : function(value, data, rowIndex, colIndex, metadata){
		if(data['SOURCE'] == 0){
			var returnText = '有得卖-PC端';
		}else if(data['SOURCE'] == 4){
			var returnText = '有得卖-移动端';
		}else if(data['SOURCE'] == 66){
			var returnText = '芝麻信用';
		}
		return returnText;
	}
}
,{header: "IP", dataIndex: 'IP',width:'100px',sortable:false}
,{header: "状态", dataIndex: 'STATUS', width:'80px',sortable:false,
	renderer : function(value, data, rowIndex, colIndex, metadata){
		if(data['STATUS'] == 'N'){
			var returnText = '已隐藏';
		}else if(data['STATUS'] == 'Y'){
			var returnText = '显示中';
		}
		return returnText;
	}
}
,{header: "操作", dataIndex: '', width:'150px', sortable:false,

				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="infos(\''+data['PKID']+'\')">详情</a>';
				  		if(data['STATUS'] == 'N'){
				  			returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="shows(\''+data['PKID']+'\')">显示</a>';
				  		}else if(data['STATUS'] == 'Y'){
				  			returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="hides(\''+data['PKID']+'\')">隐藏</a>';
				  		}
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="updates(\''+data['PKID']+'\')">修改</a>';
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="dels(\''+data['PKID']+'\')">删除</a>';
					
				  	return returnText;
				}
           	}
        ]
        ,url : '/recycle/records/pagelist'
        ,baseParams:{orderno:$('#orderno').val(),mername:$('#mername').val(),mobile:$('#mobile').val(),username:$('#username').val(),create_start:$('#create_start').val(),
        	create_end:$('#create_end').val(),source:$('#source').val(),status:$('#status').val()}
	});
});

/**
 * 添加
 */
function addInfo(){
	window.location.href = "/recycle/records/addrecords";
}
/**
 * 保存
 */
function saveButton(){
	$('#addForm').submit();
}
/**
 * 删除
 */
function dels(pkid){
	if(confirm('你确定删除该条记录？')){
		window.location.href = "/recycle/records/delrecords?pkid="+pkid;
	}
}
/**
 * 详情
 */
function infos(pkid){
	window.location.href = "/recycle/records/inforecords?pkid="+pkid;
}
/**
 * 显示
 */
function shows(pkid){
	$.post('/recycle/records/statusrecords',{pkid:pkid,type:'1',go:'1'},function(data){
	      if(data == 'Y'){
	          window.location.reload();
	      }else{
	    	  window.location.href = "/recycle/records/index"
	      }
	});
}
/**
 * 隐藏
 */
function hides(pkid){
	$.post('/recycle/records/statusrecords',{pkid:pkid,type:'2',go:'1'},function(data){
	      if(data == 'Y'){
	          window.location.reload();
	      }else{
	    	  window.location.href = "/recycle/records/index"
	      }
	});
}
/**
 * 隐藏
 */
function hides(pkid){
	$.post('/recycle/records/statusrecords',{pkid:pkid,type:'2',go:'1'},function(data){
	      if(data == 'Y'){
	          window.location.reload();
	      }else{
	    	  window.location.href = "/recycle/records/index"
	      }
	});
}
/**
 * 修改
 */
function updates(pkid){
	window.location.href = "/recycle/records/editrecords?pkid="+pkid;
}
/**
 * 清空数据
 */
function delAll(){
	if(confirm('你确定要删除所有数据吗？？？')){
		window.location.href = "/recycle/records/alldelrecords?go=1";
	}
}
function goBack(){
	window.history.go(-1);
}
function getParams(){
    return {
    	orderno:$('#orderno').val(), 
    	mername:$('#mername').val(),
    	mobile:$('#mobile').val(),
    	username:$('#username').val(),
    	create_start:$('#create_start').val(),
    	create_end:$('#create_end').val(),
    	source:$('#source').val(),
    	status:$('#status').val()
    };
}
function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
