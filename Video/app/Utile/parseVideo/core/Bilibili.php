<?php

namespace App\Utile\parseVideo\core;

class Bilibili
{
    public static function parse($url)
    {
        // $html = Base::_cget($url);
        // echo $html;exit;
        // preg_match_all('(<meta itemprop="thumbnailUrl" rel="media:thumbnail" content=".*">)', $html, $imgs);

        $av = str_replace('?tg', '', substr($url, strpos($url, 'av'), strlen($url) - strpos($url, 'av')));
        $avid = str_replace('av', '', $av);
        $avid = str_replace('/', '', $avid);

//        preg_match('#http://www.bilibilijj.com/Files/DownLoad/([=\w]+)?#ix', $html, $cids);
//        $cid = $cids[1];

        $parseUrl = 'http://www.ibilibili.com/video/'.$av;
        $html = Base::_cget($parseUrl);
        // echo $html;exit;
        preg_match('#\s*cid\s*=\s*([^\']+)&amp;#', $html, $cids);
        preg_match_all('(<h4 class="media-heading">(.*)</h4>)', $html, $titles);
        preg_match_all('(<a href="(.*)" target="_blank">截图</a>)', $html, $imgs);
     
        // var_dump($cids);exit;
     
        // preg_match_all('(<a href\s*=\s*"(.*)"\s*>视频下载)', $html, $urls);
        // preg_match_all('(<h4 class="modal-title"\s*id="myModalLabel"\s*>(.*)</h4>)', $html, $titles);
        // $data = array();
        // $data['seconds'] = '9999999';
        // if (sizeof($imgs[1]) != 0) {
        //     $data['img'] = $imgs[1][0];
        // } else {
        //     $data['img'] = 'http://share.soundtooth.cn/bilibili.png';
        // }
        // // echo $html;exit;
        // if (sizeof($titles[1]) != 0) {
        //     $data['title'] = $titles[1][0];
        // }
        // $data['high'] = array();
        // if (sizeof($urls[1]) != 0) {
        //     $data['high'][] = $urls[1][0];
        // }
        // $segaments = array();
        // $segaments[] = array('seconds' => '9999999');
        // $data['segaments']['high'] = $segaments;

        /**
         * Old way to parse bilibili
         */
        if (empty($cids) || strpos($cids[1], 'cid')) {
            // echo $html; exit;
            preg_match_all('(<a href\s*=\s*"(.*)"\s*>视频下载)', $html, $urls);
            preg_match_all('(<h4 class="modal-title"\s*id="myModalLabel"\s*>(.*)</h4>)', $html, $titles);
            $data = array();
            $data['seconds'] = '9999999';
            if (sizeof($imgs[1]) != 0) {
                $data['img'] = $imgs[1][0];
            } else {
                $data['img'] = 'http://share.soundtooth.cn/bilibili.png';
            }
            // echo $html;exit;
            if (sizeof($titles[1]) != 0) {
                $data['title'] = $titles[1][0];
            }
            $data['high'] = array();
            if (sizeof($urls[1]) != 0) {
                $data['high'][] = $urls[1][0];
            }
            $segaments = array();
            $segaments[] = array('seconds' => '9999999');
            $data['segaments']['high'] = $segaments;
        } else {
            $cid = $cids[1];
            if (sizeof($imgs[1]) != 0) {
                $img = $imgs[1][0];
            }
            if (sizeof($titles[1]) != 0) {
                $title = $titles[1][0];
            }

            $getFlvApi = 'http://www.ibilibili.com/api/bilibili/get_real_path.php?cid='.$cid.'&type=mp4';
            $result = json_decode(Base::_cget($getFlvApi), true);
            // var_dump($result);exit;
            if ($result['code'] != '0') {
                return array (
                    'status' => false
                );
            } else {
                $data = array();
                $data['img'] = $img;
                $data['title'] = $title;
                $data['seconds'] = '9999999';
                $data['high'] = array();
                $data['high'][] = $result['url'];
                $segaments = array();
                $segaments[] = array('seconds' => '9999999');
                $data['segaments']['high'] = $segaments;
            }
        }
        $data['status'] = true;
        return $data;
    }
}
