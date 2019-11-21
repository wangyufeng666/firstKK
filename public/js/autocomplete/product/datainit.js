/*jslint  browser: true, white: true, plusplus: true */
/*global $: true */
$(function(){
	'use strict';
	$('#'+autocomplete_id).autocomplete({serviceUrl:'/product/product/jsonsearch', dataType:'json',params:{pcode:pcode, merType:merType, category:category}, width:410});
});
function doSearch(value, flag){
	var keyValue = '';
	if(flag){
		keyValue = value;
	}else{
		keyValue = $('#'+autocomplete_id).val();
	}
	if($.trim(keyValue) == ''){return;}
	location.href = searchUrl+'&keyword='+keyValue+'&uid='+uid+'&merType='+merType+'&pcode='+pcode+'&category='+category;
}

function checkSearchEnter(evt){
	evt = evt ? evt : (window.event ? window.event : null);
	var key = evt.keyCode ? evt.keyCode : evt.which;
    if (key == 13){
    	if(document.activeElement.id == autocomplete_id){
    		doSearch('', false);
        }
    }
}

function pageBar(curPage, size, totalCount){
	curPage = parseInt(curPage, 10);
	size = parseInt(size, 10);
	totalCount = parseInt(totalCount, 10);
	var totalPage = (totalCount % size) == 0 ? totalCount/size : Math.ceil(totalCount/size);
	var url = '/product/product/search?merType='+merType+'&category='+category+'&pcode='+pcode+'&keyword='+keyword+'&uid='+uid;
	var pageHtml = '';
	if(totalPage == 0){
		pageHtml = '暂无搜索结果';
	}else if(totalPage <= 7){
		for(var i = 1; i <= totalPage; i++){
			if(i == curPage){
				pageHtml+= '<a class="curPage" href="">'+i+'</a>';
			}else{
				pageHtml+= '<a href="'+url+'&page='+i+'">'+i+'</a>';
			}
		}
	}else{
		if(curPage <= 4){
			if(curPage != 1){
				pageHtml+='<a class="fstPage" href="'+url+'&page='+(curPage-1)+'">上一页</a>';
			}
			for(var i = 1; i <= 7; i++){
				if(i == curPage){
					pageHtml+= '<a class="curPage" href="">'+i+'</a>';
				}else{
					pageHtml+= '<a href="'+url+'&page='+i+'">'+i+'</a>';
				}
			}
			pageHtml+='<span class="otherPage">...</span>';
			pageHtml+= '<a href="'+url+'&page='+totalPage+'">'+totalPage+'</a>';
			pageHtml+= '<a class="nextPage" href="'+url+'&page='+(curPage+1)+'">下一页</a>';
		}else{
			var start = curPage + 3 > totalPage ? (totalPage - 7 + 1) : curPage - 3;
			var end = curPage + 3 > totalPage ? totalPage : (curPage+3);
			if(curPage != 1){
				pageHtml+='<a class="fstPage" href="'+url+'&page='+(curPage-1)+'">上一页</a>';
				pageHtml+= '<a href="'+url+'&page=1">1</a>';
			}
			pageHtml+='<span class="otherPage">...</span>';
			for(var i = start; i<=end; i++){
				if(i == curPage){
					pageHtml+= '<a class="curPage" href="">'+i+'</a>';
				}else{
					pageHtml+= '<a href="'+url+'&page='+i+'">'+i+'</a>';
				}
			}
			if(end < totalPage){
				if(end+1 != totalPage){
					pageHtml+='<span class="otherPage">...</span>';
				}
				pageHtml+= '<a href="'+url+'&page='+totalPage+'">'+totalPage+'</a>';
				pageHtml+='<a class="fstPage" href="'+url+'&page='+(curPage+1)+'">下一页</a>';
			}
		}
	}
	$('#page_bar').html(pageHtml);
}
