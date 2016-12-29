<?php 
require_once("./cc.php");
session_start();
if (!$_GET['openid'] || !$_GET['nickname'] || !$_GET['headimgurl'] ) {
    echo 'missing id';
    exit;
}
$_SESSION['openid'] = $openid = $_GET['openid'];
$_SESSION['nickname'] = $nickname = urldecode($_GET['nickname']);
$_SESSION['headimgurl'] = $headimgurl = urldecode($_GET['headimgurl']);

$temp = $dbh->prepare('SELECT id FROM `vcard_userinfo` WHERE `openid` = :openid ORDER BY id DESC LIMIT 1');
$temp->bindParam(':openid' , $openid , PDO::PARAM_STR);
if(!$temp->execute()){
	echo " error";
}else{
	$vcardInfor = $temp->fetch();
	if($vcardInfor===false){
		header("Location:input.php?openid=".$openid."&nickname=".$nickname."&headimgurl=".$headimgurl) ;
	}else{
		// var_dump($vcardInfor);
		// $vcardInfor = json_decode($vcardInfor);
		header("Location:m.html?id=".$vcardInfor[0]) ;
	}
	// $vcardInfor = $temp->fetch();
	// $vcardInfor = json_encode($vcardInfor);
	// if($vcardInfor==''){
	// 	header("Location:input.php?openid=".$openid."&nickname=".$nickname."&headimgurl=".$headimgurl) ;
	// }else{
	// 	header("Location:m.html?id=".$vcardInfor) ;
	// }
}
