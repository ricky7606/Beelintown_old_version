//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

var isUsernameOK=false, isMobileOK=false, isPasswordOK=false, isPassword2OK=false, isImgcodeOK=false, isSmscodeOK=false, isAgreementOK=false;
function refreshVerify() {
	var ts = Date.parse(new Date())/1000;
	var img = document.getElementById('verify_img');
	img.src = "/captcha?id="+ts;
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

function chkCellphone(){
	var cellphone = document.getElementById('mobile').value;
	if(cellphone.length != 11){
		return false;
	}else{ 
		for(var i=0; i<cellphone.length; i++){
			if(cellphone.charAt(i)<'0' || cellphone.charAt(i)>'9'){
				return false;
			}
		}
	}
	return true;
}
function clearString(s){ 
    var pattern = new RegExp("[`~$^&*()=|{}':;'/\",\\[\\]<>/?~]");
    var rs = ""; 
    for (var i = 0; i < s.length; i++) { 
        rs = rs+s.substr(i, 1).replace(pattern, ''); 
    } 
    return rs;  
}
function chkUsername(){
	var username = document.getElementById('username').value;
	if(username.length > 0){
		var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
		regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
	
		if(regEn.test(username) || regCn.test(username)) {
			xcsoft.error('用户名不能使用特殊字符',3000);
			yesNoImg('check_username','no');
			return false;
		}
		if(GetLength(username)<4 || GetLength(username) > 20){
			xcsoft.error('用户名4-20个字符，可使用数字/字母/中文',3000);
			yesNoImg('check_username','no');
			return false;
		}
        $.post('/index/register/chkUsername', {username:jQuery.trim($('#username').val())}, function(msg) {
			if(msg=='exists'){
				xcsoft.error('用户名已经存在了，请换个别的吧！',3000);
				yesNoImg('check_username','no');
				return false;
			}else{
				yesNoImg('check_username','ok');
				isUsernameOK = true;
				return true;
			}
        });		
	}else{
		isUsernameOK = false;
		return false;
	}
}
function chkMobile(){
	var mobile = document.getElementById('mobile').value;
	if(mobile.length > 0){
		if(chkCellphone()){
			$.post('/index/register/chkMobile', {mobile:jQuery.trim($('#mobile').val())}, function(msg) {
				if(msg=='exists'){
					xcsoft.error('这个手机号码已经被注册了，请换个别的吧！',3000);
					yesNoImg('check_mobile','no');
					return false;
				}else{
					yesNoImg('check_mobile','ok');
					isMobileOK = true;
					return true;
				}
			});		
		}else{
			xcsoft.error('手机号码错误',3000);
			yesNoImg('check_mobile','no');
			return false;
		}
	}else{
		isMobileOK = false;
	}
}
function chkPassword(){
	var pwd = document.getElementById('password').value;
	if(pwd.length > 0){
		if(pwd.length < 6){
			xcsoft.error('密码必须6位以上',3000);
			yesNoImg('check_password','no');
			return false;
		}else{
			var m=0; 
			var Modes=0; 
			for(i=0; i<pwd.length; i++){ 
			var charType=0; 
			var t=pwd.charCodeAt(i); 
			if(t>=48 && t <=57){charType=1;} 
			else if(t>=65 && t <=90){charType=2;} 
			else if(t>=97 && t <=122){charType=4;} 
			else{charType=4;} 
			Modes |= charType; 
			} 
			for(i=0;i<4;i++){ 
				if(Modes & 1){m++;} 
				Modes>>>=1; 
			} 
			if(pwd.length<=5){m=1;} 
			if(pwd.length<=0){m=0;} 
			if(m<2){
				xcsoft.error('密码须6个字符以上，且数字/小写字母/大写字母/符号必须包含两种',4000);
				yesNoImg('check_password','no');
				return false;
			}else{
				yesNoImg('check_password','ok');
				isPasswordOK = true;
				return true;
			}
		}
	}else{
		isPasswordOK = false;
	}
}
function chkPassword2(){
	var pwd = document.getElementById('password').value;
	var pwd2 = document.getElementById('password2').value;
	if(pwd2.length > 0){
		if(pwd == pwd2){
			yesNoImg('check_password2','ok');
			isPassword2OK = true;
			return true;
		}else{
			xcsoft.error('您输入的两次密码不同',3000);
			yesNoImg('check_password2','no');
			return false;
		}
	}else{
		isPassword2OK = false;
	}
}
function chkImgcode(){
	var imgcode = document.getElementById('imgcode').value;
	if(imgcode.length > 0){
        $.post('/index/register/chkImgcode', {imgcode:jQuery.trim($('#imgcode').val())}, function(msg) {
			if(msg=='error'){
				xcsoft.error('图形验证码错误或者超时！',3000);
				yesNoImg('check_imgcode','no');
				return false;
			}else{
				yesNoImg('check_imgcode','ok');
				isImgcodeOK = true;
				return true;
			}
        });		
	}else{
		isImgcodeOK = false;
	}
}
function chkSmscode(){
	var smscode = document.getElementById('smscode').value;
	if(smscode.length > 0){
        $.post('/index/register/chkSmscode', {smscode:jQuery.trim($('#smscode').val()),mobile:jQuery.trim($('#mobile').val())}, function(msg) {
			if(msg=='error'){
				xcsoft.error('短信验证码错误或者超时！',3000);
				yesNoImg('check_smscode','no');
				return false;
			}else{
				yesNoImg('check_smscode','ok');
				isSmscodeOK = true;
				return true;
			}
        });		
	}else{
		isSmscodeOK = false;
	}
}
function chkAgreement(){
	var agreement = document.getElementById('agreement');
	if(agreement.checked==true){
		yesNoImg('check_agreement','ok');
		isAgreementOK=true;
		return true;
	}else{
		yesNoImg('check_agreement','no');
		isAgreementOK=false;
		return false;
	}
}
function submitForm(){
	document.getElementById("submitbtn").disabled = true;
	if(isUsernameOK && isMobileOK && isPasswordOK && isPassword2OK && isImgcodeOK && isSmscodeOK && isAgreementOK){
		document.getElementById("submitbtn").innerHTML = "提交中，请稍后...";
		$.post('/index/register/getRegister', {username:jQuery.trim($('#username').val()),mobile:jQuery.trim($('#mobile').val()),pwd:jQuery.trim($('#password').val()),register_token:jQuery.trim($('#register_token').val()),imgcode:jQuery.trim($('#imgcode').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('信息已提交，谢谢您的注册！3秒后跳转',3000);
				setTimeout("window.location.href='/index/login'", 3000 ); //4秒后跳转
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("submitbtn").disabled = false;
			}
		});
	}else{
		xcsoft.error('请完整而正确地填写信息，并同意注册条款',4000);
		document.getElementById("submitbtn").disabled = false;
	}
}
function yesNoImg(imgname,isok){
	var field = document.getElementById(imgname);
	if(isok == 'ok'){
		field.src = "/static/images/yes.jpg";
	}else{
		field.src = "/static/images/no.jpg";
	}
	field.style.display = "block";
}
function get_mobile_code(){
	if(isUsernameOK && isMobileOK && isPasswordOK && isPassword2OK && isImgcodeOK){
		$.post('/index/register/sendSms', {mobile:jQuery.trim($('#mobile').val()),register_token:jQuery.trim($('#register_token').val())}, function(msg) {
			if(msg=='提交成功'){
				RemainTime();
			}else{
				xcsoft.error(msg,3000);
				return false;
			}
		});
	}else{
		xcsoft.error('请先完善上方所有的信息',3000);
		return false;
	}
};
var iTime = 59;
var Account;
function RemainTime(){
	document.getElementById('zphone').disabled = true;
	var iSecond,sSecond="",sTime="";
	if (iTime >= 0){
		iSecond = parseInt(iTime%60);
		iMinute = parseInt(iTime/60)
		if (iSecond >= 0){
			if(iMinute>0){
				sSecond = iMinute + "分" + iSecond + "秒";
			}else{
				sSecond = iSecond + "秒";
			}
		}
		sTime=sSecond;
		if(iTime==0){
			clearTimeout(Account);
			sTime='获取验证码';
			iTime = 59;
			document.getElementById('zphone').disabled = false;
		}else{
			Account = setTimeout("RemainTime()",1000);
			iTime=iTime-1;
		}
	}else{
		sTime='没有倒计时';
	}
	document.getElementById('zphone').innerText = sTime;
}	
