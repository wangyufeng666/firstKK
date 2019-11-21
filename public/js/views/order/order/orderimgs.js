//图片拖拽
drag = 0;
move = 0;
function mousedown(){
	if(drag){
		X1 = window.event.x - parseInt(dragimages.style.left);
		Y1 = window.event.y - parseInt(dragimages.style.top);
		dragimages.style.Index += 1;
		move = 1;
	}
}
function mouseStop(){
	window.event.returnValue = false;
}
function mousemove(){
	if (move){
		dragimages.style.left = window.event.x - X1;
		dragimages.style.top = window.event.y - Y1;
	}
}
function mouseup(){
	move = 0;
}
window.onload = function(){
	//图片切换
	var ce_order_images = document.getElementsByClassName('ce_order_image');
        var ce_pos = 0;
        var ce_image_len = ce_order_images.length;
		//prev
		var btnP=document.getElementById('btnPrev');
		if(ce_pos <= 0){btnP.disabled=true;}
		btnP.onclick=function(){
			ce_order_images[ce_pos].style.display = 'none';
			ce_pos = --ce_pos <= 0 ? 0 : ce_pos;
			ce_order_images[ce_pos].style.display = 'inline';
			if(ce_pos <= 0){btnP.disabled=true;}else{btnP.disabled=false;}
			if(ce_pos >= ce_image_len-1){btnN.disabled=true;}else{btnN.disabled=false;}
			$("#nowid").text(ce_pos+1);
		}
		
		//next
		var btnN=document.getElementById('btnNext');
		btnN.onclick=function(){
			ce_order_images[ce_pos].style.display = 'none';
            ce_pos = ++ce_pos >= ce_image_len ? ce_image_len-1 : ce_pos;
            ce_order_images[ce_pos].style.display = 'inline';
			if(ce_pos <= 0){btnP.disabled=true;}else{btnP.disabled=false;}
			if(ce_pos >= ce_image_len-1){btnN.disabled=true;}else{btnN.disabled=false;}
			$("#nowid").text(ce_pos+1);
		}
		//分页
		$("#nowid").text(1);
		$("#numid").text(ce_image_len);
		//显示隐藏
		$(function(){
			$(".ce_order_image").click(function(){
				var img_date = $(this).attr("data-date");
				var img_src = $(this).attr("src");
				img_src=img_src.replace("thum",""); //去掉字符串中的thum
				$(".ce_2_img").attr("src",img_src);
				$(".ce_2_img").attr("title",'上传时间'+img_date+'（点击拖动）');
				$(".ce_1").hide();
				$(".ce_2").show();
				//拖动
				document.all.bagimg.onmousemove = mousemove;
				document.all.bagimg.onmousedown = mousedown;
				document.all.bagimg.onmouseup = mouseup;
				document.all.bagimg.ondragstart  = mouseStop;
			})
			$(".cos_bagimg").click(function(){
				$(".ce_1").show();
				$(".ce_2").hide();
			})
		})
}