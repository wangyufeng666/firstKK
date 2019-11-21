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
var knowLedgeObj = {
    getBrandList:'/redis/recycle/recybrandmertype',
    getTypeList:'/redis/recycle/recytypebybrand',
    //列表
    pageList:function(category,brand,type){
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
                        returnText+='<a href="javasrcript:void(1);" onclick="knowLedgeObj.knowledgeInfo(\''+data['PKID']+'\')" class="a_link">详情</a>';
                        return returnText;
                    }
                }
            ]
            ,url:'/inspect/knowledge/pagelist'
            ,baseParams:this.getParams(category,brand,type)
            ,afterRender:function(e, grid){
                var pageNum = grid.getPageNumber();
                limit = grid.getPageSize();
                start = (pageNum-1) * limit;
            }
            ,pageSizeList:[10,15,20,30,50]
        });

    },

    //获取参数
    getParams:function(category,brand,type) {
        return {
            category:category,
            brand:brand,
            model:type,
        };
    },

    //详情
    knowledgeInfo:function(id) {
        layer.open({
            type: 2,
            title: '查看知识库内容',
            shadeClose: true,
            shade: false,
            area: ['50%', '50%'],
            content: '/inspect/knowledge/showknowledge?id='+id
        });
    },
};


