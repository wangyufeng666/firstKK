var grid;
$().ready(function(){
	initProvinces();
	
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm:[
			{header:"NO.", dataIndex:'R', width:'40px', sortable:false}
			,{header:"省份", dataIndex:'PROVINCE', width:'80px', sortable:false}
			,{header:"城市", dataIndex:'CITY', width:'80px', sortable:false}
			,{header:"门店编号", dataIndex:'STORENO', width:'80px', sortable:false}
			,{header:"门店名", dataIndex:'STORENAME', sortable:false}
			,{header:"门店地址", dataIndex:'STOREADDRESS', width:'20%', sortable:false}
			,{header:"门店类型", dataIndex:'STORETYPE', width:'20%', sortable:false}
			,{header:"备注", dataIndex:'REMARKS', width:'20%', sortable:false}
			,{header:"操作", dataIndex:'', width:'100px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="editStore(\''+data['STORENO']+'\')">修改</a> | ';
					returnText +='<a class="a_link" href="javascript:void(0);" onclick="delStore(\''+data['STORENO']+'\')">删除</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/offlinestore/storelist'
	    ,baseParams:initParams()
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

function initParams(){
	if(backFlag == 'Y'){
		var params = getParams();
		params['start'] = start;
		return params;
	}else{
		return {};
	}
}

/**
 * 新增门店
 */
function addStore(){
	window.location.href = "/recycle/offlinestore/addstore?backUrl="+backUrl;
}
/**
 * 功能描述：修改门店
 */
function editStore(storeNo){
	window.location.href = "/recycle/offlinestore/editstore?storeNo="+storeNo+"&backUrl="+backUrl;
}

/**
 * 删除门店信息
 */
function delStore(storeNo){
	if(confirm('是否确认删除门店？')){
		$.ajax({
			type:'POST'//请求方式
			,url:"/recycle/offlinestore/delstore"  //请求路径
			,data:{storeNo:storeNo} //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:10000//超时10秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					window.location.href = backUrl+'?backFlag=Y';
				}else{
					alert("删除失败");
				}
			}
		});
	}
}

function getParams(){
	return {
		storeNo:$('#storeName').val(),
		storeName:$('#storeName').val(),
		provinceId:$('#provinceId').val(),
		cityId:$('#cityId').val(),
		start:start
	};
}

function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

function errorBox(msg){
	$.layer({
		title:'错误',
		area:['280px','auto'],
		dialog:{msg:msg, type:8}    
	});
}