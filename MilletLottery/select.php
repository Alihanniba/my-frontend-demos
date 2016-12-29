<?php
require_once("./data.php");
if(!$_GET['uid'] && !$_POST['uid']){
    exit;
}
$uid = $_GET['uid']?$_GET['uid']:$_POST['uid'];

$temp = $dbh->prepare('SELECT prize FROM `user` WHERE `uid` = :uid');
$temp->bindParam(':uid' , $uid , PDO::PARAM_STR);
if(!$temp->execute()){
    echo " error";
}else{
    $prize = $temp->fetch();
    if(!$prize){
        echo json_encode(array("prize"=>1,"success"=>true,"error_code"=>0));
    }else{
        echo json_encode(array("prize"=>0,"success"=>false,"error_code"=>-1));
    }
}
