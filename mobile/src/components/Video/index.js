import React, { Component } from 'react';
import Utils from '../../libs/utils';
import Youtube from '../../libs/youtube';
import Storage from '../../libs/storage';
import DailyMotion from '../../libs/dailymotion';
import YouTube from 'react-youtube';
import Tracker from '../../tracker';
import Toast from '../common/Toast';
import './video.css';
import './index.css';
/*
Condition:
  cordova:
    youtube ->      1. if window.config.fetchVideo is set, then fetch the video resource and use video element
                    2. if window.config.fetchVideo is not set, use iframe api
    dailymotion ->  1. if window.config.fetchVideo is set, then fetch the video resource and use video element
                    2. if window.config.fetchVideo is not set, use iframe api
    hls       ->  video element
    mp4       ->  video element

  mobile:
    youtube   -> use iframe api
    dailymotion -> use iframe api
    hls       -> video element
    mp4       -> video element

  desktop:
    youtube   -> use iframe api
    dailymotion -> use iframe api
    hls       -> video element, attach to Hls.js
    mp4       -> video element

*/
// TODO: dailymotion iframe api
// https://developer.dailymotion.com/player#api-reference
// https://www.npmjs.com/package/react-dailymotion
export default class Video extends Component {

  constructor(props) {
    super(props);
    this.state = {
      duration: 0,
      current: 0,
      total: 0,
      start: 0,
      url: null,
      yid: null,
      type: null,
      error: null
    };
    /*
    video events
    [ 'loadstart', 'progress', 'suspend',
      'abort', 'error', 'emptied',
      'stalled', 'loadedmetadata', 'loadeddata',
      'canplay', 'canplaythrough', 'playing',
      'waiting', 'seeking', 'seeked', 'ended',
      'durationchange', 'timeupdate', 'play',
      'pause', 'ratechange', 'resize', 'volumechange'];
    video properties
    [ 'error', 'src', 'srcObject',
      'currentSrc', 'crossOrigin', 'networkState',
      'preload', 'buffered', 'readyState',
      'seeking', 'currentTime', 'duration',
      'paused', 'defaultPlaybackRate', 'playbackRate',
      'played', 'seekable', 'ended',
      'autoplay', 'loop', 'mediaGroup',
      'controller', 'controls', 'volume',
      'muted', 'defaultMuted', 'audioTracks',
      'videoTracks', 'textTracks', 'width',
      'height', 'videoWidth', 'videoHeight', 'poster' ];
    video controller properties
      ['readyState', 'buffered', 'seekable',
        'duration', 'currentTime','paused',
        'playbackState', 'played', 'defaultPlaybackRate',
        'playbackRate', 'volume', 'muted' ];
    */
    // video controller events
    this.events = ['emptied', 'loadedmetadata', 'loadeddata',
      'canplay', 'canplaythrough', 'playing',
      'ended', 'waiting', 'ended',
      'durationchange', 'timeupdate', 'play',
      'pause', 'ratechange', 'volumechange'];
    this.ios = /iPad|iPhone/i.test(navigator.userAgent);
    this.android = /Android/i.test(navigator.userAgent);
    this.hidden = document.hidden !== undefined ? 'hidden'
        : document.webkitHidden !== undefined ? 'webkitHidden'
        : document.mozHidden !== undefined ? 'mozHidden'
        : document.msHidden ? 'msHidden' : null;
    this.visibilityChange = document.hidden !== undefined ? 'visibilitychange'
      : document.webkitHidden !== undefined ? 'webkitvisibilitychange'
      : document.mozHidden !== undefined ? 'mozvisibilitychange'
      : document.msHidden !== undefined ? 'msvisibilitychange' : null;
    this.timer = null;
    this.orientationchange = this.orientationchange.bind(this);
    this.fullscreen = this.fullscreen.bind(this);
    this.visibility = this.visibility.bind(this);
    // min watch time to save and report
    this.MIN_WATCH_TIME = 5;
    // if watched time history is less then this time will be deleted, 30 days
    this.DELETE_TIME = 1000 * 60 * 60 * 24 * 30;
    this.DELETE_MAX = 1000;
  }

  // Initialization before render
  componentWillMount() {
    let watchs = Storage.get(Storage.KEYS.WATCH) || {};
    let items = watchs[this.props.id];
    this.setState({start: this.props.start || items && items.current || 0});
  }

  // Initialization after render
  componentDidMount() {
    if (this.props.url && this.props.type) {
      this.obtain(this.props.url, this.props.type);
    }
    //this.ios && window.addEventListener('orientationchange', this.orientationchange, false);
    screen.unlockOrientation && screen.unlockOrientation();
  }

  // Unmounting
  componentWillUnmount() {
    //this.ios && window.removeEventListener('orientationchange', this.orientationchange, false);
    screen.lockOrientation && screen.lockOrientation('portrait');
    this.log();
    console.log('clean.timer', this.timer);
    clearInterval(this.timer);
    this.timer = null;
    document.removeEventListener(this.visibilityChange, this.visibility, false);
    let video = this.refs.video;
    this.unbind(video);
    this.unbindHlsEvent();
    video && video.removeEventListener('fullscreenchange', this.onfullscreenerror, false);
    video && video.removeEventListener('webkitfullscreenchange', this.onfullscreenerror, false);
    video && video.removeEventListener('onfullscreenerror', this.onfullscreenerror, false);
    video && video.removeEventListener('webkitendfullscreen', this.fullscreen, false);
    video && video.removeEventListener('webkitenterfullscreen', this.fullscreen, false);
    this.inited = null;
    document.title = 'Vego TV';
  }

  // Props Changes
  componentWillReceiveProps(nextProps) {
    if (nextProps.url && nextProps.type && nextProps.url !== this.state.url) {
      document.title = nextProps.name + ' - Vego TV';
      let video = this.refs.video;
      if (video) {
        video && video.pause();
      }
      this.log();
      this.reset();
      this.showLoading(true);
      //this.showPoster(true);
      console.log('componentWillReceiveProps', nextProps.url, this.state.url);
      this.obtain(nextProps.url, nextProps.type);
      this._props = nextProps;
    }
  }

  // should update satae or props
  /*
  shouldComponentUpdate(nextProps, nextState) {
  }
  */
  // state or props change
  componentWillUpdate(nextProps, nextState) {
    if (nextState.url !== this.state.url) {
    }
  }
  // state or props change after render
  componentDidUpdate(prevProps, prevState) {
    if (prevState.url !== this.state.url || prevState.yid !== this.state.yid) {
      console.log('componentDidUpdate');
      this.init();
    }
  }

  // html video event
  // https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events
  ended(e) {
    this.handleEnd();
  }

  pause(e) {
  }

  seeking(e) {
    this.showLoading(true);
  }

  seeked(e) {
    this.showLoading(false);
  }

  playing(e) {
    this.showLoading(false);
  }

  loadstart(e) {
    e.target.currentTime = this.state.start;
  }

  canplaythrough(e) {
    this.showLoading(false);
  }

  canplay(e) {
    this.showLoading(false);
  }

  progress(e) {
    let video = e.target;
    if (!video.buffered.length) {
      return;
    }
    // TimeRange
    let bufferedEnd = video.buffered.end(video.buffered.length - 1);
    let duration = video.duration;
    if (duration > 0) {
      // buffer percent
      (bufferedEnd / duration) * 100;
    }
  }

  timeupdate(e) {
    this.setState({
      current: e.target.currentTime
    });
    if (this.props.end && e.target.currentTime >= this.props.end) {
      e.target.stop();
    }
  }

  loadedmetadata(e) {
    this.setState({
      duration: e.target.duration
    });
    this.showPoster(false);
    // show airplay button
    //Airplay(e.target, this.state.type, this.refs.monitor);
  }

  suspend(e) {

  }
  // Alert that the video needs to buffer the next frame before it can start playing
  waiting(e) {
  }

  error(e) {
    /*
      1 = MEDIA_ERR_ABORTED - fetching process aborted by user
      2 = MEDIA_ERR_NETWORK - error occurred when downloading
      3 = MEDIA_ERR_DECODE - error occurred when decoding
      4 = MEDIA_ERR_SRC_NOT_SUPPORTED - audio/video not supported
    */
    this.reportError(e.target.error.code);
  }

  handleStart(e) {

  }
  // youtube event
  // todo: calculate watching times
  onReady(e) {
    this.showLoading(false);
    this.showPoster(false);
    // cordova
    if (navigator.connection &&
        navigator.connection.type &&
        (navigator.connection.type.toLowerCase() === 'wifi' || navigator.connection.type.toLowerCase() === 'ethernet')) {
      e.target.playVideo();
    }
    this.props.getVideo && this.props.getVideo({url: this.state.url, type: this.state.type, video: this.refs.video});
    this.setState({duration: e.target.getDuration()});
    this.YouTube_Player = e.target;
  }

  onPlay(e) {
    let self = this;
    // buffer time > start play 2 second and not seeked
    if (this.bufferTime && +(new Date()) > this.bufferTime + 2 * 1000 && e.target.getCurrentTime() - 3 < this.state.current) {
      let props = this.props;
      let id = props.id;
      Tracker.track('send', 'event', 'player', 'buffer', id + '-' + props.videotitle, 1);
      this.bufferTime = null;
    }
    if (self.timer) {
      return;
    }
    self.timer = setInterval(() => {
      self.setState({current: e.target.getCurrentTime(), total: this.state.total + 1});
    }, 1000);
    console.log('timer', this.timer);
  }

  onPause(e) {
    clearInterval(this.timer);
    console.log('clean.timer', this.timer);
    this.timer = null;
  }

  onEnd(e) {
    clearInterval(this.timer);
    console.log('clean.timer', this.timer);
    this.timer = null;
    this.handleEnd();
  }

  onError(e) {
    /*
      2 – 请求包含无效的参数值。例如，如果您指定的视频ID不足11个字符，或者如果视频ID包含无效字符（例如感叹号或星号），就会发生此错误。
      5 – 请求的内容无法在HTML5播放器中播放，或者发生了与HTML5播放器有关的其他错误。
      100 – 找不到所请求的视频。当视频已被移除（无论是何种原因）或者被标记为私有状态时，就会发生此错误。
      101 – 所请求的视频的所有者不允许在嵌入式播放器中播放此视频。
      150 – 此错误与101相同，实际就是变相的101错误！
    */
    //this.has_error = true;
    this.reportError(e.data);
  }

  onStateChange(e) {
    //console.log('PlayerState', e.data);
    if (e.data === YouTube.PlayerState.PLAYING) {
      //this.setState({current: e.target.getCurrentTime()});
    }
    if (e.data === YouTube.PlayerState.BUFFERING) {
      this.bufferTime = +(new Date());
    }
  }

  onPlaybackRateChange(e) {
    // console.log('onPlaybackRateChange', e.data);
  }

  onPlaybackQualityChange(e) {
    // console.log('onPlaybackQualityChange', e.data);
  }

  // call props functions
  handleEnd() {
    this.props.onEnd && this.props.onEnd();
    this.log();
  }

  // utils
  showLoading(show) {
    let spinner = this.refs.spinner;
    if (spinner) {
      spinner.style.display = show ? 'block' : 'none';
    }
  }

  showPoster(show) {
    let poster = this.refs.poster;
    if (poster) {
      poster.style.display = show ? 'block' : 'none';
    }
  }

  reportError(code) {
    this.has_error = true;
    console.log({error: 'video.error', id: this.props.id, current: this.state.current, type: this.props.type, code: code});
    var img = document.createElement('img');
    img.src = 'http://wechat.vego.tv/log?from=mobile&type=video&id=' + this.props.id + '&url=' + (!/^x-/i.test(this.props.type) ? this.state.url : this.props.url) + '&code=' + code;
  }

  // report
  log() {
    this.total();
    let props = this._props;
    if (!props || !this.state.duration) {
      return;
    }
    let id = props.id;
    if (this.has_error) {
      return Tracker.track('send', 'event', 'player', 'error', id + '-' + props.videotitle, 1);
    }
    if (this.state.total < this.MIN_WATCH_TIME) {
      return Tracker.track('send', 'event', 'player', 'not_enough', id + '-' + props.videotitle, 1);
    }
    let item = {current: parseInt(this.state.current, 10), duration: parseInt(this.state.duration, 10), total: parseInt(this.state.total, 10), id: id, type: props.type};
    Storage.set(Storage.KEYS.HISTORY, {titleId: props.titleId, episodeId: id, name: props.name, img: props.poster, current: item.current, duration: item.duration, time: Date.now()});
    Tracker.track('send', 'event', 'player', 'play', id + '-' + props.videotitle, 1);
    Tracker.track('send', 'event', 'player', 'duration', id + '-' + props.videotitle, item.total >> 0);
    Tracker.track('send', 'event', 'player', 'completion', id + '-' + props.videotitle, item.total / item.duration * 100 >> 0);
    let watchs = Storage.get(Storage.KEYS.WATCH) || {};
    if ((item.current / item.duration) > 0.96) {
      delete watchs[id];
    } else {
      watchs[id] = {
        current: item.current,
        time: Date.now()
      };
    }
    for (let key in watchs) {
      let ele = watchs[key];
      if (ele.time < Date.now() - this.DELETE_TIME) {
        delete watchs[key];
      }
    }
    Storage.set(Storage.KEYS.WATCH, watchs);
  }

  // calculate watching times
  total(video) {
    video = video || this.refs.video;
    if (!video) {
      return;
    }
    // TimeRange
    let times = video.played;
    let n = 0;
    for (let i = 0; i < times.length; i++) {
      n += times.end(i) - times.start(i);
    }
    this.state.total = n >> 0;
  }

  obtain(url, type) {
    if (!url || !type) {
      return;
    }
    let self = this;
    Promise.resolve({
      url: url,
      type: type
    }).then((item) => {
      let url = item.url;
      let type = item.type;
      return new Promise((resolve, rejecet) => {
        if (type.toLowerCase() !== 'x-youtube' && type.toLowerCase() !== 'x-dailymotion') {
          //self.setState({url: url, type: type});
          return resolve({url: url, type: type});
        }
        let id;
        // dailymotion
        if (type.toLowerCase() === 'x-dailymotion') {
          if (window.config.cordova) {
            id = Utils.dailyMotionID(url);
            if (id) {
              DailyMotion
                .fetch(id, (err, info) => {
                  if (err) {
                    return rejecet({err: err});
                  }
                  return resolve({url: info.url, type: info.type});
                });
            } else {
              return rejecet({err: 'Can not get dailymotion id'});
            }
          } else {
            return rejecet({err: 'Not support.'});
          }
        }
        // youtube
        id = Utils.youtubeID(url);
        // use iframe
        if (!window.config.cordova || !window.config.fetchVideo) {
          return resolve({yid: id, type: type});
        }
        Youtube.fetch(id, (err, info) => {
          if (err) {
            return rejecet({err: err});
          }
          resolve({url: info.url, type: info.type});
        });
      });
    }).then((item) => {
      clearInterval(self.timer);
      console.log('clean.timer', self.timer);
      self.timer = null;
      setTimeout(() => {
        self.setState((prevState, props) => {
          let info = {url: item.url, type: item.type, yid: item.yid};
          let watchs = Storage.get(Storage.KEYS.WATCH) || {};
          let items = watchs[props.id];
          info.start = items && items.current || 0;
          return info;
        });
      }, 500);
      //self.init();
      // setTimeout(() => { self.init(); }, 500);
    }).catch((err) => {
      let e = err.message || err;
      self.setState({error: e});
      this.has_error = e;
      console.error(e);
    });
  }

  hls(url, type) {
    // when UA is desktop Hls.js will loaded
    if (!window.config.desktop || !window.Hls || type !== 'application/x-mpegURL') {
      return;
    }
    let hls = new Hls({
      enableWorker: true,
      capLevelToPlayerSize: true
    });
    let video = self.refs.video;
    hls.loadSource(url);
    hls.on(Hls.Events.MANIFEST_PARSED, (eve, data) => {
      console.log(`manifest loaded, found ${data.levels.length} quality level`);
      video.play();
    });
    hls.attachMedia(video);
    this.hls = hls;
  }

  // called after video or youtube render
  init() {
    this.log();
    let video = this.refs.video;
    if (this.inited) {
      video && this.unbind(video);
    } else {
      this.inited = true;
      document.addEventListener(this.visibilityChange, this.visibility, false);
      // standard events
      video && video.addEventListener('onfullscreenerror', this.onfullscreenerror, false);
      video && video.addEventListener('fullscreenchange', this.fullscreen, false);
      // desktop safari events
      video && video.addEventListener('webkitfullscreenchange', this.fullscreen, false);
      // mobile safira webkitbeginfullscreen and webkitendfullscreen events
      video && video.addEventListener('webkitendfullscreen', this.fullscreen, false);
      video && video.addEventListener('webkitbeginfullscreen', this.fullscreen, false);
      video && this.videoCustomAttributes(video);
    }
    video && this.bind(video);
    video && this.hls(this.state.url, this.state.type);
    //this.props.getVideo && this.props.getVideo({url: this.state.url, type: this.state.type, video: video});
  }

  bind(video) {
    if (!video) {
      return;
    }
    let self = this;
    let noop = () => {};
    this.events.map((env) => {
      self[env] = (self[env] || noop).bind(self);
      video.addEventListener(env, self[env]);
    });
  }

  unbind(video) {
    if (!video) {
      return;
    }
    let self = this;
    this.events.map((env) => {
      video.removeEventListener(env, self[env]);
    });
  }

  bindHlsEvent() {
    if (!this.hls) {
      return;
    };
  }
  unbindHlsEvent() {
    if (!this.hls) {
      return;
    };
  }

  visibility(e) {
    if (document[this.hidden]) {
      let video = this.refs.video;
      video && video.pause();
      this.YouTube_Player && this.YouTube_Player.pauseVideo();
      this.log();
    }
  }

  fullscreen(e) {
    let enabled = document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled;
    if (!enabled && !this.ios) {
      return;
    }
    let ele = document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement ||
      this.refs.video.webkitDisplayingFullscreen;
    if (ele) {
      try {
        //screen.lockOrientation && screen.lockOrientation('landscape');
        //screen.orientation && screen.orientation.lock && screen.orientation.lock('landscape');
      } catch (e) {}
    } else {
      try {
        //screen.lockOrientation && screen.lockOrientation('portrait');
        //screen.unlockOrientation && screen.unlockOrientation();
        //let container = this.refs.container;
        //container && container.setAttribute('class', container.getAttribute('class').replace('video-fullscreen-enabled', ''));
        //screen.orientation && screen.orientation.lock && screen.orientation.lock('portrait');
        //screen.orientation && screen.orientation.unlock && screen.orientation.unlock();
      } catch (e) {}
    }
  }

  onfullscreenerror(e) {
    let enabled = document.fullscreenEnabled ||
      document.webkitFullscreenEnabled ||
      document.mozFullScreenEnabled ||
      document.msFullscreenEnabled;
    if (!enabled) {
      return;
    }
    let ele = document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    if (ele && ele.nodeName === 'VIDEO') {
      return;
    }
    let container = this.refs.container;
    container && container.setAttribute('class', container.getAttribute('class') + ' video-fullscreen-enabled');
  }

  orientationchange(e) {
    let video = this.refs.video;
    if (!video) {
      return;
    }
    let angle = (typeof window.orientation !== 'undefined')
      ? window.orientation
      : window.screen.orientation && window.screen.orientation.angle;
    if (angle === 180 || angle === 0) {
      video.exitFullscreen && video.exitFullscreen() ||
        video.webkitExitFullscreen && video.webkitExitFullscreen() ||
        video.mozCancelFullScreen && video.mozCancelFullScreen()	||
        video.msExitFullscreen && video.msExitFullscreen();
    }
    if (angle === 90 || angle === -90) {
      video.requestFullscreen && video.requestFullscreen() ||
        video.webkitEnterFullscreen || video.webkitEnterFullscreen() ||
        video.webkitRequestFullScreen && video.webkitRequestFullScreen() ||
        video.mozRequestFullScreen && video.mozRequestFullScreen ||
        video.msRequestFullscreen && video.msRequestFullscreen();
    }
  }

  reset() {
    this.state = {
      duration: 0,
      current: 0,
      total: 0,
      start: 0,
      url: null,
      yid: null,
      type: null,
      error: null
    };
  }

  videoCustomAttributes(ele) {
    if (!ele) {
      return;
    }
    ele.setAttribute('x-webkit-airplay', 'allow');
    ele.setAttribute('airplay', 'allow');
    ele.setAttribute('webkit-playsinline', true);
    ele.setAttribute('playsinline', true);
  }

  render() {
    const {
      url,
      yid,
      type,
      start,
      error
    } = this.state;
    if (error) {
      return (<div className='media-item'>
      <div className='rate rate16x9'>
        <div className='size'>
          <div className='container'>
         <Toast title='糟糕，你要找的资源不见了...' />
          <div className='video-react-error'>糟糕，你要找的资源不见了...</div>
        </div>
        </div>
      </div>
    </div>);
    }
    const posterStyle = this.props.poster ? {backgroundImage: 'url(' + this.props.poster + ')'} : {display: 'block'};
    // https://developers.google.com/youtube/player_parameters
    const opts = {
      width: '100%',
      height: '100%',
      playerVars: {
        modestbranding: 1,
        controls: 0,
        autoplay: 1,
        autohide: 0,
        disablekb: 0,
        fs: 1,
        cc_load_policy: 0,
        playsinline: 1,
        iv_load_policy: 3,
        rel: 0,
        showinfo: 1,
        start: start,
        end: this.props.end || 0
      }
    };
    let content = '';
    if (yid) {
      content =
        <YouTube
          videoId={yid}
          id='youtube-frame'
          className='video-container'
          opts={opts}
          onReady={this.onReady.bind(this)}
          onPlay={this.onPlay.bind(this)}
          onPause={this.onPause.bind(this)}
          onEnd={this.onEnd.bind(this)}
          onError={this.onError.bind(this)}
          onStateChange={this.onStateChange.bind(this)}
          onPlaybackRateChange={this.onPlaybackRateChange.bind(this)}
          onPlaybackQualityChange={this.onPlaybackQualityChange.bind(this)}
        />;
    }
    if (url && type) {
      content = <video ref='video' poster={this.props.poster} preload='auto' playsInline controls autoPlay>
          <source src={ url } type={ type } />
        </video>;
    }
    return <div className='media-item'>
      <div className='rate rate16x9'>
        <div className='size'>
          <div className='container'>
            {content}
          <div ref='poster' className='backgroundImage' dir='ltr' tabIndex='-1' style={posterStyle} />
          <div ref='spinner' className='loading-spinner loading-spinner-size4' />
          </div>
        </div>
      </div>
    </div>;
  }
}
