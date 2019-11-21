
function pageBar(curPage, size, totalCount){
	curPage = parseInt(curPage, 10);
	size = parseInt(size, 10);
	totalCount = parseInt(totalCount, 10);
	var totalPage = (totalCount % size) == 0 ? totalCount/size : Math.ceil(totalCount/size);
	var url = '/sale/addsalebill/search?presaleNo='+presaleNo;
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