import React from 'react'

import { connect } from 'react-redux'
import { browserHistory , hashHistory} from 'react-router'
import { getEpisodesList, clearPLayerData, setPLayerState } from '../../actions/player'
import './index.styl'
import Video from '../Video/'
import ToolKit from '../../tools/tools'
import Config from '../../tools/config'
import LoadingBox from './LoadingBox'
import Selections from './Selections'
import AirPlay from '../../libs/airplay'
import Storage from '../../libs/storage'
import FunctionNav from './FunctionNav'
import Toast from '../common/Toast'

const history = window.config.hashHistory ? hashHistory : browserHistory

class VideoPlayer extends React.Component {
  constructor(props){
    super(props);
    this.dispatchPlayerState = this.dispatchPlayerState.bind(this)
    this.dispatchPlayer = this.dispatchPlayer.bind(this)
    this.orientationchange = this.orientationchange.bind(this);
    this.backToHome = this.backToHome.bind(this);
    this.episodeId = null
    this.start = 0
    this.canBackHome = true;
    // this.getVideo = this.getVideo.bind(this)
    // this.end = this.end.bind(this)
  }

  static contextTypes = {
    store: React.PropTypes.object
  }

  dispatchPlayerState(obj) {
    this.props.dispatch(setPLayerState( obj ))
  }

  componentWillMount(){
    Storage.s_set(Storage.KEYS.PLAY_PAGE_KEY, true)
    console.log('==========player componentWillMount============');
    const id = this.props.router.params.vid;
    let { eid, s } = this.props.router.location.query
    this.episodeId = eid
    this.start = s
    this.dispatchPlayer(id)
    // this.props.dispatch(getEpisodesList(id))
  }
  dispatchPlayer(vid) {
    this.props.dispatch(getEpisodesList(vid))
  }
  componentWillReceiveProps(a) {
    console.log('==========player componentWillReceiveProps============');
    let eLists = a.episodesList
    if(eLists === undefined) return
    if((eLists && a.playUrl === '') || this.props.canChangeAlbum) {
      if( eLists.episodes.length === 0 ) {
        this.props.dispatch(setPLayerState({errTip: true}))
        return
      }
      let eid = this.episodeId == null ? eLists.episodes[0].id : this.episodeId
      console.log('get',eLists.episodes[0].url, eLists.episodes[0].mimeType)
      this.props.dispatch(setPLayerState({
        episodesList: a.episodesList,
        playUrl: eLists.episodes[0].url ,
        mimeType: eLists.episodes[0].mimeType,
        poster: eLists.episodes[0].landscape_poster,
        title: eLists.name,
        subTitle: eLists.episodes[0].name,
        playingIndex: eid,
        episodeLists: eLists.episodes,
        start: this.start}))
        this.start = 0
        this.episodeId = null
    }
  }
  //player url change create new player
  componentDidUpdate(prevProps, prevState) {
    // console.log("==========player componentDidUpdate========");
    // if( this.props.playUrl != prevProps.playUrl && this.props.playUrl != "") {
      //this.createPlayer(this.props.playUrl)
    // }
  }

  shouldComponentUpdate(a, b) {
    //没有播放地址 不重新渲染
    if(a.playUrl === "") return false
    //可切换选集，地址相同不重新渲染
    if(a.playUrl === this.props.playUrl && a.canChangeAlbum) return false
    return true
  }

  //listen orientationchange event
  componentDidMount() {
    if(window.StatusBar){
      StatusBar.overlaysWebView(true);
      StatusBar.hide();
    }
    // when user entry from other shared
    if(document.referrer && document.referrer.indexOf(location.host) === -1){
      history.push({pathname: '/home',search: '?source=' + document.referrer, state:{source: document.referrer}})
    }
    window.addEventListener('orientationchange', this.orientationchange, false);
  }
  //uninstall window orientationchange event
  componentWillUnmount() {
    this.dispatchPlayerState({
      player: null,
      title: '',
      errTip: false,
      playingIndex: null,
      episodeLists: {},
      playUrl: "",
      mimeType: '',
      poster:'',
      episodes: undefined
    })
    if(window.StatusBar){
      StatusBar.overlaysWebView(false);
      StatusBar.show();
    }
    screen.lockOrientation && screen.lockOrientation('portrait');
    window.removeEventListener('orientationchange', this.orientationchange, false)
  }

  orientationchange(e) {
    let angle = (typeof window.orientation !== 'undefined')
      ? window.orientation
      : window.screen.orientation && window.screen.orientation.angle;
    if (angle === 180 || angle === 0) {
      window.config.goBack = null;
      this.canBackHome = true;
    }
    if (angle === 90 || angle === -90) {
      // do not exit this page
      window.config.goBack = this.backToHome
      this.canBackHome = false;
    }
  }

  //only episodesList not null can render Selections component
  renderSelections() {
    if(this.props.episodesList !== undefined) {
      return (
        <Selections
          ref='selection'
          episodesList={ this.props.episodesList }
          dispatchPlayer={ this.dispatchPlayer }
          dispatchPlayerState = { this.dispatchPlayerState }
          title={ this.props.title }
          subTitle={ this.props.subTitle }
          playingIndex={ this.props.playingIndex }
          episodeLists={ this.props.episodesList.episodes }
          relatedVideo={ this.props.relatedVideo }/>
      )
    }
  }
  renderFunctionNav() {
    if(this.props.episodesList == undefined) return
    console.log(this.props.subTitle);
    return (
      <FunctionNav
        name={ this.props.title }
        subTitle={this.props.subTitle}
        poster={ this.props.poster }
        videoId={ this.props.playingIndex }
        titleId={ this.props.routeParams.vid }
        ref="functionNav"/>
    )
  }
  //back to home page and initialize player props
  backToHome() {
    if (this.canBackHome) {
      this.dispatchPlayerState({
        player: null,
        title: '',
        errTip: false,
        playingIndex: null,
        episodeLists: {},
        playUrl: "",
        mimeType: '',
        poster:'',
        episodes: undefined,
        start: 0
      });
      history.goBack()
    } else {
      screen.lockOrientation && screen.lockOrientation('portrait');
      setTimeout(()=>{
        if(history.getCurrentLocation().pathname.indexOf('watch') > -1){
          screen.unlockOrientation && screen.unlockOrientation()
        };
      },3000);
    }
  }

  getVideo(info){
    this.refs.functionNav.videoChange(info)
    console.log(info);
    this.refs.selection.videoCHange && this.refs.selection.videoCHange(info);
  }
  end(){
    console.log('===end===');
    let epi = this.refs.selection.refs.epiBox
    //电影，播放相关视频
    if(epi === undefined) {
      console.log('===电影，播放相关视频===');
      return
    }
    console.log('video end, 播放下一集')
    this.refs.selection.refs.epiBox.onEnd()
  }

  render() {
    return (
      <div>
          <nav
            onClick={()=> { this.backToHome() }}
            className="play-back-home">
          </nav>
        <div className="play-selection play-box">
          <Video
            // video id
            id={this.props.playingIndex}
            // title id
            titleId={this.props.routeParams.vid}
            // name
            name={this.props.title}
            // video title, for GA
            videotitle={this.props.subTitle}
            // video url
            url={this.props.playUrl}
            // video mimeType
            type={this.props.mimeType}
            // poster
            poster={this.props.poster}
            // start video at certain time in seconds
            start={0}
            // end video at certain time in seconds
            end={null}
            // obtain video, url and mime type when loaded video
            getVideo={this.getVideo.bind(this)}
            // obtain video end event
            onEnd={this.end.bind(this)} />
          { this.renderFunctionNav() }
          { this.renderSelections() }
        </div>
        <Toast
          ref="toast"
          title='您正在使用运营商网络' />
      </div>
    );
  }
}

const episodesList = state => {
  return {
    player: state.player.player,
    title: state.player.title,
    subTitle: state.player.subTitle,
    errTip: state.player.errTip,
    playingIndex: state.player.playingIndex,
    playUrl: state.player.playUrl,
    poster: state.player.poster,
    mimeType: state.player.mimeType,
    episodesList: state.player.episodes,
    description: state.player.description,
    canChangeAlbum: state.player.canChangeAlbum,
    start: state.player.start
  }
}

export default connect(episodesList)(VideoPlayer)
