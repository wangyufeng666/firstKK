var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
		    ,{header:"所属门店", dataIndex:'PARTNERNAME', width:'120px', sortable:false}
           ,{header:"店员", dataIndex:'NAME', width:'160px', sortable:false}
           ,{header:"联系电话", dataIndex:'MOBILE', width:'160px', sortable:false}
           ,{header:"支付宝", dataIndex:'ZHIFUBAO', width:'100px', sortable:false}
           ,{header:"真实姓名", dataIndex:'REALNAME', width:'80px', sortable:false}
           ,{header:"负责设备", dataIndex:'', width:'160px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		   	return data['TYPENAME']+'-'+data['DEVICEID'];
				}
           }
           ,{header:"操作", dataIndex:'', width:'160px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		     var returnText ='<a class="a_link" href="javascript:void(0);" onclick="deletepromoter(\''+data['PROMOCODE']+'\')">删除</a>';
        		     returnText +=' | <a class="a_link" href="javascript:void(0);" onclick="editPromoter(\''+data['PROMOCODE']+'\')">编辑</a>';
					return returnText;
				}
           }
       ]
       ,url : '/device/promoter/pagelist'
	});
});


function getParams(){
    return {
    	contacts:$('#contacts').val(), 
    	partnerName:$('#partnerName').val()
    };
}

//修改推广人信息
function editPromoter(promoCode){
	$.layer({
		type:2,
		title:'修改推广人信息',
		iframe:{src:'/device/promoter/editpromoter?promoCode='+promoCode},
		area:['500' , '320'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

//删除推广人
function deletepromoter(promoCode){
	if(confirm("确定删除该店员吗？")){
		$.post('/device/promoter/delpromoter',{promoCode:promoCode},function(data){
			if(data == 'Y'){
				window.location.reload();
			}else{
				alert('删除失败');
			}
		});
	}
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
    $.layer({
        title:'错误',
        area : ['280px','auto'],
        dialog : {msg:msg, type:8}    
    });
}