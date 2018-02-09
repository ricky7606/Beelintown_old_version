<?php
namespace app\index\model;

//导入模型类
use think\Model;
use app\index\model\QnasPending;
use app\index\model\Transactions;
use app\index\model\Users;
use app\index\model\Message;

class Qnas extends Model {
	
	// 设置当前模型对应的完整数据表名称
    protected $table = 'BLT_qna';

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
	public function getNewQnas(){
        $new_qnas = $this->with('users')->limit(10)
		->order('create_date','desc')
		->select();          // 查询所有用户的所有字段资料
        if (empty($new_qnas)) {                 // 判断是否出错
            return false;
        }
        return $new_qnas;   // 返回修改后的数据
	}
	
	public function saveNewQnas($userid, $title, $content, $content_text, $thumb_img, $coins, $invite_users){
		$error_flag = false;
		
		//开启事务
		$this->startTrans();
		$this->userid = $userid;
		$this->title = $title;
		$this->content = $content;
		$this->content_text = $content_text;
		$this->thumb_img = $thumb_img;
		$this->coins = $coins;
		$this->create_date = date('Y-m-d H:i:s',time());
		$new_qnaid = uuid();
		$this->qnaid = $new_qnaid;
		$result_qna = $this->save();
		
		if($result_qna){
			if($coins > 0){
				$users = new Users;
				$userinfo = $users->getUserDetails($userid);
				$total_invite = 1;
				$transaction = new Transactions;
				if($invite_users != ""){
					$pending = new QnasPending;
					$invite_user_arr = explode(",",$invite_users);
					$total_invite = count($invite_user_arr);
					foreach ($invite_user_arr as $username){ 
						$invited_userid = $users->getUserIdByUsername($username);
						$new_pendingid = uuid();
						$new_transid = uuid();
						
						$pending->pendingid = $new_pendingid;
						$pending->qnaid = $new_qnaid;
						$pending->qna_userid = $userid;
						$pending->pending_userid = $invited_userid;
						$pending->pending_date = date('Y-m-d H:i:s',time());
						$pending->status = 1;
						$pending->pending_type = 1;
						$pending->transactionid = $new_transid;
						$result_pending = $pending->isUpdate(false)->save();

						$result_trans = $transaction->saveTransaction($userid, $coins, 1, $new_qnaid, $invited_userid, $new_pendingid);
						$commission = bcmul($coins, 0.1, 8);
						$result_trans = $transaction->saveTransaction($userid, $commission, 2, $new_qnaid, $invited_userid, $new_pendingid);
						
						//通知被邀请用户
						$message_text = "用户“<a href=\"\\index\\userreplydetail?userid=".$userid."\" target=\"_blank\">".$userinfo->username."</a>”邀请您回答问题：“<a href=\"\\index\\qnadetails?id=".$new_qnaid."\" target=\"_blank\">".$title."</a>”，快去<a href=\"\\index\\userpending\">回答问题</a>吧。";
						$message = new Message;
						$result_message = $message->saveNewMessage($invited_userid, $message_text);

						if(!$result_trans || !$result_pending){
							$error_flag = true;
						}
					}
				}else{
					//没有邀请不需要冻结，放在申请通过的时候再检查余额
//					$result_trans = $transaction->saveTransaction($userid, $coins, 1, $new_qnaid);
//					$commission = bcmul($coins, 0.1, 8);
//					$result_trans = $transaction->saveTransaction($userid, $commission, 2, $new_qnaid);
//					if(!$result_trans){
//						$error_flag = true;
//					}
				}
			}
		}else{
			$error_flag = true;
		}

		
		if(!$error_flag){
			$this->commit();
			return "ok";
		}else{
			$this->rollBack();
			return "error";
		}
	}

	public function getQnaDetailsByQnaId($qnaid){
        $qna = $this->where('qnaid',$qnaid)
		->field('qnaid,userid,title,content,content_text,coins,thumb_img,status')
		->limit(1)
		->find();          // 查询用户
        if (empty($qna)) {                 // 判断是否出错
            return false;
        }
        return $qna;   // 返回修改后的数据
	}

	public function users()
    {
        return $this->belongsTo('Users','userid');
    }
}