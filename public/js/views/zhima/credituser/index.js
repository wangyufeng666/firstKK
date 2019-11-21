var grid;
var layerIndex = 0;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false}
			,{header:"创建日期", dataIndex:'CREATEDATE', width:'150px',sortable:false}
			,{header:"用户名", dataIndex:'USERNAME', width:'100px',sortable:false}
			,{header:"手机号", dataIndex:'MOBILE', width:'100px',sortable:false}
			,{header:"身份证", dataIndex:'CERT_NO', width:'150px',sortable:false}
			,{header:"芝麻信用分", dataIndex:'ZM_SCORE', width:'60px',sortable:false}
			,{header:"芝麻信用等级", dataIndex:'ZM_GRADE_NAME', width:'60px',sortable:false}
			,{header:"用户ID", dataIndex:'USER_ID', width:'150px',sortable:false}
			,{header:"业务流水号", dataIndex:'TRANSACTION_ID', width:'220px',sortable:false}
			,{header:"黑名单", dataIndex:'RECYBLACKLISTFLAG', width:'8%',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value == 'Y' ? '是':'否';
				}
			}
			,{header:"操作", dataIndex:'', width:'150px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:infos(\''+data['PKID']+'\')">详情</a>';
					if(data['RECYBLACKLISTFLAG'] == 'N'){
						returnText +=' | <a class="a_link" href="javascript:block(\''+data['USER_ID']+'\')">拉黑</a>';
					}
					return returnText;
				}
			}
		]
		,url:'/zhima/credituser/pagelist'
		,afterRender:function(e, grid){
			layer.close(layerIndex);
		}
		,baseParams:initParams()
		,pageSizeList:[15,30,50]
	});
});
function initParams(){
	return getParams();
}

/**
 * 详情
 */
function infos(pkid){
	
	layer.open({
		type:2,
		title:'用户信息',
		shadeClose:false,
		content:"/zhima/credituser/userinfo?pkid="+pkid,
		area:['100%','100%'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 拉黑
 * @param roleId
 */
function block(user_id){
	if(confirm("确认拉黑吗？")){
		$.post("/zhima/credituser/block", {user_id:user_id}, function(data){
			if(data == 'Y'){
				grid.reload();
			}
		});
	}
}

function getParams(){
	return {
		username:$('#username').val(), 
		mobile:$('#mobile').val(),
		cert_no:$('#cert_no').val(),
		zm_score_start:$('#zm_score_start').val(),
		zm_score_end:$('#zm_score_end').val(),
		createdate_start:$('#createdate_start').val(),
		createdate_end:$('#createdate_end').val(),
		zm_face:$('#zm_face').val(),
		usesource:$('#usesource').val(),
		zm_grade:$('#zm_grade').val()
	};
}
function doSearch(){
	layerIndex = layer.msg('加载中', {icon:16, time:10000});
	grid.query(getParams());
}


/**
 * 重新加载
 * @returns
 */
function reload(){
	layer.closeAll();
	grid.reload();
}