<?php
namespace app\index\controller;
use think\Controller;//引入Controller类
use think\Session;
use app\index\model\QnasUser;
use app\index\model\QnasPending;
use app\index\model\QnasReply;
use app\index\model\QnasReplyDetails;
use app\index\model\Follow;
use app\index\model\Attention;
use think\Db;
use think\Request;
use think\Cookie;
use Qiniu\Auth as Auth;
use Qiniu\Storage\BucketManager;
use Qiniu\Storage\UploadManager;
use app\index\model\Users;
use app\index\model\Tags;

class Index extends Controller
{
    public function index()
    {
		$reply = new QnasReplyDetails;
		$reply_list = $reply->getUpdateReplyDetails(true); 
		if(count($reply_list)==0){
			$reply_list = $reply->getUpdateReplyDetails(false); 
		}
		if(Cookie::has('userid')){
			$user = new Users;
			$userid = Cookie::get('userid');
			$user->chkReminder($userid);
			$userinfo = $user->getUserInfo($userid);
			$this->assign('userid',$userid);
			$this->assign('userinfo',$userinfo);
			$this->assign('header_type','user');
		}else{
			$this->assign('userid','');
			$this->assign('header_type','normal');
		}
		if($reply_list){
			foreach ($reply_list as $n=>$reply){ 
				$follow = new Follow;
				if(Cookie::has('userid')){
					$att = new Attention;
					$qna_pending=new QnasPending;
					$qna_follow = $follow->getFollowByQnaIdUserId($reply->qnaid, $userid);
					$pending_info = $qna_pending->getPendingByUserId($reply->qnaid, $userid );
					if($pending_info){
						$reply_list[$n]['pending_status'] = $pending_info->status;
						$reply_list[$n]['pendingid'] = $pending_info->pendingid;
					}else{
						$reply_list[$n]['pending_status'] = '-1';
						$reply_list[$n]['pendingid'] = '';
					}
					if($qna_follow){
						$reply_list[$n]['follow'] = 1;
					}else{
						$reply_list[$n]['follow'] = -1;
					}
					$reply_user_att = $att->getAttentionByUserId($reply->userid, $userid);
					if($reply_user_att){
						$reply_list[$n]['reply_user_att'] = 1;
					}else{
						$reply_list[$n]['reply_user_att'] = -1;
					}
					$qna_user_att = $att->getAttentionByUserId($reply->qna_userid, $userid);
					if($qna_user_att){
						$reply_list[$n]['qna_user_att'] = 1;
					}else{
						$reply_list[$n]['qna_user_att'] = -1;
					}
				}
				$reply_list[$n]['formatCoins'] = floatval($reply_list[$n]['qna_coins']);
				$follow_count = $follow->getFollowCount('1d537aea-f306-11e7-a12f-6c92bf0c200d');
				$reply_list[$n]['followCount'] = $follow_count->followCount;
			}
		}
		$this->assign('reply_list',$reply_list);
//暂时不需要页面右侧的最新提问列表		
//		$qnauser=new QnasUser();
//		$qna_list=$qnauser->getNewQnas(); 
//		if($qna_list){
//			foreach ($qna_list as $n=>$qna){ 
//				$qna_list[$n]['shortTitle'] = getContentText($qna->title,40);
//			}
//		}
//		$this->assign('qna_list',$qna_list);
		$this->assign('current_page','index');
        return $this->fetch(); 
	}
	
	public function saveApplyQna(){
		if(Cookie::has('userid')){
			$qnaid = Request::instance()->post('qnaid');
			$qna_pending=new QnasPending();
			return $qna_pending->saveApply($qnaid, Cookie::get('userid'));
		}else{
			return $this->redirect('/index/login');
		}
	}
	
	public function aboutus(){
		if(Cookie::has('userid')){
			$user = new Users;
			$userid = Cookie::get('userid');
			$user->chkReminder($userid);
			$userinfo = $user->getUserInfo($userid);
			$this->assign('userid',$userid);
			$this->assign('userinfo',$userinfo);
			$this->assign('header_type','user');
		}else{
			$this->assign('userid','');
			$this->assign('header_type','normal');
		}
        return $this->fetch('aboutus'); 
	}
}