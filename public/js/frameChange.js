function moduleChange(url_1, url_2) {
	self.parent.frames["framesetcontent"].firstChild.src = url_1;
    
    self.parent.frames["framesetworkspaces"].firstChild.src = url_2;
}