var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		   {header:"NO.", dataIndex:'R', width:'3%', sortable:false}
		   ,{header:"创建时间", dataIndex:"CREATEDATE", width:'10%', sortable:false}
           ,{header: "收货人", dataIndex: '', width:'10%',sortable:false
                ,renderer : function(value, data, rowIndex, colIndex, metadata){
                  return data['REALNAME']+'('+data['MOBILE']+')';
                }
            }
           ,{header:"收货地址", dataIndex:'ADDRESS', width:'62px', sortable:false}
		   ,{header:"企业名称", dataIndex:'EP_NAME', width:'10%', sortable:false}
           ,{header: "企业证件号", dataIndex: 'EP_CERT_NO', width:'15%',sortable:false}
           ,{header: "企业证件类型", dataIndex: 'EPCERTTYPENAME', width:'10%',sortable:false}
           ,{header: "会员类型", dataIndex: 'MEMBERTYPENAME', width:'10%',sortable:false}
           ,{header: "法人名称", dataIndex: 'NAME', width:'15%',sortable:false}	   
           ,{header:"免押状态", dataIndex:'PASSEDNAME', width:'8%', sortable:false}
           ,{header:"免押额度", dataIndex:'FREE_DEPOSIT_AMOUNT', width:'8%', sortable:false}
           ,{header:"已用额度", dataIndex:'USE_DEPOSIT_AMOUNT', width:'8%', sortable:false}
           ,{header:"可用额度", dataIndex:'AVAILABLE_CREDIT', width:'8%', sortable:false}
           ,{header:"状态", dataIndex:'STATUSNAME', width:'8%', sortable:false}
           ,{header: "操作", dataIndex: '', width:'15%', sortable:false, 
              renderer:function(value, data, rowIndex, colIndex, metadata){
                var id = data['PKID'];
                var returnText ='<a href="javascript:void(0);" title="'+id+'" onclick="companyInfo(\''+id+'\')" class="a_link">查看</a>';
                if(data['STATUS'] == '1'){
                  returnText +=' | <a href="javascript:void(0);" title="'+id+'" onclick="lock(\''+id+'\')" class="a_link">锁定</a>';
                }else{
                  returnText +=' | <a href="javascript:void(0);" title="'+id+'" onclick="deblock(\''+id+'\')" class="a_link">解锁</a>';
                }
                return returnText;
            }
          }
]
      ,url : '/businessrent/user/conpanyinfo'
	  ,baseParams:initParams()
	  ,pageSizeList:[10,15,20,30,50]
	});
});

function reload(){
    layer.closeAll();
    grid.reload();
}
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
function lock(id){
  layer.confirm('确认锁定吗？', {
        btn: ['确认', '取消']
    }, function(){
        $.ajax({
            url:"/businessrent/user/lock",
            type:"post",
            data:{id:id},
            dataType:"json",
            success:function(data){
                if(!data){
                    layer.msg('锁定失败');
                }else{
                    layer.msg('锁定成功');
                    grid.reload();
                }
            },
            error:function(){
                layer.msg('网络错误！');
            }
        });
    });

}

/**
 * 查看用户详情
 * @param id
 */
function companyInfo(id){
  window.location.href = "/businessrent/user/companydetail?id="+id+"&backUrl="+backUrl;
}

/**
 * 解锁
 * @param id
 */
function deblock(id){
  layer.confirm('确认解锁吗？', {
        btn: ['确认', '取消']
    }, function(){
        $.ajax({
            url:"/businessrent/user/deblock",
            type:"post",
            data:{id:id},
            dataType:"json",
            success:function(data){
                if(!data){
                    layer.msg('解锁失败');
                }else{
                    layer.msg('解锁成功');
                    grid.reload();
                }
            },
            error:function(){
                layer.msg('网络错误！');
            }
        });
    });

}
function getParams(){
    return {
        startDate:$('#startDate').val(),
        mobile:$.trim($('#mobile').val()),
        epName:$.trim($('#epName').val()),
        epCertNo:$.trim($('#epCertNo').val()),
        passEd:$('#passEd').val(),
        memberType:$('#memberType').val(),
        epCertType:$('#epCertType').val(),
        status:$('#status').val()
    };
}

function doSearch(){
    var index = layer.load(2, {time: 2*1000}); //2秒 
    layer.close(index);
   	grid.query(getParams());
}
