<?php
namespace App\Utile;

/**
*
*/
class Common
{

    /**
     * 调用远程接口
     *
     * @param $postUrl
     * @param $postData
     * @return mixed
     */
    public function curlCall($postUrl, $postData,$cookie,$gzip = true)
    {
        $result = '';
        $i = 0;
        while(empty($result) && $i<3) {
            $i++;
            $curl_handle = curl_init();
            curl_setopt($curl_handle, CURLOPT_URL, $postUrl);
            curl_setopt($curl_handle, CURLOPT_CONNECTTIMEOUT, 2);
            curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
//          curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $postData);

            if($gzip) curl_setopt($curl_handle, CURLOPT_ENCODING, "gzip");

            if (!empty($cookie))
                curl_setopt($curl_handle,CURLOPT_COOKIE,$cookie);
            $result = curl_exec($curl_handle);
            curl_close($curl_handle);
        }

        return $result;
    }

    //删除空格
    public function trimall($str)
    {
        $qian = array(" ", "　", "\t", "\n", "\r");
        $hou = array("", "", "", "", "");
        return str_replace($qian, $hou, $str);
    }
}