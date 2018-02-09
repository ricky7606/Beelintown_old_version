//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

var isTagOK = false;
var isAddressOK = false;

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

document.getElementById('submitbtn').addEventListener('click', function () {
	if(isTagOK && isAddressOK){
		document.getElementById("submitbtn").disabled = true;
		// 读取 html
		$.post('/index/userwallet/createWallet', {wallet_tag:jQuery.trim($('#wallet_tag').val()),wallet_address:jQuery.trim($('#wallet_address').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('钱包创建成功！',2000);
				setTimeout("window.location.reload(true)", 2000 ); //2 秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("submitbtn").disabled = false;
				return false;
			}
		});
	}else{
		document.getElementById("submitbtn").disabled = false;
		xcsoft.error('您输入的钱包信息有误~',3000);
		return false;
	}
}, false)

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
$("input[name=wallet_tag]").bind('blur', function () {
	if(GetLength($(this).val()) < 2){
		yesNoImg('check_tag','no');
		return;
	}else{
		if (GetLength($(this).val()) > 20) { 
			$(this).val(cutstr($(this).val(), 20)); 
		}
		isTagOK = true;
		yesNoImg('check_tag','ok');
		return; 
	}
}); 
$("input[name=wallet_address]").bind('blur', function () {
	if(GetLength($(this).val()) < 20){
		yesNoImg('check_address','no');
		return;
	}else{
		if (GetLength($(this).val()) > 50) { 
			$(this).val(cutstr($(this).val(), 50)); 
		}
		isAddressOK = true;
		yesNoImg('check_address','ok');
		return; 
	}
}); 
}); 

function yesNoImg(imgname,isok){
	var field = document.getElementById(imgname);
	if(isok == 'ok'){
		field.src = "/static/images/yes.png";
	}else{
		field.src = "/static/images/no.png";
	}
	field.style.display = "inline";
}

function delWallet(walletid){
	if(confirm('您确认要删除该钱包吗？')){
		$.post('/index/userwallet/deleteWallet', {walletid:walletid}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('钱包删除成功！',2000);
				setTimeout("window.location.reload(true)", 2000 ); //2 秒后刷新
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("submitbtn").disabled = false;
				return false;
			}
		});
	}
}

function showContent(){
	$("#loading").css({"display":"none"});
}

setTimeout("showContent()", 1000 ); //1秒后显示