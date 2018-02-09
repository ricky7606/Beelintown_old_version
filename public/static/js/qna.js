//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

var isTitleOK=false;
var isCoinsOK=false;
var originalcoins = $('#originalcoins').val();
var frozencoins = $('#frozencoins').val();
$('#available_coins').html(sub(originalcoins,frozencoins));
var invited_users = new Array();

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
editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024
editor.customConfig.debug = true
editor.customConfig.zIndex = 100
editor.create()

document.getElementById('submitbtn').addEventListener('click', function () {
	if(editor.txt.html().length > 20000){
		xcsoft.error('您输入的内容太长了，请精简一些吧',3000);
		return false;
	}else{
		if(isTitleOK && isCoinsOK){
			document.getElementById("submitbtn").disabled = true;
			document.getElementById("submitbtn").innerHTML = '数据提交中，请稍后';
			// 读取 html
			$('#content').val(editor.txt.html());
			$('#content_text').val(editor.txt.text());
			$.post('/index/qna/saveQna', {title:jQuery.trim($('#title').val()),content:jQuery.trim($('#content').val()),content_text:jQuery.trim($('#content_text').val()),coins:jQuery.trim($('#coins').val()),invite_users:jQuery.trim($('#invite_user_list').val())}, function(msg) {
				if(msg=='ok'){
					xcsoft.success('问题发布成功！3秒后跳转',3000);
					setTimeout("window.location.href='/index'", 3000 ); //3秒后跳转
					return true;
				}else{
					xcsoft.error(msg,3000);
					document.getElementById("submitbtn").disabled = false;
					return false;
				}
			});
		}else{
			document.getElementById("submitbtn").disabled = false;
			xcsoft.error('请检查您输入的内容后重试',3000);
			return false;
		}
	}
}, false)

function yesNoImg(imgname,isok){
	var field = document.getElementById(imgname);
	if(isok == 'ok'){
		field.src = "/static/images/yes.png";
	}else{
		field.src = "/static/images/no.png";
	}
	field.style.display = "block";
}

var GetLength = function (str) {
///<summary>获得字符串实际长度，中文2，英文1</summary>
///<param name="str">要获得长度的字符串</param>
var realLength = 0, len = str.length, charCode = -1;
for (var i = 0; i < len; i++) {
  charCode = str.charCodeAt(i);
  if (charCode >= 0 && charCode <= 128) realLength += 1;
  else realLength += 2;
}
return realLength;
};

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
}$(function () { 
$("input[name=title]").bind('blur', function () {
	if(GetLength($(this).val()) < 20){
		yesNoImg('check_title','no');
		return;
	}else{
		if (GetLength($(this).val()) > 120) { 
			$(this).val(cutstr($(this).val(), 120)); 
		}
		isTitleOK = true;
		yesNoImg('check_title','ok');
		return; 
	}
}); 
}); 

function getRandUsers(){
	var userid = $("#userid").val();
	$.post('/index/qna/getRandUsers', {limit:6, userid:userid}, function(msg) {
		if(msg!=''){
			$("#rnd_user_list").css({'display' : 'block'});
			$("#search_user_result").css({'display' : 'none'});
			for(var i=0;i<6;i++){
				$("#invitebtn"+(i+1)).css({'display' : 'block'});
				$("#cancelbtn"+(i+1)).css({'display' : 'none'});
			}
			for(var i=0;i<6;i++){
				var jsondata = $.parseJSON(JSON.stringify(msg[i]));
				if(jsondata.personal_pic){
					$('#rndUser'+(i+1)).html('<img src="'+ jsondata.personal_pic +'" class="user_pic"> '+jsondata.username);
				}else{
					$('#rndUser'+(i+1)).html('<img src="/static/images/profile_pic.jpg" class="user_pic"> '+jsondata.username);
				}
				$.each(invited_users, function(index,value){
					if(value==jsondata.username){
						$("#invitebtn"+(i+1)).css({'display' : 'none'});
						$("#cancelbtn"+(i+1)).css({'display' : 'block'});
					}
				});
				$("#invitebtn"+(i+1)).attr("onclick","inviteUser('"+jsondata.username+"',"+(i+1)+",'invite');");
				$("#cancelbtn"+(i+1)).attr("onclick","cancelUser('"+jsondata.username+"');");
				$("#username"+(i+1)).val(jsondata.username);
			}
		}else{
			xcsoft.error("没有更多的用户了",3000);
		}
	});
}

function inviteUser(username,i,type){
	if(invited_users.length>9){
		xcsoft.error("您最多只能邀请10位用户来回答",3000);
	}else{
		var new_user = true;
		$.each(invited_users, function(index,value){
			if(value==username){
				new_user = false;
				return false;
			}
		});
		if(new_user){
			invited_users.push(username);
			if(type=='att'){
				$("#att_invitebtn"+i).css({'display' : 'none'});
				$("#att_cancelbtn"+i).css({'display' : 'block'});
			}
			if(type=='invite'){
				$("#invitebtn"+i).css({'display' : 'none'});
				$("#cancelbtn"+i).css({'display' : 'block'});
			}
			if(type=='search'){
				$("#search_invitebtn"+i).css({'display' : 'none'});
				$("#search_cancelbtn"+i).css({'display' : 'block'});
			}
		}
		$("#invitedUsers").html(invited_users.join(", "));
		$("#invite_user_list:hidden").val(invited_users.join(","));
		if(type=='att'){
			for(i=0;i<6;i++){
				if($('#username'+(i+1)).val() == username) {
					$("#invitebtn"+(i+1)).css({'display' : 'none'});
					$("#cancelbtn"+(i+1)).css({'display' : 'block'});
				}
			}
			for(i=0;i<6;i++){
				if($('#searchusername'+(i+1)).val() == username) {
					alert($('#searchusername'+(i+1)).val());
					$("#search_invitebtn"+(i+1)).css({'display' : 'none'});
					$("#search_cancelbtn"+(i+1)).css({'display' : 'block'});
				}
			}
		}
		if(type=='invite'){
			var total_att_users = $('#total_att_users').val();
			for(i=0;i<total_att_users;i++){
				if($('#att_username'+(i+1)).val() == username) {
					$("#att_invitebtn"+(i+1)).css({'display' : 'none'});
					$("#att_cancelbtn"+(i+1)).css({'display' : 'block'});
				}
			}
			for(i=0;i<6;i++){
				if($('#searchusername'+(i+1)).val() == username) {
					alert($('#searchusername'+(i+1)).val());
					$("#search_invitebtn"+(i+1)).css({'display' : 'none'});
					$("#search_cancelbtn"+(i+1)).css({'display' : 'block'});
				}
			}
		}
		if(type=='search'){
			for(i=0;i<6;i++){
				if($('#username'+(i+1)).val() == username) {
					$("#invitebtn"+(i+1)).css({'display' : 'none'});
					$("#cancelbtn"+(i+1)).css({'display' : 'block'});
				}
			}
			var total_att_users = $('#total_att_users').val();
			for(i=0;i<total_att_users;i++){
				if($('#att_username'+(i+1)).val() == username) {
					$("#att_invitebtn"+(i+1)).css({'display' : 'none'});
					$("#att_cancelbtn"+(i+1)).css({'display' : 'block'});
				}
			}
		}
	}
	chkCoins();
}

function cancelUser(username){
	invited_users.splice($.inArray(username,invited_users),1);
	$("#invitedUsers").html(invited_users.join(", "));
	if($("#invitedUsers").html()==''){$("#invitedUsers").html('还未邀请任何用户');}
	$("#invite_user_list:hidden").val(invited_users.join(","));
	for(i=0;i<6;i++){
		$("#invitebtn"+(i+1)).css({'display' : 'block'});
		$("#cancelbtn"+(i+1)).css({'display' : 'none'});
	}
	for(i=0;i<6;i++){
		$.each(invited_users, function(index,value){
			if(value==$('#username'+(i+1)).val()){
				$("#invitebtn"+(i+1)).css({'display' : 'none'});
				$("#cancelbtn"+(i+1)).css({'display' : 'block'});
			}
		});
	}
	for(i=0;i<6;i++){
		$("#search_invitebtn"+(i+1)).css({'display' : 'block'});
		$("#search_cancelbtn"+(i+1)).css({'display' : 'none'});
	}
	for(i=0;i<6;i++){
		$.each(invited_users, function(index,value){
			if(value==$('#searchusername'+(i+1)).val()){
				$("#search_invitebtn"+(i+1)).css({'display' : 'none'});
				$("#search_cancelbtn"+(i+1)).css({'display' : 'block'});
			}
		});
	}
	var total_att_users = $('#total_att_users').val();
	for(i=0;i<total_att_users;i++){
		$("#att_invitebtn"+(i+1)).css({'display' : 'block'});
		$("#att_cancelbtn"+(i+1)).css({'display' : 'none'});
	}
	for(i=0;i<total_att_users;i++){
		$.each(invited_users, function(index,value){
			if(value==$('#att_username'+(i+1)).val()){
				$("#att_invitebtn"+(i+1)).css({'display' : 'none'});
				$("#att_cancelbtn"+(i+1)).css({'display' : 'block'});
			}
		});
	}
	chkCoins();
}

function searchUser(){
	var username = $("#search_user").val();
	var userid = $("#userid").val();
	if(username == "" || username.length < 2 ){
		xcsoft.error("请输入您想搜索的用户名",3000);
	}else{
		for(i=1;i<5;i++){
			$("#search_invitebtn"+(i)).css({"display":"block"});
			$("#search_cancelbtn"+(i)).css({"display":"none"});
			$('#searchResult'+(i)).css({"display":"none"});
			$('#searchUser'+(i)).html('');
			$('#searchusername'+(i)).val('');
		}
		$.post('/index/qna/getSearchUser', {username:username, userid:userid}, function(msg) {
			if(msg==''){
				xcsoft.error("未能搜索到相关用户名",3000);
			}else{
				for(i=0;i<msg.length;i++){
					$('#searchResult'+(i+1)).css({"display":"block"});
					var jsondata = $.parseJSON(JSON.stringify(msg[i]));
					var invited = false;
					$.each(invited_users, function(index,value){
						if(value==jsondata.username){
							invited = true;
							return true;
						}
					});
					if(jsondata.personal_pic){
						$('#searchUser'+(i+1)).html('<img src="'+ jsondata.personal_pic +'" class="user_pic"> '+jsondata.username);
					}else{
						$('#searchUser'+(i+1)).html('<img src="/static/images/profile_pic.jpg" class="user_pic"> '+jsondata.username);
					}
					$("#search_invitebtn"+(i+1)).attr("onclick","inviteUser('"+jsondata.username+"',"+(i+1)+",'search');");
					$("#search_cancelbtn"+(i+1)).attr("onclick","cancelUser('"+jsondata.username+"');");
					$('#searchusername'+(i+1)).val(jsondata.username);
					if(invited){
						$("#search_invitebtn"+(i+1)).css({"display":"none"});
						$("#search_cancelbtn"+(i+1)).css({"display":"block"});
					}else{
						$("#search_invitebtn"+(i+1)).css({"display":"block"});
						$("#search_cancelbtn"+(i+1)).css({"display":"none"});
					}
				}
			}
		});
	}
}

function chkCoins(){
	var originalcoins = $('#originalcoins').val();
	var frozencoins = $('#frozencoins').val();
	var total_invite = 1;
	var coins = 0;
	if($('#coins').val() != ''){
		var coins = $('#coins').val();
		var invite_users = $('#invite_user_list').val();
		if(invite_users != ''){
			var invite_arr = invite_users.split(',');
			total_invite = invite_arr.length;
		}
		coins = mul(coins, total_invite);
		coins = mul(coins, 1.1);
	}
	if(sub(sub(originalcoins,frozencoins), coins)<0){
		xcsoft.error("比邻币余额不足",2000);
		$('#total_coins').html(coins);
		document.getElementById('coins').style.color = "#F00";
		document.getElementById('total_coins').style.color = "#F00";
		isCoinsOK=false;
		yesNoImg('check_coins','no');
	}else{
		document.getElementById('coins').style.color = "";
		document.getElementById('total_coins').style.color = "#03F";
		$('#total_coins').html(coins);
		isCoinsOK=true;
		yesNoImg('check_coins','ok');
	}
	var row1 = document.getElementById('inviteRow');
	var row2 = document.getElementById('inviteResultRow');
	if(coins > 0){
		row1.style.display = (document.all ? "block" : "table-row");  
		row2.style.display = (document.all ? "block" : "table-row");  
	}else{
		row1.style.display = "none";  
		row2.style.display = "none";  
	}
}

function setDetailMsgRow(rowID, type) {  
	var row = document.getElementById(rowID);  
	if (row != null) {  
		if (row.style.display == (document.all ? "block" : "table-row")) {  
			row.style.display = "none";  
		}  
		else {  
			row.style.display = (document.all ? "block" : "table-row");  
		}  
	}  
}  