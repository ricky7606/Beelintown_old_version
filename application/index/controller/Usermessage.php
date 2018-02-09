<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\Users;
use app\index\model\Message;
use app\index\model\UserTagDetails;

class Usermessage extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$userid = Cookie::get('userid');
		$user = new Users;
		$user->chkReminder($userid);
		$user_info = $user->getUserInfo($userid);
		$message = new Message;
		$message_list = $message->getMessageDetailsByUserId($userid);
        $this->assign('message_list',$message_list);
        $this->assign('userinfo',$user_info);
		$user->cleanMessageReminder($userid);
        $this->assign('username',Cookie::get('username'));
        $this->assign('header_type','user');
		$user_tag = new UserTagDetails;
		$user_tag_list = $user_tag->getTagListByUserId($userid,6);
        $this->assign('user_tag_list',$user_tag_list);
        return $this->fetch();
	}
}