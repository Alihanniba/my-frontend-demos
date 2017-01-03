<?php

/**
 * Created by PhpStorm.
 * User: aleen42
 * Date: 10/16/15
 * Time: 4:10 PM
 */

namespace App\Utile\parseVideo\core;

class Vimeo
{

    /**
     * @var array Vimeo video quality priority
     */
    public $vimeoQualityPrioritet = array('hd', 'sd', 'mobile', 'hls');

    /**
     * @var string Vimeo video codec priority
     */
    public $vimeoVideoCodec = 'h264';

    /**
     * Get direct URL to Vimeo video file
     *
     * @param string $url to video on Vimeo
     * @return string file URL
     */
    public function getVimeoDirectUrl($url)
    {
        $data = array();
        $videoInfo = $this->getVimeoVideoInfo($url);
        if ($videoInfo && $videoObject = $this->getVimeoQualityVideo($videoInfo->request->files)) {
            if (isset($videoObject['hd'])) {
                $data['super'] = array();
                $data['super'][] = $videoObject['hd']->url;
            }

            if (isset($videoObject['sd'])) {
                $data['high'] = array();
                $data['high'][] = $videoObject['sd']->url;
            }

            if (isset($videoObject['mobile'])) {
                $data['normal'] = array();
                $data['normal'][] = $videoObject['mobile']->url;
            }

            /**
             * new way to parse vimeo
             */
            if (isset($videoObject['720p'])) {
                $data['super'] = array();
                $data['super'][] = $videoObject['720p'];
            }

            if (isset($videoObject['360p'])) {
                $data['high'] = array();
                $data['high'][] = $videoObject['360p'];
            }

            if (isset($videoObject['270p'])) {
                $data['normal'] = array();
                $data['normal'][] = $videoObject['270p'];
            }
        }
        

//        var_dump($videoInfo->video->duration);
        $data['seconds'] = $videoInfo->video->duration;

        $data['img'] = $videoInfo->video->thumbs->base;
        $data['title'] = $videoInfo->video->title;
        $data['segaments'] = array();

        $data['segaments']['super'] = array();
        $data['segaments']['super'][] = $videoInfo->video->duration;
        $data['segaments']['high'] = array();
        $data['segaments']['high'][] = $videoInfo->video->duration;
        $data['segaments']['normal'] = array();
        $data['segaments']['normal'][] = $videoInfo->video->duration;

        if (isset($videoInfo->request->files->hls->hd)) {
            $data['high_M3U8'] = $videoInfo->request->files->hls->hd;
        }

        if (isset($videoInfo->request->files->hls->all)) {
            $data['normal_M3U8'] = $videoInfo->request->files->hls->all;
        }

        /**
         * new way to parse m3u8
         */
        if (isset($videoInfo->request->files->hls->url)) {
            $data['normal_M3U8'] = $videoInfo->request->files->hls->url;
        }

        $data['status'] = true;
        return $data;
    }

    /**
     * Get Vimeo video info
     *
     * @param string $url to video on Vimeo
     * @return \stdClass|null result
     */
    public function getVimeoVideoInfo($url)
    {
        $videoInfo = null;
        $page = $this->getRemoteContent($url);
        $dom = new \DOMDocument("1.0", "utf-8");
        libxml_use_internal_errors(true);
        $dom->loadHTML('<?xml version="1.0" encoding="UTF-8"?>' . "\n" . $page);
        $xPath = new \DOMXpath($dom);
        $video = $xPath->query('//div[@data-config-url]');
        if ($video) {
            $videoObj = json_decode($this->getRemoteContent($video->item(0)->getAttribute('data-config-url')));
            if (!property_exists($videoObj, 'message')) {
                $videoInfo = $videoObj;
            }
        }
        return $videoInfo;
    }

    /**
     * Get vimeo video object
     *
     * @param stdClass $files object of Vimeo files
     * @return stdClass Video file object
     */
    public function getVimeoQualityVideo($files)
    {
        $video = array();
        if (!property_exists($files, $this->vimeoVideoCodec) && property_exists($files, 'codecs') && count($files->codecs)) {
            $this->vimeoVideoCodec = array_shift($files->codecs);
            $codecFiles = $files->{$this->vimeoVideoCodec};
            foreach ($this->vimeoQualityPrioritet as $quality) {
                if (property_exists($codecFiles, $quality)) {
                    $video[$quality] = $codecFiles->{$quality};
                }
            }
        } else {
            $this->vimeoVideoCodec = 'progressive';
            $this->vimeoQualityPrioritet = array('720p', '360p', '270p');
            $codecFiles = $files->{$this->vimeoVideoCodec};
            foreach ($this->vimeoQualityPrioritet as $quality) {
                foreach ($codecFiles as $videos) {
                    if ($videos->quality == $quality) {
                        $video[$quality] = $videos->url;
                    }
                }
            }
        }
        if (!$video) {
            foreach (get_object_vars($codecFiles) as $file) {
                $video = $file;
                break;
            }
        }
        return $video;
    }

    /**
     * Get remote content by URL
     *
     * @param string $url remote page URL
     * @return string result content
     */
    public function getRemoteContent($url)
    {
        $output = file_get_contents($url);
        return $output;
    }

}