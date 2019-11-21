/**
 * 客服知识库JS
 * @type {
 * {questionList: string,
  * myQuestionList: string,
  * questionPage: serviceObj.questionPage,
   * showItem: serviceObj.showItem,
   * getParams: serviceObj.getParams,
   * myQuestionPage: serviceObj.myQuestionPage,
   * addQuestion: serviceObj.addQuestion,
   * searchQuestion: serviceObj.searchQuestion}}
 */
var serviceObj = {

    questionList:'/service/index/pagelist',
    myQuestionList:'/service/index/myquestionlist',
    myAnswerList:'/service/index/myanswer',
    getBrandList:'/redis/recycle/recybrandmertype',
    getTypeList:'/redis/recycle/recytypebybrand',
    //问题列表
    questionPage:function(page,flag){
        var load = layer.load();
        var start = (page-1)*10;
        var that = this;
        $.ajax({
            url:this.questionList,
            type:'post',
            data:this.getParams(start),
            dataType:'json',
            success:function(res){
                layer.close(load);
                var html = that.showItem(res.result);
                $('.question').html(html);
                if(flag) {
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;
                        //执行一个laypage实例
                        laypage.render({
                            elem: 'questionPage' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.totalCount //数据总数，从服务端得到
                            ,jump: function(obj, first){
                                if(!first){
                                    //首次不执行
                                    serviceObj.questionPage(obj.curr,false);
                                    //do something
                                }
                            }
                        });
                    });
                }

            },
            error:function(res) {
                console.log(res);
            }

        })


    },
    //展示类
    showItem:function(data) {
        var html = "";
        for(var i=0;i < data.length;i++) {
            html +='<div class="layui-col-md6"></div><div class="layui-card">'+
                '<div class="layui-card-header" style="cursor:pointer;"' +
                ' ><div style="font-weight: bold;font-size: 16px;" onclick="showQuestion(\''+data[i].PKID+'\')">标题：'+data[i].QUESTION_TITLE+'（'+data[i].TYPENAME+' '+data[i].PNAME+'）</div></div>'+
                '<div class="layui-card-body">' +
                '<div>'+data[i].QUESTION_CONTENT+'</div><dvi>'+data[i].QUESTIONER+'</dvi></div>'+
                '</div></div>';
        }
        return html;
    },
    //获取参数
    getParams:function(page) {
        var keyword = $('input[name="keyword"]').val();
        var brand = $('#brand').val();
        var category = $('#category').val();
        var model = $('#model').val();
        return {
            start:page,
            category:category,
            keyword:keyword,
            brand:brand,
            model:model,
        };
    },
    //我的提问
    myQuestionPage:function(page,flag) {
        var load = layer.load();
        var start = (page-1)*10;
        var that = this;
        $.ajax({
            url:this.myQuestionList,
            type:'post',
            data:this.getParams(start),
            dataType:'json',
            success:function(res){
                layer.close(load);
                var html = that.showItem(res.result);
                $('.myQuestion').html(html);
                if(flag) {
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;
                        //执行一个laypage实例
                        laypage.render({
                            elem: 'myQuestionPage' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.totalCount //数据总数，从服务端得到
                            ,jump: function(obj, first){
                                if(!first){
                                    //首次不执行
                                    serviceObj.myQuestionPage(obj.curr,false);
                                    //do something
                                }
                            }
                        });
                    });
                }
            },
            error:function(res) {
                console.log(res);
            }

        })
    },
    myAnswerPage:function(page,flag) {
        var load = layer.load();
        var start = (page-1)*10;
        var that = this;
        $.ajax({
            url:this.myAnswerList,
            type:'post',
            data:this.getParams(start),
            dataType:'json',
            success:function(res){
                layer.close(load);
                var html = that.showItem(res.result);
                $('.myAnswer').html(html);
                if(flag) {
                    layui.use('laypage', function(){
                        var laypage = layui.laypage;
                        //执行一个laypage实例
                        laypage.render({
                            elem: 'myAnswerPage' //注意，这里的 test1 是 ID，不用加 # 号
                            ,count: res.totalCount //数据总数，从服务端得到
                            ,jump: function(obj, first){
                                if(!first){
                                    //首次不执行
                                    serviceObj.myQuestionPage(obj.curr,false);
                                    //do something
                                }
                            }
                        });
                    });
                }
            },
            error:function(res) {
                console.log(res);
            }

        })
    },
    //新增问题
    addQuestion: function() {
        layer.open({
            type: 2,
            title: '新增问题',
            shadeClose: true,
            shade: false,
            area: ['893px', '600px'],
            content: '/service/index/addquestion'
        });
    },
    //搜索
    searchQuestion:function(flag) {
        var that = this;
        switch(flag){
            case 1:
                that.questionPage(1,true);
                break;
            case 2:
                that.myAnswerPage(1,true);
                break;
            case 3:
                that.myQuestionPage(1,true);
                break;
            default:
                break;
        }
    },
    //获取品牌
    getBrand:function() {
        var that = this;
        $('#category').change(function(){
            var category = $(this).val();
            $.ajax({
                url:that.getBrandList,
                type:'post',
                data:{merType:category},
                dataType:'json',
                success:function(data){
                    $('#brand').html('<option value="">请选择品牌</option>');
                    $('#model').html('<option value="">请选择型号</option>');
                    if(data) {
                        var optionHtml = '';
                        for(i in data){
                            optionHtml += '<option value="'+data[i]['PCODE']+'">'+data[i]['PNAME']+'</option>';
                        }
                        $('#brand').append(optionHtml);
                    }
                }
            })
        })
    },
    getCategory:function() {
        $.ajax({
            type:'GET',
            url:'/redis/recycle/recymercatetypes',
            async:false,//同步请求
            timeout:30000,
            success:function(data){
                categorys = data;
                $('#category').html('<option value="">请选择分类</option>');
                if(categorys) {
                    var merTypeList = [], thisMerType = '', thisMerTypeName = '', thisRemark = '';
                    for(i in categorys){
                        merTypeList = categorys[i].list;
                        var optionHtml = '<optgroup label="'+categorys[i].cateName+'">';
                        for(j in merTypeList){
                            thisMerType = merTypeList[j]['merType'];
                            thismerTypeName = merTypeList[j]['merTypeName'];
                            thisRemark = thismerTypeName+'_'+merTypeList[j]['remark'];
                            optionHtml += '<option value="'+thisMerType+'" title="'+thisRemark+'">'+thisRemark+'</option>';
                        }
                        $('#category').append(optionHtml+'</option>');
                        if(typeof mertypeed != "undefined"){
                            $('#category').val(mertypeed);
                        }

                    }
                }


            }
        });
    },
    getType:function() {
        var that = this;
        $('#brand').change(function(){
            var brandcode = $(this).val();
            $.ajax({
                url:that.getTypeList,
                type:'post',
                data:{brandcode:brandcode},
                dataType:'json',
                success:function(data){
                    $('#model').html('<option value="">请选择型号</option>');
                    if(data) {
                        var optionHtml = '';
                        for(i in data){
                            optionHtml += '<option value="'+data[i]['MERCODE']+'">'+data[i]['MERNAME']+'</option>';
                        }
                        $('#model').append(optionHtml);
                    }
                }
            })
        })
    }
}


