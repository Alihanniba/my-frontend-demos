<?php

namespace App\Utile\parseVideo\core;

class Tudou
{

    public static function parse($url)
    {
        $html = Base::_cget($url);
        preg_match('#vcode:\s*"([=\w]+)"\s*#ix', $html, $vcode);
        if (!empty($vcode) && !empty($vcode[1])) {
            //判断视频是不是来自 优酷
            return Youku::_getYouku(trim($vcode[1]));
        } else {
            preg_match('#vcode:\s*\'([=\w]+)\'\s*#ix', $html, $vcode);
            if (!empty($vcode) && !empty($vcode[1])) {
                return Youku::_getYouku(trim($vcode[1]));
            }
        }
        /* 土豆改版 此方法失效 2013.10.17
        $api_url = "http://v2.tudou.com/v.action?ui=0&hd=100&sid={$areaCode}&vn=02&refurl=".urlencode($url)."&it=".$iid."&si=11000&pw=&st=1%2C2%2C3%2C5%2C99";
        */
        //现在根据土豆视频页面上的 segs 里的参数可以拼接地址 id为 segs里的k 获得相应清晰度的视频地址  http://v2.tudou.com/f?id=176466865&sid=10000&hd=3&sj=1
        $data = array();
        $time = $areaCode = $title = '';
     
        preg_match('#areaCode:\s\'(\d+)\'#', $html, $areaCodes); //获得地区id
        preg_match('#lid:\s(\d+)#', $html, $lid); //获得地区id
        preg_match('#iid:\s(\d+)#', $html, $iid); //获得地区id
//        print_r($areaCodes);
        $areaCode = $areaCodes[1] ? substr($areaCodes[1], 0, -1) : 10000;
//        preg_match('#segs:\s*\'([^\']+)\'#ms', $html, $segs);
        preg_match('#kw:\s*\'([^\']+)\'#ms', $html, $kws); //获得标题
        preg_match('#time:\s*\'([^\']+)\'#ms', $html, $times);
        
        if (!empty($times[1]) && is_array($times)) {
            $times_array = explode(":", $times[1]);
            if (count($times_array) == 2) {
                $time = intval($times_array[0]) * 60 + intval($times_array[1]);
            } else if (count($times_array) == 3) {
                $time = intval($times_array[0]) * 60 * 60 + intval($times_array[1]) * 60 + intval($times_array[2]);
            } else {
                $time = intval($times[1]);
            }

        }
        $title = (!empty($kws[1])) ? $kws[1] : '';
        $getURLString = 'http://www.tudou.com/outplay/goto/getItemSegs.action?iid=' . $iid[1];
        $curl_handle = curl_init($getURLString);
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_handle, CURLOPT_BINARYTRANSFER, true);
        $segs = json_decode(curl_exec($curl_handle), true);
        curl_close($curl_handle);

        if (!empty($segs)) {
            foreach ($segs as $key => $val) {
                foreach ($val as $k => $v) {
                    $api_url = "http://v2.tudou.com/f?id=" . $v['k'] . "&sid={$areaCode}&hd={$k}&sj=1";
                    $curl_handle = curl_init($api_url);
                    curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
                    curl_setopt($curl_handle, CURLOPT_BINARYTRANSFER, true);
                    $v_xml = curl_exec($curl_handle);
                    curl_close($curl_handle);
                    if (empty($v_xml)) {
                        return array (
                            'status' => false
                        );
                    }
                    $s_xml = @simplexml_load_string($v_xml);
                    if ($key == 2) {
                        $data['normal'][] = strval($s_xml);
                        $data['segaments']['normal'][] = $val[0]['seconds'] / 1000;
                    }
                    if ($key == 3) {
                        $data['high'][] = strval($s_xml);
                        $data['segaments']['high'][] = $val[0]['seconds'] / 1000;
                    }
                    if ($key == 5) {
                        $data['super'][] = strval($s_xml);
                        $data['segaments']['super'][] = $val[0]['seconds'] / 1000;
                    }
                    if ($key == 99) {
                        $data['original'][] = strval($s_xml);
                        $data['segaments']['original'][] = $val[0]['seconds'] / 1000;
                    }
                }
            }
            $data['title'] = $title; //土豆网已经变为utf-8编码了无需转码
            $data['seconds'] = $time;
            $data['status'] = true;
            return $data;
        } else {
            return array (
                'status' => false
            );
        }
    }
}