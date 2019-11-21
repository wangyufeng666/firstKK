//省市列表分页
var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    
{header: "No.", dataIndex: 'R', width:'100PX',sortable:false} 
,{header: "省份", dataIndex: 'PROVINCE', width:'250px',sortable:false}
,{header: "城市", dataIndex: 'CITY', width:'250px',sortable:false}
,{header: "地铁线路", dataIndex: 'FLAG',width:'200px',sortable:false,
	renderer : function(value, data, rowIndex, colIndex, metadata){
		var returnText ='<a class="a_link " href="javascript:void(0);" onclick="subwayinfo(\''+data['CITYID']+'\',\''+data['CITY']+'\')">详情</a>';
		return returnText;
	}
}
,{header: "地区", dataIndex: '', width:'', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
				  	var returnText ='<a class="a_link " href="javascript:void(0);" onclick="info(\''+data['CITYID']+'\')">详情</a>';
				  	return returnText;
				}
           	}
        ]
        ,url : '/recycle/subwayline/pagelist'
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
	var url = '/recycle/subway/areainfo/citycode/'+code;
	
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


//地铁线路详情
function subwayinfo(code,city){
	var flags = $('#flag').val();
	var url = '/recycle/subwayline/subwayinfo/citycode/'+code;
	$.layer({
		type:2,
		title:city+'地铁线路详情',
		iframe:{src:url},
		area:['800', '600'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
}
//线路对应站点
$('.subwayline').on('click',function(){
	var citycode = $(this).attr('val'),linecode = $(this).attr('rel'),a = '';
	$(".subwayline").removeClass('hover');
	$(".subwayline").find('.linedel').hide();
	$(this).addClass('hover');
	$(this).find('.linedel').show();
	$('#savestation').show();
	$('#lineid').val(linecode);
	$.post('/recycle/subwayline/subwaystation',{citycode:citycode,linecode:linecode},function(data){
		if(data.length > 0){
        	for(i in data){
        		a = a +'<div class="stations" val="'+data[i]["STATIONID"]+'">'+data[i]["STATIONNAME"]+'<a href="javascript:;" class="stationdel dels"><img src="/images/del2017.png" width="25" height="28"></a></div>';
        	}
		}
    	$('#stationinfo').html(a);
	})
})
//返回
$('.backs').on('click',function(){
	$('.tabv1').show();
	$('.tabv2').hide();
});
//线路添加
$('#saveline').on('click',function(){
	$('.tabv1').hide();
	$('.tabv2').hide();
	$('#savelinedo').show();
});
$('#subline').on('click',function(){
	var linename = $('#linename').val();
	var cityid = $('#cityid').val();
	var isenable = $('#isenable').val();
	var seq = $('#seq').val();
	$.post('/recycle/subwayline/linesave/',{linename:linename,cityid:cityid,isenable:isenable,seq:seq},function(data){
		if(data == 1){
			var txt = '是否继续添加？';
			if(confirm(txt)){
				$('.tabv1').hide();
				$('.tabv2').hide();
				$('#savelinedo').show();
			}else{
				window.location.reload();
			}
		}else{
			alert('操作失败');
		}
	})
});
//站点添加
$('#savestation').on('click',function(){
	$('.tabv1').hide();
	$('.tabv2').hide();
	$('#savestationdo').show();
});
$('#substation').on('click',function(){
	var lineid = $('#lineid').val();
	var stationname = $('#stationname').val();
	var cityid = $('#cityid').val();
	var isenable = $('#isenable2').val();
	var seq = $('#seq2').val();
	$.post('/recycle/subwayline/stationsave/',{lineid:lineid,stationname:stationname,cityid:cityid,isenable:isenable,seq:seq},function(data){
		if(data == 1){
			var txt = '是否继续添加？';
			if(confirm(txt)){
				$('.tabv1').hide();
				$('.tabv2').hide();
				$('#savestationdo').show();
			}else{
				window.location.reload();
			}
		}else{
			alert('操作失败');
		}
	})
	
});
//删除线路
$('.linedel').on('click',function(){
	if(confirm('确定删除吗？')){
		var lineid = $(this).parent('.subwayline').attr('rel');
		$.post('/recycle/subwayline/linedel/',{lineid:lineid},function(data){
			if(data == 1){
				alert('删除成功');
				window.location.reload();
			}else{
				alert('操作失败');
			}
		})
	}
});
//删除站点
$("#stationinfo").delegate(".stations","click",function(){
	$(".stations").removeClass('hover');
	$(this).addClass('hover');
	$(".stations").find('.stationdel').hide();
	$(this).find('.stationdel').show();
});
$("#stationinfo").delegate(".stationdel","click",function(){
	if(confirm('确定删除吗？')){
		var stationid = $(this).parent('.stations').attr('val');
		$.post('/recycle/subwayline/stationdel/',{stationid:stationid},function(data){
			if(data == 1){
				alert('删除成功');
				window.location.reload();
			}else{
				alert('操作失败');
			}
		})
	}
});