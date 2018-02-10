<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Cookie;
use Qiniu\Auth as Auth;
use Qiniu\Storage\BucketManager;
use Qiniu\Storage\UploadManager;
use app\index\model\Qnas;
use app\index\model\QnasReply;
use app\index\model\Users;
use app\index\model\Follow;

class Qna extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$user = new Users;
		$user->chkReminder(Cookie::get('userid'));
		$rand_users = $user->getRandomUsers(6,Cookie::get('userid'));
        $this->assign('rand_users',$rand_users);
		$att_users = $user->getAttUsers(Cookie::get('userid'));
        $this->assign('att_users',$att_users);
		$userinfo = $user->getUserDetails(Cookie::get('userid'));
		
		$coins = floatval($userinfo->coins);
		$frozen_coins = floatval($userinfo->frozen_coins);
		$this->assign('userinfo', $userinfo);
		$this->assign('coins', $coins);
		$this->assign('frozen_coins', $frozen_coins);
        $this->assign('userid', Cookie::get('userid'));
        $this->assign('header_type', 'user');
		return $this->fetch();
	}

	public function saveQna()
	{
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$userid = Cookie::get('userid');
		$title = Request::instance()->post('title');
		$content = Request::instance()->post('content');
		$content_text = Request::instance()->post('content_text');
		$coins = Request::instance()->post('coins');
		if($coins == '') {$coins = 0;}
		$invite_users = Request::instance()->post('invite_users');
		$total_invite = 1;
		if($invite_users != ''){
			$invite_user_arr = explode(",",$invite_users);
			$total_invite = count($invite_user_arr);
			if($total_invite>10){
				return '您最多只能邀请10位用户回答';
			}
		}
		$user = new Users;
		$userinfo = $user->getUserDetails($userid);
		if(bcsub($userinfo->coins, $userinfo->frozen_coins) < bcmul($total_invite, $coins)){
			return '比邻币余额不足';
		}
		$thumb_img = getThumbImg($content);
		if($thumb_img != ''){
			$content_text = getContentText($content_text,385);
		}else{
			$content_text = getContentText($content_text,540);
		}
		if($title!=""){
			$qna = new Qnas;
			return $qna->saveNewQnas($userid, $title, $content, $content_text, $thumb_img, $coins, $invite_users);
		}else{
			return "数据有误，请检查后重试";
		}
	}
	
	public function saveReplyQna()
	{
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$userid = Cookie::get('userid');
		$qnaid = Request::instance()->post('qnaid');
		$content = Request::instance()->post('content');
		$content_text = Request::instance()->post('content_text');
		$thumb_img = getThumbImg($content);
		$pendingid = Request::instance()->post('pendingid');
		$pending = new QnasPending;
		$pending_info = $pending->getPendingDetailsByPendingId($pendingid);
		if($pending_info->status == 1){
			if($thumb_img != ''){
				$content_text = getContentText($content_text,375);
			}else{
				$content_text = getContentText($content_text,500);
			}
			if($content!=""){
				$qna = new QnasReply;
				return $qna->saveReplyQna($userid, $content, $content_text, $thumb_img, $qnaid, $pendingid);
			}else{
				return "数据有误，请检查后重试";
			}
		}else{
			return "回答提交失败，提问者可能已关闭问题或撤销邀请。";
		}
	}
	
	//上传照片到七牛云
    public function uploadPic()
    {
		require_once APP_PATH . '/../vendor/qiniusdk/autoload.php';
		
		//获取文件后缀  
		function getExt($file) {  
		$tmp = explode('.',$file);  
		return strtolower(end($tmp));  
		}  
		//随机随机文件名  
		function randName() {  
		$str = 'abcdefghijkmnpqrstwxyz23456789';  
		return substr(str_shuffle($str),0,16);  
		}  

		$accessKey = 'Z4wgnwBl_94hiUth4VEgUiVaj0KQntxR7ZNGR19d';  
		$secretKey = 'SL_tEi0tauni6lvsFD894L62HlrGjTk7Qny8mQh5';  
		$bucket = 'images';  
		// 构建鉴权对象
		$auth = new Auth($accessKey, $secretKey);
		// 生成上传 Token
		$token = $auth->uploadToken($bucket);

		$name=$_FILES['upFiles']['name'];
		$filePath=$_FILES['upFiles']['tmp_name'];
		
		// 初始化 UploadManager 对象并进行文件的上传。
		$uploadMgr = new UploadManager();

		foreach ($name as $k=>$names){
			$type = strtolower(substr($names,strrpos($names,'.')+1));//得到文件类型，并且都转化成小写
			$allow_type = array('jpg','jpeg','gif','png','bmp'); //定义允许上传的类型
			//把非法格式的图片去除
			if (!in_array($type,$allow_type)){
				unset($name[$k]);
			}
		}
		$tmpStr2="{
	\"errno\": 0,
	\"data\": [";
		$tmpStr="";
		foreach ($name as $k=>$item){
			$type = getExt($item);//得到文件类型
			$newname = randName().".".$type;  //新文件名
			// 调用 UploadManager 的 putFile 方法进行文件的上传。
			list($ret, $err) = $uploadMgr->putFile($token, $newname, $filePath[$k]);
			if($tmpStr==""){
				$tmpStr="	\"http://images.beelintown.com.cn/$newname-upload_pic\"";
			}else{
				$tmpStr.=",\r\n	\"http://images.beelintown.com.cn/$newname-upload_pic\"";
			}
		}
		$tmpStr2.=$tmpStr;
		$tmpStr2.="
		]
	}"; 

		return($tmpStr2);
    }
	
	public function getRandUsers($limit = 6){
		$userid = Request::instance()->post('userid');
		$limit = Request::instance()->post('limit');
		$users = new Users;
		$rand_users = $users->getRandomUsers($limit, $userid);
		return collection($rand_users);
	}
	
	public function getSearchUser(){
		$userid = Request::instance()->post('userid');
		$username = Request::instance()->post('username');
		$users = new Users;
		$search_user = $users->getSearchUser($username, $userid);
		return $search_user;
	}
	
	public function follow(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$userid = Cookie::get('userid');
		$qnaid = Request::instance()->post('qnaid');
		if($qnaid != ''){
			$follow = new Follow;
			$result = $follow->saveNewFollow($userid, $qnaid);
		return $result;
		}else{
			return "数据错误";
		}
	}
}
