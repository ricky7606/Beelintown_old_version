    if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
        var version = parseFloat(RegExp.$1);
        if(version>2.3){
            var phoneScale = parseInt(window.screen.width)/1200;
            document.write('<meta name="viewport" content="width=1200, minimum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
        }else{
            document.write('<meta name="viewport" content="width=1200, target-densitydpi=device-dpi">');
        }
    }else{
        document.write('<meta name="viewport" content="width=1200, target-densitydpi=device-dpi">');
    }

function searchQnas(){
	if(jQuery.trim($("#search_items").val())==''){
		xcsoft.error('请输入您想搜索的问题关键词',2000);
	}else{
		var url = "/index/qnasearch?keywords="+jQuery.trim($("#search_items").val());
		$(location).attr('href', url);
	}
}

function chkSearch(e){
	var e = e || event;
	var currKey = e.keyCode || e.which || e.charCode;//支持IE,FireFox
	if (currKey == 13) {
		searchQnas();
		return false;
	}
}

