/**
 * progress-Dialog for jQuery
 *
 * 
 * @example
 * $(document).progressDialog.showDialog();
 * $(document).progressDialog.hideDialog();
 * 
 *  $.ajax({
	  .....
	  complete:function(data){
	    $(document).progressDialog.hideDialog();
	    //do something
	  }
	});
 **/
(function($) {
	$.fn.progressDialog = function() {

	};

	$.fn.progressDialog.showDialog = function(text) {
		text = text || "Loading,Please wait...";
		createElement(text);
		setPosition();
		waterfall.appendTo("body");
		$(window).bind('resize', function() {
			setPosition();
		});
	};

	$.fn.progressDialog.hideDialog = function(text) {
		waterfall.remove();
	};

	function createElement(text) {
		if (!waterfall) {
			waterfall = $(document.createElement("div"));
			waterfall.attr("id", "waterfall");
			waterfall.css( {
				"height" : "100%",
				"width" : "100%",
				"filter" : "alpha(opacity = 50)",
				"-moz-opacity" : "0.5",
				"opacity" : "0.5",
				"background-color" : "#FCFCFC",
				"position" : "absolute",
				"left" : "0px",
				"top" : "0px"
			});
		}
		if (!loadDiv) {
			loadDiv = document.createElement("div");
		}
		$(loadDiv).appendTo(waterfall);
		
		var content = " <div style='width:" +width+ "px; height:" +Height+ "px;'><div style='width:100%;font-size:20px; height:30px; line-height:31px;padding-left:15px;font-weight:bolder; color:#0000FF;'>"+text+"</div><div align='center'><img src='/images/loading1.gif' border='0'/></div></div>";
		$(loadDiv).html(content);
	}

	function setPosition() {
		var leftOffset = ($(document).width() - width) / 2;
		var topOffset = ($(document).height() - Height) / 2;
		$(loadDiv).css( {
			"position" : "absolute",
			"height" : Height + "px",
			"width" : width + "px",
			"left" : leftOffset + "px",
			"top" : topOffset + "px"
		});
	}

	var waterfall;
	var loadDiv;
	var width = 290;
	var Height = 60;
})(jQuery);