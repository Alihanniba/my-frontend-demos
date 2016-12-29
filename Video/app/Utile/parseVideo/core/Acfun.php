<?php

namespace App\Utile\parseVideo\core;

class Acfun
{
    public static function parse($url)
    {
    	$vid = '';
        $html = Base::_cget($url);
        preg_match('#data-vid\s*=\s*"([^"]+)"#ms', $html, $vids);
        if (isset($vids[1])) {
        	return self::getVideo($vids[1]);
        } else {
        	return array(
        		'status' => false
        	);
        }
    }

    private static function getVideo($vid) {
    	$url = 'http://www.acfun.tv/video/getVideo.aspx?id=' . $vid;
    	$json = json_decode(Base::_cget($url), true);
    	switch($json['player']) {
    		case 'youku':
    			/** get assign */
    			$url = 'https://api.youku.com/players/custom.json?client_id=908a519d032263f8&video_id=' . $json['sourceId'];
    			$result = json_decode(Base::_cget($url), true);
    			$assign = $result['playsign'];

    			$link = 'http://play.youku.com/partner/get.json?vid=' . $json['sourceId'] . '&ct=85&sign=' . $assign . '&ran=' . rand(1000, 9999);

    			$retval = Base::_cget($link);
        		$bretval = Base::_cget($link);

        		var_dump(Youku::extract($retval, $bretval, $json['sourceId']));exit;

    			break;
    		default:
    			return array(
    				'status' => false
    			);
    			break;
    	}
    }

}
