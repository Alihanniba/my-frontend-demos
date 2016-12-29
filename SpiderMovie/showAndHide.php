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
}else if($show_hide == "显示2"){
	$display = 2;
}else if($show_hide == "隐藏1"){
	$display = 3;
}else{
	$display = 4;
}

switch ($display){
	case 1:
		$temp = $dbh -> prepare("UPDATE `www.alihanniba.com` SET display = 3 WHERE movie_name = '" . $name . "' ");
		break;
	case 2:
		$temp = $dbh -> prepare("UPDATE `www.alihanniba.com` SET display = 4 WHERE movie_key = '" . $movie_key . "' ");
		break;
	case 3:
		$temp = $dbh -> prepare("UPDATE `www.alihanniba.com` SET display = 1 WHERE movie_name = '" . $name . "' ");
		break;
	case 4:
		$temp = $dbh -> prepare("UPDATE `www.alihanniba.com` SET display = 2 WHERE movie_key = '" . $movie_key . "' ");
		break;
	default:
		break;
}
if(!$temp -> execute()){
	echo "Error";
	exit();
}
echo json_encode($temp->rowCount());




