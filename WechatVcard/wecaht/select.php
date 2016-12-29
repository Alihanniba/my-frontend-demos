<?php 
require_once ('./cc.php');
$id = $_POST['id'];

$temp = $dbh->prepare('SELECT * FROM `vcard_userinfo` WHERE `id` = :id');
$temp->bindParam(':id' , $id , PDO::PARAM_INT);
if($temp->execute()){
	$vcardInfor['vcardInfo'] = $temp->fetch();
	echo json_encode($vcardInfor);
}else{
	echo " error";
}