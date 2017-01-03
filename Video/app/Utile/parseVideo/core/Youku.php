<?php

namespace App\Utile\parseVideo\core;

use Illuminate\Support\Facades\Config;
use App\Http\Controllers\ListYouku\ListController;

class Youku {

//    protected static $cookieString = '';
//     protected static $cookieString = '__ysuid=144694840341310z; ykss=34ae3e56defa227d21fe0b42; __ali=1446948406920ILs; _l_lgi=105357105; u=lubov910847310; _youku_ad_crazy_taobao_count=2; __aliCount=1; premium_cps=989725802_2%7C471%7C83709%7C2288___; lottery_day=2015108; logCookieKey=invalid; __utmarea=; rpabtest=A-1446951679815; xreferrer=http://static.youku.com/paymentcenter/svip/build/svipIndex.html; premium_cps_vid=XODc5MzgwMDA4; P_F=1; P_T=1446958959; yktk=1%7C1446948445%7C15%7CaWQ6MTA1MzU3MTA1LG5uOmx1Ym92OTEwODQ3MzEwLHZpcDp0cnVlLHl0aWQ6NDk5ODcwNTk0LHRpZDo5MjU4NjUxNQ%3D%3D%7Cba2db94259ca719370be9f740795bbd5%7C7e0e5ce63c5accfbce4fec8324745a01c8227b67%7C1%7C1%7C1; advideo={"adv205916_3": 3, "adv205987_5": 2, "adv206012_2": 1, "adv206026_2": 1}; __hpage_style=0';
    protected static $cookieString = '';
    protected static $srcUrl = '';
    // protected static $cookieString = '__ysuid=14329058762787Y3; __tft=1443102486510; __vtft=1443102488309; __ali=1445916123237mnz; __aliCount=1; __lai=1445929384502U2Q; __xmft=1445929384502; P_L_M=2; ykss=e76938562e53439a272aeeb3; msgid_43=43; view=2; player_pos=805|50; u_l_v_t=872; visit=22dd1c7ae5f38758efc847e782aabb1b; __hpage_style=0; advideo={"adv205916_3": 2, "adv205987_5": 2, "adv206014_1": 2, "adv206014_2": 2, "adv206025_2": 2, "adv206026_2": 2, "adv206012_2": 2, "adv206025_1": 2, "adv206013_1": 1}; __utmarea=; rpabtest=A-1446620906087; _l_lgi=780897120; yktk=1%7C1446621105%7C15%7CaWQ6NzgwODk3MTIwLG5uOuS8mOmFt%2BeUqOaItzc4MDg5NzEyMCx2aXA6dHJ1ZSx5dGlkOjc4MDg5NzEyMCx0aWQ6MA%3D%3D%7Ca22380e6d09f99faf256280d839558ce%7C7f4220801d55ffc4e31b45ffcf4266bc00cb943f%7C1; u=%E4%BC%98%E9%85%B7%E7%94%A8%E6%88%B7780897120; premium_cps=3071279665_2%7C471%7C83764%7C3493_88%7C413%7C83423%7C2555__; xreferrer=http://v.youku.com/v_show/id_XOTAzNDk2Mzgw.html; premium_cps_vid=XOTEwNzI0ODA4; P_F=1; P_T=1446628325';
//    protected static $cookieString = '__ysuid=1447062520140DB2; ykss=f96b4056fe5387d11d32d1d8; __ali=1447062524000V5h; _l_lgi=83896465; yktk=1%7C1447062533%7C15%7CaWQ6ODM4OTY0NjUsbm465Yaw6Zuq6buR6bmwLHZpcDp0cnVlLHl0aWQ6NzEzNjY1OTcxLHRpZDo0ODgwNzE5NA%3D%3D%7C5d9fde112611ceb1ec7ef97f627df1e8%7Ce795b83a6677356b55e527053717ff6eae07d7df%7C1%7C1; __hpage_style=0; u=%E5%86%B0%E9%9B%AA%E9%BB%91%E9%B9%B0; __aliCount=1; _chanel_youku_ad_crazy_count_1=2; advideo={"adv205916_3": 1, "adv205987_5": 1, "adv206012_2": 2, "adv206026_2": 1}; premium_cps=3071281656_54%7C509%7C84315%7C3512___; xreferrer=http://static.youku.com/paymentcenter/svip/build/svipIndex.html; premium_cps_vid=XOTA0OTc1NDk2; P_F=1; P_T=1447069795; rpvid=1447062592942Oq3320-1447062598859';
	//直接获取优酷视频
	public static function parse($url, $mac) {
        // $ch = curl_init("http://www.youku.com"); //初始化
        // $cookie_jar = tempnam('/tmp','cookie');
        // curl_setopt($ch, CURLOPT_HEADER, 0);
        // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        // curl_setopt($ch, CURLOPT_COOKIEJAR, $cookie_jar);
        // curl_setopt($ch, CURLOPT_COOKIE, self::$cookieString);
        // curl_exec($ch);
        // self::$cookieString = file_get_contents($cookie_jar);
        // unlink($cookie_jar);
        self::$srcUrl = $url;
        $listYoukuController = new ListController();
        self::$cookieString = $listYoukuController->getCookieByMacAddress($mac);
        preg_match("#id\_([\w=]+)#", $url, $matches); //id里可以有=号
        if (empty($matches)) {
            $html = Base::_cget($url, '', '', '', false, self::$cookieString);
        
            preg_match("#vid\s*:\s*\'(\w+)\'#", $html, $matches1);
            preg_match("#videoId2\s*=\s*\'(\w+)\'#", $html, $matches2);
            if (!$matches1 && !$matches2) {
                return array(
                    'status' => false,
                    'type' => 1
                );
            } else {
                $matches = !$matches1 ? $matches2: $matches1;
            }
        }

        // return static::_getOldYouku(trim($matches[1]));

        if (strpos($matches[1], '_ev')) {
            $matches[1] = substr($matches[1], 0, strpos($matches[1], '_ev'));
        }
        //根据you vid 获取相应的视频地址
        // self::get_m3u8_url(trim($matches[1]), 'mp4');
        return static::_getYouku(trim($matches[1]));
	}

    //start 获得优酷视频需要用到的方法
    private static function getSid(){
        $sid = time().(mt_rand(0,9000)+10000);
        return $sid;
    }

    private static function getKey($key1,$key2){
        $a = hexdec($key1);
        $b = $a ^0xA55AA5A5;
        $b = dechex($b);
        return $key2.$b;
    }

    private static function getFileid($fileId, $seed){
        $mixed = static::getMixString($seed);
        $ids = explode("*",rtrim($fileId, '*')); //去掉末尾的*号分割为数组
        $realId = "";
        for ($i=0;$i<count($ids);$i++){
            $idx = $ids[$i];
            $realId .= substr($mixed,$idx,1);
        }  
        return $realId;
    } 

    private static function getMixString($seed){
        $mixed = "";
        $source = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890";
        $len = strlen($source);
        for($i=0;$i<$len;$i++){
            $seed = ($seed * 211 + 30031)%65536;
            $index = ($seed / 65536 * strlen($source));
            $c = substr($source,$index,1);
            $mixed .= $c;
            $source = str_replace($c,"",$source);
        }
        return $mixed;
    }
    private static function yk_d($a){
        if (!$a) {
            return '';
        }
        $f = strlen($a);
        $b = 0;
        $str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        for ($c = ''; $b < $f;) {
            $e = static::charCodeAt($a, $b++) & 255;
            if ($b == $f) {
                $c .= static::charAt($str, $e >> 2);
                $c .= static::charAt($str, ($e & 3) << 4);
                $c .= '==';
                break;
            }
            $g = static::charCodeAt($a, $b++);
            if ($b == $f) {
                $c .= static::charAt($str, $e >> 2);
                $c .= static::charAt($str, ($e & 3) << 4 | ($g & 240) >> 4);
                $c .= static::charAt($str, ($g & 15) << 2);
                $c .= '=';
                break;
            }
            $h = static::charCodeAt($a, $b++);
            $c .= static::charAt($str, $e >> 2);
            $c .= static::charAt($str, ($e & 3) << 4 | ($g & 240) >> 4);
            $c .= static::charAt($str, ($g & 15) << 2 | ($h & 192) >> 6);
            $c .= static::charAt($str, $h & 63);
        }
        return $c;
    }
    private static function yk_na($a){
        if (!$a) {
            return '';
        }
        $sz = '-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,62,-1,-1,-1,63,52,53,54,55,56,57,58,59,60,61,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,-1,-1,-1,-1,-1,-1,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,-1,-1,-1,-1,-1';
        $h = explode(',', $sz);
        $i = strlen($a);
        $f = 0;
        for ($e = ''; $f < $i;) {
            do {
                $c = $h[static::charCodeAt($a, $f++) & 255];
            } while ($f < $i && -1 == $c);
            if (-1 == $c) {
                break;
            }
            do {
                $b = $h[static::charCodeAt($a, $f++) & 255];
            } while ($f < $i && -1 == $b);
            if (-1 == $b) {
                break;
            }
            $e .= static::fromCharCode($c << 2 | ($b & 48) >> 4);
            do {
                $c = static::charCodeAt($a, $f++) & 255;
                if (61 == $c) {
                    return $e;
                }
                $c = $h[$c];
            } while ($f < $i && -1 == $c);
            if (-1 == $c) {
                break;
            }
            $e .= static::fromCharCode(($b & 15) << 4 | ($c & 60) >> 2);
            do {
                $b = static::charCodeAt($a, $f++) & 255;
                if (61 == $b) {
                    return $e;
                }
                $b = $h[$b];
            } while ($f < $i && -1 == $b);
            if (-1 == $b) {
                break;
            }
            $e .= static::fromCharCode(($c & 3) << 6 | $b);
        }
        return $e;
    }
    private static function yk_e($a, $c){
        for ($f = 0, $i, $e = '', $h = 0; 256 > $h; $h++) {
            $b[$h] = $h;
        }
        for ($h = 0; 256 > $h; $h++) {
            $f = (($f + $b[$h]) + static::charCodeAt($a, $h % strlen($a))) % 256;
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
            $e .= static::fromCharCode(static::charCodeAt($c, $q) ^ $b[($b[$h] + $b[$f]) % 256]);
        }
        return $e;
    }
    
    private static function fromCharCode($codes){
        if (is_scalar($codes)) {
            $codes = func_get_args();
        }
        $str = '';
        foreach ($codes as $code) {
            $str .= chr($code);
        }
        return $str;
    }
    private static function charCodeAt($str, $index){
        static $charCode = array();
        $key = md5($str);
        $index = $index + 1;
        if (isset($charCode[$key])) {
            return $charCode[$key][$index];
        }
        $charCode[$key] = unpack('C*', $str);
        return $charCode[$key][$index];
    }

    private static function charAt($str, $index = 0){
        return substr($str, $index, 1);
    }

    /**
     * [_calc_ep2 description]
     * @param  [type] $vid [description]
     * @param  [type] $ep  [description]
     * @return [type]      [description]
     */
    private static function _calc_ep2($vid, $ep)
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
    /**
     * [curl description]
     * @param  [type]  $url             [description]
     * @param  boolean $carry_header    [description]
     * @param  integer $REFERER_        [description]
     * @param  integer $add_arry_header [description]
     * @return [type]                   [description]
     */
    private static function curl($url, $carry_header = true, $REFERER_ = 0, $add_arry_header = 0)
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
    /**
     * [get_m3u8_url: to get m3u8]
     * @param  [type] $youku_ID [description]
     * @param  string $type     [description]
     * @return [type]           [description]
     */
    private static function get_m3u8_url($youku_ID, $type = 'flv')
    {
        $link = 'http://play.youku.com/play/get.json?vid=' . $youku_ID . '&ct=12&ev=1&ran=' . rand(1000, 9999);
        // $link = 'http://play.youku.com/play/get.json?vid=' . $youku_ID . '&ct=10&ev=1&ran=6130';
        $userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_0 like Mac OS X; en-us) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
        $video_info = Base::_cget($link, $userAgent, '', '', false, self::$cookieString);
        $obj = json_decode($video_info);
        
        if (isset($obj)) {
            $vid = $obj->data->id;
            $oip = $obj->data->security->ip;
            $epdata = $obj->data->security->encrypt_string;
            $youku_m3u8 = self::_calc_ep2($vid, $epdata);
            $m3u8_url = 'http://pl.youku.com/playlist/m3u8?vid=' . $vid . '&type=' . $type . '&ep=' . urlencode($youku_m3u8['ep']) . '&token=' . $youku_m3u8['token'] . '&ctype=12&ev=1&oip=' . $oip . '&sid=' . $youku_m3u8['sid'];
        } else {
            $m3u8_url = '';
        }        
        return $m3u8_url;
    }

    /**
     * [get_old_m3u8_url: old way to get m3u8]
     * @param  [type] $youku_ID [description]
     * @param  string $type     [description]
     * @return [type]           [description]
     */
    private static function get_old_m3u8_url($youku_ID, $type = 'flv')
    {
        $link = 'http://v.youku.com/player/getPlayList/VideoIDS/' . $youku_ID . '/ctype/12/ev/1';
        $video_info = self::curl();
        $obj = json_decode($video_info);
        if (isset($obj)) {
            $vid = $obj->data[0]->videoid;
            $oip = $obj->data[0]->ip;
            $epdata = $obj->data[0]->ep;
            $youku_m3u8 = self::_calc_ep2($vid, $epdata);
            $m3u8_url = 'http://pl.youku.com/playlist/m3u8?vid=' . $vid . '&type=' . $type . '&ep=' . urlencode($youku_m3u8['ep']) . '&token=' . $youku_m3u8['token'] . '&ctype=12&ev=1&oip=' . $oip . '&sid=' . $youku_m3u8['sid'];
        } else {
            $m3u8_url = '';
        }        
        return $m3u8_url;
    }

    /**
     * [_getNewYouku: old parse]
     * @param  [type] $vid [视频id]
     * @return [type]      [description]
     */
    public static function _getOldYouku($vid) {
        //$link = "http://v.youku.com/player/getPlayList/VideoIDS/{$vid}/Pf/4"; //获取视频信息json 有些视频获取不全(土豆网的 火影忍者)
        $base = "http://v.youku.com/player/getPlaylist/VideoIDS/";
        $blink = $base.$vid;
        $link = $blink."/Pf/4/ctype/12/ev/1";

        $retval = Base::_cget($link, '', '', '', false, self::$cookieString);
        $bretval = Base::_cget($blink, '', '', '', false, self::$cookieString);

        if ($retval) {
            $rs = json_decode($retval, true);
            $brs = json_decode($bretval, true);
            $rsData = $rs['data'];
            if (!empty($rsData[0]['error'])) {
                if (strpos($rsData[0]['error'], '请先登录')) {
                    return array (
                        'status' => false,
                        'member' => true
                    );
                }
                return array (
                    'status' => false,
                    'error' => $rsData[0]['error'],
                    'type' => 2,
                    'data' => $rsData,
                    'cookie' => self::$cookieString
                );
            }
            $data = array();

            $streamtypes = $rsData[0]['streamtypes'];  //可以输出的视频清晰度
            $streamfileids = $rsData[0]['streamfileids'];
            $seed = $rsData[0]['seed'];
            $segs = $rsData[0]['segs'];
            $ip = $rsData[0]['ip'];
            $videoid = $rsData[0]['videoid'];
            list($sid, $token) = explode('_', static::yk_e('becaf9be', static::yk_na($rsData[0]['ep'])));
            foreach ($segs as $key => $val) {
                if (in_array($key, $streamtypes)) {
                    foreach ($val as $k => $v) {
                        
                        $no = strtoupper(dechex($v['no'])); //转换为16进制 大写
                        if (strlen($no) == 1) {
                            $no ="0".$no;  //no 为每段视频序号
                        }
                        //构建视频地址K值
                        $_k = $v['k'];
                        if ((!$_k || $_k == '') || $_k == '-1') {
                            $_k = $bsegs[$key][$k]['k'];
                        }
                        $fileId = static::getFileid($streamfileids[$key], $seed);
                        $fileId = substr($fileId, 0, 8) . $no . substr($fileId, 10);
                        $ep = urlencode(iconv('gbk', 'UTF-8', static::yk_d(static::yk_e('bf7e5f01', ((($sid . '_') . $fileId) . '_') . $token))));
                        //判断后缀类型 、获得后缀
                        $typeArray = array("flv"=>"flv","mp4"=>"mp4","hd2"=>"flv","3gphd"=>"mp4","3gp"=>"flv","hd3"=>"flv");
                        //判断视频清晰度
                        $sharpness = array("flv"=>"normal","flvhd"=>"normal","mp4"=>"high","hd2"=>"super","3gphd"=>"high","3gp"=>"normal","hd3"=>"original"); //清晰度 数组
                        $fileType = $typeArray[$key];
                        $data[$sharpness[$key]][$k] = "http://k.youku.com/player/getFlvPath/sid/".$sid."_00/st/{$fileType}/fileid/".$fileId."?K=".$_k."&hd=1&myp=0&ts=".((((($v['seconds'].'&ypp=0&ctype=12&ev=1&token=').$token).'&oip=').$ip).'&ep=').$ep;;
                    }
                }
            }
            $img = json_decode(Base::_cget(Config::get('app.url') . '/listVideoInfo/' . $videoid), true);
            if (empty(self::$cookieString) && isset($img['user']) && strpos($img['user']['name'], '会员')) {
                $data['member'] = true;
            }
            // $data['img'] = isset($img['thumbnail_v2']) ? $img['thumbnail_v2'] : $img['thumbnail'];
            $data['title'] = $rs['data']['video']['title'];
            $data['seconds'] = round($rs['data']['video']['seconds']);
            
            $data['segaments'] = $segaments;

            $data['high_M3U8'] = self::get_m3u8_url($vid, 'mp4');
            $data['normal_M3U8'] = self::get_m3u8_url($vid, 'flv');
            $data['super_M3U8'] = self::get_m3u8_url($vid, 'hd2');
            // else
            //     $data['segaments'] = $rsData[0]['segs']['flv'];
            $data['status'] = true;
            return $data;
        } else {
            return array (
                'status' => false,
                'type' => 3
            );
        }
    }

    /**
     * [_getYouku description]
     * @param  [type] $vid [视频id]
     * @return [type]      [description]
     */
    public static function _getYouku($vid) {
        //$link = "http://v.youku.com/player/getPlayList/VideoIDS/{$vid}/Pf/4"; //获取视频信息json 有些视频获取不全(土豆网的 火影忍者)
        // $base = "http://v.youku.com/player/getPlaylist/VideoIDS/";
        $base = "http://play.youku.com/play/get.json?vid=";
        $blink = $base.$vid;
        // $link = $blink."/Pf/4/ctype/12/ev/1";
        $link = $blink . "&ct=12&ev=1&ran=" . rand(1000, 9999);
        $blink = $blink . "&ct=12&ran=" . rand(1000, 9999);


        // $reservedCookie = '__ysuid=1448340658072Ck1; __ali=14483420793898cP; __aliCount=1; __tft=1448347525217; __vtft=1448362438327; advideo={"adv205916_3": 1, "adv205987_5": 2, "adv206012_2": 1, "adv206025_1": 1, "adv206012_1": 2}; ykss=2a4f5456348d7a4813fc380e; u_l_v_t=0; msgid_48=48; logCookieKey=invalid; r="8MaZyz7N+UYvw0SPC+D/SzXMnaMxlduh9hOeuwsu+KjQ2OC4R+1Sk8g0xVvsDsDnlzUVT8d8P+oDFIqFtrFpag=="; P_F=1; view=1; _l_lgi=51838339; u=HurricaneZheng; yktk=1%7C1448367969%7C15%7CaWQ6NTE4MzgzMzksbm46SHVycmljYW5lWmhlbmcsdmlwOnRydWUseXRpZDo1NTE4MDYyODQsdGlkOjA%3D%7C135332e95a9c52805389143fdf386203%7C70c868cf301a888cd464f9de697448f51bab7d6b%7C1%7C1; P_T=1448375173; xreferrer=http://v.youku.com/v_show/id_XODc5ODU1OTAw.html?from=y1.2-2.2; premium_cps_vid=XMTM0MjQ2NjQ4OA%3D%3D';
        $referer = self::$srcUrl;
        $retval = Base::_cget($link, '', '', $referer, false, self::$cookieString);
        $bretval = Base::_cget($blink, '', '', $referer, false, self::$cookieString);

        return self::extract($retval, $bretval, $vid);
    }

    public static function extract($retval, $bretval, $vid) {
        if ($retval) {
            $rs = json_decode($retval, true);
            $brs = json_decode($bretval, true);
            $rsData = $rs['data']['stream'];
            $brsData = $rs['data']['stream'];
            if (!empty($rsData[0]['error'])) {
                if (strpos($rsData[0]['error'], '请先登录')) {
                    return array (
                        'status' => false,
                        'member' => true
                    );
                }
                return array (
                    'status' => false,
                    'error' => $rsData[0]['error'],
                    'type' => 2,
                    'data' => $rsData,
                    'cookie' => self::$cookieString
                );
            }
            $data = array();
            
            foreach ($rsData as $key => $values) {
                $streamtypes[] = $values['stream_type'];
                $streamfileids[] = $values['stream_fileid'];
                $segs[] = $values['segs'];
            }

            foreach ($brsData as $key => $values) {
                $bsegs =  $values['segs'];
            }
            
            $ip = $rs['data']['security']['ip'];
            $videoid = $rs['data']['id'];
            list($sid, $token) = explode('_', static::yk_e('becaf9be', static::yk_na($rs['data']['security']['encrypt_string'])));
            $segaments = array();
            //返回 图片 标题 链接  时长  视频地址
            foreach ($segs as $key => $val) {
                foreach ($val as $k => $v) {
                    $no = strtoupper(dechex($k)); //转换为16进制 大写
                    if (strlen($no) == 1) {
                        $no ="0".$no;  //no 为每段视频序号
                    }
                    //构建视频地址K值
                    $_k = $v['key'];
                    if ((!$_k || $_k == '') || $_k == '-1') {
                        $_k = $bsegs[$key]['key'];
                    }
                    // $fileId = static::getFileid($streamfileids[$key], $seed);
                    $fileId = $streamfileids[$key];
                    
                    $fileId = substr($fileId, 0, 8) . $no . substr($fileId, 10);
                    $ep = urlencode(iconv('gbk', 'UTF-8', static::yk_d(static::yk_e('bf7e5f01', ((($sid . '_') . $fileId) . '_') . $token))));
                    //判断后缀类型 、获得后缀
                    $typeArray = array("flv"=>"flv","flvhd"=>"flv","mp4"=>"mp4","hd2"=>"flv","3gphd"=>"mp4","3gp"=>"flv","hd3"=>"flv","mp4hd"=>"mp4","mp4hd2"=>"flv","mp4hd3"=>"flv");
                    //判断视频清晰度
                    $sharpness = array("flv"=>"normal","flvhd"=>"normal","mp4"=>"high","mp4hd"=>"high","mp4hd2"=>"super","hd2"=>"super","3gphd"=>"3gphigh","3gp"=>"normal","hd3"=>"original"); //清晰度 数组
                    $fileType = $typeArray[$streamtypes[$key]];
                    if (isset($sharpness[$streamtypes[$key]])) {
                        $data[$sharpness[$streamtypes[$key]]][$k] = "http://k.youku.com/player/getFlvPath/sid/".$sid."_00/st/{$fileType}/fileid/".$fileId."?K=".$_k."&hd=1&myp=0&ts=".(((((round($v['total_milliseconds_audio'] / 1000).'&ypp=0&ctype=12&ev=1&token=').$token).'&oip=').$ip).'&ep=').$ep;;
                        $segaments[$sharpness[$streamtypes[$key]]][] = array(
                            'seconds' => round($v['total_milliseconds_audio'] / 1000)
                        );
                    }
                }
            }
            $img = json_decode(Base::_cget(Config::get('app.url') . '/listVideoInfo/' . $videoid), true);
            if (empty(self::$cookieString) && isset($img['user']) && strpos($img['user']['name'], '会员')) {
                $data['member'] = true;
            }

            if (isset($img['thumbnail_v2'])) {
                $data['img'] = $img['thumbnail_v2'];
            } else if (isset($img['thumbnail'])) {
                $data['img'] = $img['thumbnail'];
            } else {
                $data['img'] = 'http://7xl1kb.com2.z0.glb.qiniucdn.com/tudou.png';
            }

            $data['title'] = $rs['data']['video']['title'];

            $data['seconds'] = round($rs['data']['video']['seconds']);
            
            $data['segaments'] = $segaments;
            // $data['cookie'] = self::$cookieString;
            $data['high_M3U8'] = self::get_m3u8_url($vid, 'mp4');
            $data['normal_M3U8'] = self::get_m3u8_url($vid, 'flv');
            $data['super_M3U8'] = self::get_m3u8_url($vid, 'hd2');
//            else
//                $data['segaments'] = $rsData[0]['segs']['flv'];
            $data['status'] = true;
            return $data;
        } else {
            return array (
                'status' => false,
                'type' => 3
            );
        }
    }
    //end  获得优酷视频需要用到的方法
}