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

class Feature extends Controller
{
    public function index()
    {
		$qnauser=new QnasUser();
		$qna_list=$qnauser->getNewQnas(); 
		$reply = new QnasReplyDetails;
		$reply_list = $reply->getUpdateReplyDetails(true); 
		if(count($reply_list)==0){
			$reply_list = $reply->getUpdateReplyDetails(false); 
		}
//		dump($reply->getLastSql());
		if($reply_list){
			foreach ($reply_list as $n=>$reply){ 
				if(Cookie::has('userid')){
					$userid = Cookie::get('userid');
					$att = new Attention;
					$follow = new Follow;
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
					$this->assign('userid',$userid);
				}
				$reply_list[$n]['formatCoins'] = floatval($reply_list[$n]['qna_coins']);
			}
		}
		if(Cookie::has('userid')){
			$user = new Users;
			$user->chkReminder(Cookie::get('userid'));
			$userinfo = $user->getUserInfo(Cookie::get('userid'));
			$this->assign('userinfo',$userinfo);
			$this->assign('header_type','user');
		}else{
			$this->assign('header_type','normal');
		}
		$this->assign('reply_list',$reply_list);
		if($qna_list){
			foreach ($qna_list as $n=>$qna){ 
				$qna_list[$n]['shortTitle'] = getContentText($qna->title,40);
			}
		}
		$this->assign('qna_list',$qna_list);
		$this->assign('current_page','feature');
        return $this->fetch(); 
	}
}