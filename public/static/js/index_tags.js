//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

function getRandomTags(){
	$("#recommandTags").html("正在为您生成随机推荐，请稍后...<i class=\"am-icon-spinner am-icon-spin\"></i>");
	$.post('/index/usertags/getRandomTags', {}, function(msg) {
		if(msg==''){
			$("#recommandTags").html('没有推荐给您的标签数据了');
		}else{
			$("#recommandTags_text").val(msg);
			var tag_list = $("#recommandTags_text").val();
			var tmpStr = '';
			tmpArr = tag_list.split('$$$');
			tmpArr.forEach(function(value){
				if(value != ''){
					tmpArr2 = value.split('___');
					if(tmpArr2[2] == 'true'){
						tmpStr += " <a href=\"javascript:void(0);\" class='tag_parent' title=\"有下一级子标签\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tmpArr2[0]+"\" data-tag-id=\""+tmpArr2[1]+"\" data-type=\"tags\">";
						tmpStr += tmpArr2[0];
						tmpStr += "</a> ";
					}else{
						tmpStr += " <a href=\"javascript:void(0);\" class='tag' title=\"点击查看添加该标签的用户\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tmpArr2[0]+"\" data-tag-id=\""+tmpArr2[1]+"\" data-type=\"users\">";
						tmpStr += tmpArr2[0];
						tmpStr += "</a> ";
					}
				}
			});
			$("#recommandTags").html(tmpStr);
		}
	});
}
//获取第一批推荐标签
getRandomTags();

function chkSearchTag(e){
	var e = e || event;
	var currKey = e.keyCode || e.which || e.charCode;//支持IE,FireFox
	if (currKey == 13) {
		searchTags();
		return false;
	}
}

function searchTags(new_page){
	$("#tags_recommand").css('display','none');
	$("#tag_searched").css('display','block');
	$("#tag_searched").html('<img src="/static/images/loading.gif">');
	if(new_page<0 || new_page == ''){new_page=1;}
	$.post('/index/usertags/searchTags', {tag:jQuery.trim($('#search_tags').val()),page:new_page}, function(msg) {
		if(msg == ''){
			xcsoft.error('没有找到您想要的标签',2000);
			$("#tags_recommand").css('display','block');
			$("#tag_searched").css('display','none');
		}else{
			tmpArr = msg.split('###');
			tmpArr2 = tmpArr[0].split('___');
			no_searched = tmpArr2[0];
			if(no_searched == '1'){
				tmpStr = "<span class='header_title'><span class=\"am-icon-frown-o am-icon-sm\" style=\"color:#900;margin-right=10px;\"></span> 没有找到您想要的标签，但是您可以从我们的标签分类开始查找哦~<br /></span><span style='color:#090;'>(tips: 蓝色的标签表示在该标签下还有子标签哦)<br />";
			}else{
				tmpStr = "<span  class='header_title'><span class=\"am-icon-smile-o am-icon-sm\" style=\"color:#06C;margin-right=\"10px;\"\"></span> 搜索结果：</span><span style='color:#090;'>(tips: 蓝色的标签表示在该标签下还有子标签哦)<br />";
			}
			total_page = tmpArr2[1];
			current_page = tmpArr2[2];
			tmpArr = tmpArr[1].split('$$$');
			tmpArr.forEach(function(value){
				if(value != ''){
					tmpArr2 = value.split('___');
					if(tmpArr2[2] == 'true'){
						tmpStr += " <a href=\"javascript:void(0);\" class='tag_parent' title=\"有下一级子标签\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tmpArr2[0]+"\" data-tag-id=\""+tmpArr2[1]+"\" data-type=\"tags\">";
						tmpStr += tmpArr2[0];
						tmpStr += "</a> ";
					}else{
						tmpStr += " <a href=\"javascript:void(0);\" class='tag' title=\"点击查看添加该标签的用户\" data-reveal-id=\"tag_box\" data-animation=\"fade\" data-tag=\""+tmpArr2[0]+"\" data-tag-id=\""+tmpArr2[1]+"\" data-type=\"users\">";
						tmpStr += tmpArr2[0];
						tmpStr += "</a> ";
					}
				}
			});
			tmpStr += "<div style=\"padding-top:20px;\">";
			if(parseInt(current_page)>1){
				tmpStr += "<span class=\"prevNextBtn\" onclick=\"searchTags("+(parseInt(current_page)-1)+");\">上一页</span>";
			}
			tmpStr += "<span>( "+current_page+"/"+total_page+" )</span>";
			if(parseInt(current_page) < parseInt(total_page)){
				tmpStr += "<span class=\"prevNextBtn\" onclick=\"searchTags("+(parseInt(current_page)+1)+");\">下一页</span>";
			}
			tmpStr += "</div>";
			$("#tag_searched").html(tmpStr);
		}
	});
}

function chkTag(tagid){
	$.post('/index/usertags/addTag', {tagid:tagid}, function(msg) {
		if(msg.substr(0,2) == 'ok'){
			xcsoft.success('标签添加成功！',2000);
			tmpArr = msg.split("___");
			user_tagid = tmpArr[2];
			$("#no_tag").css('display','none');
			$("#no_tag_remove").css('display','none');
			$("#user_tag_list").html($("#user_tag_list").html()+"<span class=\"tag_remove\" id=\"tag_"+user_tagid+"\" onclick=\"delTag('"+user_tagid+"');\">"+tmpArr[1]+"</span> ");
		}else{
			xcsoft.error(msg,2000);
		}
	});
}

function delTag(user_tagid){
	if(confirm("您确定要删除这个标签吗？")){
		$.post('/index/usertags/delTag', {user_tagid:user_tagid}, function(msg) {
			if(msg.substr(0,2) == 'ok'){
				xcsoft.success('标签删除成功！',2000);
				tmpArr = msg.split(",");
				tag_count = parseInt(tmpArr[1]);
				$("#tag_"+user_tagid).css('display','none');
				if(tag_count<=0){
					$("#no_tag_remove").css('display','inline');
				}
			}else{
				xcsoft.error(msg,2000);
			}
		});
	}
}

function showNoLogin(){
	$("#notLogin").css('display','block');
}