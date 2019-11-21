var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header: "No.", dataIndex: 'R', width:'5%',sortable:false} 
			  ,{header: "创建日期", dataIndex: 'CREATEDATE', width:'10%',sortable:false}
			  ,{header: "维修单号", dataIndex: 'ORDERNO', width:'10%',sortable:false}
			  ,{header: "报修单号", dataIndex: 'PREORDERNO', width:'10%',sortable:false}
			  ,{header: "租赁单号", dataIndex: 'RENT_ORDERNO', width:'12%',sortable:false}
			  ,{header: "机器名称", dataIndex: 'MERNAME', width:'10%',sortable:false}
			  ,{header: "IMEI", dataIndex: 'IMEI', width:'10%',sortable:false}
			  ,{header: "联系人", dataIndex: 'CONTACT_NAME', width:'6%',sortable:false}
			  ,{header: "手机号码", dataIndex: 'CONTACT_MOBILE', width:'8%',sortable:false}
			  ,{header: "维修结果", dataIndex: 'RESULTS_TXT', width:'10%',sortable:false}
			  ,{header: "状态", dataIndex: 'STATUS_TXT', width:'10%',sortable:false}
			  ,{header: "操作", dataIndex: '', width:'15%', sortable:false,
					renderer : function(value, data, rowIndex, colIndex, metadata){
					  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="infos(\''+data['PKID']+'\')">详情</a>';
					  	if(data['STATUS'] == 2 || data['STATUS'] == 3 || data['STATUS'] == 4 || data['STATUS'] == 5){
					  		returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="report(\''+data['PKID']+'\')">维修报告</a>';
					  	}
					  	if(data['STATUS'] == 3 || data['STATUS'] == 4 || data['STATUS'] == 5){
					  		returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="returns(\''+data['PREORDERNO']+'\')">寄回</a>';
					  	}
					  	if(data['STATUS'] == 6){
					  		returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="accomplishs(\''+data['PREORDERNO']+'\')">完成</a>';
					  	}
					  	if(data['STATUS'] != 6 && data['STATUS'] != 7 && data['STATUS'] != 8){
					  		returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="closes(\''+data['PREORDERNO']+'\')">关闭</a>';
					  	}
					  	return returnText;
					}
	           	}
		]
		,url : '/repairs/repairs/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});
function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		params['limit'] = limit;
		return params;
	}else{
		return {};
	}
}


/**
 * 详情
 */
function infos(pkid){
	window.location.href = "/repairs/repairs/orderinfo?pkid="+pkid+"&backUrl="+backUrl;
}

/**
 * 维修报告
 */
function report(pkid){
	window.location.href = "/repairs/repairs/reportinfo?pkid="+pkid+"&backUrl="+backUrl;
}

/**
 * 寄回
 */
function returns(orderno){
	if(confirm('确定寄回？？？')){
		updatestatus(orderno,'6');
	}
}

/**
 * 完成
 */
function accomplishs(orderno){
	if(confirm('确定完成交易？？？')){
		updatestatus(orderno,'7');
	}
}

/**
 * 关闭
 */
function closes(orderno){
	if(confirm('确定关闭当前报修单吗？？？')){
		updatestatus(orderno,'8');
	}
}

/**
 * 状态修改
 */
function updatestatus(orderno,status){
	$.post("/repairs/repairs/updatestatus",{status:status,preorderno:orderno,go:'1'},function(data){
		if(data == 'Y'){
			window.location.href = '';
		}else{
			alert(data);
		}
	})
}

/**
 * 添加备注
 */
function remark_add(){
		var remark = $('#remark').val();
		var preorderno = $('#preorderno').val();
		if(remark == '' || orderno == '' || remark == null || orderno == null){
			alert('请先填写要添加的备注');
			return false;
		}else{
			$.post('/repairs/repairs/saveremark',{preorderno:preorderno,remark:remark,go:'1'},function(data){
				if(data != 'Y'){
					alert('备注添加失败！刷新重试');
				}
				window.location.href = '';
			})
		}
}

/**
 * 修改用户信息
 */
function add_uinfo(){
	var preorderno = $('#preorderno').val();
	var u_name = $('#u_name').val();
	var u_mobile = $('#u_mobile').val();
	var address = $('#address').val();
	var status = $('#status').val();
	if(status == '6' || status == '7' || status == '8'){
		alert('当前订单状态不能修改');
		return false;
	}else{
		if(confirm('确定修改客户的信息？？？')){
			$.post('/repairs/repairspre/updateuserinfo',{orderno:preorderno,u_name:u_name,u_mobile:u_mobile,address:address,go:'1'},function(data){
				if(data != 'Y'){
					alert('修改失败！刷新重试');
				}
				window.location.href = '';
			})
		}
	}
}

/**
 * 返回上一页
 */
function goBack(){
	window.location.href = backUrl;
}

function getParams(){
    return {
    	uname:$('#uname').val(), 
    	mobile:$('#mobile').val()
    };
}
function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}
function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg,type:8}
	});
}