//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

function delFollow(followid){
	if(confirm('您确实要取消收藏该问题吗？')){
		$.post('/index/userfollow/delFollow', {followid:followid}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('取消收藏成功！',2000);
				setTimeout("window.location.reload(true)", 2000 ); //2 秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				return false;
			}
		});
	}
}

function showContent(){
	$("#loading").css({"display":"none"});
}

setTimeout("showContent()", 1000 ); //1秒后显示