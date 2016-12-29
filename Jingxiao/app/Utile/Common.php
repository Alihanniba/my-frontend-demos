<?php
namespace App\Utile;

/**
* 
*/
class Common
{
    
	public static function curlCall($postUrl, $postData)
    {
        $curl_handle = curl_init();
        curl_setopt($curl_handle, CURLOPT_URL, $postUrl);
        curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $postData);
        $result = curl_exec($curl_handle);
        curl_close($curl_handle);
        return $result;
    }
}