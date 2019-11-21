var tab;
$(document).ready(function(){
	tab = $('#tabs').tab({
        initActiveTab:0
        ,height:400
        ,items:[
            {href:'/recycle/agreement/tabstoreinfo?storeNo='+storeNo+'&partnerCode='+partnerCode, text: '门店信息', id:'a'}
            ,{href:'/recycle/agreement/tabsigninfo?storeNo='+storeNo+'&partnerCode='+partnerCode, text: '签约信息', id:'b'}
            ,{href:'/recycle/agreement/tabpartnerinfo?&partnerCode='+partnerCode, text: '渠道信息', id:'c'}
        ]
	});	
});
