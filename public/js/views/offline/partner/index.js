var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
           ,{header:"合作商名称", dataIndex:'PARTNERNAME', width:'160px', sortable:false}
           ,{header:"合作商编号", dataIndex:'PARTNERCODE', width:'120px', sortable:false}
           ,{header:"用户名", dataIndex:'USERNAME', width:'160px', sortable:false}
           ,{header:"法人", dataIndex:'LEGALPERSON', width:'160px', sortable:false}
           ,{header:"法人电话： ", dataIndex:'LEGALPERSONMOBILE', width:'120px', sortable:false}
           ,{header:"操作", dataIndex:'', width:'160px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editpassword(\''+data['PKID']+'\')">重置密码</a> ';
					return returnText;
				}
           }
       ]
       ,url : '/offline/partner/pagelist'
	});
});


function getParams(){
    return {
    	companyName:$('#companyName').val(), 
    	partnerCode:$('#partnerCode').val(),
    	legalperson:$('#legalperson').val(),
    	legalpersonmobile:$('#legalpersonmobile').val(),
    	username:$('#username').val()
    };
}

function editpassword(pkid){
	if(confirm('确定将该合作商密码重置为123456吗？')){
		$.post("/offline/partner/editpassword",{id:pkid},function(data){
			if(data == 'Y'){
				window.location.href = window.location.href;
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