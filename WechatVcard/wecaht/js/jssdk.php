<?php
ini_set("display_errors", 1);

$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$access_token = get_access_token($redis);
$jsapi_ticket = get_jsapi_ticket($redis, $access_token);

function get_access_token($redis)
{
    $access_token = $redis->get('wechat_access_token');
    $access_token = json_decode($access_token);
    $expires = $redis->get('wechat_access_token_expires');
    if (isset($access_token->access_token)) {
        return $access_token->access_token;
    } else {
        $appid = 'wx131b06b8cdbe4111';
        $appsecret = 'd895a6f60e5cd1abaa93f513d57d34bc';
        $url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' . $appid . '&secret=' . $appsecret;
        $data = file_get_contents($url);
        $redis->set('wechat_access_token', $data, 3600);
        $json = json_decode($data);
        return $json->access_token;
    }
}

function get_jsapi_ticket($redis, $access_token)
{
    $ticket = $redis->get('wechat_jsapi_ticket');
    $ticket = json_decode($ticket);
    $expires = $redis->get('wechat_jsapi_expires');
    if (isset($ticket->ticket)) {
        return $ticket->ticket;
    } else {
        $appid = 'wx131b06b8cdbe4111';
        $appsecret = 'd895a6f60e5cd1abaa93f513d57d34bc';
        $url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' . $access_token . '&type=jsapi';
        $data = file_get_contents($url);
        $json = json_decode($data);
        if ($json->errcode) {
            $redis->set('wechat_access_token', '');
            $access_token = get_access_token($redis);
            $url = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=' . $access_token . '&type=jsapi';
            $data = file_get_contents($url);
        }
        $redis->set('wechat_jsapi_ticket', $data, 3600);
        $json = json_decode($data);
        return $json->ticket;
    }
}


// 微信jssdk签名方法
$appid = 'wx131b06b8cdbe4111';
$timestamp = time();
$nonceStr = 'Soundtooth';
//$url = urldecode($_GET['url']);

if (!$_SERVER['HTTP_REFERER']) {
    exit;
}

$url = $_SERVER['HTTP_REFERER'];


$string = 'jsapi_ticket=' . $jsapi_ticket . '&noncestr=' . $nonceStr . '&timestamp=' . $timestamp . '&url=' . $url;
$signature = sha1($string);
?>

wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: '<?php echo $appid;?>',
    timestamp: <?php echo $timestamp;?>,
    nonceStr: '<?php echo $nonceStr;?>',
    signature: '<?php echo $signature;?>',
    jsApiList: [
        'hideAllNonBaseMenuItem',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'onMenuShareQZone'
    ]
});
wx.ready(function(){
setShare();
});
wx.error(function(res){

});



function setShare() {
    console.log(shareData);
    wx.onMenuShareAppMessage({
        title: shareData.title, // 分享标题
        imgUrl: shareData.imgUrl, // 分享图标
        desc: shareData.desc,
        success: function () {
            // 用户确认分享后执行的回调函数
            
  
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            // alert(2);
            // alert('cancel');
        }

 });

wx.onMenuShareTimeline({
        title: shareData.title, // 分享标题
        imgUrl: shareData.imgUrl, // 分享图标
        desc:shareData.desc,
        success: function () {
            // 用户确认分享后执行的回调函数
           
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
            // alert(2);
        }
 });


}

    


