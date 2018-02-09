<?php
namespace app\index\model;

//导入模型类
use think\Model;
use app\index\model\QnasPending;
use app\index\model\Transactions;
use app\index\model\Users;

class QnasReplyDetails extends Model {
	
	// 设置当前模型对应的完整数据表名称
    protected $table = 'view_QnaReplyDetails';

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
	
	public function getReplyDetailsByUserId($userid){
        $new_reply = $this->where('userid', $userid)
		->order('create_date','desc')
		->select();          // 查询所有用户的所有字段资料
        if (empty($new_reply)) {                 // 判断是否出错
            return false;
        }
        return $new_reply;   // 返回修改后的数据
	}

	public function getReplyDetails($valuable = false, $limit = NULL){
		if($limit == NULL){
			$limit = 100000;
		}
		if($valuable){
			$reply = $this->where('valuable_answer', 1)
			->limit($limit)
			->order('create_date','desc')
			->paginate(10);          // 查询所有用户的所有字段资料
		}else{
			$reply = $this->limit($limit)
			->order('create_date','desc')
			->paginate(10);          // 查询所有用户的所有字段资料
		}
        if (empty($reply)) {                 // 判断是否出错
            return false;
        }
        return $reply;   // 返回修改后的数据
	}

	public function getReplyDetailsByQnaId($qnaid, $limit = NULL, $valuable = false){
		if($limit == NULL){
			$limit = 100000;
		}
		if($valuable){
			$reply = $this->where('qnaid',$qnaid)
			->where('valuable_answer', 1)
			->limit($limit)
			->order('create_date','desc')
			->paginate(5,false,['query'=>request()->param()]);          
		}else{
			$reply = $this->where('qnaid',$qnaid)
			->limit($limit)
			->order('create_date','desc')
			->paginate(5,false,['query'=>request()->param()]);          
		}
        if (empty($reply)) {                 // 判断是否出错
            return false;
        }
        return $reply;   // 返回修改后的数据
	}

	public function getTopReplyDetailsByReplyId($replyid, $valuable = false){
		if($valuable){
			$reply = $this->where('replyid',$replyid)
			->where('valuable_answer', 1)
			->limit(1)
			->order('create_date','desc')
			->find();          // 查询所有用户的所有字段资料
		}else{
			$reply = $this->where('replyid',$replyid)
			->limit(1)
			->order('create_date','desc')
			->find();          // 查询所有用户的所有字段资料
		}
        if (empty($reply)) {                 // 判断是否出错
            return false;
        }
        return $reply;   // 返回修改后的数据
	}

	public function getReplyDetailsByReplyId($replyid){
        $reply = $this->where('replyid',$replyid)
		->find();          // 查询所有用户的所有字段资料
        if (empty($reply)) {                 // 判断是否出错
            return false;
        }
        return $reply;   // 返回修改后的数据
	}

	public function users()
    {
        return $this->belongsTo('Users','userid');
    }

	public function getUpdateReplyDetails($valuable = false, $limit = 10){
		if($valuable){
			$qna_reply_list = $this->where('valuable_answer', 1)
			->where('share', 1)
			->field('replyid,qnaid,qna_userid,userid,qna_username,reply_username,qna_coins,content,content_text,title,create_date,qna_personal_pic,reply_personal_pic')
			->group('qnaid')
			->order('max(create_date)', 'desc')
			->paginate($limit);
		}else{
			$qna_reply_list = $this->group('qnaid')
			->field('replyid,qnaid,qna_userid,userid,qna_username,reply_username,qna_coins,content,content_text,title,create_date,qna_personal_pic,reply_personal_pic')
			->order('max(create_date)', 'desc')
			->paginate($limit);
		}
        if (empty($qna_reply_list)) {                 // 判断是否出错
            return false;
        }
        return $qna_reply_list;   // 返回修改后的数据
	}

	public function getUpdateReplyDetailsByUserId($userid, $vauable = false, $limit = 10){
		if($vauable){
			$qna_reply_list = $this->where('userid', $userid)
			->where('valuable_answer', 1)
			->field('replyid,qnaid,qna_userid,userid,qna_username,reply_username,qna_coins,content,content_text,title,create_date,qna_personal_pic,reply_personal_pic')
			->group('qnaid')
			->order('max(create_date)', 'desc')
			->paginate($limit);
		}else{
			$qna_reply_list = $this->where('userid', $userid)
			->group('qnaid')
			->paginate($limit);
		}
        if (empty($qna_reply_list)) {                 // 判断是否出错
            return false;
        }
        return $qna_reply_list;   // 返回修改后的数据
	}
}