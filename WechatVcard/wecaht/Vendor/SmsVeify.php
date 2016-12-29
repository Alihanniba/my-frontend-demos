<?php
/**
 * Created by PhpStorm.
 * User: Allan
 * Date: 5/11/15
 * Time: 10:06 AM
 */

define("API","https://api.sms.mob.com/sms/verify");
class SmsVeify {

// 配置项

    /**
     * 发起一个post请求到指定接口
     *
     * @param string $api 请求的接口
     * @param array $params post参数
     * @param int $timeout 超时时间
     * @return string 请求结果
     */

   public  function postRequest(array $params = array(), $timeout = 30 ) {
        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_URL, API );
        // 以返回的形式接收信息
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER, 1 );
        // 设置为POST方式
        curl_setopt( $ch, CURLOPT_POST, 1 );
        curl_setopt( $ch, CURLOPT_POSTFIELDS, http_build_query( $params ) );

        // 不验证https证书
        curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, 0 );
        curl_setopt( $ch, CURLOPT_SSL_VERIFYHOST, 0 );

        curl_setopt( $ch, CURLOPT_TIMEOUT, $timeout );

        curl_setopt( $ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/x-www-form-urlencoded;charset=UTF-8',
            'Accept: application/json',
        ) );

        // 发送数据
        $response = curl_exec( $ch );
        // 不要忘记释放资源
        curl_close( $ch );
        return $response;
    }
}