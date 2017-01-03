<?php
namespace App\Utile\parseVideo\core;

use App\Model\Parse\SohuSVP;

class Sohu
{

    public static function parse($url)
    {
        if (strpos($url, 'vid=')) {
            $vid = str_replace('vid=', '', substr($url, strpos($url, 'vid='), strlen($url) - strpos($url, 'vid=')));
            return self::getVideInfo($vid);
        }
        $html = Base::_cget($url);
        $vids = $data = array();
        preg_match('#\s*vid=\s*"([^"]+)"#', $html, $vids);
        if (is_array($vids) && !empty($vids[1])) {
            $vid = $vids[1];
            return self::getVideInfo($vid);
        } else {
            preg_match('#\s*vid\s*=\s*\'([^\']+)\'#', $html, $vids);
            if (is_array($vids) && !empty($vids[1])) {
                $vid = $vids[1];
                return self::getVideInfo($vid);
            } else {
                return array (
                    'status' => false,
                    'type' => 1
                );
            }
        }
    }


    private static function charCodeAt($str, $index)
    {
        $char = mb_substr($str, $index, 1, 'UTF-8');
        
        if (mb_check_encoding($char, 'UTF-8'))
        {
            $ret = mb_convert_encoding($char, 'UTF-32BE', 'UTF-8');
            return hexdec(bin2hex($ret));
        }
        else
        {
            return null;
        }
    }

    private static function fromCharCode($codes) {
        if (is_scalar($codes)) {
            $codes= func_get_args();
        }
        $str= '';
        foreach ($codes as $code) {
            $str.= chr($code);
        }
        return $str;
    }

    private static function shift_en ($str, $array) {
        // var_dump($vid);exit;
        $t = sizeof($array);
        $e = 0;
        $return = '';
        for ($i = 0; $i < strlen($str); $i++) {
            $a = self::charCodeAt($str, $i);
            $n = 65;
            $o = 26;

            if ($a >= 97) {
                $n = 97;
            } else {
                if (65 > $a) {
                   $n = 48;
                   $o = 10; 
                }  
            }
            $r = $a - $n;
            $return .= self::fromCharCode(($r + $array[$e++ % $t]) % $o + $n);
        }
        return $return;
    }

    private static function getMillisecond()
    {
        list($t1, $t2) = explode(' ', microtime());
        return (float)sprintf('%.0f', (floatval($t1) + floatval($t2)) * 1000);
    }

    private static function convertM3u8($vid, $uid, $url, $key, $sig)
    {
        $return = preg_replace('(ipad\d+\_\d+_\d+.)', 'ipad' . (intval($vid) + 1) . '_' . $sig . '_' . $key . '.', $url);
        $return = str_replace("plat=h5&playType=p2p", "", $return);
        $sohusvp = self::getCookieInfos();
        if ($sohusvp == '') {
            return '';
        }
        $return .= 'plat=17&uid=' . $uid . '&vid=' . $vid . '&SOHUSVP=' . $sohusvp . '&pt=3&prod=h5&pg=1&eye=0&cv=1.0.0&qd=680&src=1105&ca=4&cateCode=106&_c=1';
        return $return;
    }
    // http://hot.vrs.sohu.com/ipad2741456_4650339979757_5952777.m3u8?plat=17&vid=2741455&uid=1512012253445128&SOHUSVP=TT9NWx8CqN5eMT1P9sBcyLvM1whMaBYUSkoKjylcVr_InHE7K1OObQ&pt=3&prod=h5&pg=1&eye=0&cv=1.0.0&qd=680&src=1105&ca=4&cateCode=101&_c=0

    private static function get_m3u8_url ($vid)
    {
        $access_key = self::shift_en($vid, [23, 12, 131, 1321]);
        $real_key = self::shift_en($vid + 1, [23, 12, 131, 1321]);
        $sig = self::shift_en(strval(self::getMillisecond()), [23, 12, 131, 1321]);
        $uid = '1512012253445128';
        $url = 'http://pad.tv.sohu.com/playinfo?vid=' . $vid . '&playlistid=0' . '&sig=' . $sig . '&key=' . $access_key . '&uid=' . $uid;
        $content = Base::_cget($url);
        
        preg_match('("highVid"\s*:\s*"([^"]+)")', $content, $high_M3U8s);
        preg_match('("norVid"\s*:\s*"([^"]+)")', $content, $normal_M3U8s);
        preg_match('("superVid"\s*:\s*"([^"]+)")', $content, $super_M3U8s);
        if (isset($high_M3U8s[1])) {
            $high_M3U8 = self::convertM3u8($vid, $uid, $high_M3U8s[1], $real_key, $sig);
        }
        
        if (isset($normal_M3U8s[1])) {
            $normal_M3U8 = self::convertM3u8($vid, $uid, $normal_M3U8s[1], $real_key, $sig);
        }

        if (isset($super_M3U8s[1])) {
            $super_M3U8 = self::convertM3u8($vid, $uid, $super_M3U8s[1], $real_key, $sig);
        }

        return array(
            'high_M3U8' => $high_M3U8,
            'normal_M3U8' => $normal_M3U8,
            'super_M3U8' => $super_M3U8
        );
    }

    /**
     * [getCookieInfos: get sohusvp for m3u8 by vid]
     * @param  [type] $vid [description]
     * @return [type]      [description]
     */
    private static function getCookieInfos()
    {
        // 初始化CURL
        $userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4';
        // $cookie = 'sohu_mvp=1; IPLOC=CN6100; SUV=1512021024235419; localChannelInfo=[{"appointUrl":"https://itunes.apple.com/cn/app/sou-hu-shi-pin-gao-qing/id458587755?mt=8","startapp":"1","channelSrc":1106,"cover":1,"isClosed":0,"timeLimit":0,"channelNum":680,"cid":"","quality":"nor,hig,sup","time":' . self::getMillisecond() . '}]; SOHUSVP=TT9NWx8CqN6sfBNk54GDwLoQFvvz13OcMBNV3xA9VGbZP_hniXx9Cw; Hm_lvt_9874e9bc062a4a65ffe25b80aa62eaa6=1449020634,1449021792,1449022433,1449023060; Hm_lpvt_9874e9bc062a4a65ffe25b80aa62eaa6=' . time() . '; MTV_SRC=11060001; _channeled=1212120001';
        // $referrer = 'http://m.tv.sohu.com/v2741623.shtml';
        // $url = 'http://m.tv.sohu.com/svp/mysugar?callback=jsonpx1&vid=2741623&uid=1512021024235419&pt=3&_=' . self::getMillisecond();
        // // $url = 'http://m.tv.sohu.com/svp/mysugar?callback=jsonpx1&vid=' . $vid . '&uid=' . $uid . '&pt=3&_=' . self::getMillisecond();
        // $result = shell_exec('/usr/bin/curl -I "' . $url . '" -A "' . $userAgent . '" --cookie "' . $cookie . '" -e "' . $referrer . '" -H "Host: m.tv.sohu.com"  2>&1 &');
        // preg_match('#SOHUSVP\s*=\s*(.*); domain#', $result, $svps);
        // /* get aid */
        // $url = 'http://m.tv.sohu.com/svp/video/info/2741623.json?callback=jsonpx2&api_key=&plat=&sver=&partner=&site=1&_=' . self::getMillisecond();

        // $result = Base::_cget($url);
        // preg_match('#"aid"\s*:\s*(\d*)(?=,)#', $result, $aids);

        // /* registration */
        // if (isset($svps[1]) && isset($aids[1])) {
        //     $url = 'http://m.tv.sohu.com/svp/play/url/2741623.json?callback=jsonpx3&site=1&cateCode=101&uid=1512021024235419&_c=1&pt=3&qd=680&src=1105&SOHUSVP='. $svps[1] . '&aid=' . $aids[1] . '&plat=17&appid=tv&_=' . self::getMillisecond();
        //     $result = Base::_cget($url);
        //     var_dump($svps[1]);exit;
        // } else {
        //     echo 'error get svp';
        //     exit;
        // }
        $sohusvp = SohuSVP::find(1);
        $ctime = time();
        if ($ctime > $sohusvp->ctime + 3 * 60 * 60) {
            return '';
        } else {
            return $sohusvp->SOHUSVP;
        }
    }
    /**
     * [getVideInfo 获得视频相关信息]
     * @param  [type] $vid [description]
     * @return [type]      [description]
     */
    private static function getVideInfo($vid)
    {
        //swf播放地址 http://tv.sohu.com/upload/swf/20131017/Main.swf?vid=1365644
        //搜狐视频api http://hot.vrs.sohu.com/vrs_flash.action?vid=1363984&af=1&uid=13823401060045028275&out=-1&g=8&referer=&t=0.40577955078333616
        //2013.10.21 搜狐存在备选ip 220.181.19.218、220.181.118.181、123.126.48.47、123.126.48.48
        $sub_ip = array('220.181.118.53', '220.181.19.218', '220.181.118.181', '123.126.48.47', '123.126.48.48');
        $ip_status = self::rolling_curl_code($sub_ip); //curl 并发获得ip是否可以访问，返回的都可以访问
        $sub_ip = array_keys($ip_status);//提取ip
        /* //对每个ip 进行访问 get_headers获得每个ip的 http状态码，确认是否可以访问
        foreach ($sub_ip as $k => $ip){
            $url  = "http://{$ip}";  //判断ip是否可以访问
            $header_array = array();
            $header_array = @get_headers($url);
            $is_ok = strpos($header_array[0], "OK");
            if(empty($header_array) || $is_ok == false){
                unset($sub_ip[$k]);
                sort($sub_ip);
            }
        }
        */

        $api_url = "http://" . $sub_ip[0] . "/vrs_flash.action?vid={$vid}&af=1&out=-1&g=8&r=2&t=0." . mt_rand(100, 999);
        $video_datas = json_decode(Base::_cget($api_url), true);
        // var_dump('http://hot.vrs.sohu.com/ipad' . $vid . '.m3u8');exit;
        if (is_array($video_datas) && !empty($video_datas['data'])) {
            $video_data = $video_datas['data'];
            $data['img'] = $video_data['coverImg'];
            $data['title'] = $video_data['tvName'];
            $data['seconds'] = $video_data['totalDuration'];
//			print_r($video_data);
            $segaments = array();
            foreach ($video_data['clipsDuration'] as $key => $value) {
                $segaments[] = array(
                    'seconds' => intval($value)
                );
            }
            $data['segaments']['high'] = $segaments;
            $data['segaments']['super'] = $segaments;
            $data['segaments']['normal'] = $segaments;
            $data['segaments']['fluent'] = $segaments;
            //获取不同清晰版本的视频地址
            if ($video_data['relativeId']) {
                $data['fluent'] = self::parseVideoUrl($video_data['relativeId'], $sub_ip);
            }
            if ($video_data['norVid']) {
                $data['normal'] = self::parseVideoUrl($video_data['norVid'], $sub_ip);
            }
            if ($video_data['highVid']) {
                $data['high'] = self::parseVideoUrl($video_data['highVid'], $sub_ip);
            }
            if ($video_data['superVid']) {
                $data['super'] = self::parseVideoUrl($video_data['superVid'], $sub_ip);
            }
            if ($video_data['oriVid']) {
                $data['original'] = self::parseVideoUrl($video_data['oriVid'], $sub_ip);
            }

            $m3u8s = self::get_m3u8_url($vid);
            if (!empty($m3u8s['high_M3U8'])) {
                $data['high_M3U8'] = $m3u8s['high_M3U8'];
            }
            if (!empty($m3u8s['normal_M3U8'])) {
                $data['normal_M3U8'] = $m3u8s['normal_M3U8'];
            }
            if (!empty($m3u8s['super_M3U8'])) {
                $data['super_M3U8'] = $m3u8s['super_M3U8'];
            }
            
            // $data['high_M3U8'] = '';
            // $data['normal_M3U8'] = '';
            // $data['super_M3U8'] = '';
            $data['status'] = true;
            return $data;
        } else {
            return array (
                'status' => false,
                'type' => 2
            );
        }
    }

    //拼接参数解析视频的方法
    private static function parseVideoUrl($vid, $sub_ip)
    {
        $api_url = "http://" . $sub_ip[0] . "/vrs_flash.action?vid={$vid}&out=0&g=8&r=2&t=0." . mt_rand(100, 999);
        $video_data = json_decode(Base::_cget($api_url), true);
        $rands = mt_rand(1, 22);
        $data = $urls = $data_urls = $params = array();
        if (is_array($video_data) && !empty($video_data)) {
            foreach ($video_data['data']['clipsURL'] as $key => $val) {
                $su_key = $video_data['data']['su'][$key];
                $url = "http://" . $video_data['allot'] . "/?prot=" . $video_data['prot'] . "&file=" . ltrim($val, "http://data.vod.itc.cn") . "&new=" . $su_key;
                $urls[$key] = $url;
                $params[$key]['su_key'] = 'http://14.215.106.11/sohu/s26h23eab6/xdispatch/sohu.vod.qingcdn.com' . $su_key;
                $params[$key]['rands'] = $rands;
                /*  //这里一次只能获取一段视频，速度慢
                $param_array = explode("|",Base::_cget($url));
                //视频截图地址 http://data.vod.itc.cn/preview?file=/233/52/28FAAL9Tq9UX9kOatm6bj7.mp4&start=28
                //相对视频地址 中间多了个thumb http://219.238.10.45/sohu/thumb/1/233/52/28FAAL9Tq9UX9kOatm6bj7.mp4?start=28&key=uGacwCdCKICxxJnliepKI_od5tZlsh3ONPL_ow..&n=13&a=4019&cip=101.39.251.131
                $video_url = substr($param_array[0],0,-1).$su_key."?start=&key=" .$param_array[3]."&n=".$rands."&a=4019";
                $data[] = $video_url;
                */
            }
            //curl 并发获取视频地址 排序
            $data_urls = self::rolling_curl_url($urls, $params);
            ksort($data_urls);
            $data = $data_urls;
            return $data;
        } else {
            return array (
                'status' => false,
                'type' => 3
            );
        }
    }

    //另外一种解析视频的方法 速度慢
    private static function parseVideoUrl2($vid, $sub_ip)
    {
        $data = $urls = $data_urls = array();
        $api_url = "http://" . $sub_ip[0] . "/vrs_flash.action?vid={$vid}&out=0&g=8&r=2&t=0." . mt_rand(100, 999);
        $video_data = json_decode(Base::_cget($api_url), true);
        if (is_array($video_data) && !empty($video_data)) {
            foreach ($video_data['data']['clipsURL'] as $key => $val) {
                $su_key = $video_data['data']['su'][$key];
                $url = "http://data.vod.itc.cn/preview?file=" . $su_key;
                $urls[] = $url;
                /*curl 获取header
                $headers = Base::getHeader($url);
                preg_match("#Location:\s*(.+)#",$headers,$locations);
                $param_array = $locations[1];
                */
                /* //一次获得一个视频地址的，速度慢
                $param_array = get_headers($url,1);
                //视频截图地址 http://data.vod.itc.cn/preview?file=/233/52/28FAAL9Tq9UX9kOatm6bj7.mp4&start=28
                //相对视频地址 中间多了个thumb http://219.238.10.45/sohu/thumb/1/233/52/28FAAL9Tq9UX9kOatm6bj7.mp4?start=28&key=uGacwCdCKICxxJnliepKI_od5tZlsh3ONPL_ow..&n=13&a=4019&cip=101.39.251.131
                $video_url = str_replace('/thumb/', '/',$param_array['Location']); //获得地址转向
                $data[] = $video_url;
                */
            }
            $data_urls = self::rolling_curl_url2($urls);
            ksort($data_urls); //获得数组根据key值排序
            $data = array_values($data_urls);
            $data['status'] = true;
            return $data;
        } else {
            return array (
                'status' => false,
                'type' => 4
            );
        }
    }

    /**
     * [rolling_curl_code curl并发获得ip 的http状态码]
     * @param  [type] $ips [description]
     * @return [type]      [description]
     */
    private static function rolling_curl_code ($ips)
    {
        $queue = curl_multi_init();
        $map = array();
        $url = null;
        foreach ($ips as $ip) {
            $ch = curl_init();
            $url = "http://{$ip}";
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_USERAGENT, Base::USER_AGENT);
            curl_setopt($ch, CURLOPT_NOSIGNAL, 1);
            curl_multi_add_handle($queue, $ch);
            $map[(string)$ch] = $ip; //将ip当作 数组的value
        }
        $responses = array();

        do {
            while (($code = curl_multi_exec($queue, $active)) == CURLM_CALL_MULTI_PERFORM);
            if ($code != CURLM_OK) {
                break;
            }
            // a request was just completed -- find out which one
            while ($done = curl_multi_info_read($queue)) {
                // get the info and content returned on the request
                $http_code = curl_getinfo($done['handle'], CURLINFO_HTTP_CODE); //获得HTTP 状态码
                //$error = curl_error($done['handle']); //获得错误信息
                //$results = curl_multi_getcontent($done['handle']); //获得结果
                if ($http_code != 404) {
                    $responses[$map[(string)$done['handle']]] = compact('http_code');
                }
                // remove the curl handle that just completed
                curl_multi_remove_handle($queue, $done['handle']);
                curl_close($done['handle']);
            }
            // Block for data in / output; error handling is done by curl_multi_exec
            if ($active > 0) {
                curl_multi_select($queue, 0.5);
            }
        } while ($active);
        curl_multi_close($queue);
        return $responses;
    }

    /**
     * [rolling_curl_url curl并发获取视频地址]
     * @param  [type] $urls [description]
     * @return [type]       [description]
     */
    private static function rolling_curl_url($urls, $params)
    {
        $queue = curl_multi_init();
        $map = $param_array = array();
        $i = 0;
        foreach ($urls as $url) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_USERAGENT, Base::USER_AGENT);
            curl_setopt($ch, CURLOPT_NOSIGNAL, 1);
            curl_multi_add_handle($queue, $ch);
            $map[(string)$ch] = $i; //将$i当作 数组的value
            $i += 1;
        }
        $responses = array();
        $video_url = null;
        do {
            while (($code = curl_multi_exec($queue, $active)) == CURLM_CALL_MULTI_PERFORM) ;
            if ($code != CURLM_OK) {
                break;
            }
            // a request was just completed -- find out which one
            while ($done = curl_multi_info_read($queue)) {
                // get the info and content returned on the request
                //$http_code = curl_getinfo($done['handle'],CURLINFO_HTTP_CODE); //获得HTTP 状态码
                //$error = curl_error($done['handle']); //获得错误信息
                $results = curl_multi_getcontent($done['handle']);//获得请求结果
                //拼接视频地址
                $param_array = explode("|", $results);
                $su_key = $params[$map[(string)$done['handle']]]['su_key'];
                $rands = $params[$map[(string)$done['handle']]]['rands'];
                //$video_url = substr($param_array[0],0,-1).$su_key."?start=&key=" .$param_array[3]."&n=".$rands."&a=4019";
                $video_url = substr($param_array[0], 0, -1) . $su_key . "?start=&key=" . $param_array[0] . "&n=" . $rands . "&a=4019";
                $responses[$map[(string)$done['handle']]] = $video_url; //对结果处理
                // remove the curl handle that just completed
                curl_multi_remove_handle($queue, $done['handle']);
                curl_close($done['handle']);
            }
            // Block for data in / output; error handling is done by curl_multi_exec
            if ($active > 0) {
                curl_multi_select($queue, 0.5);
            }
        } while ($active);
        curl_multi_close($queue);
        return $responses;
    }

    /**
     * [rolling_curl_url curl并发获取视频地址]
     * @param  [type] $urls [description]
     * @return [type]       [description]
     */
    private static function rolling_curl_url2($urls)
    {
        $queue = curl_multi_init();
        $map = array();
        $i = 0;
        foreach ($urls as $url) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_USERAGENT, Base::USER_AGENT);
            curl_setopt($ch, CURLOPT_NOSIGNAL, 1);
            curl_multi_add_handle($queue, $ch);
            $map[(string)$ch] = $i; //将$i当作 数组的value
            $i += 1;
        }
        $responses = array();

        do {
            while (($code = curl_multi_exec($queue, $active)) == CURLM_CALL_MULTI_PERFORM) ;
            if ($code != CURLM_OK) {
                break;
            }
            // a request was just completed -- find out which one
            while ($done = curl_multi_info_read($queue)) {
                // get the info and content returned on the request
                //$http_code = curl_getinfo($done['handle'],CURLINFO_HTTP_CODE); //获得HTTP 状态码 重定向为301
                //$error = curl_error($done['handle']); //获得错误信息
                $redirect_url = curl_getinfo($done['handle'], CURLINFO_REDIRECT_URL);//获得重定向URL;
                $responses[$map[(string)$done['handle']]] = str_ireplace('/thumb/', '/', $redirect_url); //对结果替换处理
                // remove the curl handle that just completed
                curl_multi_remove_handle($queue, $done['handle']);
                curl_close($done['handle']);
            }
            // Block for data in / output; error handling is done by curl_multi_exec
            if ($active > 0) {
                curl_multi_select($queue, 0.5);
            }
        } while ($active);
        curl_multi_close($queue);
        return $responses;
    }
}