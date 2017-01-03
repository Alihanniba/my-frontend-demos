<?php

namespace App\Utile\shortUrl;

/**
 * Created by PhpStorm.
 * User: aleen42
 * Date: 10/15/15
 * Time: 6:14 PM
 */
class dwz
{

    public static function shortUrl($inputUrl)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://dwz.cn/create.php");
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $postData = array(
            'url' => $inputUrl
        );

        curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
        $arrResponse = json_decode(curl_exec($ch), true);

        if ($arrResponse['status'] != 0) {
            return false;
        }

        $videoUrl = $arrResponse['tinyurl'];
        curl_close($ch);
        return $videoUrl;
    }
}

