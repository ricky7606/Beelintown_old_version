<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\Users;
use app\index\model\Wallet;
use app\index\model\UserTagDetails;

class Userwallet extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$wallet = new Wallet;
		$wallet_list = $wallet->getWalletByUserId(Cookie::get('userid'));
        $this->assign('wallet_list',$wallet_list);
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

	public function extractCoins(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$coins = Request::instance()->post('coins');
		$user = new Users;
		$user_info = $user->getUserInfo(Cookie::get('userid'));
		$user_coins = $user_info->coins;
		$frozen_coins = $user_info->frozen_coins;
		$frozen_coins_after = bcadd($frozen_coins, $coins, 8);
		if(bcsub($user_coins, $frozen_coins_after, 8) < 0){
			return "比邻币余额不足";
		}
		$trans = new Transactions;
		$trans_result = $trans->saveTransaction(Cookie::get('userid'), $coins, 12);
		if($trans_result){
			return "ok";
		}else{
			return "发生错误，提现申请可能失败";
		}
	}
	
	public function createWallet(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$wallet_tag = Request::instance()->post('wallet_tag');
		$wallet_address = Request::instance()->post('wallet_address');
		if(mb_strlen($wallet_tag)==0 || mb_strlen($wallet_tag)>20){
			return "钱包标签填写错误";
		}
		if(mb_strlen($wallet_address)<20 || mb_strlen($wallet_tag)>50){
			return "钱包地址填写错误";
		}
		$wallet = new Wallet;
		$wallet_result = $wallet->saveNewWallet(Cookie::get('userid'), $wallet_tag, $wallet_address);
		if($wallet_result){
			return "ok";
		}else{
			return "发生错误，钱包创建可能失败";
		}
	}

	public function deleteWallet(){
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$walletid = Request::instance()->post('walletid');
		$wallet = new Wallet;
		$wallet_result = $wallet->deleteWallet($walletid);
		if($wallet_result){
			return "ok";
		}else{
			return "发生错误，钱包删除可能失败";
		}
	}
}