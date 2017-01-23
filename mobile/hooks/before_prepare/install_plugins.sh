#!/bin/bash

# device infomation
cordova plugin add cordova-plugin-device
# geo  location
cordova plugin add cordova-plugin-geolocation -variable GEOLOCATION_USAGE_DESCRIPTION="为了更好的推送视频给你，VegoTV 需要获取你的位置。"

cordova plugin add cordova-plugin-globalization
# network infomation
cordova plugin add cordova-plugin-network-information
# splashscreen
cordova plugin add cordova-plugin-splashscreen
# statusbar
cordova plugin add cordova-plugin-statusbar
# whitelist
cordova plugin add cordova-plugin-whitelist
# in app browser
cordova plugin add cordova-plugin-inappbrowser
# vibration
cordova plugin add cordova-plugin-vibration
# orientation
cordova plugin add cordova-plugin-screen-orientation
# cordova plugin add cordova-plugin-googleplus --save --variable REVERSED_CLIENT_ID=myreversedclientid
# 添加 push notification ?
# https://github.com/orcasgit/PushNotification

# customurl scheme hander
cordova plugin add cordova-plugin-customurlscheme --variable URL_SCHEME=vegotv

cordova plugin add cordova-plugin-http

cordova plugin add http://git.vego.tv:9000/git/wukong/cordova-plugin-wechat.git --variable wechatappid=wx8c74f72241cd32bc

cordova plugin add http://git.vego.tv:9000/git/wukong/cordova-plugin-netstatus.git

cordova plugin add http://git.vego.tv:9000/git/wukong/cordova-plugin-AppStore.git
#cordova plugin add cordova-plugin-wechat1 --variable wechatappid=wx8c74f72241cd32bc
