
<?php
session_start();
if (!$_GET['openid'] || !$_GET['nickname'] || !$_GET['headimgurl'] ) {
    echo 'missing id';
    exit;
}
$_SESSION['openid'] = $openid = $_GET['openid'];
$_SESSION['nickname'] = $nickname = urldecode($_GET['nickname']);
$_SESSION['headimgurl'] = $headimgurl = urldecode($_GET['headimgurl']);

?>

<!DOCTYPE html>
<html> 
    <head>
        <!-- <meta http-equiv="html/content" content="text/html; charset = utf8"> -->
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
      <script>
            var _hmt = _hmt || [];
            (function() {
              var hm = document.createElement("script");
              hm.src = "www.alihanniba.com";
              var s = document.getElementsByTagName("script")[0]; 
              s.parentNode.insertBefore(hm, s);
            })();
        </script>
        <script src="js/jquery-1.11.2.min.js"></script>
        <script src="js/vcard.js"></script>
        <script src="js/webuploader.js"></script>
        <link rel="stylesheet" href="css/webuploader.css">
        <title>微信专属名片</title>
        <link rel="stylesheet" href="css/index.css">
        <script src="js/jssdk.php"></script>
        <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
        <script type="text/javascript" src="http://www.alihanniba.com/soundtooth_vcard/wecaht/js/jssdk.php?url=<?php echo urlencode("http://".$_SERVER ['HTTP_HOST'].$_SERVER['PHP_SELF']."?".$_SERVER['QUERY_STRING']);?>"></script>
        
    </head>
    <body>
            <div id="load_shadow"></div>
            <div id="loading">
                <img src="./img/loading.gif" alt="">
            </div>
            <input type="hidden" value="" id="image-url">
            <input type="hidden" value="<?php echo $openid; ?> " id="openid">

            <div class="left_box left_basic border_rt_green">
                <div class="vcard_head" style="background-image: url(http://biz.cli.im/Public/images/vcardbg7.jpg);">
                    <div class="vcard_face_wrap">
                        <div class="vcard_face_bg">
                        </div>
                        <div class="vcard_face" >
                             

                                    <!--  <div id="localImag" >
                                                <img id="preview" src="http://img0.ph.126.net/-2QnvWEqVk_AmTzGiGB5Og==/2512164167160507273.jpg" name="preview">
                                            </div>
                                            <div align="center" >
                                                    <input type="file" name="file" id="doc" onchange="setImagePreview();">
                                            </div>
                                     </div> -->

                                   <!--  <div class="vcard_face_lang lang_fake" data-lang-key="Avatar">
                                        点击获取头像
                                    </div> -->
                                <div style="border-radius:50%;height:100%;width:100%;">
                                    <img src=" <?php echo $headimgurl; ?> " alt="" style="height:100%;width:100%;border:none;border-radius:50%;" id="headimg">
                                </div>
                                <p id="headimgs"></p>
                        </div>
                    </div>
                    <div class="vcard_career_wrap">
                        <p id="vcard_data_name" data-lang-key="Name" class="vcard_data_fullname lang_fake">
                            姓名
                        </p>
                        <p class="vcard_data_appointment vcard_career lang_fake" data-lang-key="Appointment" id="vcard_data_appointment">
                            职位
                        </p>
                        <p class="vcard_data_company vcard_career lang_fake" data-lang-key="Company" id="vcard_data_company">
                            公司
                        </p>
                        <div class="cl">
                        </div>
                    </div>
                </div>
                <div class="left_addable_wrap" id="left_addable_basic">
                </div>
            </div>
            <div class="left_box left_phone">
                 <div class="vcard_data_txt"> 
                    <input type="text" class="input-news mandatory" placeholder="姓名*必填"  onpropertychange ="setValue('vcard_data_name','name');" oninput="setValue('vcard_data_name','name');"  id="name">
                </div>
                  <div class="vcard_data_txt"> 
                    <input type="text" class="input-news mandatory" placeholder="职位*必填" onpropertychange ="setValue('vcard_data_appointment','jobs');" oninput="setValue('vcard_data_appointment','jobs');"  id="jobs">
                </div>
                  <div class="vcard_data_txt"> 
                    <input type="text" class="input-news mandatory" placeholder="公司*必填" onpropertychange ="setValue('vcard_data_company','company');" oninput="setValue('vcard_data_company','company');"  id="company">
                </div>
                <div class="vcard_data_txt"> 
                    <input type="text" class="input-news mandatory" placeholder="移动号码*必填"  id="mobile">
                </div>
                <div class="left_addable_wrap" id="left_addable_phone">
                    <div class=" vcard_data_txt">
                        <input type="text" class="input-news" placeholder="固定号码" id="tel">
                    </div>
                </div>
                <div class="left_addable_wrap" id="left_addable_fax">
                    <div class="vcard_data_txt">
                        <input type="text" class="input-news" placeholder="传真" id="fax">
                    </div>
                </div>
            </div>
            <div class="left_box left_internet">
                <div class="bg_wrap hidden">
                    <div class="bg">
                    </div>
                    <i class="icon_edit">
                    </i>
                    <span>
                        互联网
                    </span>
                </div>
                <div class="left_addable_wrap" id="left_addable_email">
                    <div class="vcard_email vcard_data_txt">
                       <input type="text" class="input-news mandatory" placeholder="电子邮箱*必填" id="email">
                    </div>
                </div>
                <div class="left_addable_wrap" id="left_addable_site">
                    <div class="vcard_site vcard_data_txt">
                        <input type="text" class="input-news" placeholder="主页网址" id="url">
                    </div>
                </div>
                <div class="vcard_data_txt">
                    <input type="text" class="input-news" placeholder="微博" id="weibo">
                </div>
                <div class="vcard_data_txt ">
                   <input type="text" class="input-news mandatory scalewidth" placeholder="QQ" id="qq">
                   <p id="add_qq">上传二维码</p>
                   <input type="hidden" id="upload_qq">
                </div>
                <div class="left_addable_wrap" id="left_addable_message">
                    <div class="vcard_data_txt vcard_message ">
                        <input type="text" class="input-news mandatory scalewidth" placeholder="微信" id="wechat">
                        <p id="add_wechat">上传二维码</p>
                   <input type="hidden" id="upload_wechat">
                    </div>
                </div>
            </div>
            <div class="left_box left_address">
                <div class="bg_wrap hidden">
                    <div class="bg">
                    </div>
                    <i class="icon_edit">
                    </i>
                    <span>
                        联系地址
                    </span>
                </div>
                <div class="left_addable_wrap" id="left_addable_address">
                    <div class="vcard_address vcard_data_txt">
                        <input type="text" class="input-news" placeholder="地址" id="address">
                    </div>
                </div>
            </div>
            <div class="left_box left_other" style="border-radius: 0 0 10px 10px;">
               
                <div class="vcard_other vcard_data_txt ">
                        <input type="text" class="input-news" placeholder="个人说明" id="description">
                    
                </div>
               <!--  <div class="vcard_other vcard_data_txt " id="vcard_more">
                    <textarea name="intro" id="intro" placeholder="附加信息"></textarea>
                </div> -->
            </div>
            <div  class="submit-news">
                <button  class="create-card" >生成</button>

            </div>
        </div>
    </body>

</html>