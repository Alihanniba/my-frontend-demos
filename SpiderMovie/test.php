<?php
$value = $_POST['key'];

// 访问页面
$url = "http://www.alihanniba.com". $value;
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'MicroMessenger android');
$content = curl_exec($ch);
curl_close($ch);
//$pattern = "/'player'\,'(.*)'/U";
$pattern = "/'player'\,encodeURIComponent\('(.*)'\)/U";
preg_match($pattern, $content, $key);
$pattern2 = "/<title>(.*) \|/U";
preg_match($pattern2, $content, $title);


if ($key) {
    // echo "------------"."\n";
    // echo ++$counter. '. '. $title[1]."\n";

    // 获取iframe-src
    $url = "https://www.alihanniba.com/play1.php?key=".$key[1];
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'MicroMessenger android');
    curl_setopt($ch, CURLOPT_REFERER, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $content = curl_exec($ch);
    curl_close($ch);
    $pattern = '/source src="(.*)"/U';
    preg_match($pattern, $content, $video_url);
    // var_dump($video_url[1]);
    
    // echo $video_url[1];exit;

    // 获取视频真实地址
    if (!$video_url[1]) {
        echo 'error';
    }
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $video_url[1]);
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_USERAGENT, 'MicroMessenger android');
    curl_setopt($ch, CURLOPT_REFERER, $url);
    curl_setopt($ch, CURLOPT_NOBODY, true); 
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0); 
    // curl_setopt($ch, CURLOPT_MAXREDIRS, 1); 
    $content = curl_exec($ch);
    curl_close($ch);
    $pattern = "/Location: (.*)/";
    preg_match($pattern, $content, $targetURL);
    // echo $targetURL[1]."\n";

    // 乐视的视频还有一层跳转
    if (strstr($targetURL[1], 'letv') || strstr($targetURL[1], 'aixifan')) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, trim($targetURL[1]));
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'MicroMessenger android');
        curl_setopt($ch, CURLOPT_REFERER, $url);
        curl_setopt($ch, CURLOPT_NOBODY, true); 
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 0); 
        // curl_setopt($ch, CURLOPT_MAXREDIRS, 1); 
        $content = curl_exec($ch);
        curl_close($ch);
        $pattern = "/Location: (.*)/";
        preg_match($pattern, $content, $targetURL);
        // echo $targetURL[1]."\n";
    }
}

if (isset($targetURL[1])) {
    echo $video_url = $targetURL[1];
} else {
    exit;
}




