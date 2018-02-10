<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Cookie;
use app\index\model\Users;
use app\index\model\UsersTags;
use app\index\model\UserTagDetails;
use app\index\model\Tags;

class Usertags extends Controller
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
		$user_tag_list = $user_tag->getTagListByUserId(Cookie::get('userid'));
        $this->assign('user_tag_list',$user_tag_list);
        return $this->fetch();
	}
	
	public function getRandomTags(){
		$tag = new Tags;
		$tag_list = $tag->getRandomTags(15);
		return $tag_list;
	}
	
	public function searchTags(){
//		if(!Cookie::has('userid')){
//			return $this->redirect('/index/login');
//		}
		$page = Request::instance()->post('page');
		if($page == ''){$page = 1;}
		$searchtag = Request::instance()->post('tag');
		$tag = new Tags;
		return $tag->searchTags($searchtag, 20, $page);
	}
	
	public function addTag(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$userid = Cookie::get('userid');
		$tagid = Request::instance()->post('tagid');
		if($tagid != ''){
			$usertag = new UsersTags;
			$result = $usertag->addTag($userid, $tagid);
			return $result;
		}else{
			return "数据错误！";
		}
	}

	public function delTag(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$userid = Cookie::get('userid');
		$user_tagid = Request::instance()->post('user_tagid');
		if($user_tagid != ''){
			$usertag = new UsersTags;
			$result = $usertag->delTag($user_tagid, $userid);
			return $result;
		}else{
			return "数据错误！";
		}
	}

	public function getMoreTags(){
//		if(!Cookie::has('userid')){
//			return $this->redirect('/index/login');
//		}
		$tagid = Request::instance()->post('tagid');
		$page = Request::instance()->post('page');
		if($page == ''){$page = 1;}
		if($tagid == ""){
			return "";
		}else{
			$tag = new Tags;
			return $tag->getMoreTags($tagid,50,$page);
		}
	}
	
	public function getTagUsers(){
		$tagid = Request::instance()->post('tagid');
		if($tagid == ""){
			return "";
		}else{
			$tag = new UserTagDetails;
			return $tag->getTagUsers($tagid);
		}
	}
}