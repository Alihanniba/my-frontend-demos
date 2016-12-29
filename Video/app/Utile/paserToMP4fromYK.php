<?php

namespace App\Utile;

class Youku
{

    const USER_AGENT = "Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36";
    const REFERER = "http://www.youku.com";
    const FORM_ENCODE = "GBK";
    const TO_ENCODE = "UTF-8";
    private static $base = "http://v.youku.com/player/getPlaylist/VideoIDS/";
    private static $source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
    private static $sz = '-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1';
    private static $str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

    public static function parse($url)
    {
        preg_match("#id\_([\w=]+)#", $url, $matches); //id里可以有=号
        if (empty($matches)) {
            $html = self::_cget($url);
            preg_match("#videoId2\s*=\s*\'(\w+)\'#", $html, $matches);
            if (!$matches) return false;
        }
        //根据you vid 获取相应的视频地址
        return self::_getYouku(trim($matches[1]));
//        echo json_encode(trim($matches[1]));
//        $result = self::get_m3u8_url(trim($matches[1]), 'mp4');
//        echo json_encode($result);
//        exit;
    }

    /**
     * 25      * [_cget curl获取数据]
     * 26      * @param  [type]  $url     [url地址]
     * 27      * @param  boolean $convert [是否转换编码]
     * 28      * @param  integer $timeout [超时时间]
     * 29      * @return [type]           [description]
     * 30      */
    public static function _cget($url, $convert = false, $timeout = 10)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_USERAGENT, self::USER_AGENT);
        curl_setopt($ch, CURLOPT_REFERER, self::REFERER);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); //跟随301跳转
        curl_setopt($ch, CURLOPT_AUTOREFERER, 1); //自动设置referer
        $res = curl_exec($ch);
        curl_close($ch);
        if ($convert) {
            $res = mb_convert_encoding($res, self::TO_ENCODE, self::FORM_ENCODE);
        }
        return $res;
    }

    // curl
    public static function curl($url, $carry_header = true, $REFERER_ = 0, $add_arry_header = 0)
    {
        $ch = curl_init($url);
        if ($carry_header) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('User-Agent: Mozilla/5.0 (Windows NT 5.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.116 Safari/537.36'));
        }
        if ($add_arry_header) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $add_arry_header);
        }
        if ($REFERER_) {
            curl_setopt($ch, CURLOPT_REFERER, $REFERER_);
        }
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $get_url = curl_exec($ch);
        curl_close($ch);
        return $get_url;
    }

    // get m3u8
    priate static function get_m3u8_url($youku_ID, $type = 'flv')
    {
        $video_info = self::curl('http://v.youku.com/player/getPlayList/VideoIDS/' . $youku_ID . '/ctype/12/ev/1');
        $obj = json_decode($video_info);
        $vid = $obj->data[0]->videoid;
        $oip = $obj->data[0]->ip;
        $epdata = $obj->data[0]->ep;
        $youku_m3u8 = self::_calc_ep2($vid, $epdata);
        $m3u8_url = 'http://pl.youku.com/playlist/m3u8?vid=' . $vid . '&type=' . $type . '&ep=' . urlencode($youku_m3u8['ep']) . '&token=' . $youku_m3u8['token'] . '&ctype=12&ev=1&oip=' . $oip . '&sid=' . $youku_m3u8['sid'];
        echo $m3u8_url;
        return $m3u8_url;
    }

    public static function _calc_ep2($vid, $ep)
    {
        $e_code = self::yk_e('becaf9be', base64_decode($ep));
        $s_t = explode('_', $e_code);
        $sid = $s_t[0];
        $token = $s_t[1];
// $new_ep = trans_e('bf7e5f01', '%s_%s_%s' % ($sid.$vid.$token));
        $new_ep = self::yk_e('bf7e5f01', $sid . '_' . $vid . '_' . $token);
        $new_ep = base64_encode($new_ep); //可以换作下面代码
// $new_ep = iconv(‘gbk’, ‘UTF-8’, self::yk_d($new_ep));
        return array(
            'ep' => $new_ep,
            'token' => $token,
            'sid' => $sid,
        );
    }

    private static function yk_e($a, $c)
    {
        for ($f = 0, $i = 0, $e = '', $h = 0; 256 > $h; $h++) {
            $b[$h] = $h;
        }
        for ($h = 0; 256 > $h; $h++) {
            $f = (($f + $b[$h]) + self::charCodeAt($a, $h % strlen($a))) % 256;
            $i = $b[$h];
            $b[$h] = $b[$f];
            $b[$f] = $i;
        }
        for ($q = ($f = ($h = 0)); $q < strlen($c); $q++) {
            $h = ($h + 1) % 256;
            $f = ($f + $b[$h]) % 256;
            $i = $b[$h];
            $b[$h] = $b[$f];
            $b[$f] = $i;
            $e .= self::fromCharCode(self::charCodeAt($c, $q) ^ $b[($b[$h] + $b[$f]) % 256]);
        }
        return $e;
    }

//start 获得优酷视频需要用到的方法
    private
    static function getSid()
    {
        $sid = time() . (mt_rand(0, 9000) + 10000);
        return $sid;
    }

    private static function getKey($key1, $key2)
    {
        $a = hexdec($key1);
        $b = $a ^ 0xA55AA5A5;
        $b = dechex($b);
        return $key2 . $b;
    }

    private static function getFileid($fileId, $seed)
    {
        $mixed = self::getMixString($seed);
        $ids = explode("*", rtrim($fileId, '*')); //去掉末尾的*号分割为数组
        $realId = "";
        for ($i = 0; $i < count($ids); $i++) {
            $idx = $ids[$i];
            $realId .= substr($mixed, $idx, 1);
        }
        return $realId;
    }

    private static function getMixString($seed)
    {
        $mixed = "";
        $source = self::$source;
        $len = strlen($source);
        for ($i = 0; $i < $len; $i++) {
            $seed = ($seed * 211 + 30031) % 65536;
            $index = ($seed / 65536 * strlen($source));
            $c = substr($source, $index, 1);
            $mixed .= $c;
            $source = str_replace($c, "", $source);
        }
        return $mixed;
    }

    private static function yk_d($a)
    {
        if (!$a) {
            return '';
        }
        $f = strlen($a);
        $b = 0;
        $str = self::$str;
        for ($c = ''; $b < $f;) {
            $e = self::charCodeAt($a, $b++) & 255;
            if ($b == $f) {
                $c .= self::charAt($str, $e >> 2);
                $c .= self::charAt($str, ($e & 3) << 4);
                $c .= '==';
                break;
            }
            $g = self::charCodeAt($a, $b++);
            if ($b == $f) {
                $c .= self::charAt($str, $e >> 2);
                $c .= self::charAt($str, ($e & 3) << 4 | ($g & 240) >> 4);
                $c .= self::charAt($str, ($g & 15) << 2);
                $c .= '=';
                break;
            }
            $h = self::charCodeAt($a, $b++);
            $c .= self::charAt($str, $e >> 2);
            $c .= self::charAt($str, ($e & 3) << 4 | ($g & 240) >> 4);
            $c .= self::charAt($str, ($g & 15) << 2 | ($h & 192) >> 6);
            $c .= self::charAt($str, $h & 63);
        }
        return $c;
    }

    private static function yk_na($a)
    {
        if (!$a) {
            return '';
        }

        $h = explode(',', self::$sz);
        $i = strlen($a);
        $f = 0;
        for ($e = ''; $f < $i;) {
            do {
                $c = $h[self::charCodeAt($a, $f++) & 255];
            } while ($f < $i && -1 == $c);
            if (-1 == $c) {
                break;
            }
            do {
                $b = $h[self::charCodeAt($a, $f++) & 255];
            } while ($f < $i && -1 == $b);
            if (-1 == $b) {
                break;
            }
            $e .= self::fromCharCode($c << 2 | ($b & 48) >> 4);
            do {
                $c = self::charCodeAt($a, $f++) & 255;
                if (61 == $c) {
                    return $e;
                }
                $c = $h[$c];
            } while ($f < $i && -1 == $c);
            if (-1 == $c) {
                break;
            }
            $e .= self::fromCharCode(($b & 15) << 4 | ($c & 60) >> 2);
            do {
                $b = self::charCodeAt($a, $f++) & 255;
                if (61 == $b) {
                    return $e;
                }
                $b = $h[$b];
            } while ($f < $i && -1 == $b);
            if (-1 == $b) {
                break;
            }
            $e .= self::fromCharCode(($c & 3) << 6 | $b);
        }
        return $e;
    }


    private static function fromCharCode($codes)
    {
        if (is_scalar($codes)) {
            $codes = func_get_args();
        }
        $str = '';
        foreach ($codes as $code) {
            $str .= chr($code);
        }
        return $str;
    }

    private static function charCodeAt($str, $index)
    {
        static $charCode = array();
        $key = md5($str);
        $index = $index + 1;
        if (isset($charCode[$key])) {
            return $charCode[$key][$index];
        }
        $charCode[$key] = unpack('C*', $str);
        return $charCode[$key][$index];
    }

    private static function charAt($str, $index = 0)
    {
        return substr($str, $index, 1);
    }


    /**
     * 212      * [_getYouku description]
     * 213      * @param  [type] $vid [视频id]
     * 214      * @return [type]      [description]
     * 215      */
    public static function _getYouku($vid)
    {
        //$link = "http://v.youku.com/player/getPlayList/VideoIDS/{$vid}/Pf/4"; //获取视频信息json 有些视频获取不全(土豆网的 火影忍者)
        $blink = self::$base . $vid;
        $link = $blink . "/Pf/4/ctype/12/ev/1";
        $retval = self::_cget($link);
        $bretval = self::_cget($blink);
//        print_r(json_decode($retval, true));
//        exit;
        if ($retval) {
            $rs = json_decode($retval, true);
            $brs = json_decode($bretval, true);
            if (!empty($rs['data'][0]['error'])) {
                return false;  //有错误返回false
            }
            $data = array();
            $streamtypes = $rs['data'][0]['streamtypes'];  //可以输出的视频清晰度
            $streamfileids = $rs['data'][0]['streamfileids'];
            $seed = $rs['data'][0]['seed'];
            $segs = $rs['data'][0]['segs'];
            $ip = $rs['data'][0]['ip'];
            $bsegs = $brs['data'][0]['segs'];
            list($sid, $token) = explode('_', self::yk_e('becaf9be', self::yk_na($rs['data'][0]['ep'])));
            foreach ($segs as $key => $val) {
                if (in_array($key, $streamtypes)) {
                    foreach ($val as $k => $v) {
                        $no = strtoupper(dechex($v['no'])); //转换为16进制 大写
                        if (strlen($no) == 1) {
                            $no = "0" . $no;  //no 为每段视频序号
                        }
                        //构建视频地址K值
                        $_k = $v['k'];
                        if ((!$_k || $_k == '') || $_k == '-1') {
                            $_k = $bsegs[$key][$k]['k'];
                        }
                        $fileId = self::getFileid($streamfileids[$key], $seed);
                        $fileId = substr($fileId, 0, 8) . $no . substr($fileId, 10);
                        $ep = urlencode(iconv('gbk', 'UTF-8', self::yk_d(self::yk_e('bf7e5f01', ((($sid . '_') . $fileId) . '_') . $token))));
                        //判断后缀类型 、获得后缀
                        $typeArray = array("flv" => "flv", "mp4" => "mp4", "hd2" => "flv", "3gphd" => "mp4", "3gp" => "flv", "hd3" => "flv");
                        //判断视频清晰度
                        $sharpness = array("flv" => "normal", "flvhd" => "normal", "mp4" => "high", "hd2" => "super", "3gphd" => "high", "3gp" => "normal", "hd3" => "original"); //清晰度 数组
                        $fileType = $typeArray[$key];
                        $data[$sharpness[$key]][$k] = "http://k.youku.com/player/getFlvPath/sid/" . $sid . "_00/st/{$fileType}/fileid/" . $fileId . "?K=" . $_k . "&hd=1&myp=0&ts=" . ((((($v['seconds'] . '&ypp=0&ctype=12&ev=1&token=') . $token) . '&oip=') . $ip) . '&ep=') . $ep;;
                    }
                }
            }
            //返回 图片 标题 链接  时长  视频地址
            $data['img'] = $rs['data'][0]['logo'];
            $data['title'] = $rs['data'][0]['title'];
            $data['seconds'] = $rs['data'][0]['seconds'];
            $data['segaments'] = $rs['data'][0]['segs']['mp4'];
            return $data;
        } else {
            return false;
        }
    }
    //end  获得优酷视频需要用到的方法
}