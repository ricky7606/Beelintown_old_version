<?php
namespace app\index\model;

//导入模型类
use think\Model;
use app\index\model\QnaPendingDetails;
use app\index\model\Qnas;
use app\index\model\Users;
use app\index\model\Transactions;
use app\index\model\Message;

class QnasPending extends Model {
	
	// 设置当前模型对应的完整数据表名称
    protected $table = 'BLT_qna_pending';

	//在子类重写父类的初始化方法initialize()
	protected function initialize(){
		
	  //继承父类中的initialize()
		parent::initialize();
		
	   //初始化数据表字段信息	
	   $this->field = $this->db()->getTableInfo('', 'fields');  
	
	   //初始化数据表字段类型
	   $this->type = $this->db()->getTableInfo('', 'type'); 
	
	   //初始化数据表主键
	   $this->pk = $this->db()->getTableInfo('', 'pk');     
		
		
		}
	
	//拒绝回答
	public function refusePending($pendingid){
		$this->startTrans();
		$result = $this->update(['pendingid' => $pendingid, 'status' => 2]);
		
		$pending = new QnaPendingDetails;
		$pending_info = $pending->getPendingDetailsByPendingId($pendingid);
		$coins_before = $pending_info->payer_coins;
		$payer_userid = $pending_info->qna_userid;
		$payee_userid = $pending_info->pending_userid;
		$qnaid = $pending_info->qnaid;
		$coins = $pending_info->coins;
		$transaction = new Transactions;
		$result_trans = $transaction->saveTransaction($payer_userid, $coins, 3, $qnaid, $payee_userid, $pendingid);
		$commission = bcmul($coins, 0.1, 8);
		$result_trans = $transaction->saveTransaction($payer_userid, $commission, 4, $qnaid, $payee_userid, $pendingid); 
		$message_text = "用户“<a href=\"\\index\\userreplydetail?userid=".$payee_userid."\" target=\"_blank\">".$pending_info->pending_username."</a>”刚刚拒绝了回答您的问题：“<a href=\"\\index\\qnadetails?id=".$qnaid."\" target=\"_blank\">".$pending_info->title."</a>”。";
		$message = new Message;
		$result_message = $message->saveNewMessage($payer_userid, $message_text);
		if($result === false || $result_trans === false || $result_message === false){
			$this->rollBack();
			return "处理失败";
		}else{
			$this->commit();
			return "ok";
		}
	}

	//处理邀请或申请记录
//	回答流程(pending)状态码说明：
//	-1 - 撤销邀请、撤销申请
//	0 - 待处理，通常是申请回答；
//	1 - 通过；如邀请回答以及申请通过；
//	2 - 拒绝；如邀请被拒绝以及申请被拒绝或申请通过后拒绝回答；
//	3 - 已回答；
//	4 - 回答被采纳；
//	5 - 回答被拒绝；
//	6 - 回答被拒绝后进入待处理状态；
//	7 - 进入仲裁状态；
//	8 - 仲裁结束；
	public function updatePending($pendingid, $pending_status){
		$error_flag = false;
		$this->startTrans();
		$result = $this->update(['pendingid' => $pendingid, 'status' => $pending_status]);
		if($result === false){
			$error_flag = true;
			$error_msg = "发生错误";
		}else{
			$pending = new QnaPendingDetails;
			$message = new Message;
			$pending_info = $pending->getPendingDetailsByPendingId($pendingid);
			$coins_before = $pending_info->payer_coins;
			$coins_frozen = $pending_info->payer_frozen_coins;
			$payer_userid = $pending_info->qna_userid;
			$payee_userid = $pending_info->pending_userid;
			$qnaid = $pending_info->qnaid;
			$coins = $pending_info->coins;
			$pending_type = $pending_info->pending_type;
					
			//撤销邀请回答需要创建解冻记录
			if($pending_type == 1 && $pending_status == -1){
				$transaction = new Transactions;
				$result_trans = $transaction->saveTransaction($payer_userid, $coins, 3, $qnaid, $payee_userid, $pendingid);
				$commission = bcmul($coins, 0.1, 8);
				$result_trans = $transaction->saveTransaction($payer_userid, $commission, 4, $qnaid, $payee_userid, $pendingid);
				$message_text = "您撤销了对用户“<a href=\"\\index\\userreplydetail?userid=".$payee_userid."\" target=\"_blank\">".$pending_info->pending_username."</a>”关于问题：“<a href=\"\\index\\qnadetails?id=".$qnaid."\" target=\"_blank\">".$pending_info->title."</a>”的回答邀请。相应的悬赏及佣金已经解冻。";
				$result_message = $message->saveNewMessage($payer_userid, $message_text);
				if($result_trans === false || $result_message === false){
					$error_flag = true;
					$error_msg = "发生错误";
				}
			}
			//邀请回答拒绝需要创建解冻记录
			if($pending_type == 1 && $pending_status == 2){
				$transaction = new Transactions;
				$result_trans = $transaction->saveTransaction($payer_userid, $coins, 3, $qnaid, $payee_userid, $pendingid);
				$commission = bcmul($coins, 0.1, 8);
				$result_trans = $transaction->saveTransaction($payer_userid, $commission, 4, $qnaid, $payee_userid, $pendingid);
				$message_text = "用户“<a href=\"\\index\\userreplydetail?userid=".$payee_userid."\" target=\"_blank\">".$pending_info->pending_username."</a>”刚刚拒绝了您关于问题：“<a href=\"\\index\\qnadetails?id=".$qnaid."\" target=\"_blank\">".$pending_info->title."</a>”的回答邀请。";
				$result_message = $message->saveNewMessage($payer_userid, $message_text);
				if($result_trans === false || $result_message === false){
					$error_flag = true;
					$error_msg = "发生错误";
				}
			}
			//申请回答拒绝需要通知申请人
			if($pending_type == 2 && $pending_status == 2){
				$message_text = "用户“<a href=\"\\index\\userreplydetail?userid=".$payer_userid."\" target=\"_blank\">".$pending_info->qna_username."</a>”刚刚拒绝了您关于问题：“<a href=\"\\index\\qnadetails?id=".$qnaid."\" target=\"_blank\">".$pending_info->title."</a>”的回答申请。";
				$result_message = $message->saveNewMessage($payee_userid, $message_text);
				if($result_message === false){
					$error_flag = true;
					$error_msg = "发生错误";
				}
			}
			//申请回答通过需要创建冻结记录
			if($pending_type == 2 && $pending_status == 1){
				$commission = bcmul($coins, 0.1, 8);
				if(bcadd($coins,$commission,8)>bcsub($coins_before,$coins_frozen,8)){
					$error_flag = true;
					$error_msg = "您的比邻币余额不足！";
				}else{
					$transaction = new Transactions;
					$result_trans = $transaction->saveTransaction($payer_userid, $coins, 1, $qnaid, $payee_userid, $pendingid);
					$result_trans = $transaction->saveTransaction($payer_userid, $commission, 2, $qnaid, $payee_userid, $pendingid);
					$message_text = "用户“<a href=\"\\index\\userreplydetail?userid=".$payer_userid."\" target=\"_blank\">".$pending_info->qna_username."</a>”刚刚通过了您关于问题：“<a href=\"\\index\\qnadetails?id=".$qnaid."\" target=\"_blank\">".$pending_info->title."</a>”的回答申请，快去<a href=\"\\index\\userpending\">回答问题</a>吧。";
					$result_message = $message->saveNewMessage($payee_userid, $message_text);
					if($result_trans === false || $result_message === false){
						$error_flag = true;
						$error_msg = "发生错误";
					}
				}
			}
		}

		if($error_flag){
			$this->rollBack();
			return $error_msg;
		}else{
			$this->commit();
			$user = new Users;
			$user->chkReminder($payer_userid);
			$user->chkReminder($payee_userid);
			return "ok";
		}
	}
	
	public function getPendingByUserId($qnaid, $userid){
        $new_pending = $this->where('pending_userid',$userid)
		->where('qnaid', $qnaid)
		->field('status,pendingid')
		->limit(1)
		->find();          // 查询用户
        if (empty($new_pending)) {                 // 判断是否出错
            return false;
        }
        return $new_pending;   // 返回修改后的数据
	}

	public function saveApply($qnaid, $userid){
		$this->startTrans();
		$qna = new Qnas;
		$qna_info = $qna->getQnaDetailsByQnaId($qnaid);

		$this->pendingid = uuid();
		$this->qna_userid = $qna_info->userid;
		$this->pending_userid = $userid;
		$this->pending_date = date('Y-m-d H:i:s',time());
		$this->qnaid = $qnaid;
		$this->status = '0';
		$this->pending_type = '2';
		$result = $this->isUpdate(false)->save();
		$user = new Users;
		$userinfo = $user->getUserDetails($userid);
		$message_text = "用户“<a href=\"\\index\\userreplydetail?userid=".$userid."\" target=\"_blank\">".$userinfo->username."</a>”刚刚申请了回答您的问题：“<a href=\"\\index\\qnadetails?id=".$qnaid."\" target=\"_blank\">".$qna_info->title."</a>”，请<a href=\"\\index\\userqnas\">尽快处理</a>";
		$message = new Message;
		$result_message = $message->saveNewMessage($qna_info->userid, $message_text);
        if ($result === false || $result_message === false) {                 // 判断是否出错
            $this->rollback();
			return "error";
        }else{
			$this->commit();
			$user = new Users;
			$user->chkReminder($qna_info->userid);
	        return "ok";   // 返回修改后的数据
		}
	}
	
	public function arbitrate($pendingid){
		$this->pendingid = $pendingid;
		$this->status = 7;
		$this->update_date = date('Y-m-d H:i:s',time());
		$result = $this->isUpdate(true)->save();
        if ($result === false) {                 // 判断是否出错
            return "发生错误，申请仲裁可能失败";
        }else{
	        return "ok";   // 返回修改后的数据
		}
	}
}