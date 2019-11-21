var grid;
$().ready(function(){
	grid = $('#grid').grid({
		pageSize :10,
		height:250
		,cm : [
		    {header: "NO.", dataIndex: 'R', width:'40px',sortable:false} 
		    ,{header: "名称", dataIndex: 'PROVIDERNAME', width:'12%',sortable:false}
		    ,{header: "别名", dataIndex: 'PROVIDERBM', width:'14%',sortable:false}
		    ,{header: "合作类型", dataIndex: 'PROVIDERTYPE', width:'6%',sortable:false}
		    ,{header: "地区", dataIndex: 'SHENG', width:'7%',sortable:false}
		    ,{header: "联系电话", dataIndex: 'LXDH', width:'8%',sortable:false}
		    ,{header: "状态", dataIndex: 'PROVIDERSTATUS', width:'8%',sortable:false}
		    ,{header: "操作", dataIndex: '', width:'12%', sortable:false,
				renderer : function(value, data, rowIndex, colIndex, metadata){
					var returnText ='<a class="a_link" href="javascript:void(0);" onclick="providerInfo(\''+data['PROVIDERID']+'\')">详细</a>&nbsp&nbsp&nbsp|';
					returnText += "&nbsp&nbsp&nbsp<a class='a_link' href='javascript:void(0);' onclick='areaManag(\""+data['PROVIDERID']+"\",\""+data['PROVIDERNAME']+"\");'>区域管理<a>";
					return returnText;
				}
           }
	]
    ,url : '/provider/party/searchprovider'
    ,baseParams:{isAll:'all'}
  });
});

/**
 * 供应商详情详情
 */
function providerInfo(providerId){
	window.location.href = "/provider/party/providermessage?providerid="+providerId;
}

/**
 * 区域管理
 */
function areaManag(providerId, providerName){
	window.location.href = "/provider/party/areamange?providerid="+providerId+"&providername="+providerName;
}

function getParams(){
    return {

        sheng:''==$('#sheng1 option:selected').val()?'':$('#sheng1 option:selected').text(),
        shi:''==$('#shi1 option:selected').val()?'':$('#shi1 option:selected').text(),
        qu:''==$('#qu1 option:selected').val()?'':$('#qu1 option:selected').text(),
        dianhua:$('#dianhua').val(),
      	providerstatus:$('#providerstatus').val(),
        providername:$('#providername').val(),
        type:$('#type').val(),
        
        isAll:'all'
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