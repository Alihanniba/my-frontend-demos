<?php

namespace App\Utile\parseVideo\core;

class Bilibili
{

    public static function parse($url)
    {
        $av = str_replace('?tg', '', substr($url, strpos($url, 'av'), strlen($url) - strpos($url, 'av')));
        $avid = str_replace('av', '', $av);
        $avid = str_replace('/', '', $avid);

//        preg_match('#http://www.bilibilijj.com/Files/DownLoad/([=\w]+)?#ix', $html, $cids);
//        $cid = $cids[1];

        $parseUrl = 'http://www.ibilibili.com/video/' . $av;
        $html = Base::_cget($parseUrl);
        preg_match('#\s*cid\s*=\s*([^\']+)&amp;#', $html, $cids);
        preg_match_all('(<h4 class="media-heading">(.*)</h4>)', $html, $titles);
//        var_dump($cids);
        $cid = $cids[1];
        $title = trim($titles[1][0]);

        $getFlvApi = 'http://onijiang.sinaapp.com/getBiliFlv.php?cid=' . $cid . "&type=mp4";
        $result = json_decode(Base::_cget($getFlvApi), true);


//        var_dump($result);
        if ($result['code'] != '0')
            return false;
        else {
            $data = array();
            $data['seconds'] = '1';
            $data['title'] = $title;
            $data['high'] = array();
            $data['high'][] = $result['url'];
            $segaments = array();
            $segaments[] = array('seconds' => '1');
            $data['segaments']['high'] = $segaments;
            return $data;
        }
    }
}