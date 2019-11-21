var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :15,
		height:380
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		    ,{header:"模板名称", dataIndex:'NAME', width:'100px', sortable:false}
		    ,{header:"模板金额", dataIndex:'', width:'100px', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['PRICE'] == 0) {
						return  '无限额';
					}else {
						return data['PRICE']+'&nbsp;元';
					}

				}
			}
		    ,{header:"创建时间", dataIndex:'CREATEDATE', width:'120px', sortable:false}
           ,{header:"是否启用", dataIndex:'STATUS', width:'80px', sortable:false,
				renderer:function(value,data) {
					if(data['STATUS'] == 'Y') {
						return '启用';
					}else {
						return '停用';
					}
				}
			}
           ,{header:"操作", dataIndex:'', width:'120px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
				   var returnText = '';
				    if(data['STATUS'] == 'Y') {
						returnText +='<a class="a_link" href="javascript:void(0);" onclick="del(\''+data['ID']+'\')">停用</a>';
					}else {
						returnText +='<a class="a_link" href="javascript:void(0);" onclick="enable(\''+data['ID']+'\')">启用</a>';
					}
					return returnText;
				}
           }
       ]
       ,url : '/device/business/templetelist'
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

function del(id) {
	if(confirm('请谨慎操作，如果停用则无法继续使用改模板进行发送红包！')) {
		$.ajax({
			url:'/device/business/delactivetemplete',
			type:'post',
			data:{id:id},
			dataType:'json',
			async:false,
			success:function(res) {
				if(res == 'Y') {
					window.location.href = '/device/business/activetemplete';
				}else {
					alert('停用异常');
				}

			}
		})
	}
}


function getParams(){
    return {
    	name:$('#name').val(),
    	price:$('#price').val(),
    	flag:$('#flag').val(),
    };
}

function doSearch(){
	grid.query(getParams());
}


function doAdd() {
	window.location.href = '/device/business/addactivetemplete';
}

function enable(id) {
	$.ajax({
		url:'/device/business/enabletemplete',
		type:'post',
		data:{id:id},
		dataType:'json',
		async:false,
		success:function(res) {
			if(res == 'Y') {
				window.location.href = '/device/business/activetemplete';
			}else {
				alert('启用异常');
			}
		}
	})
}