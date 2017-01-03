<?php
require("data.php");
if(!$_POST['page']){
	echo "error";
}
$pageSize = 15; //显示条数s
$page = $_POST['page'];
$num = ($page-1)*$pageSize;

$result = $dbh -> prepare("SELECT * FROM `dy592` WHERE (`display` = 1 OR `display` = 2)
	ORDER BY `sort_order` DESC LIMIT ". $num .',' .$pageSize);
// $type = $dbh -> prepare("SELECT COUNT(*) FROM `dy592`");

if(!$result->execute()){
	echo " error";
}
$movieInfo = $result->fetchall();
echo json_encode($movieInfo);

