import ons from 'onsenui';
import Storage from './libs/storage';
import { browserHistory, hashHistory } from 'react-router';
import Tracker from './tracker';

const history = window.config.hashHistory ? hashHistory : browserHistory;
const HOMEPAGE = '/home';

const Startup = () => {
  // default behave
  resizeHtml();
  window.onresize = () => {
    //resizeHtml();
  };
  // common online and offline event
  document.addEventListener('offline', () => {}, false);

  document.addEventListener('online', () => {
    Storage.sync();
  }, false);
  Tracker.initialize('UA-78478916-3');
  // config
  let config = 	window['config'];
  config.cordova && cordova() ||
    config.wechat && wechat() ||
    config.mobile && mobile() ||
    config.desktop && desktop();
};

const resizeHtml = () => {
  document.getElementsByTagName('html')[0].style.fontSize = window.innerWidth / 10 + 'px';
};
// wechat jssdk list
const WECHAT_LIST = [
  'checkJsApi',
  'onMenuShareTimeline',
  'onMenuShareAppMessage',
  'onMenuShareQQ',
  'onMenuShareWeibo',
  'onMenuShareQZone',
  'hideMenuItems',
  'showMenuItems',
  'hideAllNonBaseMenuItem',
  'showAllNonBaseMenuItem',
  'translateVoice',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'onVoicePlayEnd',
  'pauseVoice',
  'stopVoice',
  'uploadVoice',
  'downloadVoice',
  'chooseImage',
  'previewImage',
  'uploadImage',
  'downloadImage',
  'getNetworkType',
  'openLocation',
  'getLocation',
  'hideOptionMenu',
  'showOptionMenu',
  'closeWindow',
  'scanQRCode',
  'chooseWXPay',
  'openProductSpecificView',
  'addCard',
  'chooseCard',
  'openCard'
];

const wechat = () => {
  Tracker.set('dataSource', 'wechat');
  Tracker.set('plateform', 'wechat');

  let script = document.createEleement('script');
  let protocol = location.protocol;
  if (/file/i.test(protocol)) {
    protocol = 'http:';
  }
  script.src = protocol + '//res.wx.qq.com/open/js/jweixin-1.0.0.js';
  script.onload = () => {
    let configure = (data) => {
      if (data.code) {
        return console.error(data.message);
      }
      let config = data.data;
      config.debug = window['config'] && window['config'].debug;
      config.jsApiList = WECHAT_LIST;
      wx.config(config);
      wx.error((res) => { console.log(JSON.stringify(res)); });
      wx.ready(() => {
        console.log('Wechat config success');
        if (window['_onWecahtReady']) {
          window['_onWecahtReady']();
        }
      });
    };
    let request = new XMLHttpRequest();
    request.open('POST', protocol + '//wechat.vego.tv/service/wechat/jssdk', true);
    request.onreadystatechange = (env) => {
      if (request.readyState === 4) {
        if (request.status === 200) {
          try {
            configure(JSON.parse(request.responseText));
          } catch (e) {
            console.log(e);
          }
        } else {
          console.error(env);
        }
      }
    };
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send('url=' + decodeURIComponent(location.href.split('#')[0]));
  };
  document.getElementsByTagName('head')[0].appendChild(script);
};


const mobile = () => {
  Tracker.set('dataSource', 'mobile-www');
  Tracker.set('plateform', 'mobile-www');
};

const desktop = () => {
  var script = document.createElement('script');
  script.src = 'hls.min.js';
  var eles = document.getElementsByTagName('head');
  eles && eles[0] && eles[0].appendChild(script);
  Tracker.set('dataSource', 'desktop');
  Tracker.set('plateform', 'desktop');
};


const cordova = () => {
  document.addEventListener('deviceready', (e) => {
    //alert('deviceready')
    console.log('------ %s ---------', 'Launch');
    //index = e.target.URL;
    //alert(screen.lockOrientation);
    navigator.splashscreen && navigator.splashscreen.hide();
    window.screen.lockOrientation('portrait');
    //console.log('------ %s ---------', 'StatusBar');
    //console.log(StatusBar);
    //console.log('------ %s ---------', 'Device');
    //console.log(device);
    Tracker.set('dataSource', 'mobile');
    Tracker.set('network', navigator.connection.type);
    Tracker.set('plateform', device.platform);
    Tracker.set('uuid', device.uuid);
    Tracker.set('model', device.model);
    Tracker.set('version', window.config.cordova_v);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        //console.log('------ %s ---------', 'Geolocation');
        //console.log(pos.coords);
        Tracker.set('latitude', pos.coords.latitude);
        Tracker.set('longitude', pos.coords.longitude);
        window.config.geo = pos.coords;
      }, (err) => {
        console.error(err.messag);
      });
    }
  }, false);
  /*
  navigator.globalization.getPreferredLanguage((language) => {
    //console.log('------ %s ---------', 'Language');
    window.config.language = language.value;
    //console.log(language.value);
  });
  */
  let l;
  document.addEventListener('pause', () => {
    console.log('pause');
    l = history.getCurrentLocation();
  }, false);
  document.addEventListener('resume', () => {
    console.log('resume');
    history.getCurrentLocation().pathname = l.pathname;
  }, false);

  let backbutton = (e) => {
    //console.log(history.getCurrentLocation().pathname);
    if (window.config.goBack) {
      e.preventDefault && e.preventDefault();
      window.config.goBack();
      return false;
    }
    if (history.getCurrentLocation().pathname === HOMEPAGE) {
      e.preventDefault && e.preventDefault();
      navigator.app.exitApp();
    } else {
      history.goBack();
    }
    return false;
  };

  setTimeout(() => {
    ons.disableDeviceBackButtonHandler();
    // android
    // document.addEventListener('backbutton', backbutton, false);
    ons.setDefaultDeviceBackButtonListener(backbutton);
  }, 2000);
};

Startup();
