<?php
namespace app\index\controller;
use think\Controller;
use think\Request;
use think\Db;
use think\Cookie;
use app\index\model\Users;
use app\index\model\Wallet;
use app\index\model\Transactions;
use app\index\model\UserTagDetails;

class Usercoins extends Controller
{
    public function index()
    {
		if(!Cookie::has('userid')){
			return $this->redirect('/index/login');
		}
		$user = new Users;
		$user->chkReminder(Cookie::get('userid'));
		$user_info = $user->getUserInfo(Cookie::get('userid'));
		$user_info['coins'] = floatval($user_info['coins']);
		$user_info['frozen_coins'] = floatval($user_info['frozen_coins']);
		$user_info['available_coins'] = floatval(bcsub($user_info['coins'], $user_info['frozen_coins'], 8));
		$trans = new Transactions;
		$trans_list = $trans->getTransFormatDetailsByUserId(Cookie::get('userid'));
		$wallet = new Wallet;
		$wallet_list = $wallet->getWalletByUserId(Cookie::get('userid'));
        $this->assign('userinfo',$user_info);
		$user->cleanTransactionReminder(Cookie::get('userid'));
        $this->assign('trans_list',$trans_list);
        $this->assign('wallet_list',$wallet_list);
        $this->assign('username',Cookie::get('username'));
        $this->assign('header_type','user');
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
		$wallet = Request::instance()->post('wallet');
		if($coins == '' || $wallet == ''){
			return "提现信息输入错误";
		}
		$user = new Users;
		$user_info = $user->getUserInfo(Cookie::get('userid'));
		$user_coins = $user_info->coins;
		$frozen_coins = $user_info->frozen_coins;
		$frozen_coins_after = bcadd($frozen_coins, $coins, 8);
		if(bcsub($user_coins, $frozen_coins_after, 8) < 0){
			return "比邻币余额不足";
		}
		$trans = new Transactions;
		$trans_result = $trans->saveTransaction(Cookie::get('userid'), $coins, 13, NULL, NULL, NULL, $wallet);
		if($trans_result){
			return "ok";
		}else{
			return "发生错误，提现申请可能失败";
		}
	}
}