//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

function showContent(){
	$("#loading").css({"display":"none"});
}

setTimeout("showContent()", 1000 ); //1秒后显示