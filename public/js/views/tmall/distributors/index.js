var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
           ,{header:"渠道商名称", dataIndex:'PARTNERNAME', width:'100px', sortable:false}
           ,{header:"渠道商别名", dataIndex:'NICKNAME', width:'100px', sortable:false}
           ,{header:"渠道商编号", dataIndex:'PARTNERCODE', width:'100px', sortable:false}
           ,{header:"联系方式", dataIndex:'CONTACTS', width:'100px', sortable:false,
           	   renderer : function(value, data, rowIndex, colIndex, metadata){
               return data['CONTACTWAY']+'('+data['CONTACTS']+')';
             }        	   
           }
           ,{header:"结算方式", dataIndex:'TRADETYPENAME', width:'50px', sortable:false}
           ,{header:"详细地址： ", dataIndex:'ADDRESS', width:'160px', sortable:false}
           ,{header:"渠道商合作状态： ", dataIndex:'PARSTATUSNAME', width:'50px', sortable:false}
           ,{header:"审批状态", dataIndex:'STATUSNAME', width:'50px', sortable:false}
           ,{header:"操作", dataIndex:'', width:'160px', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText =' <a class="a_link" href="javascript:void(0);" onclick="distributorsinfo(\''+data['PARTNERID']+'\')">详情</a>| ';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['PARTNERID']+'\')">修改</a> |';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="deldistributors(\''+data['PARTNERID']+'\')">删除</a>| ';
					if((data['PARTNERTYPE'] == '5' || data['BUSINESSCODE'] == '8') && data['AUDITSTATUS'] == '0'){
						returnText +='<a class="a_link" href="javascript:void(0);" onclick="approval(\''+data['PARTNERCODE']+'\')">审批</a>';
					}
					return returnText;
				}
           }
       ]
       ,url : '/tmall/distributors/pagelist'
	});
	
/**
 * 省份初始化
 * @return
 */
function initProvinces(){
	$.ajax({type:'POST', dataType:'jsonp', jsonp:'jsonp_callback',
		url:openApiDomain+'/recycle/area/provinces',
		success:function(data){
			var optionsText = "<option value=''>请选择省份</option>";
			for(i in data){
				optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
			}
			$('#provinceId').html(optionsText);
			$('#provinceId').val(provinceId);
			$('#cityId').val(cityId);
		}
	});
}

/**
 * 省份change
 */
$("#provinceId").change(function(){
	var provinceId = $('#provinceId').val();
	if(provinceId != ""){
		var optionsText = "<option value=''>请选择城市</option>";
		$.ajax({type:'GET', dataType:'jsonp', jsonp:'jsonp_callback',
			data:{pid:provinceId},
			url:openApiDomain+'/recycle/area/citys',
			success:function(data){
				for(i in data){
					optionsText += "<option value='"+data[i]['ID']+"' title='"+data[i]['NAME']+"'>"+data[i]['NAME']+"</option>";
				}
				$('#cityId').html(optionsText);
				}
			});
		}
	});
});

/**
 * 渠道商详情
 */
function distributorsinfo(partnerId){
	window.location.href = "/tmall/distributors/distributorsinfo?partnerId="+partnerId;
}

/**
 * 新增渠道商
 */
function addStore(){
	window.location.href = "/tmall/distributors/adddistributors";
}

/**
 * 功能描述：修改渠道商信息
 */
function edit(partnerId){
	window.location.href = "/tmall/distributors/editdistributors?partnerId="+partnerId;
}

/**
 * 功能描述：审批合作商
 */
function approval(partnerCode){
	if(confirm("是否确认审批该合作商？")){
		$.ajax({
			type:'POST'//请求方式
				,url:"/tmall/distributors/approval"  //请求路径
					,data:{partnerCode:partnerCode} //发送到服务器的数据
		,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
		,async:false //同步请求
		,timeout:60000//默认超时60秒
		,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					doSearch();
				}else{
					alert("该合作商没有佣金策略或活动策略，无法审批");
				}
			}
		});
	}
}

function deldistributors(partnerId){
	if(confirm('是否确认删除该渠道商？')){
	$.ajax({
        type:'POST'//请求方式
        ,url:"/tmall/distributors/deldistributors"  //请求路径
        ,data:{partnerId:partnerId} //发送到服务器的数据
        ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async:false //同步请求
        ,timeout:60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
		,success:function(data){
    		if(data == "Y"){
    			window.location.href = "/tmall/distributors/index";
            }else{
				alert("删除失败");
            }
		}
	});
  }
}
function getParams(){
    return {
    	partnerName:$('#partnerName').val(), 
    	partnerCode:$('#partnerCode').val(),
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
    	auditStatus:$('#auditStatus').val(),
    	partnerStatus:$('#partnerStatus').val(),
    	businessCode:$('#businessCode').val(),
    	mobile:$('#mobile').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		typeCode:$('#typeCode').val(),
    };
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

function exprotPartners(){
	var param = '';
	param += '&partnerName=' + $('#partnerName').val();
	param += '&partnerCode=' + $('#partnerCode').val();
	param += '&startCreateDate=' + $('#startCreateDate').val();
	param += '&endCreateDate=' + $('#endCreateDate').val();
	param += '&auditStatus=' + $('#auditStatus').val();
	param += '&partnerStatus=' + $('#partnerStatus').val();
	param += '&businessCode=' + $('#businessCode').val();
	param += '&mobile=' + $('#mobile').val();
	param += '&provinceId=' + $('#provinceId').val();
	param += '&cityId=' + $('#cityId').val();
	param += '&typeCode=' + $('#typeCode').val();
	window.location.href = '/tmall/distributors/exprotpartners?'+param;
	return false; //截取返回false就不会保存网页了
}