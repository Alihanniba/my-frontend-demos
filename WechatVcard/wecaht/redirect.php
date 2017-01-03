<?php
    session_start();
    if (isset($_GET['code'])) {
        $code = $_GET['code'];
        $data = get_access_token($code);

        if (!isset($data->errcode)) {
            $access_token  = $data->access_token;
            $expires_in    = $data->expires_in;
            $refresh_token = $data->refresh_token;
            $openid        = $data->openid;

            $userInfo = getUserInfo($access_token, $openid);
            $nickname = $userInfo->nickname;
            $headimgurl = $userInfo->headimgurl;

            // 重定向
            $_SESSION['userInfo'] = $userInfo;

            if (isset($_GET['game_id']) && $_GET['game_id'] == 1) {
                header("Location: ./data/monster-hunt.php");
            } else if (isset($_GET['game_id']) && $_GET['game_id'] == 2) {
                header("Location: http://www.alihanniba.com/soundtooth_vcard/wecaht/input.php?openid=".$openid."&nickname=".urlencode($nickname)."&headimgurl=".urlencode($headimgurl)."&signature=".sha1($openid.$headimgurl."Soundtooth"));
            } else if (isset($_GET['game_id']) && $_GET['game_id'] == 3) {
                echo $headimgurl;
            }
        } else {
            if (isset($_GET['game_id']) && $_GET['game_id'] == 1) {
                header("Location: https://open.weixin.qq.com/connect/oauth2/authorize?appid=www.alihanniba.com&redirect_uri=http://www.alihanniba.com/soundtooth_vcard/wecaht/redirect.php?game_id=1&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect");
            } else if (isset($_GET['game_id']) && $_GET['game_id'] == 2) {
                header("Location: https://open.weixin.qq.com/connect/oauth2/authorize?appid=www.alihanniba.com&redirect_uri=http://www.alihanniba.com/soundtooth_vcard/wecaht/redirect.php?game_id=2&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect");
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | 通过code换取网页授权access_token
    |--------------------------------------------------------------------------
    |
    | 正确时返回的JSON数据包如下：
    | {
    |   "access_token":"ACCESS_TOKEN",
    |   "expires_in":7200,
    |   "refresh_token":"REFRESH_TOKEN",
    |   "openid":"OPENID",
    |   "scope":"SCOPE"
    | }
    |
    */
    function get_access_token($code){
        $baseurl = 'https://api.weixin.qq.com/sns/oauth2/access_token';
        $query = array(
            'appid'      => 'www.alihanniba.com',
            'secret'     => 'www.alihanniba.com',
            'code'       => $code,
            'grant_type' => 'authorization_code'
        );
        $url    = $baseurl.'?'.http_build_query($query);
        $json   = file_get_contents($url);
        $result = json_decode($json);
        return $result;
    }

    /*
    |--------------------------------------------------------------------------
    | 拉取用户信息(需scope为 snsapi_userinfo)
    |--------------------------------------------------------------------------
    |
    | {
    |   "openid":" OPENID",
    |   "nickname": NICKNAME,
    |   "sex":"1",
    |   "province":"PROVINCE"
    |   "city":"CITY",
    |   "country":"COUNTRY",
    |   "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/46", 
    |   "privilege":[
    |     "PRIVILEGE1"
    |     "PRIVILEGE2"
    |   ]
    |}
    |
    */
    function getUserInfo($access_token, $openid){
        $baseurl = 'https://api.weixin.qq.com/sns/userinfo';
        $query = array(
            'access_token' => $access_token,
            'openid'       => $openid,
            'lang'         => 'zh_CN' 
        );
        $url = $baseurl.'?'.http_build_query($query);
        $json = file_get_contents($url);
        return json_decode($json);
    }



    