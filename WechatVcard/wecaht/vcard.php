<?php 
require_once ('./cc.php');

$openid = $_POST['openid'];
$name = $_POST['name'];
$job = $_POST['job'];
$headimg = $_POST['headimg'];
$company = $_POST['company'];
$mobile = $_POST['mobile'];
$tel = $_POST['tel'];
$fax = $_POST['fax'];
$email = $_POST['email'];
$url = $_POST['url'];
$weibo = $_POST['weibo'];
$qq = $_POST['qq'];
$qq_url = $_POST['qq_url'];
$wechat = $_POST['wechat'];
$wechat_url = $_POST['wechat_url'];
$address = $_POST['address'];
$description = $_POST['description'];
$created_at = date("Y-m-d H:i:s");

$temp = $dbh->prepare('INSERT `vcard_userinfo` (`openid`,`name`,`job` ,`headimg`,`company`,`mobile`,`tel`,`fax`,`email`,`url`,`weibo`,`qq`,`qq_url`,`wechat`,`wechat_url`,`address`,`description`,`created_at`) 
	VALUES (:openid , :name , :job , :headimg, :company , :mobile , :tel , :fax , :email , :url , :weibo , :qq , :qq_url , :wechat , :wechat_url ,  :address , :description , :created_at)');
$temp->bindParam(':openid' , $openid , PDO::PARAM_STR);
$temp->bindParam(':name' , $name , PDO::PARAM_STR);
$temp->bindParam(':job' , $job , PDO::PARAM_STR);
$temp->bindParam(':headimg' , $headimg , PDO::PARAM_STR);
$temp->bindParam(':company' , $company , PDO::PARAM_STR);
$temp->bindParam(':mobile' , $mobile , PDO::PARAM_STR);
$temp->bindParam(':tel' , $tel , PDO::PARAM_STR);
$temp->bindParam(':fax' , $fax , PDO::PARAM_STR);
$temp->bindParam(':email' , $email , PDO::PARAM_STR);
$temp->bindParam(':url' , $url , PDO::PARAM_STR);
$temp->bindParam(':weibo' , $weibo , PDO::PARAM_STR);
$temp->bindParam(':qq' , $qq , PDO::PARAM_STR);
$temp->bindParam(':qq_url' , $qq_url , PDO::PARAM_STR);
$temp->bindParam(':wechat' , $wechat , PDO::PARAM_STR);
$temp->bindParam(':wechat_url' , $wechat_url , PDO::PARAM_STR);
$temp->bindParam(':address' , $address , PDO::PARAM_STR);
$temp->bindParam(':description' , $description , PDO::PARAM_STR);
$temp->bindParam(':created_at' , $created_at , PDO::PARAM_STR);

if($temp->execute()){
	$lastId = $dbh ->lastInsertId();
	echo json_encode(array('id'=>$lastId));
}else{
	echo json_encode(array('error'=>'插入失败!'));
}
