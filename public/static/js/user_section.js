//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

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
		$.post('/index/qna/saveReplyQna', {content:jQuery.trim($('#content').val()),content_text:jQuery.trim($('#content_text').val()),qnaid:jQuery.trim($('#qnaid').val()),inviteid:jQuery.trim($('#inviteid').val()),pendingid:jQuery.trim($('#pendingid').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('回答发布成功！',3000);
				setTimeout("window.location.reload(true)", 3000 ); //3秒后刷新
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

/*
document.getElementById('additionbtn').addEventListener('click', function () {
	chkContent();
	if(isContentOK){
		document.getElementById("additionbtn").disabled = true;
		// 读取 html
		$('#content').val(editor.txt.html());
		$('#content_text').val(editor.txt.text());
		$.post('/index/userqnas/saveAdditionReply', {content:jQuery.trim($('#content').val()),content_text:jQuery.trim($('#content_text').val()),replyid:jQuery.trim($('#replyid').val()),addition_type:jQuery.trim($('#addition_type').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('发布成功！',3000);
				setTimeout("window.location.reload(true)", 3000 ); //3秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("additionbtn").disabled = false;
				return false;
			}
		});
	}else{
		document.getElementById("additionbtn").disabled = false;
		xcsoft.error('您输入的内容太少啦~',3000);
		return false;
	}
}, false)
*/

function chkContent(){
	var content = editor.txt.text();
	if(content.length > 10){
		isContentOK = true;
	}else{
		isContentOK = false;
	}
}

function apply_update(applyid,applystatus){
	var text = "";
	if(applystatus == 1){
		text = "您确认要通过该用户的回答申请吗？";
	}else{
		text = "您确认要拒绝该用户的回答申请吗？";
	}
	if(confirm(text)){
		$.post('/index/userqnas/updateApply', {applyid:applyid,applystatus:applystatus}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('申请处理成功！',2000);
				setTimeout("window.location.reload(true)", 2000 ); //3秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				return false;
			}
		});
	}
}

function reply_update(replyid,replystatus,i){
	var go_next = false, share = false;;
	$("#acceptBtn"+i).attr('disabled','disabled');
	$("#refuseBtn"+i).attr('disabled','disabled');
	if(replystatus == '1'){
		if(!document.getElementById('share'+i).checked){
			if(confirm("接受回答时分享答案，帮助更多的人。\r同时系统将返还9.5%的佣金。您确认不想分享吗？")){
				go_next = true;
			}else{
				$("#acceptBtn"+i).attr('disabled',false);
				$("#refuseBtn"+i).attr('disabled',false);
			}
		}else{
			if(confirm("您确认要接受这个回答并支付悬赏吗？")){
				go_next = true;
				share = true;
			}else{
				$("#acceptBtn"+i).attr('disabled',false);
				$("#refuseBtn"+i).attr('disabled',false);
			}
		}
	}else{
		if(confirm("您真的要拒绝这个答案吗？")){
			go_next = true;
		}else{
			$("#acceptBtn"+i).attr('disabled',false);
			$("#refuseBtn"+i).attr('disabled',false);
		}
	}
	if(go_next){
		$.post('/index/userqnas/updateReply', {replyid:replyid,replystatus:replystatus,share:share}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('回答处理成功！',2000);
				setTimeout("window.location.reload(true)", 2000 ); //3秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				return false;
			}
		});
	}
}

function pending_refuse(pendingid){
	$.post('/index/userpending/refusePending', {pendingid:pendingid}, function(msg) {
		if(msg=='ok'){
			xcsoft.success('处理成功！',2000);
			setTimeout("window.location.reload(true)", 2000 ); //3秒后刷新
			return true;
		}else{
			xcsoft.error(msg,3000);
			return false;
		}
	});
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

function arbitrate(pendingid,i){
	if(pendingid != ''){
		$.post('/index/userpending/arbitrate', {pendingid:pendingid}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('仲裁申请成功！',2000);
				var btn = document.getElementById('arbitrateBtn'+i);
				btn.className = "btn btn-default button_white";
				btn.style = "width:auto; margin-left:20px;";
				btn.innerHTML = "<span class=\"am-icon-balance-scale am-icon-sm\"></span> 已申请仲裁";
				btn.disabled = "";
				btn.onclick = "";
				return true;
			}else{
				xcsoft.error(msg,3000);
				return false;
			}
		});
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
function viewReply(i){
	var text_box = document.getElementById('reply_text_'+i);
	var html_box = document.getElementById('reply_html_'+i);
	text_box.style.display = 'none';
	html_box.style.display = 'block';
}
function hideReply(i){
	var text_box = document.getElementById('reply_text_'+i);
	var html_box = document.getElementById('reply_html_'+i);
	text_box.style.display = 'block';
	html_box.style.display = 'none';
}
function viewAddition(i){
	var text_box = document.getElementById('addition_text_'+i);
	var html_box = document.getElementById('addition_html_'+i);
	text_box.style.display = 'none';
	html_box.style.display = 'block';
}
function hideAddition(i){
	var text_box = document.getElementById('addition_text_'+i);
	var html_box = document.getElementById('addition_html_'+i);
	text_box.style.display = 'block';
	html_box.style.display = 'none';
}

function showContent(){
	$("#loading").css({"display":"none"});
}

setTimeout("showContent()", 1000 ); //1秒后显示