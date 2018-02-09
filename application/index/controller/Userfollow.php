<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\Users;
use app\index\model\Follow;
use app\index\model\UserTagDetails;

class Userfollow extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$follow = new Follow;
		$follow_info = $follow->getFollowDetailsByUserId(Cookie::get('userid'));
        $this->assign('follow_list',$follow_info);
        $this->assign('followcount',count($follow_info));
        $this->assign('username',Cookie::get('username'));
        $this->assign('header_type','user');
		$user = new Users;
		$user->chkReminder(Cookie::get('userid'));
		$userinfo = $user->getUserInfo(Cookie::get('userid'));
        $this->assign('userinfo',$userinfo);
		$user_tag = new UserTagDetails;
		$user_tag_list = $user_tag->getTagListByUserId(Cookie::get('userid'),6);
        $this->assign('user_tag_list',$user_tag_list);
        return $this->fetch();
	}

	public function delFollow(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$followid = Request::instance()->post('followid');
		if($followid != ''){
			$follow = new Follow;
			$follow_result = $follow->deleteFollow($followid);
			if($follow_result){
				return "ok";
			}else{
				return "发生错误，取消收藏可能失败";
			}
		}else{
			return "数据错误";
		}
	}
}