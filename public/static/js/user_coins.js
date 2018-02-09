//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

var isCoinsOK = false;
var isWalletOK = false;

document.getElementById('submitbtn').addEventListener('click', function () {
	if(isCoinsOK && isWalletOK){
		document.getElementById("submitbtn").disabled = true;
		// 读取 html
		$.post('/index/usercoins/extractCoins', {coins:jQuery.trim($('#coins').val()), wallet:jQuery.trim($('#wallet_list').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('提现申请成功！',2500);
				setTimeout("window.location.reload(true)", 2500 ); //2.5 秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("submitbtn").disabled = false;
				return false;
			}
		});
	}else{
		document.getElementById("submitbtn").disabled = false;
		xcsoft.error('您输入的提现信息有误',3000);
		return false;
	}
}, false)

function chkCoins(){
	var availablecoins = $('#availablecoins').val();
	var coins = 0;
	if($('#coins').val() != ''){
		var coins = $('#coins').val();
	}
	if(sub(availablecoins, coins)<0){
		xcsoft.error("比邻币余额不足",2000);
		yesNoImg('check_coins','no');
		document.getElementById('coins').style.color = "#F00";
		isCoinsOK=false;
	}else{
		yesNoImg('check_coins','ok');
		document.getElementById('coins').style.color = "";
		isCoinsOK=true;
	}
}

function chkWallet(){
	var wallet = $('#wallet_list').val();
	if(wallet != ''){
		yesNoImg('check_wallet','ok');
		isWalletOK = true;
	}else{
		yesNoImg('check_wallet','no');
		isWalletOK = false;
	}
}

function yesNoImg(imgname,isok){
	var field = document.getElementById(imgname);
	if(isok == 'ok'){
		field.src = "/static/images/yes.png";
	}else{
		field.src = "/static/images/no.png";
	}
	field.style.display = "inline";
}

function showContent(){
	$("#loading").css({"display":"none"});
}

setTimeout("showContent()", 1000 ); //1秒后显示