<?php 
require("data.php");

$result = $dbh -> prepare("SELECT * from `alihanniba` WHERE (`display` = 1 OR `display` = 2) order by rand() limit 0,3");

if(!$result->execute()){
	echo " error";
}
$movieInfo = $result->fetchall();
echo json_encode($movieInfo);


