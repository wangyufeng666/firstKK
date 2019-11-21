var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
           ,{header:"推广人", dataIndex:'NAME', width:'160px', sortable:false}
           ,{header:"推广人编号", dataIndex:'PROMOCODE', width:'120px', sortable:false}
           ,{header:"联系电话", dataIndex:'MOBILE', width:'160px', sortable:false}
           ,{header:"所属合作商", dataIndex:'PARTNERNAME', width:'160px', sortable:false}
           ,{header:"是否登录过", dataIndex:'WEIXINIMG', width:'160px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['WEIXINIMG']){
						return '<font color="green">已登录</font>';
					}else{
						return '<font color="red">从未登录</font>';
					}
				}
           }
           ,{header:"审批状态", dataIndex:'APPROVAL', width:'160px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['APPROVAL'] == 'Y'){
						return '<font color="green">已审核</font>';
					}else if (data['APPROVAL'] == 'N'){
						return '<font color="red">未审核</font>';
					}
				}
           }
           ,{header:"操作", dataIndex:'', width:'160px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
        		   if(data['APPROVAL'] == 'Y'){
        			   var returnText ='<a href="#" class="a_link">已审批</a> |';
        		   }else{
        			   var returnText ='<a class="a_link" href="javascript:void(0);" onclick="approvalpromoter(\''+data['PROMOCODE']+'\')">审批</a> |';
        		   }
        		    returnText +='<a class="a_link" href="javascript:void(0);" onclick="editpromoter(\''+data['PROMOCODE']+'\')">修改</a> | '; 
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="deletepromoter(\''+data['PROMOCODE']+'\')">删除</a> ';
					return returnText;
				}
           }
       ]
       ,url : '/offline/promoters/pagelist'
	});
});


function getParams(){
    return {
    	promoter:$('#promoter').val(), 
    	promoCode:$('#promoCode').val(),
    	mobile:$('#mobile').val(),
    	partnerCode:$('#partnerCode').val(),
    	approval:$('#approval').val()
    };
}

//新增推广人
function addPromoter(){
	window.location.href="/offline/promoters/addpromoter";
}

//审批推广人
function approvalpromoter(promoCode){
	if(confirm("确定审批该推广人吗？")){
		$.post('/offline/promoters/approvalpromoter',{promoCode:promoCode},function(data){
			if(data == 'Y'){
				alert('审批通过');
				window.location.reload();
			}else{
				alert('审批失败');
			}
		});
	}
}

//修改推广人信息
function editpromoter(promoCode){
	$.layer({
		type:2,
		title:'修改推广人信息',
		iframe:{src:'/offline/promoters/editpromoter?promoCode='+promoCode},
		area:['500' , '320'],
		offset:['50px',''],
		close:function(index){
			layer.close(index);
		}
	});
}

//删除推广人
function deletepromoter(promoCode){
	if(confirm("确定删除该推广人吗？")){
		$.post('/offline/promoters/deletepromoter',{promoCode:promoCode},function(data){
			if(data == 'Y'){
				alert('删除成功');
				window.location.reload();
			}else{
				alert('删除失败');
			}
		});
	}
}

initProvince();
//省份初始化
function initProvince(){
	$("#sheng").html("<option value=''>请选择省份</option>");
	$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,async:false,url:openapiUrl+'/util/util/getprovince',
		success:function(data){
			var optionHtml = "", name = "";
			for(i in data){
				name = data[i]['NAME'];
				optionHtml += "<option value='"+data[i]['ID']+"' title='"+name+"'>"+name+"</option>";
			}
			$("#sheng").append(optionHtml);
		}
	});
}

//省动态改变
$('#sheng').change(function(){
	$("#shi").html("<option value='' flag='N'>请选择城市</option>");
	$("#partnerCode").html("<option value='' flag='N'>请选择地区</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'jsonp',jsonp:'jsonp_callback',cache:false,data:{provinceId:thisVal},url:openapiUrl+'/util/util/getcity',
			success:function(data){
				var optionHtml = '', id = '', name = '';
				for(i in data){
					id = data[i]['ID'];
					name = data[i]['NAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#shi").append(optionHtml);
			}
		});
	}
});

//合作商动态改变
$('#shi').change(function(){
	$("#partnerCode").html("<option flag='' value=''>请选择合作商</option>");
	var thisVal = $(this).val();
	if(thisVal != ''){
		$.ajax({type:'GET',dataType:'json',cache:false,data:{cityId:thisVal},url:'/system/brokerage/getpartners',
			success:function(data){
				var optionHtml = '',id = '',name = '';
				for(i in data){
					id = data[i]['PARTNERCODE'];
					name = data[i]['PARTNERNAME'];
					optionHtml += "<option value='"+id+"' title='"+name+"'>"+name+"</option>";
				}
				$("#partnerCode").append(optionHtml);
			}
		});
	}
});




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