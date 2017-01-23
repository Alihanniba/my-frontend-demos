import React, { Component } from 'react'
import { browserHistory , hashHistory} from 'react-router'
import Tracker from '../../tracker';

import VarietyCommon from './VarietyCommon'

const history = window.config.hashHistory ? hashHistory : browserHistory

export default class RelatedVideos extends Component {
  constructor(props) {
    super(props)
    this.state = {
      unfold: false
    }
    this.renderRelatedVideo = this.renderRelatedVideo.bind(this)
    this.setRelatedState = this.setRelatedState.bind(this)
    this.playRelative = this.playRelative.bind(this)
    this.renderLiveVideos = this.renderLiveVideos.bind(this)
  }
  playRelative(vid) {
    this.props.dispatchPlayerState({canChangeAlbum: true})
    history.replace(`/watch/${vid}`)
    this.props.dispatchPlayer(vid)
    // this.forceUpdate()
  }
  //renderRelatedVideo
  renderRelatedVideo() {
    let flag = this.state.unfold
    const lists = this.props.relatedVideo

    if(flag && this.props.type == "综艺") {
      return (
        <VarietyCommon
          displayStyle="block"
          relatedVideo={ true }
          lists={ lists }
          action={ this.playRelative }/>
      )
    }
    const SelectionArr = []

    const len = lists.length > 6 ? 6 : lists.length
    // debugger
    // const len = lists.length
    for (let i = 0; i < len; i++) {
      let item = lists[i]
      SelectionArr.push(
        <figure
          className="related-figure"
          onClick={()=>{ this.playRelative(item.id)}}
          key={i}>
          <img
            className="related-img"
            src={lists[i].landscape_poster} onError={Tracker.youtubeError}/>
          <figcaption className="related-type">{ item.buoy.value[0].l }</figcaption>
          <figcaption className="related-desc">{ item.buoy.value[0].r }</figcaption>
          <figcaption className="related-title">{ item.name }</figcaption>
        </figure>
      )
    }
    return SelectionArr
  }
  renderLiveVideos() {
    {/***
    <li
      key={i}
      onClick={()=>{this.playRelative(item.id)}}>
      { item.name }
    </li>*/}
    const lists = this.props.relatedVideo
    const SelectionArr = []
    for (let i = 0; i < lists.length; i++) {
      let item = lists[i]
      SelectionArr.push(
        <figure
          className="related-figure"
          onClick={()=>{ this.playRelative(item.id)}}
          key={i}>
          <img
            className="related-img"
            src={lists[i].landscape_poster} onError={Tracker.youtubeError}/>
          <figcaption className="related-title">{ item.name }</figcaption>
        </figure>
      )
    }
    return SelectionArr
  }
  //control RelatedVideoLists unfold or not
  setRelatedState(flag) {
    let rb = this.refs.relateBox
    let rvc = this.refs.rvc
    let cname = 'related-video-box'
    flag === false ? rb.className = cname : rb.className += " unfold"
    flag === false ? rvc.scrollTop = 0 : ''
    this.setState({
      unfold: flag
    },()=>{
      // this.props.troggleFuncBox(flag)
    })
  }

  render() {
    let flag = this.state.unfold
    let type = this.props.type
    let sty = {}
    let containerStyle = {}
    if(flag) {
      let d = document.getElementsByClassName('functionNav-box')[0]
      let dTop = +d.style.top.replace('px', '')
      let dHeight = `${dTop}px`
      sty = {
        position: 'fixed',
        top: dHeight
      }
      containerStyle = {
        maxHeight: '10.16rem',
        overflow: 'scroll'
      }
    }

    if( type === '直播' )
     {
       return (
         <div className="related-live-video" style={sty}>
           <div className="related-live-line"></div>
           <h1>相关直播</h1>
           <div
             className="related-video-container">
             { this.renderLiveVideos()  }
           </div>
           {/***
           <ul>
             { this.renderLiveVideos() }
           </ul>*/}
         </div>
       )
     } else {
       return (
         <div
           style={sty}
           className="related-video-box"
           ref="relateBox">
           <div className="divisionRect"></div>
           <div className="related-video-text">
             <p
               onClick={(e)=>{ this.setRelatedState(!flag) }}
               className={flag === true ? 'related-arrow-close' : 'related-video-arrow'}>
               相关视频
             </p>
           </div>
           <div
             style={containerStyle}
             className="related-video-container" ref="rvc">
             { this.renderRelatedVideo() }
           </div>
           <div
             onClick={()=>{ this.setRelatedState(true) }}
             style={flag === true ? {display: 'none'} : {display: 'block'}}
             className="click-look-more">
             点击查看更多视频>>
           </div>
         </div>
       )
     }
  }
}
