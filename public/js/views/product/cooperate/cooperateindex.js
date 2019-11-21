var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px',sortable:false}
			,{header:"合作商", dataIndex:'PARTNERNAME', width:'100px',sortable:false}
			,{header:"商品类型", dataIndex:'MERTYPENAME', width:'80px',sortable:false}
			,{header:"所属品牌", dataIndex:'PNAME', width:'80px',sortable:false}
			,{header:"品牌编码", dataIndex:'PCODE', width:'80px',sortable:false}
			,{header:"商品名称", dataIndex:'MERNAME', width:'150px',sortable:false}
			,{header:"合作商商品名称", dataIndex:'P_MERNAME', width:'150px',sortable:false}
			,{header:"合作商商品ID", dataIndex:'P_MERID', width:'100px',sortable:false}
			,{header:"热度", dataIndex:'REDU', width:'80px',sortable:false}
			,{header:"操作", dataIndex:'', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a class="a_link" href="javascript:editThis(\''+data['MERID']+'\',\''+data['P_MERID']+'\',\''+data['P_CODE']+'\')">修改</a>';
					
					var returnText = '<a class="a_link" href="javascript:deleteThis(\''+data['PKID']+'\', '+JSON.stringify(data).replace(/"/g, '&quot;')+')">删除</a>';
					return returnText;
				}
			}
		]
		,url:'/product/cooperate/pagelist'
		,baseParams:getParams()
	});
	
	$("#merType").change(function(){
	    var merType = $(this).val();
	    if(merType != ''){
	    	$.post('/common/brands/getbrandslist', {merType:merType}, function(data){
	    		$("#brandCode").html("<option value=''>全部</option>");
	    		for(i in data){
	    			$("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
	    		}
	    	}, 'json');
	    }else{
	    	$("#brandCode").html("<option value=''>全部</option>");
	    }
	});
});

/**
 * 新增合作商商品
 * @return
 */
function addPartnerMer(){
	layer.open({
		type:2,
		title:'新增合作商商品信息',
		shadeClose:false,
		shade:0.8,
		content:'/product/cooperate/addcooperate',
		area:['800px', '500px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 跳转到修改商品页面
 * @param orderNo
 */
function editThis(merId){
    window.location.href = "/product/cooperate/editcooperate?merId="+merId;
}

/**
 * 删除
 */
function deleteThis(pkId, data){
	
	var mountFlag='', merStatus='', operFlag='', partnerCode='';
	
	if(partnerCode == '10000070'){
		if(mountFlag == '3' || mountFlag == '4' || merStatus == '0' || operFlag == '2'){
			alert('当前商品处于挂载状态，不能删除');
			return;
		}
	}
	
    if(confirm('是否确认删除选中的商品？')){
        $.post('/product/cooperate/delpartnermer', {pkId:pkId}, function(data){
            if(data == 'Y'){
                doSearch();
            }
        });
    }
}

function getParams(){
    return {
    	partnerCode:$('#partnerCode').val(),
    	merType:$('#merType').val(),
    	brandCode:$('#brandCode').val(),
    	merName:$('#merName').val(),
    };
}

function reload(){
	layer.closeAll('iframe');
	grid.reload();
}

function doSearch(){
    grid.query(getParams());
}