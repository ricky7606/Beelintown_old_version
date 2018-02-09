//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;

var isMobileOK=false, isPasswordOK=false, isImgcodeOK=false;
function refreshVerify() {
	var ts = Date.parse(new Date())/1000;
	var img = document.getElementById('verify_img');
	img.src = "/captcha?id="+ts;
}
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
function chkMobile(){
	var mobile = document.getElementById('mobile').value;
	if(mobile.length > 0){
		if(chkCellphone()){
			yesNoImg('check_mobile','ok');
			isMobileOK = true;
			return true;
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
				xcsoft.error('密码须6个字符以上，且数字/大写字母/小写字母/符号必须包含两种',4000);
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
function submitForm(){
	chkImgcode();
	chkPassword();
	chkMobile();
	document.getElementById("loginbtn").disabled = true;
	if(isMobileOK && isPasswordOK && isImgcodeOK){
		$.post('/index/login/getLogin', {mobile:jQuery.trim($('#mobile').val()),pwd:jQuery.trim($('#password').val()),imgcode:jQuery.trim($('#imgcode').val()),isonemonth:jQuery.trim($('#isOneMonthLogin').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('登录成功！2秒后跳转',2000);
				setTimeout("window.location.href='/index'", 2000 ); //3秒后跳转
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("loginbtn").disabled = false;
				return false;
			}
		});
	}else{
		document.getElementById("loginbtn").disabled = false;
		xcsoft.error('请正确填写手机号码密码及图形验证码',3000);
		return false;
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
