var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize:15,
		height:375
		,cm:[
			{header:"No.", dataIndex:'R', width:'35PX',sortable:false} 
			,{header:"渠道名称", dataIndex:'PARTNERNAME', sortable:false}
			,{header:"渠道编号", dataIndex:'', width:'160px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PARTNERCODE']+'('+data['SELFCODE']+')';
				}
			}
			,{header:"渠道联系方式", dataIndex:'', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['PARTNERCONTACTS']+'-'+data['PARTNERMOBILE']+'';
				}
			}
			,{header:"门店名称", dataIndex:'STORENAME',sortable:false}
			,{header:"门店编号", dataIndex:'STORENO',width:'80px',sortable:false}
			,{header:"门店联系方式", dataIndex:'', width:'140px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					return data['STORECONTACTS']+'-'+data['STOREMOBILE'];
				}
			}
			,{header:"签约状态", dataIndex:'', width:'70px',sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					if(data['AGREEMENTNO'] == null || data['AGREEMENTNO'] == 'null' || data['AGREEMENTNO'] == ''){
						var returnText = '<font color="red">未签约</font>';
					}else{
						var returnText = '<font color="green">已签约</font>';
					}
					return returnText;
				}
			}
			,{header:"操作", dataIndex:'', width:'60px', sortable:false,
				renderer:function(value, data, rowIndex, colIndex, metadata){
					var storeNo = data['STORENO'];
					var partnerCode = data['PARTNERCODE'];
					var parentCode = data['SELFCODE'];
					
				  	var returnText ='<a class="a_link" href="javascript:void(0);" onclick="storeInfo(\''+storeNo+'\', \''+partnerCode+'\')">详情</a>';
				  	return returnText;
				}
           	}
        ]
        ,url:'/recycle/agreement/pagelist'
        ,baseParams:getParams()
	});
});

/**
 * 端口活动详情
 */
function storeInfo(storeNo, partnerCode){
	
	var url = "/recycle/agreement/storeinfo?storeNo="+storeNo+'&partnerCode='+partnerCode;
	$.layer({
		type:2,
		title:'门店签约信息',
		iframe:{src:url},
		area:['700', '510'],
		offset:['50px', ''],
		close:function(index){
			layer.close(index);
		}
	});
	
}


function getParams(){
    return {
    	parentCode:$('#parentCode').val(),
    	contacts:$('#contacts').val(),
    	contactWay:$('#contactWay').val(),
    	storeName:$('#storeName').val(),
    	partnerName:$('#partnerName').val(),
    	signStatus:$('#signStatus').val()
    };
}

function doSearch(){
	layer.load('数据加载中...', 1);
    grid.query(getParams());
}