<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use Qiniu\Auth as Auth;
use Qiniu\Storage\BucketManager;
use Qiniu\Storage\UploadManager;
use app\index\model\QnaPendingDetails;
use app\index\model\QnasPending;
use app\index\model\Users;
use app\index\model\UserTagDetails;

class Userpending extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$qna_pending = new QnaPendingDetails;
		$pending_list = $qna_pending->getPendingDetailsByUserId(Cookie::get('userid'),1);
		if($pending_list){
			foreach ($pending_list as $n=>$pending){ 
				$pending_list[$n]['formatCoins'] = floatval($pending->coins);
			}
		}
        $this->assign('pending_list',$pending_list);
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

	public function refusePending(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$pendingid = Request::instance()->post('pendingid');
		$pending = new QnasPending;
		return $pending->refusePending($pendingid);
	}

	public function arbitrate($pendingid){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$pendingid = Request::instance()->post('pendingid');
		$pending = new QnasPending;
		return $pending->arbitrate($pendingid);
	}
}