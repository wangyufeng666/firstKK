var grid;
$().ready(function(){
    grid = $('#grid').grid({
        pageSize :10,
        height:250
        ,cm : [
          {header: "No.", dataIndex: 'R', width:'40PX',sortable:false} 
          ,{header: "商品分类", dataIndex: 'MERTYPENAME', width:'60px',sortable:false}
          ,{header: "商品品牌", dataIndex: 'PNAME', width:'60px',sortable:false}
          ,{header: "商品名称", dataIndex: 'MERNAME', width:'250px',sortable:false}
          ,{header: "商品别名", dataIndex: 'NICKNAME', width:'250px',sortable:false}
          ,{header: "关键词", dataIndex: 'KEYWORDS', width:'250px',sortable:false}
          ,{header: "规则名称", dataIndex: 'RULENAME',sortable:false}
          ,{header: "状态", dataIndex: '', width:'200px', sortable:false, 
              renderer : function(value, data, rowIndex, colIndex, metadata){
                var returnText = '';
                if('Y' == data['ISENABLE']){
                    returnText = '<span style="color:green">启用<span>';
                }else{
                    returnText = '<span style="color:red">禁用<span>';
                }
                return returnText;
              }
            }
          ,{header: "操作", dataIndex: '', width:'200px', sortable:false, 
            renderer : function(value, data, rowIndex, colIndex, metadata){
                returnText = '<a href="javascript:void(0);" onclick="edit(\''+data['MERID']+'\')" class="a_link">修改</a> ';
                var button = "启用"
                if('Y' == data['ISENABLE']){
                    button = "禁用";
                }
                returnText += '| <a href="javascript:void(0);" onclick="enableSwitch(\''+data['MERID']+'\', \''+data['ISENABLE']+'\')" class="a_link">'+button+'</a> ';
                return returnText;
            }
          }
        ]
        ,url : '/product/repair/repairproductlist'
        ,baseParams:initParams()
        ,pageSizeList:[10,15,20,30,50]
    });
    
    $("#addRule").click(function(){
        addRule();
    });
    $("#merType").change(function(){fillBrands();});
});

function initParams(){
    if(backFlag == 'Y'){
        var params = getParams();
        params['start'] = start;
        params['limit'] = limit;
        return params;
    }else{
        return {};
    }
}

function getParams(){
    var params = [];
    params['merType'] = $("#merType").val();
    params['merName'] = $("#merName").val();
    params['brandCode'] = $("#brandCode").val();
    return params;
}

/**
 * 搜索
 */
function doSearch(){
    layer.load('数据加载中...', 1);
    grid.query(getParams());
}

/**
 * 加载品牌
 */
function fillBrands(){
    var merType = $("#merType").val();
    $("#brandCode").html('<option value="">请选择</option>');
    if(merType != "" || merType != null){
        $.ajax({
            type:'POST'//请求方式
            ,url:"/common/brands/getbrandslist"
            ,data:{merType:merType}  //发送到服务器的数据
            ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
            ,async:true //同步请求
            ,timeout:60000//默认超时60秒
            ,dataType:'json' //预期服务器返回的数据类型
            ,success:function(data){
                var htmlStr = "";
                for(var i in data){
                    htmlStr += "<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>";
                }
                $("#brandCode").html('<option value="">请选择</option>');
                $("#brandCode").append(htmlStr);
            }
        });
    }
}

///**
// * 商品报价页面
// */
//function quote(merId, ruleId){
//    window.location.href = "/product/repair/malfunctionitemquote?merId="+merId+"&ruleId="+ruleId;
//}
/**
 * 修改商品信息
 */
function edit(merId){
    window.location.href = "/product/repair/editrepairproduct?merId="+merId;
}


/**
 * 启用禁用
 */
function enableSwitch(merId, isenable){
    var index = layer.load('正在修改');
    $.ajax({
        type:'POST'//请求方式
        ,url:"/product/repair/enableswitch"
        ,data:{merId:merId, isenable:isenable}  //发送到服务器的数据
        ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,async:true //同步请求
        ,timeout:60000//默认超时60秒
        ,dataType:'json' //预期服务器返回的数据类型
        ,success:function(data){
            layer.close(index);
            if(data == 'Y'){
                layer.load('请稍等');
                window.location.href = window.location.href;
            }else{
                layer.alert("操作失败");
            }
        }
        ,error:function(){
            layer.close(index);
        }
    });
}
