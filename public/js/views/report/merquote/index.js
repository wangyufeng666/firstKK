var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'3%',sortable:false} 
			,{header:"商品编码", dataIndex:'MERCODE', width:'8%',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'8%',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'8%',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'20%',sortable:false}
			,{header:"加入报表状态", dataIndex:'STATUS',width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['STATUS'] == 'Y'){
						var returnText = '已启用';
					}else if(data['STATUS'] == 'N'){
						var returnText = '<font color="#999">已隐藏</font>';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', width:'12%', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '';
					returnText += '<a class="a_link" href="javascript:void(0);" onclick="infoThis(\''+data['MERID']+'\')">详情</a> ';
				  	if(data['STATUS']=='N'){
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="opensThis(\''+data['MERID']+'\')">启用</a>';
				  	}else if(data['STATUS']=='Y'){
				  		returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="closeThis(\''+data['MERID']+'\')">隐藏</a>';
				  	}
				  	returnText += '&nbsp;|&nbsp;<a class="a_link" href="javascript:void(0);" onclick="deleteThis(\''+data['MERID']+'\')">删除</a>';
				  	return returnText;
				}
		   	}
		]
		,url:'/report/merquote/pagelist'
		,baseParams:{merType:$('#merType').val(), merName:$('#merName').val(),pinpai:$('#pinpai').val()}
	});
});

/**
 * 详情
 */
function infoThis(merId){
	window.location.href="/report/merquote/infos/merid/"+merId;
}
/**
 * 删除
 */
function deleteThis(merId){
	if(confirm('是否确认删除选中的商品？')){
		$.post('/report/merquote/delmerquote', {merId:merId,submit:'1'}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}
/**
 * 清空
 */
function delAll(){
	if(confirm('确认清空所有商品吗？')){
		$.post('/report/merquote/delallmerquote', {submit:'1'}, function(data){
			if(data == 'Y'){
				doSearch();
			}
		});
	}
}
/**
 * 启用
 */
function opensThis(merId){
if(confirm("你确定要启用吗？？？")){
		statusUpdate(merId,'Y');
	}
}
/**
 * 停用
 */
function closeThis(merId){
	if(confirm("你确定要隐藏吗？？？")){
		statusUpdate(merId,'N');
	}
}



/**
 * 修改状态
 */
function statusUpdate(merId,status){
	$.post("/report/merquote/updatestatus/",{merId:merId,status:status,submit:'1'},function(data){
		if(data == 'Y'){
			doSearch();
		}else{
			doSearch();
			alert('操作失败');
		}
	});
}

/**
 * 提交数据导出报表
 */

var sleep = 10, interval = null;
window.onload = function (){
    var btn = document.getElementById ("exportAll");
    btn.onclick = function (){
        if (!interval){
            this.style.backgroundColor = '#cccccc';
            this.disabled = "disabled";
            this.style.cursor = "wait";
            this.value = "("+sleep--+')';
            interval = setInterval (function (){
                if (sleep == 0){
                    if (!!interval){
                        clearInterval (interval);
                        interval = null;
                        sleep = 10;
                        btn.style.cursor = "pointer";
                        btn.removeAttribute ('disabled');
                        btn.value = "导出";
                        btn.style.backgroundColor = '';
                    }
                    return false;
                }
                var sss = sleep--;
                if(sss<10){sss = '0'+sss;}
                btn.value = "("+sss+")";
            }, 1000);
            var merName = $('#merName').val();
        	var merType = $('#merType').val();
        	var pinpai = $('#pinpai').val();
        	var merSource = $('#merSource').val();
        	window.location.href="/report/merquote/exportsvn?merName="+merName+"&merType="+merType+"&pinpai="+pinpai+"&merSource="+merSource;
        }
    }
}

$("#merType").change(function(){
	var merType = $(this).val();
	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
		$("#pinpai").html("<option value=''>全部</option>");
		for(i in data){
			$("#pinpai").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
		}
	}, 'json');
});

function getParams(){
	return {
		merName:$('#merName').val(), 
		merType:$('#merType').val(),
		pinpai:$('#pinpai').val(),
		merSource:$('#merSource').val()
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}