<?php 
require_once("./Vendor/autoload.php");
use Qiniu\Auth;
use Qiniu\Storage\UploadManager;
use Qiniu\Storage\BucketManager;


  	$accessKey = 'www.alihanniba.com';
            	$secretKey = 'www.alihanniba.com';
            	$auth = new Auth($accessKey, $secretKey);
            	$bucket = 'www.alihanniba.com';
            	$opts = array(
                'callbackBodyType' => 'application/json'
            );
            $token = $auth->uploadToken($bucket, null, 3600, $opts);
            $uploadMgr = new UploadManager();
            $bucketManager = new BucketManager($auth);

            if (isset($_FILES["file"]['tmp_name']) && $_FILES["file"]['tmp_name']) {
                $image = $_FILES["file"]['tmp_name'];
                list($ret, $err) = $uploadMgr->putFile($token, null, $image);
                if ($err !== null) {
//                    echo('<script>alert(\'更新失败\')</script>');
                    $this->index();
                } else {
                    $img = "www.alihanniba.com" . $ret['key'];
                    echo json_encode("www.alihanniba.com" . $ret['key']);
                }
            }