function selectdel(){//侧滑显示删除按钮
    var expansion = null;
    var container = document.querySelectorAll('#mersUl .oitop_box>div');
    for(var i = 0; i < container.length; i++){
        var x, y, X, Y, swipeX, swipeY;
        container[i].addEventListener('touchstart', function(event) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
            swipeX = true;
            swipeY = true ;
            if(expansion){   //判断是否展开，如果展开则收起
                expansion.className = "";
            }
        });
        container[i].addEventListener('touchmove', function(event){
            X = event.changedTouches[0].pageX;
            Y = event.changedTouches[0].pageY;        
            // 左右滑动
            if(swipeX && Math.abs(X - x) - Math.abs(Y - y) > 0){
                // 阻止事件冒泡
                event.stopPropagation();
                if(X - x > 10){   //右滑
                    event.preventDefault();
                    this.className = "";    //右滑收起
                    if($('#mersUl .oitop_box .swipeleft').length == 0){
                        $('.search_box .edit').removeClass('delay').html('编辑');
                        $('.oitop_box>div').removeClass('swipeleft');
                    }
                }
                if(x - X > 10){   //左滑
                    event.preventDefault();
                    this.className = "swipeleft";   //左滑展开
                    expansion = this;
                }
                swipeY = false;
            }
            // 上下滑动
            if(swipeY && Math.abs(X - x) - Math.abs(Y - y) < 0) {
                swipeX = false;
                if($('#mersUl .oitop_box .swipeleft').length == 0){
                    $('.search_box .edit').removeClass('delay').html('编辑');
                    $('.oitop_box>div').removeClass('swipeleft');
                }
            }
        });
    }
    var height = $('#mersUl .oitop_box:first-child').height();
    $('#mersUl .oitop_box .delect_obt').css('line-height',height+'px');
}