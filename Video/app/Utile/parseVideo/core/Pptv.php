<?php

namespace App\Utile\parseVideo\core;

class Pptv
{
    public static function parse($url)
    {
        $vid = '';
        $html = Base::_cget($url);
        preg_match('#"id":\s*([\d]+)#ms', $html, $vids);
        $vid = $vids[1] ? trim($vids[1]) : '';

        if ($vid) {
            return self::getVideoData($vid);
        } else {
            return array (
                'status' => false
            );
        }
    }

    private static function getVideoData($vid)
    {
        //pptv 接口 http://play.api.pptv.com/boxplay.api?cb=json&auth=mpptv&ver=2&id=16904252&ft=5&type=mpptv&platform=ikan&_=1382552026550
        /** old api */

        // foreach ($video_data['childNodes'] as $nodeVals) {
        //     //获得影片名称和视频文件参数 
        //     if ($nodeVals['tagName'] == 'channel') {
        //         $data['title'] = $nodeVals['nm'];
        //         $data['seconds'] = $nodeVals['dur'];
        //         foreach ($nodeVals['childNodes'] as $nodeVal) {
        //             if ($nodeVal['tagName'] == 'd') {
        //                 foreach ($nodeVal['childNodes'] as $node) {
        //                     if ($node['tagName'] == 'item') {
        //                         //获取视频文件参数地址
        //                         $file_array[$node['ft']]['file'] = $node['rid'];
        //                         $file_array[$node['ft']]['height'] = $node['height'];
        //                         $file_array[$node['ft']]['width'] = $node['width'];
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     //获得视频地址参数
        //     if ($nodeVals['tagName'] == 'dt') {
        //         foreach ($nodeVals['childNodes'] as $nodeVal) {
        //             //获取视频ip地址
        //             if ($nodeVal['tagName'] == 'sh') {
        //                 $file_array[$nodeVals['ft']]['host'] = $nodeVal['childNodes'][0];
        //             }
        //             //获取视频key值
        //             if ($nodeVal['tagName'] == 'key') {
        //                 $file_array[$nodeVals['ft']]['key'] = $nodeVal['childNodes'][0];
        //             }
        //         }
        //     }
        // }
        // $get_url = 'http://play.api.pptv.com/boxplay.api?cb=json&auth=mpptv&ver=2&id='.$vid.'&ft=5&type=mpptv&platform=ikan&_='.time().mt_rand(100, 999);
        // $video_json = rtrim(ltrim(Base::_cget($get_url), 'json ('), ');');
        
        $file_array = $data = array();
        
        $get_url = 'http://play.api.pptv.com/boxplay.api?auth=d410fafad87e7bbf6c6dd62434345818&userLevel=1&content=need_drag&id='.$vid.'&platform=android3&param=userType%3D1&k_ver=1.1.0.7932&sv=3.6.1&ver=1&type=phone.android&gslbversion=2';
        $video_data = self::parseXml($get_url);
        if (isset($video_data->channel)) {
        	$channel_array = (array)$video_data->channel;
        	$data['title'] = $channel_array['@attributes']['nm'];
        	$data['seconds'] = floor($channel_array['@attributes']['dur']);
	        for ($i = 0; $i < sizeof($video_data->channel->file->item); $i++) {
	        	$rid_array = (array)$video_data->channel->file->item[$i];	
	        	$sh_array = (array)$video_data->dt[$i]->sh;
	        	$key_array = (array)$video_data->dt[$i]->key;
	        	$drag_array = (array)$video_data->drag[$i];
	        	$seconds = array();
	        	if (isset($drag_array['sgm'])) {
	        		$for_array = (array)$drag_array['sgm'];
	        		foreach ($for_array as $key => $value ) {
		        		$seconds[] = array(
		        			'seconds' => floor($value['dur'])
		        		);
		        	}
	        	} else {
	        		$seconds[] = array(
	        			'seconds' => floor($channel_array['@attributes']['dur'])
	        		);
	        	}
	        	$file_array[] = array(
	        		'width' => $rid_array['@attributes']['width'],
	        		'file' => $rid_array['@attributes']['rid'],
	        		'host' => $sh_array[0],
	        		'key' => $key_array[0],
	        		'seconds' => $seconds
	        	);
	        }

        }
        $segaments = array();
        // $m3u8keys = self::getM3U8Keys($vid);
        if (!empty($file_array)) {
            foreach ($file_array as $key => $val) {
                //构建视频地址 视频地址不能带 key值 
                if ($key == 0) {
                    for ($i = 0; $i < sizeof($val['seconds']); $i++) {
                    	$data['normal'][] = 'http://' . $val['host'] . '/' . $i . '/' . $val['file'] . '?platform=android3&type=phone.android&k=' . $val['key'];
                    }
                    // $data['normal_M3U8'] = 'http://' . $val['host'] . '/' . str_replace('mp4', 'm3u8', $val['file']) .  '?version=4&type=m3u8.web.phone&k=' . $m3u8keys[$key];
                    $segaments['normal'] = $val['seconds'];
                }
                if ($key == 1) {
                    for ($i = 0; $i < sizeof($val['seconds']); $i++) {
                    	$data['high'][] = 'http://' . $val['host'] . '/' . $i . '/' . $val['file'] . '?platform=android3&type=phone.android&k=' . $val['key'];
                    }
                    // $data['high_M3U8'] = 'http://' . $val['host'] . '/' . str_replace('mp4', 'm3u8', $val['file']) .  '?version=4&type=m3u8.web.phone&k=' . $m3u8keys[$key];
                    $segaments['high'] = $val['seconds'];
                }
                if ($key == 2) {
                    for ($i = 0; $i < sizeof($val['seconds']); $i++) {
                    	$data['super'][] = 'http://' . $val['host'] . '/' . $i . '/' . $val['file'] . '?platform=android3&type=phone.android&k=' . $val['key'];
                    }
                    // $data['super_M3U8'] = 'http://' . $val['host'] . '/' . str_replace('mp4', 'm3u8', $val['file']) .  '?version=4&type=m3u8.web.phone&k=' . $m3u8keys[$key];
                    $segaments['super'] = $val['seconds'];
                }
                if ($key == 5) {
                    for ($i = 0; $i < sizeof($val['seconds']); $i++) {
                    	$data['fluent'][] = 'http://' . $val['host'] . '/' . $i . '/' . $val['file'] . '?platform=android3&type=phone.android&k=' . $val['key'];
                    }
                    $segaments['fluent'] = $val['seconds'];
                }
            }
            $data['segaments'] = $segaments;
            $data['img'] = 'http://share.soundtooth.cn/pptv.png';
            $data['status'] = true;
            return $data;
        } else {
            return array (
                'status' => false
            );
        }
    }

    /**
     * [getM3U8: get m3u8 key]
     * @param  [type] $vid [description]
     * @return [type]      [description]
     */
    private static function getM3U8Keys($vid) {
    	$get_url = 'http://web-play.pptv.com/webplay3-0-' . $vid . '.xml?version=4&type=m3u8.web.phone&rcc_id=v.pptv.com';
    	$userAgent = 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11A465 Safari/9537.53';
    	$video_data = self::parseXml($get_url);
    	$keys = array();
    	for ($i = 0; $i < sizeof($video_data->channel->file->item); $i++) {
    		$key_array = (array)$video_data->dt[$i]->key;
    		$keys[] = $key_array[0];
    	}
    	return $keys;
    }

    /**
     * [parseXml:get xml]
     * @param  [type] $url [description]
     * @return [type]      [description]
     */
    public static function parseXml($url)
    {
        $xml_str = Base::_cget($url);
        return @simplexml_load_string($xml_str);
        // return self::xml_to_array($xml_str);
    }

    /**
     * [xml_to_array: load xml into an array]
     * @param  [type] $xml [description]
     * @return [type]      [description]
     */
    public static function xml_to_array($xml)
    {
        $reg = '/<(\\w+)[^>]*?>([\\x00-\\xFF]*?)<\\/\\1>/';
        if (preg_match_all($reg, $xml, $matches)) {
            $count = count($matches[0]);
            $arr = array();
            for ($i = 0; $i < $count; ++$i) {
                $key = $matches[1][$i];
                $val = self::xml_to_array($matches[2][$i]);  // 递归
	            if (array_key_exists($key, $arr)) {
	                if (is_array($arr[$key])) {
	                    if (!array_key_exists(0, $arr[$key])) {
	                        $arr[$key] = array($arr[$key]);
	                    }
	                } else {
	                    $arr[$key] = array($arr[$key]);
	                }
	                $arr[$key][] = $val;
	            } else {
	                $arr[$key] = $val;
	            }
            }
            return $arr;
        } else {
            return $xml;
        }
    }
}
