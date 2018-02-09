//为 tips 提示框自定义 CSS,以下为默认
xcsoft.tipsCss = {
	height: '60px',
	fontSize: '16px'
};
//隐藏、显示速度 ，默认 fast
xcsoft.tipsHide=xcsoft.tipsShow=300;
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
$("input[name=brief]").bind('blur', function () {
	if (GetLength($(this).val()) > 40) { 
		$(this).val(cutstr($(this).val(), 40)); 
		yesNoImg('check_brief','ok');
		return; 
	}else{
		if(GetLength($(this).val()) > 0){
			yesNoImg('check_brief','ok');
			return; 
		}
	}
}); 
$("input[name=location]").bind('blur', function () {
	if (GetLength($(this).val()) > 60) { 
		$(this).val(cutstr($(this).val(), 60)); 
		yesNoImg('check_location','ok');
		return; 
	}else{
		if(GetLength($(this).val()) > 0){
			yesNoImg('check_location','ok');
			return; 
		}
	}
}); 
$("input[name=industry]").bind('blur', function () {
	if (GetLength($(this).val()) > 60) { 
		$(this).val(cutstr($(this).val(), 60)); 
		yesNoImg('check_industry','ok');
		return; 
	}else{
		if(GetLength($(this).val()) > 0){
			yesNoImg('check_industry','ok');
			return; 
		}
	}
}); 
$("textarea[name=career]").bind('blur', function () {
	if (GetLength($(this).val()) > 1000) { 
		$(this).val(cutstr($(this).val(), 1000)); 
		yesNoImg('check_career','ok');
		return; 
	}else{
		if(GetLength($(this).val()) > 0){
			yesNoImg('check_career','ok');
			return; 
		}
	}
}); 
$("textarea[name=education]").bind('blur', function () {
	if (GetLength($(this).val()) > 1000) { 
		$(this).val(cutstr($(this).val(), 1000)); 
		yesNoImg('check_education','ok');
		return; 
	}else{
		if(GetLength($(this).val()) > 0){
			yesNoImg('check_education','ok');
			return; 
		}
	}
}); 
$("textarea[name=introduction]").bind('blur', function () {
	if (GetLength($(this).val()) > 1000) { 
		$(this).val(cutstr($(this).val(), 1000)); 
		yesNoImg('check_introduction','ok');
		return; 
	}else{
		if(GetLength($(this).val()) > 0){
			yesNoImg('check_introduction','ok');
			return; 
		}
	}
}); 
}); 

function chkGender(gender){
	yesNoImg('check_gender','ok'); 
	document.getElementById('gender').value =  gender;
}
function chkCellphone(){
	var cellphone = document.getElementById('new_mobile').value;
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
function chkEmail() {  
	var email = document.getElementById('email').value;
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;  
    if (filter.test(email)) {
		yesNoImg('check_email','ok');  
        return true;   
    } else {  
		yesNoImg('check_email','no');
        return false;  
    }   
}  
function clearString(s){ 
    //var pattern = new RegExp("[`~$^&*()=|{}':;'/\",\\[\\]<>/?~]");
    var pattern = new RegExp("[`=|''/\",\\[\\]<>/?~]");
    var rs = ""; 
    for (var i = 0; i < s.length; i++) { 
        rs = rs+s.substr(i, 1).replace(pattern, ''); 
    } 
    return rs;  
}

var isUsernameOK = false, isPasswordOK = false, isImgcodeOK = false, isSmscodeOK = false, isMobileOK = false;

function chkUsername(){
	var username = document.getElementById('username').value;
	if(username.length > 0){
		var regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im,
		regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
	
		if(regEn.test(username) || regCn.test(username)) {
			xcsoft.error('用户名不能使用特殊字符',3000);
			$("#username").css('color','#F00');
			$("#username").css('border-color','#F00');
			isUsernameOK = false;
			return false;
		}
		if(GetLength(username)<4 || GetLength(username) > 20){
			xcsoft.error('用户名4-20个字符，可使用数字/字母/中文',3000);
			$("#username").css('color','#F00');
			$("#username").css('border-color','#F00');
			isUsernameOK = false;
			return false;
		}
        $.post('/index/register/chkUsername', {username:jQuery.trim($('#username').val())}, function(msg) {
			if(msg=='exists'){
				xcsoft.error('用户名已经存在了，请换个别的吧！',3000);
				isUsernameOK = false;
				$("#username").css('color','#F00');
				$("#username").css('border-color','#F00');
				return false;
			}else{
				$("#username").css('color','');
				$("#username").css('border-color','');
				isUsernameOK = true;
				return true;
			}
        });		
	}else{
		return false;
	}
}
function chkMobile(){
	var mobile = document.getElementById('new_mobile').value;
	if(mobile.length > 0){
		if(chkCellphone()){
			$.post('/index/register/chkMobile', {mobile:mobile}, function(msg) {
				if(msg=='exists'){
					xcsoft.error('这个手机号码已经被注册了，请换个别的吧！',3000);
					isMobileOK = false;
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
			isMobileOK = false;
			return false;
		}
	}
}
function submitForm(){
	document.getElementById("submitbtn").disabled = true;
	$.post('/index/userprofile/saveDetails', {mobile:jQuery.trim($('#old_mobile').val()),gender:jQuery.trim($('#gender').val()),brief:clearString(jQuery.trim($('#brief').val())),email:jQuery.trim($('#email').val()),location:clearString(jQuery.trim($('#location').val())),industry:clearString(jQuery.trim($('#industry').val())),career:clearString(jQuery.trim($('#career').val())),education:clearString(jQuery.trim($('#education').val())),introduction:clearString(jQuery.trim($('#introduction').val()))}, function(msg) {
		if(msg=='ok'){
			xcsoft.success('信息已更新！',2000);
			setTimeout("window.location.reload(true)", 2000 ); //2秒后跳转
			return true;
		}else{
			xcsoft.error(msg,3000);
			document.getElementById("submitbtn").disabled = false;
			return false;
		}
	});
}
function yesNoImg(imgname,isok){
	var field = document.getElementById(imgname);
	if(isok == 'ok'){
		field.src = "/static/images/yes.png";
	}else{
		field.src = "/static/images/no.png";
	}
	field.style.display = "block";
}
function choosePic(type){
	var pictype = document.getElementById('pictype');
	pictype.value = type;
	var tmpfile = document.getElementById('upFiles');
	tmpfile.click();
}
function chkPic(){
	var upfile = document.getElementById('upFiles');
	if(upfile.value != ''){
		document.getElementById('upLabel').disabled = "disabled";
		document.getElementById('upLabelBg').disabled = "disabled";
		document.getElementById('upLabel').innerHTML = "上传中，请稍后";
		document.getElementById('upLabelBg').innerHTML = "上传中，请稍后";
		document.getElementById('pictureForm').submit();
	}
}
function changeUsername(){
	if(isUsernameOK){
		document.getElementById("changeUsernameBtn").disabled = true;
		$.post('/index/userprofile/changeUsername', {username:jQuery.trim($('#username').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('用户名已修改！',2000);
				setTimeout("window.location.reload(true)", 2000 ); //2秒后跳转
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("changeUsernameBtn").disabled = false;
				return false;
			}
		});
	}else{
		xcsoft.error('用户名有错误，请检查！',2000);
	}
}
function chkPassword(password_field){
	var pwd = document.getElementById(password_field).value;
	if(pwd.length > 0){
		if(pwd.length < 6){
			xcsoft.error('密码必须6位以上',3000);
			$("#"+password_field).css('color','#F00');
			$("#"+password_field).css('border-color','#F00');
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
				$("#"+password_field).css('color','#F00');
				$("#"+password_field).css('border-color','#F00');
				return false;
			}else{
				isPasswordOK = true;
				$("#"+password_field).css('color','');
				$("#"+password_field).css('border-color','');
				return true;
			}
		}
	}
}
function chkPassword2(){
	var pwd = document.getElementById('new_password').value;
	var pwd2 = document.getElementById('new_password2').value;
	if(pwd2.length > 0){
		if(pwd == pwd2){
			isPassword2OK = true;
			$("#new_password2").css('color','');
			$("#new_password2").css('border-color','');
			return true;
		}else{
			xcsoft.error('您输入的两次密码不同',3000);
			$("#new_password2").css('color','#F00');
			$("#new_password2").css('border-color','#F00');
			return false;
		}
	}
}
function changePassword(){
	if(isPasswordOK){
		document.getElementById("changePasswordBtn").disabled = true;
		$.post('/index/userprofile/changePassword', {password:jQuery.trim($('#password').val()),new_password:jQuery.trim($('#new_password').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('密码已修改，请重新登录！',2000);
				setTimeout("window.location.href='/index/login'", 2000 ); //2秒后跳转
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("changePasswordBtn").disabled = false;
				return false;
			}
		});
	}else{
		xcsoft.error('密码有错误，请检查！',2000);
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
	}
}
function chkSmscode(type){
	if(type == 'old'){
		var smscode = document.getElementById('old_smscode').value;
		var mobile = document.getElementById('old_mobile').value;
		var smscheck = 'check_smscode';
	}else{
		var smscode = document.getElementById('new_smscode').value;
		var mobile = document.getElementById('new_mobile').value;
		var smscheck = 'check_smscode2';
	}
	if(smscode.length > 0){
        $.post('/index/register/chkSmscode', {smscode:smscode,mobile:mobile}, function(msg) {
			if(msg=='error'){
				xcsoft.error('短信验证码错误或者超时！',3000);
				yesNoImg(smscheck,'no');
				return false;
			}else{
				yesNoImg(smscheck,'ok');
				isSmscodeOK = true;
				return true;
			}
        });		
	}
}
function changeMobile(){
	if(isImgcodeOK && isSmscodeOK){
		document.getElementById("changeMobileBtn").disabled = true;
		$.post('/index/userprofile/changeMobile', {old_mobile:jQuery.trim($('#old_mobile').val()),new_mobile:jQuery.trim($('#new_mobile').val()),register_token:jQuery.trim($('#register_token').val()),imgcode:jQuery.trim($('#imgcode').val())}, function(msg) {
			if(msg=='ok'){
				xcsoft.success('手机号码已修改，请重新登录！',2000);
				setTimeout("window.location.href='/index/login'", 2000 ); //2秒后跳转
				return true;
			}else{
				xcsoft.error(msg,3000);
				document.getElementById("changeMobileBtn").disabled = false;
				return false;
			}
		});
	}else{
		xcsoft.error('请输入正确的图形验证码和短信验证码',2000);
	}
}
function get_mobile_code(type){
	if(type == 'old'){
		if(isImgcodeOK){
			$.post('/index/register/sendSms', {mobile:jQuery.trim($('#old_mobile').val()),register_token:jQuery.trim($('#register_token').val())}, function(msg) {
				if(msg=='提交成功'){
					RemainTimeold();
				}else{
					xcsoft.error(msg,3000);
					return false;
				}
			});
		}else{
			xcsoft.error('请先填写图形验证码',3000);
			return false;
		}
	}else{
		if(isMobileOK && isImgcodeOK){
			$.post('/index/register/sendSms', {mobile:jQuery.trim($('#new_mobile').val()),register_token:jQuery.trim($('#register_token').val())}, function(msg) {
				if(msg=='提交成功'){
					RemainTimenew();
				}else{
					xcsoft.error(msg,3000);
					return false;
				}
			});
		}else{
			xcsoft.error('请先填写手机号码及图形验证码',3000);
			return false;
		}
	}
};
var iTime_old = 59;
var iTime_new = 59;
var Account_old;
var Account_new;
function RemainTimeold(){
	var btn = document.getElementById('old_zphone');
	btn.disabled = true;
	var iSecond,sSecond="",sTime="";
	if (iTime_old >= 0){
		iSecond = parseInt(iTime_old%60);
		iMinute = parseInt(iTime_old/60)
		if (iSecond >= 0){
			if(iMinute>0){
				sSecond = iMinute + "分" + iSecond + "秒";
			}else{
				sSecond = iSecond + "秒";
			}
		}
		sTime=sSecond;
		if(iTime_old==0){
			clearTimeout(Account_old);
			sTime='获取验证码';
			iTime_old = 59;
			btn.disabled = false;
		}else{
			Account_old = setTimeout("RemainTimeold()",1000);
			iTime_old=iTime_old-1;
		}
	}else{
		sTime='没有倒计时';
	}
	btn.innerText = sTime;
}	
function RemainTimenew(){
	var btn = document.getElementById('new_zphone');
	btn.disabled = true;
	var iSecond,sSecond="",sTime="";
	if (iTime_new >= 0){
		iSecond = parseInt(iTime_new%60);
		iMinute = parseInt(iTime_new/60) 
		if (iSecond >= 0){
			if(iMinute>0){
				sSecond = iMinute + "分" + iSecond + "秒";
			}else{
				sSecond = iSecond + "秒";
			}
		}
		sTime=sSecond;
		if(iTime_new==0){
			clearTimeout(Account_new);
			sTime='获取验证码';
			iTime_new = 59;
			btn.disabled = false;
		}else{
			Account_new = setTimeout("RemainTimenew()",1000);
			iTime_new=iTime_new-1;
		}
	}else{
		sTime='没有倒计时';
	}
	btn.innerText = sTime;
}	
