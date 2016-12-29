<?php
namespace App\Utile\parseVideo\core;

class Hunantv
{
    public static function parse($url)
    {
        $html = Base::_cget($url);
        $videos = $infos = $data = $video_data = array();
        preg_match("#VIDEOINFO\s*=\s*(\{[\s\S]+?\})#ms", $html, $videos);
        //修复json 里面的 键值不能像 http:// 等 存在冒号的  否则会 修复失败
        $infos = json_decode(str_replace('"http"', 'http', preg_replace('@([\w_0-9]+):@', '"\1":', $videos[1])), true);
        if (empty($infos)) {
            return array(
                'status' => false,
            );
        } else {
            $limitrate = intval($infos['limit_rate'] * 1.2);
            // 通过拼接参数来获得视频地址
            $fhv_url = 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do?fid='.$infos['code'].'&limitrate='.$limitrate.'&file='.$infos['file'].'&fmt=2&pno=1';
            $m3u8_url = 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do?fid='.$infos['code'].'&limitrate='.$limitrate.'&file='.$infos['file'].'&fmt=6&pno=3&m3u8=1';
            if ($video_data) {
                $data['seconds'] = '1';
                $data['img'] = 'http://share.soundtooth.cn/hunantv.png';
                $normal = array();
                $normal[] = array(
                    'seconds' => '1',
                );
                $data['title'] = $infos['title'];
                $data['segaments'] = array(
                    'normal' => $normal,
                );
                $data['normal'][] = $video_data['info'];
                $data['status'] = true;
                return $data;
            } else {
                return array(
                    'status' => false,
                );
            }
        }
    }
}
