    var sheng='',shi='',qu='',doorsheng='',doorshi='',doorqu='',subCity='',subStationLine='',subStation='',_thisNum='',doorTime='',sftime='';//_thisNum：手机号
    
    var winWidth =  document.body.clientWidth;
    var visitData = '',pickFlag=false;
    getItemData();
    
    //重新估价
    $('.p_reprice').click(function(){
        window.history.back();
    })

    //询价详情
    $('.p_click').click(function(){
        var s_index = $(this).attr('pindex');
        $('.price_box_item .p_inner').css('transform','translateX(-'+winWidth*s_index+'px)');
    })
    
    //切换回收方式
    $('.trade_box .trade').click(function(){
        if($(this).hasClass('opacity')){
            short_tips('暂不支持此回收方式');
        }else{
            tradeType = $(this).attr('type');
            $(this).addClass('on').siblings().removeClass('on');
            $('.address_box .box').removeClass('on');
            $('.address_box .box[type='+tradeType+']').addClass('on');
            $('.trade_tips .typeway[type='+tradeType+']').addClass('on').siblings().removeClass('on');
            if(merType == 'J'){
                $('.address_box .box.immediately').addClass('on');
            }
            if(tradeType == 2 || tradeType == 8){
                $('.address_box .box.expressdoor').addClass('on');
            }else if(tradeType == 5){
                $('.address_box .box.shangSubway').addClass('on');
            }else if(tradeType == 1){
                $('.address_box .box.shangSubway').addClass('on');
                $('.address_box .box.expressdoor').addClass('on');
            }
        }
    })
    
    //关闭弹窗 -- login_slide
    $('.login_slide').click(function(){
        closeloginbox();
    })
    
    function closeloginbox(){
        $('.loginbox').removeClass('actived');
        $('.login_slide').addClass('hide');
        $('.subnit').removeClass('flag');
        hideAddressBox();//隐藏地址弹窗
    }
    
    //获取上门时间，顺丰上门时间、地铁线地铁站（diyFlag 为 Y：不支持上门--只支持快递）
    function getItemData(){
        $.post('/offlinem/visitserver/visit',{door:diyFlag,flag:applianceFlag},function(data){
            console.log(data)
            visitData = data;
            pickFlag = true;
        })
    }

    //快递回收选择省市区
    $('#expressaddress').click(function(){
        if(pickFlag){
            cityList(allcitys,'expressaddress','3','allcitys');
        }else{
            short_tips('数据还在加载中...');
        }
    })
    
    //顺丰取件时间
    $('#sfapoint').click(function(){
        if(pickFlag){
            cityList(visitData['sfVisitDate'],'sfapoint','2','sfVisitDate');
        }else{
            short_tips('数据还在加载中...');
        }
    })

    //上门预约时间点击事件
    $('#doorapoint').click(function(){
        if(pickFlag){
            cityList(visitData['doorVisitDate'],'doorapoint','2','doorVisitDate');
        }else{
            short_tips('数据还在加载中...');
        }
    })
    
    //选择地铁站、地铁线subaddress
    $('#subaddress').click(function(){
        if(pickFlag){
            cityList(visitData['areaSubways'],'subaddress','3','areaSubways');
        }else{
            short_tips('数据还在加载中...');
        }
    })
    
    //上门回收方式.......
    $('#dooraddress').click(function(){
        if(pickFlag){
            cityList(visitData['door3cAreas'],'dooraddress','3','door3cAreas'); //普通上门
        }else{
            short_tips('数据还在加载中...');
        }
    })
    

    var frist_name='',second_name='',three_name='';//获取点击的值
    var frist_name_time='',second_name_time='';
    var parent_class = '';
    var dataSecondList = '',second_sub='';
    var html_id = '';
    function cityList(datas,id,col,_class){
        parent_class = _class;
        dataSecondList = datas;
        html_id = id;
        
        $('.login_slide').removeClass('hide');
        var _thisClass = $('.'+_class);
        if(col == '3'){
            console.log(_thisClass.length)
            if(_thisClass.length){
                $(_thisClass).removeClass('hide');
                $('.pick_contain_box').addClass('picked');
                $('.more_box').removeClass('hide');
                $('.title_conta .clearfix').addClass('hide');
                $('.'+_class+'title').removeClass('hide');
                return;
            }
            
            var listHtml = '';
            listHtml += '<div class="'+_class+' item_box clearfix" style="width:'+winWidth*col+'px">';
                listHtml += '<div class="box_list left" style="width:'+winWidth+'px">';
                    for(var d in datas){
                        listHtml += '<div class="item_list" onclick=getSecondList("'+datas[d]['name']+'","'+datas[d]['id']+'",this) name="'+datas[d]['name']+'" id="'+datas[d]['id']+'">'+datas[d]['name']+'</div>';
                    }
                listHtml += '</div>';
                listHtml += '<div class="box_list box_list_second left" style="width:'+winWidth+'px"></div>';
                listHtml += '<div class="box_list box_list_three left" style="width:'+winWidth+'px"></div>';
            listHtml += '</div>';
            $('.address_box_item').append(listHtml);
            $('.pick_contain_box').addClass('picked');
            $('.more_box').removeClass('hide')
            shoowPickTitle(0,'请选择','more',_class);//设置底部选中的
        }else{
            if(_thisClass.length){
                $(_thisClass[0]).removeClass('hide');
                $('.pick_contain_box').addClass('picked');
                $('.less_box').removeClass('hide');
                $('.'+_class).removeClass('hide');
                return;
            }
            var out_box_html = '';
            out_box_html += '<div class="item_box '+_class+' clearfix">';
                out_box_html += '<div class="box_list left_time left"></div>';
                out_box_html += '<div class="box_list right_time left"></div>';
            out_box_html += '</div>';
            $('.time_box').html(out_box_html);
            var listHtml = '';
            for(var k in datas){
                var left_class='';
                if(k==0){
                    left_class = 'selected';
                }
                listHtml += '<div class="item_list less_time '+left_class+'" onclick=getLessTimeLeft("'+datas[k]['name']+'","'+id+'","'+k+'",this) name="'+datas[k]['name']+'">'+datas[k]['name']+'</div>';
                $('.pick_contain_box .out_pick .time_box .item_box.'+_class+' .left_time').html(listHtml);
                if(k == 0){
                    frist_name_time = datas[k]['name'];
                    var listinner = '';
                    for(var m in datas[0]['sub']){
                        var right_class = '';
                        if(m == 0){
                            right_class = 'selected';
                        }
                        listinner += '<div class="item_list less_right '+right_class+'"  onclick=getLessTimeRight("'+id+'","'+datas[0]['sub'][m]['name']+'",this) name="'+datas[0]['sub'][m]['name']+'">'+datas[0]['sub'][m]['name']+'</div>';
                    }
                    $('.pick_contain_box .out_pick .time_box .item_box.'+_class+' .right_time').html(listinner);
//                  $api.html($api.dom('.pick_contain_box .out_pick .time_box .item_box.'+_class+' .right_time'),listinner);
                }
            }
            $('.pick_contain_box').addClass('picked'); //弹窗显示
            $('.less_box').removeClass('hide');        //显示时间显示
        }
    }


    //点击第一列选项...
    function getSecondList(name,id,_this){
        frist_name = $(_this).attr('name');
        for(var e in dataSecondList){
            if(dataSecondList[e]['id'] == id){
                $(_this).addClass('selected').siblings().removeClass('selected');
                second_sub = dataSecondList[e]['sub'];
                var secondHtml= '';
                for(var f in second_sub){
                    secondHtml += '<div class="item_list second_list" onclick=getThreeList("'+second_sub[f]['name']+'","'+second_sub[f]['id']+'",this) name="'+second_sub[f]['name']+'" id="'+second_sub[f]['id']+'">'+second_sub[f]['name']+'</div>';
                }
                $('.'+parent_class+' .box_list_second').html(secondHtml);
                shoowPickTitle(1,frist_name,'more',parent_class);//设置底部选中的
            }
        }
    }

    //获取第三列
    function getThreeList(name,secondId,_this){
        second_name = name;
        for(var g in second_sub){
            if(second_sub[g]['id'] == secondId){
                $(_this).addClass('selected').siblings().removeClass('selected');
                three_sub = second_sub[g]['sub'];
                var threeHtml = '';
                for(var h in three_sub){
                    threeHtml += '<div class="item_list three_list" onclick=setHtmlList("'+three_sub[h]['name']+'","'+three_sub[h]['id']+'",this) name="'+three_sub[h]['name']+'" id="'+three_sub[h]['id']+'">'+three_sub[h]['name']+'</div>';
                }
                $('.'+parent_class+' .box_list_three').html(threeHtml);
                shoowPickTitle(2,second_name,'more',parent_class);//设置底部选中的
            }
        }
                    
    }

    //左边时间点击事件
    function getLessTimeLeft(name,id,tabindex,_this){
        $(_this).addClass('selected').siblings().removeClass('selected');
        frist_name_time = name;
        var listinner = '';
        for(var o in dataSecondList[tabindex]['sub']){
            listinner += '<div class="item_list less_right" onclick=getLessTimeRight("'+id+'","'+dataSecondList[tabindex]['sub'][o]['name']+'",this) name="'+dataSecondList[tabindex]['sub'][o]['name']+'">'+dataSecondList[tabindex]['sub'][o]['name']+'</div>';
        }
        $('.pick_contain_box .out_pick .time_box .item_box.'+parent_class+' .right_time').html(listinner)
    }
    
    //右边时间点击事件
    function getLessTimeRight(id,name,_this){
        $(_this).addClass('selected').siblings().removeClass('selected');
        second_name_time = name;
        if(id == 'sfapoint'){
            $('#'+id).html(frist_name_time+' '+second_name_time);
            var sfsplit = (frist_name_time.replace('月','-')).replace('日',''); //匹配顺丰取件时间格式
            sftime = new Date().getFullYear()+'-'+sfsplit.split("（")[0]+" "+second_name_time;
        }else if(id == 'doorapoint'){
            doorTime = frist_name_time+' '+second_name_time;
            $('#'+id).html(doorTime);
        }
        hideAddressBox();
    }
    

    function setHtmlList(three_name,threeId,_this){
        hideAddressBox();
        var id = html_id;
        $(_this).addClass('selected').siblings().removeClass('selected');
        shoowPickTitle(3,three_name,'more',parent_class);//设置底部选中的
        $('#'+id).addClass('active')
        $(_this).parents('.item_box').addClass('hide');
//      $api.addCls($api.byId(''+id+''),'active');
//      id=    1、expressaddress   2、sfapoint   3、doorapoint   4、subaddress   5、dooraddress
        if(id == 'dooraddress'){
            doorsheng = frist_name ? frist_name : '';
            doorshi = second_name ? second_name : '';
            doorqu = three_name ? three_name : '';
            $('#'+id).html(doorsheng+' '+doorshi+' '+doorqu);
        }else if(id == 'expressaddress'){
            sheng = frist_name ? frist_name : '';
            shi = second_name ? second_name : '';
            qu = three_name ? three_name : '';
            $('#'+id).html(sheng+' '+shi+' '+qu);
        }else if(id == 'subaddress'){
            subCity =  frist_name ? frist_name : '';
            subStationLine = second_name ? second_name : '';
            subStation = three_name ? three_name : '';
            $('#'+id).html(subCity+' '+subStationLine+' '+subStation);
        }
    }


    function shoowPickTitle(index,title,sum,_class){
        if(sum == 'more'){
            $('.title_conta .clearfix').addClass('hide');
            $('.'+_class+'title').removeClass('hide');
            
            var pick_title_dom = $('.'+_class+'title .item_title');
            $(pick_title_dom[index-1]).html(title);
            
            if(index != 3){
                for(var r = 0;r<3;r++){
                    if(r>=index){
                        $(pick_title_dom[r]).addClass('hide');//显示头部信息
                        $(pick_title_dom[r]).html('请选择');   //显示头部信息
                    }
                }
                $(pick_title_dom[index]).removeClass('hide');//显示头部信息
                
                lineTranslate(pick_title_dom,index,title);
            }else{
                $('.login_slide').addClass('hide');
                $('.pick_contain_box').removeClass('picked');
                lineTranslate(pick_title_dom,index,title);
            }
        }
    }

    function lineTranslate(pick_title_dom,index,title){
        var line_width = parseInt($('.pick_line').width());
//      var line_width = parseInt($api.cssVal($api.dom('.pick_line'),'width'));
        if(index == 3){
            index--;
        }
//      var pss = parseInt($api.cssVal($api.dom('.pick_contain_box .out_pick .pick_title'),'padding-left'));
        var pss = parseInt($('.pick_contain_box .out_pick .pick_title').css('padding-left'));
        var pick_width = 80;
        var line_left = 80*index;
        var pick_left = line_left + pick_width*0.5 - line_width*0.5 + pss;
//      $api.css($api.dom('.pick_contain_box .address_box_item.pick_item .item_box'),'transform:translateX(-'+winWidth*index+'px)');
        $('.pick_contain_box .'+parent_class+'.item_box').css('transform','translateX(-'+winWidth*index+'px)');
        $('.pick_contain_box .out_pick .pick_title .'+parent_class+'title .pick_line').css('left',parseInt(pick_left)+'px');
    }

    //隐藏弹窗
    function hideAddressBox(){
        pickFlag = true;
        $('.login_slide').addClass('hide');
        $(parent_class).addClass('hide');
        $('.pick_contain_box').removeClass('picked');
        $('.less_box').addClass('hide');
        $('.more_box').addClass('hide');
    }

    //顶部导航点击
    $('.item_title').click(function(){
        tab_index = $(this).attr('tabindex');
        var pick_title_dom = $('.'+parent_class+'title .item_title');
        var title = $(this).html();
        lineTranslate(pick_title_dom,tab_index,title);
    })

    //保存订单...
    $('.subnit').click(function(){
        if($(this).hasClass('successFlag')){
            selectBtm('此订单已提交','backindex','返回首页','orderlist','订单列表','hidepop');
        }else{
            if($('.subnit').hasClass('flag')){
                return;   
            }
            var user_inputVal = $('#contactWay').val();
            $('.subnit').addClass('flag');
            if($('#contacts').val()){
                if(user_inputVal){
                    if(checkMobile(user_inputVal)){
                        if(tradeType == 8){         //地铁回收........................................
                            if(sheng != '' && shi != '' && qu !=''){
                                if($('#detailaddress').val().length >1 ){
                                    checkOrder();
                                }else{
                                    initSubmit();
                                    short_tips('请填写详细地址');
                                    return;
                                }
                            }else{
                                initSubmit();
                                short_tips('请选择所在省市区');
                                return;
                            }
                        }else if(tradeType == 1){   //上门回收........................................
                            if(doorsheng != '' && doorshi != '' && doorqu != ''){
                                if($('#detailaddress').val().length >1 ){
                                    if(doorTime != ''){
                                        checkOrder();
                                    }else{
                                        initSubmit();
                                        short_tips('请选择上门时间');
                                        return;
                                    }
                                }else{
                                    initSubmit();
                                    short_tips('请填写详细地址');
                                    return;
                                }
                            }else{
                                initSubmit();
                                short_tips('请选择上门省市区');
                                return;
                            }
                        }else if(tradeType == 5){       //地铁回收........................................
                            if(subCity != '' && subStationLine != '' && subStation != ''){
                                if(doorTime != ''){
                                    checkOrder();
                                }else{
                                    initSubmit();
                                    short_tips('请选择上门时间');
                                    return;
                                }
                            }else{
                                initSubmit();
                                short_tips('请选择地铁站');
                                return;
                            }
                        }else if(tradeType == 8){
                            if($('#detailaddress').val().length >1 ){
                                checkOrder();
                            }else{
                                initSubmit();
                                short_tips('请填写详细地址');
                                return;
                            }
                        }
                    }else{
                        initSubmit();
                        short_tips('手机号码有误');
                        return;
                    }
                }else{
                    initSubmit();
                    short_tips('手机号码为空');
                    return;
                }
            }else{
                initSubmit();
                short_tips('用户姓名不能为空');
                return;
            }
        }
            
    })

    function checkOrder(){
        if(merType == 'J'){
            var imeiReg = /^\d{15}$/;//imei正则
            var imei = $.trim($('#imei').val());
            if(imei != ''){
                if(imeiReg.test(imei)){
                }else{
                    initSubmit();
                    short_tips('IMEI号为15位数');
                    return;
                }
            }else{
                initSubmit();
                short_tips('请填写您的IMEI号');
                return;
            }
        }
        $('.subnit').html('保存中...')
//      sheng='',shi='',qu='',subCity='',subStationLine='',subStation='',_thisNum='',doorTime='',sftime='';//_thisNum：手机号
        var user_inputVal = $('#contactWay').val();
        var detailaddress = $('#detailaddress').val();
        var contacts = $('#contacts').val();
        var imei = $.trim($('#imei').val());
        var prams = {};
        prams.contacts = contacts; //联系人
        prams.userId = userId; //用户 userId
//      prams.contactWay = _thisNum; //联系电话
        prams.contactWay = user_inputVal; //联系电话
        prams.tradeType = tradeType; //回收方式
        prams.provinceName = sheng; //省
        prams.cityName = shi; //市
        prams.districtName = qu; //市
        prams.detailAddress = detailaddress; //详细地址
        prams.subwayAddress = subCity + ' '+subStationLine +' '+subStation; //地铁回收详细地址
        prams.serverDate = doorTime; //上门时间
        prams. sfAppointmentTime = sftime; //顺丰时间
        prams.phone = 'xiamai';
        prams.couponCode = couponCode; //优惠券，暂时没有
        prams.imei = imei; //优惠券，暂时没有
        if(tradeType == 1){
            prams.provinceName = doorsheng; //省
            prams.cityName = doorshi; //市
            prams.districtName = doorqu; //市
        }
        prams.spId = spid;
        prams.inquiryId = inquiryId;
        prams.salt = salt;
        prams.zhongliang = zhongliang;
        //提交订单 埋点
        $.post('/offlinem/order/saveorder',prams,function(data){
            initSubmit();
            if(data['code'] == '1000'){
                $('.subnit').addClass('successFlag');//已经提交成功
                window.location.href = '/offlinem/order/success?no='+data['data']['order'];
            }else{
                short_tips(data['msg']);
            }
        })
    }
    
    function initSubmit(){
        $('.subnit').removeClass('flag').html('提交订单');
    }

    var phone = /^1[3456789]\d{9}$/;
    //检查手机号码
    function checkMobile(mobile){
        var resultFlag = false;
        if(phone.test(mobile)){
            resultFlag = true;  
        }
        return resultFlag;
    }