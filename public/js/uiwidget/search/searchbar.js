(

	function(){

		$.fn.extend({
			searchbar:function(params){

				//$(this).html("<table id='search_td'><tr id='search_name'></tr><tr id_search_value></tr></table>");
				var name="";
				var value="";
				for(i=0;i<params.cm.length;i++){
					switch(params.cm[i].type){
						case '0':
							name += "<th>"+params.cm[i].hearder+"</th>";
							value +="<td><input id= '"+params.cm[i].hearder+"' type='text'></td>";
							break;
						case '1':
							name += "<th>"+params.cm[i].hearder+"</th>";
							value += "<td><select></select></td>";
							value += "<option>全部</option>";
							data = {parent:params.cm[i].parentIndex, url:params.cm[i].url};
							$.post(url,function(data,status){
								if('success' == status){
									
								}
							});
							value +="<td><select>";
							value +="<select></td>";
							break;
						default:
							alert("错误");
					}
				}
				function test(){
					alert(name);
				}

			}

			
		});
	}
)();
