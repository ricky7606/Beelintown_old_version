	var u = navigator.userAgent;
	var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if(/Android (\d+\.\d+)/.test(navigator.userAgent)){
        var version = parseFloat(RegExp.$1);
        if(version>2.3){
            var phoneScale = parseInt(window.screen.width)/640;
            document.write('<meta name="viewport" content="width=640, minimum-scale = '+ phoneScale +', maximum-scale = '+ phoneScale +', target-densitydpi=device-dpi">');
        }else{
            document.write('<meta name="viewport" content="width=640, target-densitydpi=device-dpi">');
        }
    }else{
        document.write('<meta name="viewport" content="width=640, user-scalable=no, target-densitydpi=device-dpi">');
    }
    //微信去掉下方刷新栏
			document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
				WeixinJSBridge.call('hideOptionMenu');
			});
			document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
				WeixinJSBridge.call('hideToolbar');
			});
			function closeWX(){
				window.close();
				WeixinJSBridge.call('closeWindow');
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

var isUsernameOK=false, isMobileOK=false, isPasswordOK=false, isPassword2OK=false, isImgcodeOK=false, isSmscodeOK=false;
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
			$("#message").html("用户名不能使用特殊字符");
			$("#username").css('border-color','#F00');
			$("#username").css('color','#F00');
			$("#result").slideToggle(500, function(){
				setTimeout("$('#result').slideUp(500)", 2000);
			});
			return false;
		}
		if(GetLength(username)<4 || GetLength(username) > 20){
			$("#message").html("用户名4-20个字符<br />可使用数字/字母/中文");
			$("#username").css('border-color','#F00');
			$("#username").css('color','#F00');
			$("#result").slideToggle(500, function(){
				setTimeout("$('#result').slideUp(500)", 2000);
			});
			return false;
		}
        $.post('/index/register/chkUsername', {username:jQuery.trim($('#username').val())}, function(msg) {
			if(msg=='exists'){
				$("#message").html("用户名已经存在了，请换个别的吧！");
				$("#username").css('border-color','#F00');
				$("#username").css('color','#F00');
				$("#result").slideToggle(500, function(){
					setTimeout("$('#result').slideUp(500)", 2000);
				});
				return false;
			}else{
				isUsernameOK = true;
				$("#username").css('border-color','#093');
				$("#username").css('color','');
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
					$("#message").html("手机号码已经被注册了");
					$("#mobile").css('border-color','#F00');
					$("#mobile").css('color','#F00');
					$("#result").slideToggle(500, function(){
						setTimeout("$('#result').slideUp(500)", 2000);
					});
				}else{
					isMobileOK = true;
					$("#mobile").css('border-color','#093');
					$("#mobile").css('color','');
					return true;
				}
			});		
		}else{
			$("#message").html("手机号码格式不正确");
			$("#mobile").css('border-color','#F00');
			$("#mobile").css('color','#F00');
			$("#result").slideToggle(500, function(){
				setTimeout("$('#result').slideUp(500)", 2000);
			});
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
			$("#message").html("密码必须6位以上");
			$("#password").css('border-color','#F00');
			$("#password").css('color','#F00');
			$("#result").slideToggle(500, function(){
				setTimeout("$('#result').slideUp(500)", 2000);
			});
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
				$("#message").html("密码须6个字符以上，且数字/小写字母/大写字母/符号必须包含两种");
				$("#password").css('border-color','#F00');
				$("#password").css('color','#F00');
				$("#result").slideToggle(500, function(){
					setTimeout("$('#result').slideUp(500)", 2000);
				});
				return false;
			}else{
				isPasswordOK = true;
				$("#password").css('border-color','#093');
				$("#password").css('color','');
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
			isPassword2OK = true;
			$("#password2").css('border-color','#093');
			$("#password2").css('color','');
			return true;
		}else{
			$("#message").html("两次输入的密码不一致");
			$("#password2").css('border-color','#F00');
			$("#password2").css('color','#F00');
			$("#result").slideToggle(500, function(){
				setTimeout("$('#result').slideUp(500)", 2000);
			});
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
				$("#message").html("图形验证码错误");
				$("#imgcode").css('border-color','#F00');
				$("#imgcode").css('color','#F00');
				$("#result").slideToggle(500, function(){
					setTimeout("$('#result').slideUp(500)", 2000);
				});
				return false;
			}else{
				isImgcodeOK = true;
				$("#imgcode").css('border-color','#093');
				$("#imgcode").css('color','');
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
				$("#message").html("短信验证码错误");
				$("#smscode").css('border-color','#F00');
				$("#smscode").css('color','#F00');
				$("#result").slideToggle(500, function(){
					setTimeout("$('#result').slideUp(500)", 2000);
				});
				return false;
			}else{
				isSmscodeOK = true;
				$("#smscode").css('border-color','#093');
				$("#smscode").css('color','');
				return true;
			}
        });		
	}else{
		isSmscodeOK = false;
	}
}
function submitForm(){
	document.getElementById("submitbtn").disabled = true;
	if(isUsernameOK && isMobileOK && isPasswordOK && isPassword2OK && isImgcodeOK && isSmscodeOK){
		document.getElementById('error').innerHTML = "";
		document.getElementById("submitbtn").innerHTML = "提交中，请稍后...";
		$.post('/index/register/getRegister', {username:jQuery.trim($('#username').val()),mobile:jQuery.trim($('#mobile').val()),pwd:jQuery.trim($('#password').val()),register_token:jQuery.trim($('#register_token').val()),imgcode:jQuery.trim($('#imgcode').val())}, function(msg) {
			if(msg=='ok'){
				$("#message").html("<span style='color:#004d9d'>信息已经提交，感谢您的注册！</span>");
				$("#result").slideDown(500, function(){
					setTimeout("$('#result').slideUp(500)", 2000);
				});
				setTimeout("window.location.href='/index/mobileregister/regOK'", 2500 ); //4秒后跳转
			}else{
				document.getElementById("submitbtn").disabled = false;
				$("#message").html(msg);
				$("#result").slideDown(500, function(){
					setTimeout("$('#result').slideUp(500)", 2000);
				});
			}
		});
	}else{
		document.getElementById("submitbtn").disabled = false;
		document.getElementById('error').innerHTML = "<span style='color:#900;'>* 信息填写有误，请检查！</span";
	}
}
function get_mobile_code(){
	if(isUsernameOK && isMobileOK && isPasswordOK && isPassword2OK && isImgcodeOK){
		$.post('/index/register/sendSms', {mobile:jQuery.trim($('#mobile').val()),register_token:jQuery.trim($('#register_token').val())}, function(msg) {
			if(msg=='提交成功'){
				RemainTime();
			}else{
				$("#message").html(msg);
				$("#result").slideToggle(500, function(){
					setTimeout("$('#result').slideUp(500)", 2000);
				});
				return false;
			}
		});
	}else{
		$("#message").html("请先完善上方所有信息");
		$("#result").slideToggle(500, function(){
			setTimeout("$('#result').slideUp(500)", 2000);
		});
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
