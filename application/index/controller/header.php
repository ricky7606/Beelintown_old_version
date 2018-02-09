<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Cookie;
use app\index\model\Users;

class Register extends Controller
{
    public function index()
    {
		if(Cookie::has('userid')){
			$user = new Users;
			$userinfo = $user->getUserInfo(Cookie::get('userid'));
			$this->assign('header_type', 'user');
			$this->assign('user_header_info', $userinfo);
		}else{
			$this->assign('header_type', 'login');
		}
        return $this->fetch();
    }
	
	public function login()
	{
		$this->assign('header_type', 'login');
		// 渲染模板输出
		return $this->fetch();
	}
	
	public function normal()
	{
		if(Cookie::has('userid')){
			$user = new Users;
			$userinfo = $user->getUserInfo(Cookie::get('userid'));
			$this->assign('header_type', 'user');
			$this->assign('user_header_info', $userinfo);
			$this->assign('header_type', 'user');
		}else{
			$this->assign('header_type', 'login');
		}
		// 渲染模板输出
		return $this->fetch();
	}

	public function user()
	{
		$user = new Users;
		$userinfo = $user->getUserInfo(Cookie::get('userid'));
		$this->assign('header_type', 'user');
		$this->assign('user_header_info', $userinfo);
		$this->assign('header_type', 'user');
		// 渲染模板输出
		return $this->fetch();
	}
}