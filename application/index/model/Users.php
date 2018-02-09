<?php
namespace app\index\model;

//导入模型类
use think\Model;
use think\Cookie;
use app\index\model\Transactions;
use app\index\model\UserTags;
use app\index\model\QnasPending;
use app\index\model\AttentionDetails;
use app\index\model\Message;

class Users extends Model {
	
	// 设置当前模型对应的完整数据表名称
    protected $table = 'BLT_user';
	
	//protected $resultSetType = 'collection';

	//在子类重写父类的初始化方法initialize()
	protected function initialize(){
		
	  //继承父类中的initialize()
		parent::initialize();
		
	   //初始化数据表字段信息	
	   $this->field = $this->db()->getTableInfo('', 'fields');  
	
	   //初始化数据表字段类型
	   $this->type = $this->db()->getTableInfo('', 'type'); 
	
	   
	   $this->pk = $this->db()->getTableInfo('', 'pk');     
		}

     public function qnas()
    {
        return $this->hasMany('Qnas','userid');//对应多条问答记录
    }

	public function getRandomUsers($limit, $userid){
        $random_users = $this->where('userid','<>',$userid)
		->field('userid,username,personal_pic')
		->order('ROUND(RAND()*1000)','desc')
		->limit($limit)->select();          // 查询随机用户
        if (empty($random_users)) {                 // 判断是否出错
            return false;
        }
        return $random_users;   // 返回修改后的数据
	}

	public function getSearchUser($username, $userid){
        $search_users = $this->where('username','like','%'.$username.'%')
		->where('userid','<>',$userid)
		->field('userid,username,personal_pic')
		->order('ROUND(RAND()*1000)','desc')
		->limit(6)->select();          // 查询用户
        if (empty($search_users)) {                 // 判断是否出错
            return false;
        }
        return $search_users;   // 返回修改后的数据
	}
	
	public function getAttUsers($userid){
        $att = new AttentionDetails;
		$att_users = $att->where('userid', $userid)
		->field('attention_userid,attention_username')
		->order('attention_date','desc')
		->select();          // 查询随机用户
        if (empty($att_users)) {                 // 判断是否出错
            return false;
        }
        return $att_users;   // 返回修改后的数据
	}
	
	public function getUserIdByUsername($username){
        $search_users = $this->where(function ($query) use ($username){
		$query->where('username',$username)
		->field('userid');
		})->find();          // 查询用户
        if (empty($search_users)) {                 // 判断是否出错
            return false;
        }
        return $search_users->userid;   // 返回修改后的数据		
	}
	
	public function getUserDetails($userid){
        $users = $this->where('userid',$userid)
		->field('*,pending_reminder+reply_apply_reminder+answer_reminder+attention_reminder+transaction_reminder+message_reminder as message_count')
		->find();          
        if (empty($users)) {                 // 判断是否出错
            return false;
        }
        return $users;   // 返回修改后的数据
	}
	
	public function getLogin($mobile, $password, $isonemonth){
		// 验证用户Bcrypt加密后的密码
		$chkPwd = $this->where(function ($query) use ($mobile){
			$query->where('mobile',$mobile)
			->field('password,userid,usernmae')
			->limit(1);
		})->find();
		if($chkPwd){
			if(password_verify($password,$chkPwd->password)){
				if($isonemonth == 'yes'){
					Cookie::set('userid',$chkPwd->userid,2678400);
					Cookie::set('mobile',$mobile,2678400);
					Cookie::set('username',$chkPwd->username,2678400);
				}else{
					Cookie::set('userid',$chkPwd->userid,86400);
					Cookie::set('mobile',$mobile,86400);
					Cookie::set('username',$chkPwd->username,86400);
				}
				$this->chkReminder($chkPwd->userid);
				return "ok";
			}else{
				return "密码错误，请检查后重试";
			}
		}else{
			return "手机号码未注册，请检查后重试";
		}
	}
	
	public function chkReminder($userid){
		$pending = new QnasPending;
		//待回答+待补充回答总数
		$pending_result = $pending->where('pending_userid', $userid)
		->where('status', 'in', '1,31')
		->field('count(*) as pending_count')
		->find();
		//待处理申请+待处理回答+回答者拒绝补充回答(要处理原回答)+待处理补充回答总数
		$apply_reply_result = $pending->where('qna_userid', $userid)
		->where('status','in','0,3,32,33')
		->field('count(*) as apply_reply_count')
		->find();
		//未读消息总数
		$message = new Message;
		$message_result = $message->where('userid', $userid)
		->where('status', 0)
		->field('count(*) as message_count')
		->find();
		$this->where('userid', $userid)->update(['pending_reminder' => $pending_result->pending_count, 'reply_apply_reminder' => $apply_reply_result->apply_reply_count, 'message_reminder' => $message_result->message_count]);
		return true;
	}
	
	public function addAnswerReminder($userid){
		$this->where('userid', $userid)->setInc('answer_reminder',1);
	}
	
	public function cleanAnswerReminder($userid){
		$this->where('userid', $userid)->update(['answer_reminder' => 0]);
	}
	
	public function addNewAtt($userid){
		$this->where('userid', $userid)->setInc('attention_reminder',1);
	}
	
	public function cleanAttentionReminder($userid){
		$this->where('userid', $userid)->update(['attention_reminder' => 0]);
	}

	public function addNewTransactionReminder($userid, $num = 1){
		$this->where('userid', $userid)->setInc('transaction_reminder',$num);
	}
	
	public function cleanTransactionReminder($userid){
		$this->where('userid', $userid)->update(['transaction_reminder' => 0]);
	}

	public function cleanMessageReminder($userid){
		$message = new Message;
		$message->where('userid', $userid)->update(['status' => 1]);
		$this->where('userid', $userid)->update(['message_reminder' => 0]);
	}
	
	public function userRegister($username, $password, $mobile){
		$this->startTrans();
		$this->username = $username;
		$this->password = $password;
		$this->mobile = $mobile;
		$this->reg_date = date('Y-m-d H:i:s',time());
		$userid = uuid();
		$this->userid = $userid;
		$result_user = $this->isUpdate(false)->save();
		
		$transaction = new Transactions;
		$result_trans = $transaction->saveTransaction($userid, 50, 0);
		$message_text = "欢迎您成为比邻小镇新居民！奖励给您50个比邻币，祝您在这里玩的开心！";
		$message = new Message;
		$message_result = $message->saveNewMessage($userid, $message_text);
		if($result_user === false || $result_trans === false || $message_result === false){
			$this->rollBack();
			return "注册失败";
		}else{
			$this->commit();
			return "ok";
		}
	}
	
	public function chkMobile($mobile){
		$chkMobile = $this->where(function ($query) use ($mobile){
			$query->where('mobile',$mobile);
		})->find();
		if($chkMobile)
		{
			return "exists";
		}else{
			return "none";
		}
	}
	
	public function chkUsername($username){
		$chkUsername = $this->where(function ($query) use ($username){
			$query->where('username',$username);
		})->find();
		if($chkUsername)
		{
			return "exists";
		}else{
			return "none";
		}
	}
	
	public function getUserInfo($userid){
        $user = $this->where('userid', $userid)
		->field('*,pending_reminder+reply_apply_reminder+answer_reminder+attention_reminder+transaction_reminder+message_reminder as message_count')
		->find();          // 查询所有用户的所有字段资料
        if (empty($user)) {                 // 判断是否出错
            return false;
        }
        return $user;   // 返回修改后的数据
	}
	
	public function saveUserDetails($mobile, $gender, $brief, $email, $location, $industry, $career, $education, $introduction){
		$this->mobile = $mobile;
		$this->gender = $gender;
		$this->brief = $brief;
		$this->email = $email;
		$this->location = $location;
		$this->industry = $industry;
		$this->career = $career;
		$this->education = $education;
		$this->introduction = $introduction;
		$this->update_date = date('Y-m-d H:i:s',time());
		$result = $this->isUpdate(true)->save();
		if($result){
			return "ok";
		}else{
			return "更新失败";
		}
	}
	
	public function saveNewTag($userid, $tagid){
		$tag = new UserTags;
		$tag->user_tagid = uuid();
		$tag->userid = $userid;
		$tag->tagid = $tagid;
		$tag->create_date = date('Y-m-d H:i:s',time());
		$tag->status = 0;
		$result = $tag->isUpdate(false)->save();
		if($result){
			return "ok";
		}else{
			return "添加标签失败";
		}
	}

	public function deleteTag($user_tagid){
		$tag = new UserTags;
		$tag->user_tagid = $user_tagid;
		$tag->delete_date = date('Y-m-d H:i:s',time());
		$tag->status = 1;
		$result = $tag->isUpdate(true)->save();
		if($result){
			return "ok";
		}else{
			return "删除标签失败";
		}
	}
	
	public function changeUsername($mobile, $username){
		$this->mobile = $mobile;
		$this->username = $username;
		$this->original_username = Cookie::get('username');
		$this->changed_username = 1;
		$result = $this->isUpdate(true)->save();
		if($result){
			Cookie::set('username',$username,86400);
			return "ok";
		}else{
			return "用户名修改失败";
		}
	}

	public function changePassword($mobile, $password, $new_password){
		$result = $this->where('mobile', $mobile)
		->limit(1)
		->find();
		if($result){
			$current_pwd = $result->password;
			if(password_verify($password,$current_pwd)){
				$new_password = password_hash($new_password,PASSWORD_BCRYPT);
				$result_pwd = $this->update(['mobile' => $mobile, 'password' => $new_password]);
				if($result_pwd){
					return "ok";
				}else{
					return "密码修改失败";
				}
			}else{
				return "登录密码错误";
			}
		}else{
			return "数据错误";
		}
	}
	
	public function changeMobile($old_mobile, $new_mobile){
		$result = $this->where('mobile', $old_mobile)->update(['mobile' => $new_mobile]);
		if($result){
			return "ok";
		}else{
			return "手机号码修改失败";
		}
	}
}