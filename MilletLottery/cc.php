<?php
require_once("./data.php");


$prize = $_POST['prize'];
$uid = $_POST['uid'];
$datatime = date('Y-m-d', time());

// echo $prize;
// echo $datatime;
//插入数据
$temp = $dbh->prepare('INSERT `user` (`uid`,`prize`,`time`) VALUES (:uid ,:prize ,:time)');
$temp->bindParam(':uid', $uid, PDO::PARAM_STR);
$temp->bindParam(':prize', $prize, PDO::PARAM_STR);
$temp->bindParam(':time', $datatime, PDO::PARAM_STR);
if($temp->execute()){
    $lastId = $dbh ->lastInsertId();
    echo json_encode(array('status'=> 0 ,'id'=>$lastId));
}else{
    echo json_encode(array('status'=> -1 ,'error'=>'插入失败!'));
}

