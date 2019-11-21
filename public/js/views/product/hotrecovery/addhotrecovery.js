$().ready(function(){
	$('#saveButton').bind('click', function(){saveMerInfo();});
	
	//表单验证
	$('#addForm').validate({
		rules:{
			merType:{//类型
				required:true
			}
        	,brandCode:{//品牌
        		required:true
        	}
        	,partnerCode:{//合作商品ID
        		required:true
        	}
        	,merName:{//商品名称
        		required:true
        	}
            ,avgPrice:{//平均价格
                required:true
            }
            ,viewseq:{//排序
                required:true
            }
		}
		,messages:{
			merType:{//类型
				required:"请选择类型"
			}
			,brandCode:{//品牌
				required:"请选择品牌"
			}
			,partnerCode:{//合作商
				required:"请选择合作商",
			}
			,merName:{//商品名称
				required:"请输入合作商品名称",
			}
            ,avgPrice:{//平均价格
                required:"请输入平均价格",
            }
            ,viewseq:{//排序
                required:"请给商品排序",
            }
		}
	});

	/**
	 * 商品类型改变
	 */
    $("#merType").change(function(e, p_brandCode){
        var loadFlag1 = false, loadFlag2 = false;
        var merType = $(this).val();
        var loadIndex = layer.load(1);
        if(merType != ''){
            //品牌列表
            $.post('/common/brands/getbrandslist', {merType:merType}, function(data){
                $("#brandCode").html("<option value=''>全部</option>");
                for(i in data){
                    $("#brandCode").append("<option value='"+data[i]['PCODE']+"'>"+data[i]['PNAME']+"</option>");
                }
                layer.close(loadIndex);
                if(p_brandCode && p_brandCode != ''){
                    $('#brandCode').val(p_brandCode);
                }
            }, 'json');
        }else{
            $("#brandCode").html("<option value=''>全部</option>");
            $("#ruleId").html("<option value=''>全部</option>");
        }
    });
});



/**
 * 保存商品信息
 * @param thisAttrId
 * @returns
 */
function saveMerInfo(thisAttrId){
	$('#saveButton').unbind('click');
	if($("#addForm").valid()){
		var params = {
				merId:$('#merId').val(),
            	merImg:$('#merImg').val(),
				categoryId:$('#categoryId').val(),
				partnerCode:$('#partnerCode').val(),
				merType:$('#merType').val(),
				brandCode:$('#brandCode').val(),
				merName:$('#merName').html(),
				avgPrice:$('#avgPrice').val(),
				viewseq:$('#viewseq').val(),
		};
		
		if(params.merId == ''){
			alert('请选择商品');
			$('saveButton').bind('click', function(){saveMerInfo();});
			return;
		}
		
		$.ajax({
			type:'POST'//请求方式
			,url:"/product/hotrecovery/savehotrecovery" //请求路径
			,data:params //发送到服务器的数据
			,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
			,async:false //同步请求
			,timeout:60000//默认超时60秒
			,dataType:'json' //预期服务器返回的数据类型
			,success:function(data){
				if(data == "Y"){
					parent.reload();
				}
			},
			error:function(){
				alert('修改保存失败，请重新修改');
				$('#saveButton').bind('click', function(){saveMerInfo();});
			}
		});
	}else{
		$('#saveButton').bind('click', function(){saveMerInfo();});
	}
}

/**
 * 选择商品
 * @returns
 */
function selectMerInfo(){
	var merType = $('#merType').val();
	var brandCode = $('#brandCode').val();
	layer.open({
		type:2,
		title:'商品搜索',
		shadeClose:true,
		content:'/product/hotrecovery/merlist?merType='+merType+'&brandCode='+brandCode,
		area:['99%','99%'],
		close:function(index){
			layer.close(index);
		}
	});
}


/**
 * 获取layer页面传回的商品信息
 * @param merId
 * @param p_merInfo
 * @returns
 */
function getSelectMer(merId, p_merInfo){

	var merName = '', merType = '', brandCode = '';
	merType = p_merInfo['MERTYPE'];
	merName = p_merInfo['PNAME']+' '+p_merInfo['MERNAME'];
	brandCode = p_merInfo['PCODE'];
	
	layer.closeAll('iframe');
	var thisMerType = $('#merType').val();
	if(thisMerType != merType){
		$('#brandCode').val(brandCode);
		$('#merType').val(merType).trigger('change', [brandCode]);
	}
	$('#merId').val(merId);
	$('#merName').html(merName);
	$('#merImg').val(p_merInfo['MERIMG']);
	$('#categoryId').val(p_merInfo['CATEGORYID']);
}


function goBack(){
	parent.reload();
}