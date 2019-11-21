$(document).ready(function(){
    var width = document.body.clientWidth;
    $('#sortUl').css({'width':width+'px'});
    $('#bottomMenu').css({'width':width+'px'});
    
	$(window).resize(function(){
	    var width = document.body.clientWidth;
	    $('#sortUl').css({'width':width+'px'});
	    $('#bottomMenu').css({'width':width+'px'});
	});
});

$("#userMenu").click(function(){
	window.location.href="/offlinem/invitee/center";
    })

//hot 回收JSON 请求
getHotmer('J');

$('.hot_mer_list .mer_list').bind('click',function(){
	var screen_width = document.body.clientWidth;
	var posi_Y = $(this).position().left;
	var this_width = $(this).width();
	if((posi_Y+this_width) >= screen_width/2){
		$('.hot_mer_list').animate({scrollLeft: screen_width},1000);
	}else{
		$('.hot_mer_list').animate({scrollLeft: 0},1000);
	}
    $('.hot_mer_list .mer_list').removeClass('selected');
    var index = $(this).addClass('selected').attr('tabindex');
    getHotmer(index);
});

var typeArr =[];
function getHotmer(index){
    var html = '';
    $.ajax({
        type:'GET'//请求方式
        ,url:'/js/view/promoter/product/hotmers.json' //请求路径
        ,cache:false //设置为 false 将不会从浏览器缓存中加载请求信息
        ,contentType: "application/x-www-form-urlencoded; charset=UTF-8"
        ,dataType:'json' //预期服务器返回的数据类型
        ,success:function(data){
            for(var j in data.sorts){
    			if(data.sorts[j].mertype == index){
                	if(typeArr.indexOf(data.sorts[j].mertype) >= 0){
	                	$('.hot_mer_box .hot_box .hot').removeClass('actived');
	                	$('.hot_mer_box .hot_box .hot[type='+index+']').addClass('actived');
                	}else{
	            		typeArr.push(data.sorts[j].mertype);
	            		$('.hot_mer_box .hot_box .hot').removeClass('actived');
	            		$('.hot_mer_box .hot_box .hot[type='+index+']').addClass('actived');
	            		var hotList = data.sorts[j].hotmers;
	                    html += '<div class="hot actived" type="'+index+'">';
	                    html += '<ul class="clearfix">';
	                    for(var i in hotList){
	                    	if(data.sorts[j].mertype == 'WB'){
	                    		var href='http://www.ponhu.cn/index.php/Wap/Recycle/recycle';
	                        }else{
	                        	var href='/offlinem/inquiry/detail?spid='+hotList[i].merId;
	                        }
	                        html += '<a href="'+href+'"><li><div class="inner_border">';
	                        if(data.sorts[j].mertype == 'V' || data.sorts[j].mertype == 'CD'){
	                            html += '<img class="mer_img" src="'+hotList[i].imgPath+'" />';
	                        }else{
	                            html += '<img class="mer_img" src="http://images.youdemai.com/'+hotList[i].imgPath+'" />';
	                        }
	                        html += '<div class="mer_name">'+hotList[i].name+'</div>';
	                        html += '<div class="give_price">最高回收价<span>¥ '+hotList[i].price+'</span></div>';
	                        if(data.sorts[j].mertype == 'WB'){
	                            html += '<div class="btm"><img src="/images/index/recycle_index_icon/recovery_go.png" /></div>';
	                        }else{
	                            html += '<div class="btm"><img src="/images/index/recycle_index_icon/recovery_go.png" /></div>';
	                        }
	                    }
	                    html += '</div></li></a></ul></div>';
	                    $('.hot_mer_box .hot_box').append(html);
                	}
                }
            }
        }
    });
};

$('.ydm_new_bottom div').click(function(){
	var indexTab = $(this).attr('for');
	if(indexTab == 'index'){
	}else if(indexTab == 'zuzheyong'){
		window.location.href='http://www.zuzheyong.com';
	}else if(indexTab == 'user'){
		window.location.href='/user';
	}
})
