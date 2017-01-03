<?php
/**
 * Created by PhpStorm.
 * User: Allan
 * Date: 6/15/15
 * Time: 5:48 PM
 */
require_once('./api_config.inc.php');
class DBConn {

    static private $_db = null; // The same PDO will persist from one call to the next

    private function __clone() {} // disallow cloning the class

    static public function getConnection()
    {
        if (self::$_db == null) { // No PDO exists yet, so make one and send it back.
            try {
                self::$_db = new PDO('mysql:host='.DB_HOST.';dbname='.DB_NAME,DB_USERNAME,DB_PASSWORD,array(
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8",));
            } catch (PDOException $e) {

                die('<h1>Sorry. The Database connection is temporarily unavailable.</h1>');
            }
            return self::$_db;
        } else {
            return self::$_db;
        }
    }
}