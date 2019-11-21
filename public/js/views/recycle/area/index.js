//省市列表分页
var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:20,
		height:500
		,cm:[
			{header:"No.", dataIndex:'R', width:'60PX',sortable:false} 
			,{header:"省份ID", dataIndex:'PROVINCEID', width:'80px',sortable:false}
			,{header:"省份", dataIndex:'PROVINCE', width:'200px',sortable:false}
			,{header:"城市ID", dataIndex:'CITYID', width:'80px',sortable:false}
			,{header:"城市", dataIndex:'CITY', width:'200px',sortable:false}
			,{header:"地铁交易标记", dataIndex:'FLAG',width:'200px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['FLAG'] == 5){
						var returnText ='<a href="javascript:offSubway(\''+data['CITYID']+'\',\''+data['PROVINCEID']+'\');" class="a_link" style="color:red" >是</a>';
					}else{
						var returnText = '<a href="javascript:openSubway(\''+data['CITYID']+'\',\''+data['PROVINCEID']+'\');" class="a_link" >否</a>';
					}
					return returnText;
				}
			}
			,{header:"地区", dataIndex:'', width:'', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var returnText = '<a class="a_link" href="javascript:void(0);" onclick="info(\''+data['CITYID']+'\')">详情</a>';
					return returnText;
				}
			}
		]
		,url:'/recycle/area/pagelist'
		,baseParams:{province:$('#province').val(), city:$('#city').val(),keyword:$('#keyword').val(),flag:$('#flag').val()}
	});
});

function getParams(){
	return {
		province:$('#province').val(), 
		city:$('#city').val(),
		keyword:$('#keyword').val(),
		flag:$('#flag').val(),
	};
}

//查询
function doSearch(){
	layer.load('数据加载中...', 1);
	grid.query(getParams());
}

//index 地区二级  （城市 ）
$().ready(function(){
	$('#province').change(function(){
		var parentid = $(this).val();
		var a = '<option value="">请选择</option>',b = '';
		if(parentid == ''){
			$('#city').html(a);
		}
		$.post('/recycle/area/getcity',{parentid:parentid},function(data){
			if(data.length > 0){
				for(i in data){
					b = b +'<option value="'+data[i]["AREA_ID"]+'">'+data[i]["AREA_NAME"]+'</option>';
				}
				$('#city').html(a+b);
			}
		})
	});
});

//区域详情
function info(code){
	var flags = $('#flag').val();
	var url = '/recycle/area/areainfo/citycode/'+code;
	if(flags == 2){
		url = '/recycle/area3c/areainfo/citycode/'+code;
	}
	if(flags == 3){
		url = '/recycle/areabigappliances/areainfo/citycode/'+code;
	}
	$.layer({
		type:2,
		title:'区域详情',
		iframe:{src:url},
		area:['800', '600'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}

//地区开通地铁交易
function openSubway(cityid,pid){
	var txt = '当前城市开通地铁交易？';
	if(confirm(txt)){
		areaSubwayUpdate(cityid, 5,pid);
	}
}

//地区关闭地铁交易
function offSubway(cityid,pid){
	var txt = '当前城市关闭地铁交易？';
	if(confirm(txt)){
		areaSubwayUpdate(cityid, 0,pid);
	}
}

//修改地铁交易
function areaSubwayUpdate(cityid,flag,pid){
	$.post('/recycle/subway/opensubway',{cityid:cityid,flag:flag,pid:pid},function(data){
		if(data == 1){
			alert('操作成功');
			window.location.reload();
		}else{
			alert('操作失败');
		}
	});
}