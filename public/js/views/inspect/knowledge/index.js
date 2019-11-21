/**
 * 检测知识库JS
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

var grid;
var inspectObj = {
    getBrandList:'/redis/recycle/recybrandmertype',
    getTypeList:'/redis/recycle/recytypebybrand',
    //列表
    pageList:function(){

        grid = $('#grid').grid({
            pageSize:15,
            height:375
            ,cm:[
                {header:"序号", dataIndex:'R', width:'80px',sortable:false}
                ,{header:"标题", dataIndex:'TITLE', width:'100px',sortable:false}
                ,{header:"商品", dataIndex:'GOODS', width:'100px',sortable:false}
                ,{header:"内容", dataIndex:'CONTENT', width:'80px',sortable:false}
                ,{header:"创建时间", dataIndex:'CREATEDATE', width:'130px',sortable:false}
                ,{header:"创建人", dataIndex:'CREATE_USER', width:'140px',sortable:false}
                ,{header:"操作", dataIndex:'', width:'130px', sortable:false,
                    renderer:function(value, data, rowIndex, colIndex, metadata){
                        var returnText = "";

                        returnText+=' <a href="javasrcript:void(1);" onclick="inspectObj.editKnowledge(\''+data['PKID']+'\')" class="a_link">编辑</a>';
                        returnText+=' |<a href="javasrcript:void(1);" onclick="inspectObj.knowledgeInfo(\''+data['PKID']+'\')" class="a_link">详情</a>';
                        if(data['STATUS'] == '1') {
                            returnText+=' |<a href="javasrcript:void(1);" onclick="inspectObj.deleteKnowledge(\''+data['PKID']+'\')" class="a_link">删除</a>';
                        }
                        return returnText;
                    }
                }
            ]
            ,url:'/inspect/knowledge/pagelist'
            ,baseParams:this.getParams()
            ,afterRender:function(e, grid){
                var pageNum = grid.getPageNumber();
                limit = grid.getPageSize();
                start = (pageNum-1) * limit;
            }
            ,pageSizeList:[10,15,20,30,50]
        });

    },

    //获取参数
    getParams:function() {
        var keyword = $('input[name="keyword"]').val();
        var brand = $('#brand').val();
        var category = $('#category').val();
        var model = $('#model').val();
        return {
            category:category,
            keyword:keyword,
            brand:brand,
            model:model,
        };
    },

    //新增知识库内容
    addKnowledge: function() {
        layer.open({
            type: 2,
            title: '新增知识库内容',
            shadeClose: true,
            shade: false,
            area: ['893px', '600px'],
            content: '/inspect/knowledge/addknowledge'
        });
    },
    //搜索
    searchKnowledge:function() {
        var that = this;
        grid.query(this.getParams());
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
    },

    //编辑
    editKnowledge:function(id) {
        layer.open({
            type: 2,
            title: '编辑知识库内容',
            shadeClose: true,
            shade: false,
            area: ['893px', '600px'],
            content: '/inspect/knowledge/editknowledge?id='+id
        });
    },
    //详情
    knowledgeInfo:function(id) {
        layer.open({
            type: 2,
            title: '查看知识库内容',
            shadeClose: true,
            shade: false,
            area: ['893px', '800px'],
            content: '/inspect/knowledge/showknowledge?id='+id
        });
    },
    //删除
    deleteKnowledge:function(id) {
        if(confirm('确认要删除当前知识库内容？')){
            $.post('/inspect/knowledge/deleteknowledge',{id:id},function(data){
                if(data == 'Y'){
                    alert('操作成功！');
                    window.location.reload();
                }else{
                    alert('操作失败，请重新操作');
                }
            })
        }
    }
};


