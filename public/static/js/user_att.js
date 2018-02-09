//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

function delAtt(attid){
	if(confirm('您确实要取消关注该用户吗？')){
		$.post('/index/userattention/delAtt', {attentionid:attid}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('取消关注成功！',2000);
				setTimeout("window.location.reload(true)", 2000 ); //2 秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				return false;
			}
		});
	}
}

function attUser(userid){
	$.post('/index/userattention/attUser', {attention_userid:userid}, function(msg) {
		if(msg=='ok'){
			xcsoft.success('关注成功！',2000);
			setTimeout("window.location.reload(true)", 2000 ); //3秒后刷新
			return true;
		}else{
			xcsoft.error(msg,3000);
			return false;
		}
	});
}

function showContent(){
	$("#loading").css({"display":"none"});
}

setTimeout("showContent()", 1000 ); //1秒后显示