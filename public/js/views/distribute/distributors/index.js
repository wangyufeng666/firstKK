var grid;
$().ready(function(){
	initProvinces();
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header:"NO.", dataIndex:'R', width:'40px', sortable:false}
           ,{header:"渠道商名称", dataIndex:'PARTNERNAME', width:'', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					if(data['BUSINESSCODE'] == 11) {
						return '小红箱'
					}else {
						return value;
					}
				}
			}
           ,{header:"合作商类型", dataIndex:'PARTNERTAG', width:'', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				switch(value) {
					case '1':
						return '平台商';
						break;
					case '2':
						return '品牌厂商';
						break;
					case '3':
						return '跨界合作';
						break;
					default:
						return '';
				}
			}}
           ,{header:"合作商编码", dataIndex:'PARTNERCODE', width:'', sortable:false}
           ,{header:"端口名称", dataIndex:'SOURCENAME', width:'', sortable:false}
           ,{header:"端口编码", dataIndex:'SOURCECODE', width:'', sortable:false}
           ,{header:"端口类型", dataIndex:'SOURCETYPE', width:'', sortable:false,
           	   renderer : function(value, data, rowIndex, colIndex, metadata){
				   switch(value) {
					   case '1':
						   return '海外';
						   break;
					   case '2':
						   return '回收箱';
						   break;
					   case '3':
						   return '企业回收';
						   break;
					   case '4':
						   return '线上回收';
						   break;
					   case '5':
						   return '线下回收';
					       break;
					   case '6':
						   return '新零售';
					       break;
					   case '7':
						   return '租赁';
					       break;
					   default:
						   return '';
				   }
             }        	   
           }
           ,{header:"创建时间", dataIndex:'CREATEDATE', width:'', sortable:false}
           ,{header:"上线时间 ", dataIndex:'ONLINEDATE', width:'', sortable:false}
           ,{header:"运营负责人 ", dataIndex:'SUPERVISOR', width:'', sortable:false}
           ,{header:"渠道状态", dataIndex:'SOURCESTATUS', width:'', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					switch(value) {
						case '1':
							return '待上线';
							break;
						case '2':
							return '开发中';
							break;
						case '3':
							return '已停用';
							break;
						case '4':
							return '运营中';
							break;
						default:
							return '';
					}
				}
			}
           ,{header:"渠道标签", dataIndex:'SOURCETAG', width:'', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					switch(value) {
						case '1':
							return '优质渠道';
							break;
						case '2':
							return '战略合作';
							break;
						case '3':
							return '普通渠道';
							break;
						case '4':
							return '业务探索';
							break;
						default:
							return '';
					}
				}
			}
           ,{header:"操作", dataIndex:'', width:'20%', sortable:false,
        	   renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText =' <a class="a_link" href="javascript:void(0);" onclick="distributorsinfo(\''+data['PARTNERID']+'\',\''+data['SOURCEID']+'\')">渠道详情</a> | ';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="edit(\''+data['PARTNERID']+'\')">编辑渠道</a> | ';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="editSource(\''+data['SOURCEID']+'\')">编辑端口</a> | ';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="deldistributors(\''+data['PARTNERID']+'\',\''+data['SOURCEID']+'\')">删除</a> ';
					return returnText;
				}
           }
       ]
       ,url : '/distribute/distributors/pagelist'
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
function distributorsinfo(partnerId,sourceId){
	layer.open({
		type:2,
		title:'详情',
		content:'/distribute/distributors/distributorsinfo?partnerId='+partnerId+'&sourceId='+sourceId,
		shadeClose:false,
		shade:0.8,
		area:['1200px' , '550px'],
		close:function(index){
			layer.close(index);
		}
	});

}

/**
 * 新增渠道商
 */
function addStore(){
	layer.open({
		type:2,
		title:'新增',
		content:'/distribute/distributors/adddistributors?layer=Y',
		shadeClose:false,
		shade:0.8,
		area:['1200px' , '650px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 功能描述：修改渠道商信息
 */
function edit(partnerId){
	layer.open({
		type:2,
		title:'修改',
		content:'/distribute/distributors/editdistributors?partnerId='+partnerId,
		shadeClose:false,
		shade:0.8,
		area:['1200px' , '650px'],
		close:function(index){
			layer.close(index);
		}
	});
}

/**
 * 功能描述：修改渠道商信息
 */
function editSource(sourceId){
	layer.open({
		type:2,
		title:'修改',
		content:'/distribute/distributors/editsource?sourceId='+sourceId,
		shadeClose:false,
		shade:0.8,
		area:['1200px' ,'650px'],
		close:function(index){
			layer.close(index);
		}
	});
}



function deldistributors(partnerId,sourceId){
	layer.confirm('请选择删除合作商或端口', {
		btn: ['合作商','合作端口'] //按钮
	}, function(){
		layer.confirm('是否确认删除该渠道商？',{
			btn:['确认','取消']
		},function(){
			$.ajax({
				type:'POST'//请求方式
				,url:"/distribute/distributors/deldistributors"  //请求路径
				,data:{partnerId:partnerId} //发送到服务器的数据
				,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async:false //同步请求
				,timeout:60000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
					if(data == "Y"){
						window.location.href = "/distribute/distributors/index";
					}else{
						layer.msg("删除失败",1);
					}
				}
			});
		},function(){

		})
	}, function(){
		layer.confirm('是否确认删除该合作商端口？',{
			btn:['确认','取消']
		},function(){
			$.ajax({
				type:'POST'//请求方式
				,url:"/distribute/distributors/deletesource"  //请求路径
				,data:{sourceId:sourceId} //发送到服务器的数据
				,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
				,async:false //同步请求
				,timeout:60000//默认超时60秒
				,dataType:'json' //预期服务器返回的数据类型
				,success:function(data){
					if(data == "Y"){
						window.location.href = "/distribute/distributors/index";
					}else{
						layer.msg("删除失败",1);
					}
				}
			});
		},function(){

		})
	});
}
function getParams(){
    return {
    	partnerName:$('#partnerName').val(), 
    	partnerCode:$('#partnerCode').val(),
    	startCreateDate:$('#startCreateDate').val(),
    	endCreateDate:$('#endCreateDate').val(),
		sourceType:$('#sourceType').val(),
		sourceStatus:$('#sourceStatus').val(),
		partnerTag:$('#partnerTag').val(),
		provinceId:$('#provinceId').val(),
		mobile:$('#mobile').val(),
		cityId:$('#cityId').val()
    };
}

function doSearch(){
	//layer.load('数据加载中...', 1);
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
	param += '&sourceType=' + $('#sourceType').val();
	param += '&sourceStatus=' + $('#sourceStatus').val();
	param += '&partnerTag=' + $('#partnerTag').val();
	param += '&mobile=' + $('#mobile').val();
	param += '&provinceId=' + $('#provinceId').val();
	param += '&cityId=' + $('#cityId').val();
	window.location.href = '/distribute/distributors/exprotpartners?'+param;
	return false; //截取返回false就不会保存网页了
}
