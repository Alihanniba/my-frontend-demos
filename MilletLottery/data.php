<?php
/**
 *
 * @authors alihanniba          alihanniba@gmail.com
 * @date    2016-01-20 16:07:41
 * @version \www.alihanniba.com\
 */
$dbms='mysql';     //数据库类型
$host='alihanniba'; //数据库主机名
$dbName='millet';    //使用的数据库
$user='root';      //数据库连接用户名
$pass='alihanniba';          //对应的密码
$dsn="$dbms:host=$host;dbname=$dbName";



try{
    $dbh=new PDO($dsn,$user,$pass);//初始化一个PDO对象
    $dbh->exec("SET NAMES utf8");
}catch(PDOException $e){
    die("Error!:".$e->getMessage()."<br>");
}
