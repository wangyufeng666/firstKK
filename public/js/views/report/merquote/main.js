$(function(){
	$("#btn_back").click(function(){
		window.location="/report/merquote/index";
	});
	$(".del_questrule_btn").click(function(){
		var groupid = $(this).attr('date-groupid');
		if(confirm('确定删除吗？？？')){
			window.location='/report/merquote/delquestrule?groupid='+groupid+'&merid='+merid;
		}
	});
    /**
     * 报价iframe
     */
    $("tr").delegate(".quotes","click",function(){
    	var merId = $("#merid").val();
    	var merName = $("#mername").val();
    	var typeId = $("#mertype").val();
    	$(this).attr('id','quotesid');
    	var pageii = $.layer({
            type:2,
            title:merName+' 报价',
            iframe:{src:'/report/merquote/detail/spid/'+merId+'/typeId/'+typeId},
            area:['1000', '640'],
            offset:['50px', ''],
            close:function(index){
                layer.close(index);
            }
        });
    });
});



