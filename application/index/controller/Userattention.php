<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\Users;
use app\index\model\Attention;
use app\index\model\UserTagDetails;

class Userattention extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$att = new Attention;
		$att_info = $att->getAttentionDetailsByUserId(Cookie::get('userid'));
        $this->assign('att_list',$att_info);
        $this->assign('attcount',count($att_info));
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

    public function be_attention()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$att = new Attention;
		$att_info = $att->getBeAttentionDetailsByUserId(Cookie::get('userid'));
        $this->assign('att_list',$att_info);
        $this->assign('attcount',count($att_info));
        $this->assign('username',Cookie::get('username'));
        $this->assign('header_type','user');
		$user = new Users;
		$user->chkReminder(Cookie::get('userid'));
		$userinfo = $user->getUserInfo(Cookie::get('userid'));
		$user->cleanAttentionReminder(Cookie::get('userid'));
        $this->assign('userinfo',$userinfo);
		$user_tag = new UserTagDetails;
		$user_tag_list = $user_tag->getTagListByUserId(Cookie::get('userid'),6);
        $this->assign('user_tag_list',$user_tag_list);
        return $this->fetch('index2');
	}
	
	public function delAtt(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$attid = Request::instance()->post('attentionid');
		if($attid != ''){
			$att = new Attention;
			$att_result = $att->deleteAttention($attid);
			if($att_result){
				return "ok";
			}else{
				return "发生错误，取消关注可能失败";
			}
		}else{
			return "数据错误";
		}
	}

	public function attUser(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$attention_userid = Request::instance()->post('attention_userid');
		if($attention_userid != ''){
			$att = new Attention;
			$att_result = $att->saveNewAttention(Cookie::get('userid'), $attention_userid);
			if($att_result){
				return "ok";
			}else{
				return "发生错误，关注可能失败";
			}
		}else{
			return "数据错误";
		}
	}
}