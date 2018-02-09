<?php
namespace app\index\controller;
use think\Controller;//引入Controller类
use think\Session;
use app\index\model\QnasUser;
use app\index\model\QnasPending;
use app\index\model\QnasReply;
use app\index\model\Follow;
use app\index\model\Attention;
use think\Db;
use think\Request;
use think\Cookie;
use Qiniu\Auth as Auth;
use Qiniu\Storage\BucketManager;
use Qiniu\Storage\UploadManager;
use app\index\model\Users;

class Qnasearch extends Controller
{
    public function index()
    {
		$keywords = Request::instance()->get('keywords');
		if($keywords == ''){
			return $this->redirect('/index/qnalist');
		}
		$no_result = false;
		$qnauser=new QnasUser();
		$qna_list=$qnauser->searchQnas($keywords); 
		if(!$qna_list){
			$qna_list=$qnauser->getNewQnas(); 
			$no_result = true; 
		}
		$user = new Users;   
		if(Cookie::has('userid')){
			$qna_pending=new QnasPending;
			$follow = new Follow;
			$attention = new Attention;
			if($qna_list){
				foreach ($qna_list as $n=>$qna){ 
					$pending_info = $qna_pending->getPendingByUserId($qna->qnaid, Cookie::get('userid'));
					$follow_info = $follow->getFollowByQnaIdUserId($qna->qnaid, Cookie::get('userid'));
					$attention_info = $attention->getAttentionByUserId($qna->userid, Cookie::get('userid'));
					if($pending_info){
						$qna_list[$n]['pending_status'] = $pending_info->status;
						$qna_list[$n]['pendingid'] = $pending_info->pendingid;
					}else{
						$qna_list[$n]['pending_status'] = '-1';
						$qna_list[$n]['pendingid'] = '';
					}
					if($follow_info){
						$qna_list[$n]['follow'] = '1';
					}else{
						$qna_list[$n]['follow'] = '-1';
					}
					if($attention_info){
						$qna_list[$n]['attention'] = '1';
					}else{
						$qna_list[$n]['attention'] = '-1';
					}
					$qna_list[$n]['shortTitle'] = getContentText($qna->title,40);
					$qna_list[$n]['formatCoins'] = floatval($qna->coins);
					$qna_list[$n]['userinfo'] = $user->getUserDetails($qna->userid);
				}
			}
		}else{
			if($qna_list){
				foreach ($qna_list as $n=>$qna){ 
					$qna_list[$n]['shortTitle'] = getContentText($qna->title,40);
					$qna_list[$n]['formatCoins'] = floatval($qna->coins);
					$qna_list[$n]['userinfo'] = $user->getUserDetails($qna->userid);
				}
			}
		}
		$this->assign('list',$qna_list);
		$this->assign('no_result',$no_result);
		if(Cookie::has('userid')){
			$this->assign('header_type', 'user');
			$this->assign('userid', Cookie::get('userid'));
			$user->chkReminder(Cookie::get('userid'));
			$userinfo = $user->getUserInfo(Cookie::get('userid'));
			$this->assign('userinfo',$userinfo);
		}else{
			$this->assign('header_type', 'normal'); 
		}
        return $this->fetch();
    }
}