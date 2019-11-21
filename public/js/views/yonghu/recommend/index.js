var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
{header: "No.", dataIndex: 'R', width:'35PX',sortable:false} 
,{header: "邀请时间", dataIndex: 'CREATETIME',width:'120px',sortable:false}
,{header: "推荐人手机号", dataIndex: 'MAINMOBILE', width:'100px',sortable:false}
,{header: "被邀请人手机号", dataIndex: 'PASSIVEMOBILE', width:'100px',sortable:false}
,{header: "被邀请人订单编号", dataIndex: 'ORDERCODE',width:'120px',sortable:false}
,{header: "被邀请人订单金额", dataIndex: 'SETTLEPRICE',width:'100px',sortable:false}
,{header: "被邀请人订单状态", dataIndex: 'ORDERTYPE_TEXT',width:'100px',sortable:false}
,{header: "所属邀请活动码", dataIndex: 'INVITECODE',width:'120px',sortable:false}
,{header: "IP", dataIndex: 'IP',width:'100px',sortable:false}
,{header: "端口来源", dataIndex: 'SOURCE_TEXT',width:'80px',sortable:false}
,{header: "邀请状态", dataIndex: 'STATUS',width:'80px',sortable:false,
	renderer : function(value, data, rowIndex, colIndex, metadata){
		if(data['STATUS'] == 1){
			var returnText = '成功';
		}else{
			var returnText = '邀请失败';
		}
		return returnText;
	}
}
,{header: "是否审核", dataIndex: 'TYPES',width:'80px',sortable:false,
	renderer : function(value, data, rowIndex, colIndex, metadata){
		if(data['TYPES'] == 1){
			var returnText = '已审';
		}else{
			var returnText = '未审核';
		}
		return returnText;
	}
}
,{header: "操作", dataIndex: '', width:'150px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='';
				  	if(data['TYPES'] != 1){
				  		returnText +='<a class="a_link" href="javascript:void(0);" onclick="examines(\''+data['PKID']+'\')">待审</a>';
				  	}
				  	return returnText;
				}
           	}
        ]
        ,url : '/yonghu/recommend/pagelist'
        ,baseParams:{mainmobile:$('#mainmobile').val(),passivemobile:$('#passivemobile').val(),ordercode:$('#ordercode').val(),
        	createtime_start:$('#createtime_start').val(),createtime_end:$('#createtime_end').val(),
        	types:$('#types').val(),status:$('#status').val()}
	});
});

/**
 * 详情
 */
function info(pkid){
	window.location.href = "/yonghu/recommend/recommendinfo/pkid/"+pkid;
}

/**
 * 审核
 */
function examines(pkid){
	 if(confirm("你确定要审核吗？？？")){
		$.post("/yonghu/recommend/recommendstatus/",{pkid:pkid,submit:'1'},function(data){
			if(data == 'Y'){
				doSearch();
			}else{
				doSearch();
				alert('操作失败');
			}
		});
	}
}
/**
 * 导出
 */
var sleep = 10, interval = null;
window.onload = function (){
    var btn = document.getElementById ('doExport');
    btn.onclick = function (){
        if (!interval){
            this.style.backgroundColor = '#cccccc';
            this.disabled = "disabled";
            this.style.cursor = "wait";
            this.value = "稍后"+sleep--;
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
                btn.value = "稍后"+sss;
            }, 1000);
            //
            var mainmobile = $('#mainmobile').val();
    		var passivemobile = $('#passivemobile').val();
    		var ordercode = $('#ordercode').val();
    		var createtime_start = $('#createtime_start').val();
    		var createtime_end = $('#createtime_end').val();
    		var types = $('#types').val();
    		var status = $('#status').val();
    		var param = "?mainmobile="+mainmobile+"&passivemobile="+passivemobile+"&ordercode="+ordercode+"&sources="+sources;
    		param += "&createtime_start="+createtime_start+"&createtime_end="+createtime_end+"&types="+types+"&status="+status;
    		window.location.href="/yonghu/recommend/recommendexport"+param;
            //
        }
    }
}

function getParams(){
    return {
    	mainmobile:$('#mainmobile').val(), 
    	passivemobile:$('#passivemobile').val(),
    	ordercode:$('#ordercode').val(),
    	createtime_start:$('#createtime_start').val(),
    	createtime_end:$('#createtime_end').val(),
    	types:$('#types').val(),
    	status:$('#status').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}

