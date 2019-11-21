var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'40PX',sortable:false}
			,{header:"所属品类", dataIndex:'CATEGORYNAME', width:'100PX',sortable:false}
			,{header:"所属分类", dataIndex:'MERTYPENAME', width:'100PX',sortable:false}
			,{header:"品类编码", dataIndex:'MERTYPE', width:'100PX',sortable:false}
			,{header:"品牌ID", dataIndex:'PID', width:'80PX',sortable:false}
			,{header:"品牌名称", dataIndex:'PNAME', width:'100PX',sortable:false}
			,{header:"品牌编号", dataIndex:'PCODE', width:'100PX',sortable:false}
			,{header:"英文名", dataIndex:'ENAME', width:'100PX',sortable:false}
			,{header:"显示顺序", dataIndex:'SEQ', width:'80PX',sortable:false}
			,{header:"状态", dataIndex:'ISENABLE', width:'80PX',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['ISENABLE'] == 'Y'){
						return "<span class='green'>已启用</span>";
					}else if(data['ISENABLE']=='N'){
						return "<span class='red'>已停用</span>";
					}else if(data['ISENABLE']=='C'){//新增
						return "<span class='blue'>新增未启用</span>";
					}else{
						return data['ISENABLE'];
					}
				}
			}
			,{header:"操作", dataIndex:'', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var html = "<a class='a_link' href='javaScript:updateBrand(\"" + data['PID'] + "\")'>修改</a> | ";
					html += "<a class='a_link' href='javaScript:delBrand(\"" + data['PID'] + "\")'>删除</a>";
					if(data['ISENABLE']=='N' || data['ISENABLE']=='C'){
						html += " | <a class='a_link' href='javaScript:onBrand(\"" + data['PID']+"\")'>启用</a>";
					}else if(data['ISENABLE']=='Y'){
						html += " | <a class='a_link' href='javaScript:offBrand(\"" + data['PID'] + "\")'>停用</a>";
					}
					return html;
				}
			}
		]
		,url:'/recycle/brand/pagelist'
		,baseParams:initParams()
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

function getParams(){
	return {
		pname:$('#pname').val(),
		mertype:$('#mertype').val(),
		isenable:$('#isenable').val()
	};
}

function doSearch(){
	grid.query(getParams());
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function addBrand(){
	layer.open({
		type:2,
		title:'新增回收品牌',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/brand/addbrand',
		area:['450px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 跳转到修改页
 * @param pid
 * @returns
 */
function updateBrand(pid){
	layer.open({
		type:2,
		title:'品牌信息修改',
		shadeClose:false,
		shade:0.8,
		content:'/recycle/brand/editbrand?pid='+pid,
		area:['450px','300px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 删除
 * @param pid
 * @returns
 */
function delBrand(pid){
	if(confirm('是否确认删除该品牌？')){
		$.ajax({
			type:"POST",
			url:'/recycle/brand/delbrand',
			data:{pid:pid},
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					alert('删除失败：'+data);
				}
			},
			error:function(){
				 alert('网络错误');
			}
		});
	}
}

/**
 * 启用
 * @param pid
 * @returns
 */
function onBrand(pid){
	if(confirm('是否确认启用该品牌？')){
		$.ajax({
			type:"POST",
			url:"/recycle/brand/onbrand",
			data:{pid:pid},
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					alert('启用失败：'+data);
				}
			},
			error:function(){
				alert('网络错误');
			}
		});
	}
}

/**
 * 停用
 * @param pid
 * @returns
 */
function offBrand(pid){
	if(confirm('是否确认停用该品牌？')){
		$.ajax({
			type:"POST",
			url:"/recycle/brand/offbrand",
			data:{pid:pid},
			dataType:"json",
			timeout:30000,
			cache:false,
			success:function(data){
				if(data == 'Y'){
					grid.reload();
				}else{
					alert('设置失败：'+data);
				}
			},
			error:function(){
				alert('网络错误');
			}
		});
	}
}
