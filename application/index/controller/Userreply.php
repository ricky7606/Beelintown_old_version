<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\QnasReplyDetails;
use app\index\model\Users;
use app\index\model\UserTagDetails;

class Userreply extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$reply = new QnasReplyDetails;
		$reply_list = $reply->getReplyDetailsByUserId(Cookie::get('userid'));
		if($reply_list){
			foreach($reply_list as $n=>$reply){
				$reply_list[$n]['formatCoins'] = floatval($reply->qna_coins);
			}
		}
        $this->assign('reply_list',$reply_list);
        $this->assign('username',Cookie::get('username'));
        $this->assign('header_type','user');
		$user = new Users;
		$user->chkReminder(Cookie::get('userid'));
		$userinfo = $user->getUserInfo(Cookie::get('userid'));
        $this->assign('userinfo',$userinfo);
		$user->cleanAnswerReminder(Cookie::get('userid'));
		$user_tag = new UserTagDetails;
		$user_tag_list = $user_tag->getTagListByUserId(Cookie::get('userid'),6);
        $this->assign('user_tag_list',$user_tag_list);
        return $this->fetch();
	}
}