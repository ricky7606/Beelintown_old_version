<?php
/*===========================================================
= 版权协议：
= GPL (The GNU GENERAL PUBLIC LICENSE Version 2, June 1991)
=------------------------------------------------------------
= 文件名称：SysCrypt.php
= 摘 要：php加密解密处理类
= 版 本：1.2
= 参 考：Discuz论坛的passport相关函数
=------------------------------------------------------------
= 修改后支持 THINPHP5
= 最后更新：lijing
= 最后日期：2016-10-08
============================================================*/
namespace think;
class SysCrypt {
private $crypt_key;
// 构造函数 
public function __construct($crypt_key) {
$this->crypt_key = $crypt_key;
}
public function php_encrypt($txt) {
srand((double)microtime() * 1000000);
$encrypt_key = md5(rand(0,32000));
$ctr = 0;
$tmp = '';
for($i = 0;$i<strlen($txt);$i++) {
$ctr = $ctr == strlen($encrypt_key) ? 0 : $ctr;
$tmp .= $encrypt_key[$ctr].($txt[$i]^$encrypt_key[$ctr++]);
}
return base64_encode(self::__key($tmp,$this -> crypt_key));
}

public function php_decrypt($txt) {
$txt = self::__key(base64_decode($txt),$this -> crypt_key);
$tmp = '';
for($i = 0;$i < strlen($txt); $i++) {
$md5 = $txt[$i];
$tmp .= $txt[++$i] ^ $md5;
}
return $tmp;
}

private function __key($txt,$encrypt_key) {
$encrypt_key = md5($encrypt_key);
$ctr = 0;
$tmp = '';
for($i = 0; $i < strlen($txt); $i++) {
$ctr = $ctr == strlen($encrypt_key) ? 0 : $ctr;
$tmp .= $txt[$i] ^ $encrypt_key[$ctr++];
}
return $tmp;
}

public function __destruct() {
$this->crypt_key = null;
}
}