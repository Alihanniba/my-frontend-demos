<?php 
require("data.php");

if(!$_POST['name']||!$_POST['url']||!$_POST['img']){
	echo "error";
	exit;
}
$name = $_POST['name'];
$url = $_POST['url'];
$img = $_POST['img'];
$key = time();

$result = $dbh -> prepare('INSERT INTO `dy592` (`movie_key`,`movie_name`,`movie_url`,`movie_image`,`display`) VALUES (:key, :name, :url, :img, 2)'); 
$result -> bindParam(':key', $key, PDO::PARAM_STR);
$result -> bindParam(':name', $name, PDO::PARAM_STR);
$result -> bindParam(':url', $url, PDO::PARAM_STR);
$result -> bindParam(':img', $img, PDO::PARAM_STR);

if(!$result->execute()){
	// print_r($result->errorInfo()) ;
	echo "上传错误,请重新输入电影名称";
}else{
	echo "插入成功!";
}
