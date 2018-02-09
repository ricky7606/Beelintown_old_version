<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\Users;
use think\captcha\Captcha;

class Login extends Controller
{
    public function index()
    {
        $this->assign('header_type','login');
        return $this->fetch();
	}

	public function getLogin(){
		$mobile = Request::instance()->post('mobile');
		$password = Request::instance()->post('pwd');
		$imgcode = Request::instance()->post('imgcode');
		$isonemonth = Request::instance()->post('isonemonth');
		$id = "";
		$captcha = new Captcha();
		$captcha->reset = false;
		if(!$captcha->check($imgcode, $id)){
			return "验证码错误或者请求超时";
		}
		if($mobile!="" && $password!="" && $imgcode!=""){
			//实例化模型后调用查询
			$user = new Users();
			//登录验证
			return $user->getLogin($mobile, $password, $isonemonth);
		}else{
			return "数据有误，请检查后重试";
		}
	}
	
	public function Logout(){
		Cookie::clear();
		return $this->redirect('/index');
	}
}
