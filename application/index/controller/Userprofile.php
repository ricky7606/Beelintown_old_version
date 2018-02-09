<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use Qiniu\Auth as Auth;
use Qiniu\Storage\BucketManager;
use Qiniu\Storage\UploadManager;
use think\Cookie;
use think\Session;
use app\index\model\Users;
use app\index\model\UserTagDetails;
use think\captcha\Captcha;

class Userprofile extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
        $this->assign('username',Cookie::get('username'));
        $this->assign('header_type','user');
		$user = new Users;
		$user->chkReminder(Cookie::get('userid'));
		$userinfo = $user->getUserInfo(Cookie::get('userid'));
        $this->assign('userinfo',$userinfo);
		$user_tag = new UserTagDetails;
		$user_tag_list = $user_tag->getTagListByUserId(Cookie::get('userid'),6);
        $this->assign('user_tag_list',$user_tag_list);
		
		//开启SESSION
		session_start();
		$register_token = random(6,1);
		$_SESSION['register_token'] = $register_token;
        $this->assign('register_token',$register_token);
        return $this->fetch();
	}
	
	public function saveDetails(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$mobile = Request::instance()->post('mobile');
		$gender = (int)Request::instance()->post('gender');
		$brief = Request::instance()->post('brief');
		$email = Request::instance()->post('email');
		$location = Request::instance()->post('location');
		$industry = Request::instance()->post('industry');
		$career = Request::instance()->post('career');
		$education = Request::instance()->post('education');
		$introduction = Request::instance()->post('introduction');
		$user = new Users;
		return $user->saveUserDetails($mobile, $gender, $brief, $email, $location, $industry, $career, $education, $introduction);
	}

	//上传照片到七牛云
    public function uploadPic()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		require_once APP_PATH . '/../vendor/qiniusdk/autoload.php';
		$userid = Cookie::get('userid');
		$mobile = Cookie::get('mobile');
		$pictype = Request::instance()->post('pictype');
		
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

		$type = strtolower(substr($name,strrpos($name,'.')+1));//得到文件类型，并且都转化成小写
		$allow_type = array('jpg','jpeg','gif','png','bmp'); //定义允许上传的类型
		//把非法格式的图片去除
		if (!in_array($type,$allow_type)){
			return false;;
		}
		$newname = randName().".".$type;  //新文件名
		// 调用 UploadManager 的 putFile 方法进行文件的上传。
		list($ret, $err) = $uploadMgr->putFile($token, $newname, $filePath);
		$tmpStr="http://images.beelintown.com.cn/$newname";
		$user = new Users;
		$user->mobile = $mobile;
		if($pictype == 'pic'){
			$tmpStr .= "-personal_pic";
			$user->personal_pic = $tmpStr;
		}else{
			$tmpStr .= "-personal_bg";
			$user->personal_bg = $tmpStr;
		}
		$user->isUpdate(true)->save();

		return $this->redirect('/index/userprofile');
	}
	
	public function changeUsername(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$mobile = Cookie::get('mobile');
		$username = Request::instance()->post('username');
		if($username == ''){
			return "用户名不能为空";
		}
		if(mb_strwidth($username, 'utf8') > 20){
			return "用户名不能超过20个字符";
		}
		$user = new Users;
		return $user->changeUsername($mobile, $username);
	}
	
	public function changePassword(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$password = Request::instance()->post('password');
		$new_password = Request::instance()->post('new_password');
		if($password == '' || $new_password == ''){
			return "密码不能为空";
		}else{
			$user = new Users;
			return $user->changePassword($password, $new_password);
		}
	}
	
	public function changeMobile(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		session_start();
		$old_mobile = Request::instance()->post('old_mobile');
		$new_mobile = Request::instance()->post('new_mobile');
		$register_token = Request::instance()->post('register_token');
		$imgcode = Request::instance()->post('imgcode');
		if(empty($_SESSION['register_token']) or $register_token != $_SESSION['register_token']){
			return '请求超时，请刷新页面后重试';
		}
		$id = "";
		$captcha = new Captcha();
		$captcha->reset = false;
		if(!$captcha->check($imgcode, $id)){
			return "验证码错误或者请求超时";
		}
		if($old_mobile!="" && $new_mobile){
			$user = new Users;
			$result = $user->changeMobile($old_mobile, $new_mobile);
			if($result == "ok"){
				Session::clear();
				return "ok";
			}else{
				return "新手机号码绑定失败";
			}
		}else{
			return "数据有误，请检查后重试";
		}
	}
}