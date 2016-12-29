<?php 
$dbms='mysql';     //数据库类型
// $host='fenxiao.soundtooth.cn'; //数据库主机名
$host='localhost'; //数据库主机名
$dbName='www.alihanniba.com';    //使用的数据库
$user='www.alihanniba.com';      //数据库连接用户名
$pass='www.alihanniba.com';          //对应的密码
$dsn="$dbms:host=$host;dbname=$dbName";
$wechat = "撸电影";

try{
 $dbh=new PDO($dsn,$user,$pass);//初始化一个PDO对象
 $dbh->exec("SET NAMES utf8");
}catch(PDOException $e){
 die("Error!:".$e->getMessage()."<br>");
}
