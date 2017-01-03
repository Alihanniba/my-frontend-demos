<?php 
require("data.php");
if(!$_POST['name']||!$_POST['show_hide']||!$_POST['movie_key']){
	echo "Error";
	exit();
}

$name = $_POST['name'];
$show_hide = $_POST['show_hide'];
$movie_key = $_POST['movie_key'];
if($show_hide == "显示1"){
	$display = 1;
}else{
	$display = 2;
}

$result = $dbh -> prepare("SELECT max(sort_order) as max from `www.alihanniba.com`");
if(!$result -> execute()){
	echo "Error";
	exit();
}
$temp = $result->fetchall();
$max = intval($temp[0]['max']) + 1;
if($show_hide == "显示1"){
	$tt = $dbh -> prepare("UPDATE `www.alihanniba.com` SET sort_order = " . $max . " WHERE movie_name = '" . $name . "' AND  display = " . $display);
}else{
	$tt = $dbh -> prepare("UPDATE `www.alihanniba.com` SET sort_order = " . $max . " WHERE movie_key = '" . $movie_key . "' AND  display = " . $display);
}
// var_dump($tt);exit();
if(!$tt -> execute()){
	echo "Error";
	exit();
}
$data = array('temp' => json_encode($temp),'tt' => json_encode($tt->rowCount()));

echo json_encode($data);
