<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Cookie;
use think\Session;
use think\captcha\Captcha;
use app\index\model\Users;

class Mobileregister extends Controller
{
    public function index()
    {
		//开启SESSION
		session_start();
		//生成注册页面随机数作为token
		$register_token = random(6,1);
		$_SESSION['register_token'] = $register_token;
		
        $this->assign('register_token',$register_token);
        return $this->fetch(); 
	}
	
	public function regOK(){
		$str = udate('Y-m-d H:i:s.u');
        $this->assign('str',$str);
        return $this->fetch('index2'); 
	}
}