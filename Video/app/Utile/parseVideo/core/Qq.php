<?php

namespace App\Utile\parseVideo\core;

class Qq
{

    const REFERER = "http://imgcache.qq.com/tencentvideo_v1/player/TencentPlayer.swf?max_age=86400&v=20130507";

    public static function parse($url)
    {
        $data = array();
        $title = $vid = $duration = '';
        if (preg_match("/vid=([^\_]+)/", $url)) {
            preg_match("/vid=([^\_]+)/", $url, $matches);
            $html = Base::_cget($url);
            $vid = $matches[1];
        } else {
            $html = Base::_cget($url);
            //视频播放页面获得相应的参数
            preg_match('/title:"([^"]+)"/s', $html, $titles);
            preg_match('/duration:"([^"]+)"/s', $html, $durations);
            preg_match('/vid:"([^"]+)"/s', $html, $vids);
            $title = (!empty($titles[1])) ? $titles[1] : '';
            if (sizeof($durations) != 0) {
                $duration = $durations[1];
            }
            if (sizeof($vids) != 0) {
                $vid = $vids[1];
            }
        }
        if ($vid) {
            $data = self::getVideoUrl($vid);
            if (!isset($data['status'])) {
                $data['status'] = true;
            }
            return $data;
        } else {
            return array (
                'status' => false
            );
        }
    }

    /**
     * [getHtml5video 获得手机版的到视频地址]
     * @param  [type] $vid [description]
     * @return [type]      [description]
     */
    private static function getHtml5video($vid)
    {
        $data = array();
        //腾讯 mp4 接口
        $req_url = "http://vv.video.qq.com/geturl?otype=json&vid={$vid}&charge=0";
        $json_str = Base::_fget($req_url);
        $video_info = json_decode(substr($json_str, strpos($json_str, "{"), -1), true);
        if ($video_info['s'] == 'o') {
            $data['high'][0] = $video_info['vd']['vi'][0]['url'];
            return $data['high'][0];
        }
        return false;
    }

    /**
     * [getVideoUrl 根据视频vid 获得视频地址]
     * @param  [type] $vid [description]
     * @return [type]      [description]
     */
    private static function getVideoUrl($vid)
    {
        $infos = self::getInfo($vid);
        $vi = $infos['vl']['vi'][0];
        $video_type = $infos['fl']['fi'];
        $counts = $vi['cl']['fc'];//当前视频的分段数
        $segaments = array(
            'super' => array(),
            'high' => array(),
            'normal' => array()
        );
        $sharpness = array("fhd" => 10209, "shd" => 10201, "hd" => 10202, "sd" => 10203); //视频清晰度
        $data = $datas = $data_videos = array();
        if ($counts != 0) {
            foreach ($vi['cl']['ci'] as $key => $values) {
                $segaments['super'][] = array(
                    'seconds' => intval(floor($values['cd']))
                );
                $segaments['high'][] = array(
                    'seconds' => intval(floor($values['cd']))
                );
                $segaments['normal'][] = array(
                    'seconds' => intval(floor($values['cd']))
                );
            }
        } else {
            if (self::getHtml5video($vid)) {
                $data['high'][0] = self::getHtml5video($vid);
                $data['high_M3U8'] = self::getM3U8($vid);
                $segaments['high'][] = array(
                    'seconds' => intval(floor($vi['td']))
                );
                $data['title'] = $vi['ti'];//标题
                $data['img'] = 'http://share.soundtooth.cn/tencent.png';
                $data['seconds'] = $infos['preview'];//时长
                $data['segaments'] = $segaments;
                $data['status'] = true;
            } else {
                $data['status'] = false;
            }
            return $data;
        }

        if ($vi['st'] == 2 && $vi['fst'] == 5 && $infos['s'] == 'o') {
            foreach ($video_type as $val) {
                if (in_array($val['name'], array_keys($sharpness))) {
                    for ($i = 1; $i <= $counts; $i++) {
                        $fmt = $val['name']; //视频类型
                        $format = $val['id']; //视频类型id
//                        $filename = substr($vi['fn'],0,-4).'.1'.substr($vi['fn'],-4); //这个 fn是变化的
                        $filename = urlencode($vid . ".p" . substr($format, 2) . ".{$i}.mp4");
                        $br = $vi['br'];
                        $vt = $vi['ul']['ui']['0']['vt'];
                        $path = $vi['ul']['ui']['0']['url'];
                        $datas[] = array('path' => $path, 'vid' => $vid, 'filename' => $filename, 'vt' => $vt, 'format' => $format, 'br' => $br, 'fmt' => $fmt);
                        /* 下面的方法 一次只返回一段视频地址 速度太慢
                        $keyjson = self::getKey($vid,$filename,$vt,$format);
                        if(!empty($keyjson['key'])){
                            //echo "获得视频段 {$fmt} {$i} ".date("Y-m-d H:i:s").PHP_EOL;
                            //videourl = infoData["path"] + infoData["fn"] + "?vkey=" + keyjson.key + "&br=" + infoData["br"] + "&platform=2&fmt=" + s.fmt + "&level=" + keyjson.level + "&sdtfrom=" + getMp4Key();
                            $videourl = $path.$filename."?vkey=".$keyjson['key']."&br=".$br."&platform=2&fmt=".$fmt."&level=".$keyjson['level']."&sdtfrom=v1000";
                            $data[$fmt][] = $videourl;
                        }
                        */
//                        var_dump($datas);
                    }
                }
            }
            $url = "http://vv.video.qq.com/getkey";
            $data_videos = self::rolling_curl($url, $datas);
            $normal = $original = $high = $super = array();
            foreach ($data_videos as $val) {
                if (empty($val['error'])) {
                    if ($val['results']['fmt'] == 'sd') $normal[$val['results']['id']] = $val['results']['url'];
                    if ($val['results']['fmt'] == 'fhd') $original[$val['results']['id']] = $val['results']['url'];
                    if ($val['results']['fmt'] == 'hd') $high[$val['results']['id']] = $val['results']['url'];
                    if ($val['results']['fmt'] == 'shd') $super[$val['results']['id']] = $val['results']['url'];
                }
            }
            //视频清晰度判定和视频排序
            if (!empty($normal)) {
                ksort($normal);
                sort($normal);
                $data['normal'] = $normal;
            }
            if (!empty($original)) {
                ksort($original);
                sort($original);
                $data['original'] = $original;
            }
            
            if (!empty($high)) {
                ksort($high);
                sort($high);
                $data['high'] = $high;
            }
            
            if (!empty($super)) {
                ksort($super);
                sort($super);
                $data['super'] = $super;
            } 
            $data['img'] = 'http://share.soundtooth.cn/tencent.png';
            $data['title'] = $vi['ti'];//标题
            $data['seconds'] = $infos['preview'];//时长
            $data['segaments'] = $segaments;
            $data['high_M3U8'] = self::getM3U8($vid);
            $data['status'] = true;
            return $data;
        }
    }

    /**
     * [createGUID 生成随机数]
     * @param  string $len [description]
     * @return [type]      [description]
     */
    private static function createGUID($len = '')
    {
        $len = $len ? $len : 32;
        $guid = "";
        for ($i = 1; $i <= $len; $i++) {
            $n = dechex(floor(mt_rand(0, 15)));
            $guid .= $n;
        }
        return $guid;
    }

    private static function getSpeed()
    {
        $data = array(
            "adspeed" => "0",
            "otype" => "json",
            "history" => "0,0," . time()
        );
        $url = "http://vv.video.qq.com/getspeed";
        $jsonStr = Base::_cget($url, Base::USER_AGENT, $data, self::REFERER);
        $jsonArr = json_decode(substr($jsonStr, strpos($jsonStr, '{'), -1), true);
        return $jsonArr;
    }

    //获得腾讯的 getifo 信息
    private static function getInfo($vid)
    {
        $data = array(
            "ran" => floatval('0.' . mt_rand(10000000, 90000000)),
            "charge" => "0",
            "pid" => self::createGUID(48),
            "fp2p" => "1",
            "otype" => "json",
            "platform" => "11",
            "appver" => "3.2.11.159",
            "vids" => $vid,
            "speed" => "0"
        );

        $url = "http://vv.video.qq.com/getinfo";
        $jsonStr = Base::_cget($url, Base::USER_AGENT, $data, self::REFERER);
//        var_dump($jsonStr);
        $jsonArr = json_decode(substr($jsonStr, strpos($jsonStr, '{'), -1), true);
        return $jsonArr;

    }

    private static function getM3U8($vid)
    {
        $url = "http://vv.video.qq.com/gethls?otype=json&vid=" . $vid;
        $result = Base::_cget($url);
        $result = substr($result, strpos($result, '{'), -1);
        $result = json_decode($result, true);
        if (isset($result['vd'])) {
            return $result['vd']['vi'][0]['url'];
        } else {
            return '';
        }
    }

    /**
     * [getKey  根据参数获得视频地址参数]
     * @param  [type] $vid      [description]
     * @param  [type] $filename [description]
     * @param  [type] $vt       [description]
     * @param  [type] $format   [description]
     * @return [type]           [description]
     */
    private static function getKey($vid, $filename, $vt, $format)
    {
        $url = "http://vv.video.qq.com/getkey";
        $data = array(
            "otype" => "json",
            "charge" => "0",
            "ran" => floatval('0.' . mt_rand(10000000, 90000000)),
            "filename" => $filename,
            "platform" => "11",
            "format" => $format,
            "vid" => $vid,
            "vt" => $vt,
            "defaultfmt" => "hd"
        );
        $jsonStr = Base::_cget($url, Base::USER_AGENT, $data, self::REFERER);
        $jsonArr = json_decode(substr($jsonStr, strpos($jsonStr, '{'), -1), true);
        return $jsonArr;
    }

    /**
     * [rolling_curl curl并发]
     * @param  [type] $urls  [urls数组]
     * @return [type]        [description]
     */
    private static function rolling_curl($url, $datas)
    {
        $queue = curl_multi_init();
        $map = $data = array();
        $i = 0;
        foreach ($datas as $val) {
            $data = array(
                "otype" => "json",
                "charge" => "0",
                "ran" => floatval('0.' . mt_rand(10000000, 90000000)),
                "filename" => $val['filename'],
                "platform" => "11",
                "format" => $val['format'],
                "vid" => $val['vid'],
                "vt" => $val['vt'],
                "defaultfmt" => "hd"
            );

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_REFERER, self::REFERER);
            curl_setopt($ch, CURLOPT_USERAGENT, Base::USER_AGENT);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_NOSIGNAL, 1);
            curl_multi_add_handle($queue, $ch);
            $map[(string)$ch] = $i;
            $i += 1;
        }
        $responses = array();

        do {
            while (($code = curl_multi_exec($queue, $active)) == CURLM_CALL_MULTI_PERFORM) ;
//            var_dump($code);
            if ($code != CURLM_OK) {
                break;
            }
            // a request was just completed -- find out which one
//            var_dump(curl_multi_info_read($queue));
            while ($done = curl_multi_info_read($queue)) {
                // get the info and content returned on the request
                //$info = curl_getinfo($done['handle']);
                $error = curl_error($done['handle']);
                $results = self::callback_parse(curl_multi_getcontent($done['handle']), $map[(string)$done['handle']], $datas[$map[(string)$done['handle']]]);
//                var_dump($results);
                $responses[$map[(string)$done['handle']]] = compact('error', 'results');
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
     * [callback_parse 回调拼接视频地址参数]
     * @param  [type] $json_str [description]
     * @param  [type] $id       [description]
     * @param  [type] $data     [description]
     * @return [type]           [description]
     */
    private static function callback_parse($json_str, $id, $data)
    {
        // var_dump(json_decode(substr($json_str, strpos($json_str, '{'), -1), true));exit;
        $json_arr = json_decode(substr($json_str, strpos($json_str, '{'), -1), true);
        $video_url = $data['path'] . $data['filename'] . "?vkey=" . $json_arr['key'] . "&br=" . $data['br'] . "&platform=2&fmt=" . $data['fmt'] . "&level=" . $json_arr['level'] . "&sdtfrom=v1000";
        return array('fmt' => $data['fmt'], 'id' => $id, 'url' => $video_url);
    }
}