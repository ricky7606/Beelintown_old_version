var isContentOK=false;
var E = window.wangEditor
var editor = new E('#editordiv')
editor.customConfig.menus = [
    'head',  // 标题
    'bold',  // 粗体
    'italic',  // 斜体
    'underline',  // 下划线
    'strikeThrough',  // 删除线
    'foreColor',  // 文字颜色
    'backColor',  // 背景颜色
    'link',  // 插入链接
    'list',  // 列表
    'justify',  // 对齐方式
    'quote',  // 引用
    'emoticon',  // 表情
    'image',  // 插入图片
    'video',  // 插入视频
    'table',  // 表格
    'undo',  // 撤销
    'redo'  // 重复
]
editor.customConfig.uploadImgServer = '/index/qna/uploadPic'
editor.customConfig.uploadFileName = 'upFiles[]'
// 限制一次最多上传 5 张图片
editor.customConfig.uploadImgMaxLength = 5
// 将图片大小限制为 3M
editor.customConfig.uploadImgMaxSize = 5 * 1024 * 1024
editor.customConfig.debug = true
editor.customConfig.zIndex = 100
editor.create()

document.getElementById('submitbtn').addEventListener('click', function () {
	chkContent();
	if(isContentOK){
		document.getElementById("submitbtn").disabled = true;
		// 读取 html
		$('#content').val(editor.txt.html()); 
		$('#content_text').val(editor.txt.text());
		$.post('/index/qna/saveReplyQna', {content:jQuery.trim($('#content').val()),content_text:jQuery.trim($('#content_text').val()),qnaid:jQuery.trim($('#qnaid').val()),pendingid:jQuery.trim($('#pendingid').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('回答发布成功！',3000);
				setTimeout("window.location.reload(true)", 1000 ); //3秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("submitbtn").disabled = false;
				return false;
			}
		});
	}else{
		document.getElementById("submitbtn").disabled = false;
		xcsoft.error('您输入的内容太少啦~',3000);
		return false;
	}
}, false)

function applyQna(btn){
	document.getElementById('apply'+btn).disabled = true;
	$.post('/index/index/saveApplyQna', {qnaid:jQuery.trim($('#qnaid'+btn).val())}, function(msg) {
		if(msg=='ok'){
			xcsoft.success('申请成功！',2000);
			document.getElementById('apply'+btn).innerHTML = "<i class=\"am-icon-hourglass-half am-icon-sm\"></i> 已申请回答";
			document.getElementById('apply'+btn).setAttribute('class','btn btn-default button_grey');
			document.getElementById('apply'+btn).setAttribute('onclick','');
			return true;
		}else{
			xcsoft.error(msg,3000);
			document.getElementById('apply'+btn).disabled = false;
			return false;
		}
	});
}

function chkContent(){
	var content = editor.txt.text();
	if(content.length > 10){
		isContentOK = true;
	}else{
		isContentOK = false;
	}
}

//js截取字符串，中英文都能用 
//如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。 
//字符串，长度 

/** 
* js截取字符串，中英文都能用 
* @param str：需要截取的字符串 
* @param len: 需要截取的长度 
*/
function cutstr(str, len) {
var str_length = 0;
var str_len = 0;
str_cut = new String();
str_len = str.length;
for (var i = 0; i < str_len; i++) {
  a = str.charAt(i);
  str_length++;
  if (escape(a).length > 4) {
	//中文字符的长度经编码之后大于4 
	str_length++;
  }
  str_cut = str_cut.concat(a);
  if (str_length >= len) {
	return str_cut;
  }
}
//如果给定字符串小于指定长度，则返回源字符串； 
if (str_length < len) {
  return str;
}
}

function viewAll(i){
	var text_box = document.getElementById('content_text_'+i);
	var html_box = document.getElementById('content_html_'+i);
	text_box.style.display = 'none';
	html_box.style.display = 'block';
}
function hideAll(i){
	var text_box = document.getElementById('content_text_'+i);
	var html_box = document.getElementById('content_html_'+i);
	text_box.style.display = 'block';
	html_box.style.display = 'none';
}

function follow(qnaid,i){
	$.post('/index/qna/follow', {qnaid:qnaid}, function(msg) {
		if(msg=='ok'){
			xcsoft.success('收藏成功！',2000);
			//setTimeout("window.location.reload(true)", 2000 ); //2秒后刷新
			var btn = document.getElementById('followBtn'+i);
			btn.className = "btn btn-default button_white";
			btn.style = "margin-left:30px;";
			btn.innerHTML = "<i class=\"am-icon-star am-icon-sm\"></i> 已收藏";
			btn.disabled = "";
			btn.onclick = "";
			return true;
		}else{
			xcsoft.error(msg,3000);
			return false;
		}
	});
}

function attUser(userid,i){
	$.post('/index/userqnas/attUser', {userid:userid}, function(msg) {
		if(msg=='ok'){
			xcsoft.success('关注成功！',2000);
			//setTimeout("window.location.reload(true)", 2000 ); //3秒后刷新
			var btn = document.getElementById('attBtn'+i);
			btn.className = "btn btn-default button_white";
			btn.style = "width:auto; margin-left:20px;";
			btn.innerHTML = "<i class=\"am-icon-user-plus am-icon-sm\"></i> 已关注";
			btn.disabled = "";
			btn.onclick = "";
			return true;
		}else{
			xcsoft.error(msg,3000);
			return false;
		}
	});
}

function attReplyUser(userid,i){
	$.post('/index/userqnas/attUser', {userid:userid}, function(msg) {
		if(msg=='ok'){
			xcsoft.success('关注成功！',2000);
			//setTimeout("window.location.reload(true)", 2000 ); //3秒后刷新
			var btn = document.getElementById('attReplyBtn'+i);
			btn.className = "btn btn-default button_white";
			btn.style = "width:auto; margin-left:20px;";
			btn.innerHTML = "<i class=\"am-icon-user-plus am-icon-sm\"></i> 已关注";
			btn.disabled = "";
			btn.onclick = "";
			return true;
		}else{
			xcsoft.error(msg,3000);
			return false;
		}
	});
}

function showAllTags(type){
	for(i=6;i<30;i++){
		if($("#"+type+"_tag"+i)){
			$("#"+type+"_tag"+i).css({"display":"inline"});
		}
	}
	$("#"+type+"_tag_more").css({"display":"none"});
	$("#"+type+"_tag_less").css({"display":"inline"});
}

function hideAllTags(type){
	for(i=6;i<30;i++){
		if($("#"+type+"_tag"+i)){
			$("#"+type+"_tag"+i).css({"display":"none"});
		}
	}
	$("#"+type+"_tag_more").css({"display":"inline"});
	$("#"+type+"_tag_less").css({"display":"none"});
}

function showContent(){
	$("#loading").css({"display":"none"});
}

setTimeout("showContent()", 1000 ); //3秒后跳转

var thisHref = window.location.href;
if(thisHref.indexOf("index") > 0 && thisHref.indexOf("index/") < 0){
	$("#index_header").attr("class","form-group header_title current_header");
}else if(thisHref.indexOf("index/qnalist") > 0){
	$("#qnalist_header").attr("class","form-group header_title current_header");
}else if(thisHref.indexOf("index/feature") > 0){
	$("#feature_header").attr("class","form-group header_title current_header");
}