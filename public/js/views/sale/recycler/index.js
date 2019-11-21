var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375,
		cm:[
			{header:"No.", dataIndex:'R', width:'40px',sortable:false} 
			,{header:"创建时间", dataIndex:'CREATEDATE', width:'100px',sortable:false}
			,{header:"合作商名称", dataIndex:'PROVIDERNAME',sortable:false}
			,{header:"联系人", dataIndex:'LIANXIREN', width:'100px',sortable:false}
			,{header:"联系电话", dataIndex:'DIANHUA', width:'100px',sortable:false}
			,{header:"用户名", dataIndex:'USERNAME', width:'100px',sortable:false}
            ,{header:"登入名", dataIndex:'LOGINNAME', width:'100px',sortable:false}
			,{header:"用户状态", dataIndex:'USERSTATUS', width:'100px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return value == 'USERSTATUS_1' ? '有效':'无效';
				}
			}
			,{header:"操作", dataIndex:'PROVIDERID', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a href="javascript:updateRecycler(\''+value+'\')" class="a_link">修改</a>';
					return returnText;
				}
			}
		]
		,url:'/sale/recycler/pagelist'
		,baseParams:initParams()
		,pageSizeList:[10,15,20,30,50]
	});
});

function initParams(){
	return getParams();
}

/**
 * 添加合作商
 */
function addRecycler(){
    layer.open({
        type:2,
        title:'添加合作商',
        shadeClose:true,
        content:'/sale/recycler/addrecycler',
        area:['600px','450px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 修改合作商信息
 */
function updateRecycler(providerId){
    layer.open({
        type:2,
        title:'添加合作商',
        shadeClose:true,
        content:'/sale/recycler/updaterecycler?providerId='+providerId,
        area:['600px','450px'],
        close:function(index){
            layer.close(index);
        }
    });
}

/**
 * 搜索参数
 */
function getParams(){
    return {
    	providerName:$('#providerName').val(),
    	contactWay:$('#contactway').val(),
        loginName:$('#loginName').val()
    };
}

/**
 * 搜索
 */
function doSearch(){
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