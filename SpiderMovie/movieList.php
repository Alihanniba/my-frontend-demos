<?php 
	require("data.php");
	$result = $dbh -> prepare("SELECT * FROM `www.alihanniba.com` WHERE (`display` = 1 OR `display` = 2 OR `display` = 3 OR `display` = 4) ORDER BY sort_order DESC");
	if(!$result -> execute()){
		echo "Error";
	}
	$movieLst = $result->fetchall();
	echo json_encode($movieLst);
 ?>