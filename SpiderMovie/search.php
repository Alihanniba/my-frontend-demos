<?php 
require("data.php");
if(!$_POST['title']){
	echo "error";
}
$title = $_POST['title'];

$result = $dbh -> prepare("SELECT * FROM `www.alihanniba.com` WHERE (`display` = 1 OR `display` = 2)  AND `movie_name` LIKE :title" );
$result -> bindValue(':title' , '%'.$title.'%' , PDO::PARAM_STR);

if(!$result->execute()){
	echo " error";
}

$movieInfo = $result->fetchall();
echo json_encode($movieInfo);
