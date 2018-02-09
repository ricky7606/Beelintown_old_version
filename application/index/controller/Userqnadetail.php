<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\QnasUser;
use app\index\model\QnasReply;
use app\index\model\QnasPending;
use app\index\model\QnasReplyDetails;
use app\index\model\Attention;
use app\index\model\Follow;
use app\index\model\Users;
use app\index\model\UserTagDetails;

class UserQnaDetail extends Controller
{
    public function index()
    {
		$userid = Request::instance()->get('userid');
		if($userid == ''){
			return $this->redirect('/index');
		}

		$user = new Users;
		$userdetail = $user->getUserInfo($userid);
		if(!$userdetail){
			return $this->redirect('/index');
		}
		$user_att = "";
		if(Cookie::has('userid')){
			$login_userid = Cookie::get('userid');
			$att = new Attention;
			$user_att = $att->getAttentionByUserId($userdetail->userid, $login_userid);
			if($user_att){
				$user_att = 1;
			}else{
				$user_att = -1;
			}
		}
		$this->assign('userdetail',$userdetail);
		$this->assign('user_att',$user_att);

		$user_tag = new UserTagDetails;
		$user_tag_list = $user_tag->getTagListByUserId($userid);
		$this->assign('user_tag_list',$user_tag_list);
		
		$reply = new QnasReplyDetails;
		$reply_list = $reply->getUpdateReplyDetailsByUserId($userid);
		foreach($reply_list as $n=>$reply){
			$reply_list[$n]['shortTitle'] = getContentText($reply->title,40);
		}
		$this->assign('reply_list',$reply_list);

		$qna = new QnasUser;
		$qna_list = $qna->getQnasByUserId($userid);
		if($qna_list){
			foreach($qna_list as $n=>$qna){
				if(Cookie::has('userid')){
					$follow = new Follow;
					$qna_pending=new QnasPending;
					$qna_follow = $follow->getFollowByQnaIdUserId($qna->qnaid, $login_userid);
					$pending_info = $qna_pending->getPendingByUserId($qna->qnaid, $login_userid );
					if($pending_info){
						$qna_list[$n]['pending_status'] = $pending_info->status;
						$qna_list[$n]['pendingid'] = $pending_info->pendingid;
					}else{
						$qna_list[$n]['pending_status'] = '-1';
						$qna_list[$n]['pendingid'] = '';
					}
					if($qna_follow){
						$qna_list[$n]['follow'] = 1;
					}else{
						$qna_list[$n]['follow'] = -1;
					}
				}
				$qna_list[$n]['formatCoins'] = floatval($qna->coins);
			}
		}
		$this->assign('qna_list',$qna_list);

		if(Cookie::has('userid')){
			$this->assign('header_type','user');
			$user->chkReminder($login_userid);
			$userinfo = $user->getUserInfo($login_userid);
			$this->assign('userinfo',$userinfo);
			$this->assign('login_userid',$login_userid);
		}else{
			$this->assign('header_type','normal');
		}
        return $this->fetch(); 
	}
}