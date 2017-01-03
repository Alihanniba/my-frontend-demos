<?php

namespace App\Utile\parseVideo\core;

class Letv
{
    public static function parse($url)
    {	
        $html = Base::_cget($url);
  
        $vid = '';
        $vids = $data = $video_data = array();
        preg_match("#vid:\s*([\d]+),#ms", $html, $vids);
        $vid = $vids[1] ? trim($vids[1]) : '';
        if (empty($vid)) {
            return array(
                'status' => false,
            );
            exit(0);
        } else {
            $tkey = self::getKey(time());
            //通过解析 乐视 的xml 来获得视频地址 tkey值需要计算  
            $json_url = "http://api.letv.com/mms/out/video/playJson?id={$vid}&platid=1&splatid=101&format=1&tkey={$tkey}&domain=www.letv.com&dvtype=1000&accessyx=1";
            $video_data = json_decode(Base::_cget($json_url), true);
            $video_data = $video_data['playurl'];
            if ($video_data) {
                //存有视频的数组 有 dispatch dispatchbak dispatchbak1 dispatchbak2  这里使用 dispatch
                $domain = $video_data['domain'][0];
                if (is_array($video_data['dispatch']) && !empty($video_data['dispatch'])) {
                    foreach ($video_data['dispatch'] as $key => $val) {
                        //加上后面的参数才可以播放
                        if ($key == '350') {
                            $data['fluent'][] = self::getPlayUrl($domain, $val[0], $key);
                        }
                        if ($key == '1000') {
                            $normal = $val[0];
                            $data['normal'][] = self::getPlayUrl($domain, $val[0], $key);
                        }
                        // if ($key == '1300') {
                        //     $high = $val[0];
                        //     $data['high'][] = self::getPlayUrl($domain, $val[0], $key);
                        // }
                        // if ($key == '720p') {
                        //     $super = $val[0];
                        //     $data['super'][] = self::getPlayUrl($domain, $val[0], $key);
                        // }
                        // if ($key == "1080p") {
                        // 	$data['original'][] = Letv::getPlayUrl($domain, $val[0], $key);
                        // }
                    }
                    // $data['normal_M3U8'] = self::getM3U8Url($normal, '1000');
                    // $data['high_M3U8'] = self::getM3U8Url($high, '1300');
                    // $data['super_M3U8'] = self::getM3U8Url($super, '720p');
                }
                /* 
                 * segaments 
                 */

                $super = array();
                $high = array();
                $normal = array();
                $fluent = array();
                $super[] = array(
                    'seconds' => $video_data['duration'],
                );
                $high[] = array(
                    'seconds' => $video_data['duration'],
                );
                $normal[] = array(
                    'seconds' => $video_data['duration'],
                );
                $fluent[] = array(
                    'seconds' => $video_data['duration'],
                );

                $data['segaments'] = array(
                    'super' => $super,
                    'high' => $high,
                    'normal' => $normal,
                    'fluent' => $fluent,
                );
                $data['img'] = $video_data['pic'];
                $data['title'] = $video_data['title'];
                $data['seconds'] = $video_data['duration'];
                $data['status'] = true;

                return $data;
            } else {
                return array(
                    'status' => false,
                );
            }
        }
    }

    /**
     * [getM3U8Url: get the m3u8 url].
     *
     * @param [type] $type [description]
     *
     * @return [type] [description]
     */
    // public static function getM3U8Url($url, $hd)
    // {
    //     $tn = (mt_rand(10000, 99999) * 865);
    //     $url = 'http://g3.letv.cn'.$url.'&ctv=pc&m3v=1&termid=1&format=1&hwtype=un&ostype=MacOS10.11.0&tag=letv&sign=letv&expect=3&tn='.$tn.'&pay=0&iscpn=f9051&rateid='.$hd;
    //     $content = Base::_cget($url);
    //     $urls = json_decode($content, true);
    //     exit;
    //     if (isset($urls['nodelist'][0]['location'])) {
    //         return $urls['nodelist'][0]['location'];
    //     } else {
    //         return false;
    //     }
    // }

    /**
     * [parseXml 解析相关xml].
     *
     * @param [type] $url [description]
     *
     * @return [type] [description]
     */
    public static function parseXml($url)
    {
        $xml_str = Base::_cget($url);
        $xml_obj = @simplexml_load_string($xml_str);
        $playurl = $xml_obj->playurl;
        if (!empty($playurl)) {
            $play_str = strval($playurl);
            $play_json = json_decode($play_str, true);
            if (is_array($play_json)) {
                return $play_json;
            } else {
                return false;
            }
        } else {
            return  false;
        }
    }

    /**
     * [getKey 2015 letv tkey值的算法].
     *
     * @param [type] $t [时间戳]
     *
     * @return [type] [description]
     */
    private static function getKey($t)
    {
        // for ($e, $s = 0; $s < 8; $s++) {
        // 	$e = 1 & $t;
        // 	$t >>= 1; 
        // 	$e <<= 31; 
        // 	$t += $e;
        // }
        // return $t^185025305;
        $key = 773625421;
        $v = self::convKey($t, $key % 13);
        $v = $v ^ $key;
        $v = self::convKey($v, $key % 17);

        return $v;
    }

    private static function convKey($v, $key)
    {
        $rv = $v;
        for ($i = 0; $i < $key; ++$i) {
            $rv = (2147483647 & $rv >> 1) | ($rv & 1) << 31;
        }

        return $rv;
    }

    /**
     * [getPlayUrl 根据前面拿到的url 获得视频地址].
     *
     * @param [type] $url [description]
     *
     * @return [type] [description]
     */
    private static function getPlayUrl($domain, $url, $hd)
    {
        $url = str_replace('tss=ios', 'tss=no', $url).'&expect=3000';
        $tn = (mt_rand(10000, 99999) * 865);
        $url = $url.'&ctv=pc&m3v=1&termid=1&format=1&hwtype=un&ostype=window&tag=letv&sign=letv&expect=3&tn='.$tn.'&pay=0&iscpn=f9051&rateid=' . $hd;
        $content = Base::_cget($domain.$url, '', '', 'http://www.letv.com', false, '');
        $urls = json_decode($content, true);
        // $playJson = Base::_cget($url);
        // $urls = json_decode($playJson,true);
        if (isset($urls['nodelist'][1]['location'])) {
            return $urls['nodelist'][1]['location'];
        } else {
            return false;
        }
    }
}
