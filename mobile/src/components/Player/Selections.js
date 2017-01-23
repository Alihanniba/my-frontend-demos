import React, { Component } from 'react';
import Episodes from './Episodes'
import Actor from './Actor'
import RelatedVideos from './RelatedVideos'
import FunctionNav from './FunctionNav'

import tools from '../../tools/tools'

export default class Selections extends Component {
  constructor(props) {
    super(props)
    this.renderSelectionList = this.renderSelectionList.bind(this)
    this.changeAlbum = this.changeAlbum.bind(this)
    this.renderEpisodesList = this.renderEpisodesList.bind(this)
    this.renderActorList = this.renderActorList.bind(this)
    this.renderRelatedVideos = this.renderRelatedVideos.bind(this)
    this.troggleFuncBox = this.troggleFuncBox.bind(this)
    this.troggleEpisodesBox = this.troggleEpisodesBox.bind(this)
  }

  isEmpty(obj) {
    for (var name in obj) {
      return false
    }
    return true
  }

  renderSelectionList() {
    const lists = this.props.episodeLists
    var flag = this.isEmpty(lists)
    if(flag) return
    const SelectionArr = []
    for (let i in lists) {
      SelectionArr.push(
        <li key={i} className={lists[i].id == this.props.playingIndex ? 'playing' : ''}
          onClick={ () => {this.changeAlbum(i)}}>
          {lists[i].name}
        </li>
      )
    }
    return SelectionArr
  }

  renderEpisodesList() {
    let type = this.props.episodesList.buoy[0].l

    if( this.props.episodeLists.length === 1 || type =="电影") return

    return (
      <Episodes
        ref="epiBox"
        type={ type }
        troggleEpisodesBox={ this.troggleEpisodesBox }
        buoy={ this.props.episodesList.buoy }
        dispatchPlayerState={ this.props.dispatchPlayerState }
        playingIndex={ this.props.playingIndex }
        episodeLists={ this.props.episodeLists }
        />
    )
  }

  renderActorList() {
    let { actors } = this.props.episodesList
    if( actors === "" || actors === undefined || actors.length == 0) return
    let type = this.props.episodesList.buoy[0].l
    return (
      <Actor
        ref="actBox"
        type = { type }
        actors={ actors } /> )
  }

  renderRelatedVideos() {
    let eLists = this.props.episodesList
    let rVideos = eLists.related_titles
    if(rVideos=== undefined || rVideos.length === 0) return
    let type = this.props.episodesList.genres[0].name === '直播' ? '直播' : eLists.buoy[0].l
    return (
      <RelatedVideos
        ref="relateBox"
        type = {type}
        dispatchPlayerState = { this.props.dispatchPlayerState }
        dispatchPlayer = { this.props.dispatchPlayer }
        troggleFuncBox={ this.troggleFuncBox }

        relatedVideo={ rVideos }/>
    )
  }
  //hide funcBox
  troggleFuncBox(flag) {
    this.refs.selBox.style.display = flag ? 'none' : 'block'
  }

  troggleEpisodesBox(flag) {
    // this.refs.funcBox.refs.func.style.display = flag ? 'none' : 'block'
    // this.refs.introBox.refs.introduce.style.display = flag ? 'none' : 'block'
    // this.refs.actBox && (this.refs.actBox.refs.actor.style.display = flag ? 'none' : 'block')
    // this.refs.relateBox.refs.relateBox.style.display = flag ? 'none' : 'block'
  }

  changeAlbum(index) {
    let nextEpisode = this.props.episodeLists[index];
    this.props.dispatchPlayerState({
      subTitle: nextEpisode.name,
      playingIndex: nextEpisode.id,
      playUrl: nextEpisode.url
    })
  }

  render() {
    let { actors, directors, description, douban_rating, name, year, tags, genres, play_count } = this.props.episodesList
    let action_arr = []
    if(typeof actors !== 'string' && actors != undefined) {
      actors.forEach((val)=>{
        action_arr.push(val.name)
      })
      actors = action_arr.join('、')
    }
    let d = document.getElementsByClassName('functionNav-box')[0]
    let selTop = ''
    if( d !== undefined ) {
      let dTop = +d.style.top.replace('px', '')
      let dHeight = d.clientHeight
      selTop = dTop + dHeight + 'px'
    }
    return (
      <div className="selections-box" style={selTop == '' ? {} : {top: 0}}>
        <div ref="selBox">
          {/** <FunctionNav
            ref="funcBox"/>
          Introduction **/}
          <VideoIntroduction
            ref="introBox"
            info={this.props.episodesList}
            />
          {/** Episodes **/}
          { this.renderEpisodesList() }
          {/** Actor **/}
          { this.renderActorList() }
          {/** RelatedVideos **/}
        </div>
        { this.renderRelatedVideos() }
        </div>
      );
    }
}

class VideoIntroduction extends Component {
  constructor(props) {
    super(props)
    this.unfoldDesc = this.unfoldDesc.bind(this)
    this.renderEpisodeStyle = this.renderEpisodeStyle.bind(this)
    this.renderDramaStyle = this.renderDramaStyle.bind(this)
    this.renderLiveStyle = this.renderLiveStyle.bind(this)
    // this.renderVarietyStyle = this.renderVarietyStyle.bind(this)
  }

  unfoldDesc(e) {
    let node = this.refs.introBox
    if ( node.className.indexOf('active') > -1 ) {
      node.className = 'introduce-box'
      return
    }
    node.className = 'introduce-box active'
  }
  renderEpisodeStyle() {
    let { buoy, genres } = this.props.info
    let type = genres[0].name == "直播" ? '直播' : buoy[0].l
    switch (type) {
      case "综艺":
          console.log("综艺")
          return this.renderDramaStyle()
      case "直播":
          console.log("直播")
          return this.renderLiveStyle()
        break;
      default:
        console.log("电影或电视剧")
        return this.renderDramaStyle()
    }
  }
  renderDramaStyle() {
    let { description, douban_rating, name, year, directors, genres, tags, play_count, buoy, actors } = this.props.info
    let action_arr = []
    if(typeof actors !== 'string' && actors != undefined) {
      actors.forEach((val)=>{
        action_arr.push(val.name)
      })
      actors = action_arr.join('、')
    }

    let type = buoy[0].l
    let act = type === '综艺' ? '嘉宾' : '主演'
    let host = type === '综艺' ? '主持人' : '导演'

    if(type == '') {
      if(genres.length > 0) {
        type = genres[0].name
      }
    }

    let sel = (
      <section className="introduce-box" ref="introBox">
        <p className="introduce-score ofhidden">
          <span>{ name }</span>
          <span>{ douban_rating }</span>
        </p>
        <p
          className="introduce-more"
          onClick={(e)=>{ this.unfoldDesc(e) }}>
        </p>
        <ul className="introduce-play-count ofhidden">
          <li>
            <span>视频类型：</span>
            <span>{ type }</span>
          </li>
          <li><span>播放：</span><span>{ play_count }次</span></li>
        </ul>
        <ul className="introduce-actor">
          <li
            style={(actors == undefined || actors.length == 0) ? {display:'none'} : {display:'block'}}>
            <span>{ act }：</span>
            <span>{ actors }</span>
          </li>
        </ul>
        <ul className="introduce-director ofhidden">
          <li style={ (directors == undefined || directors.length === 0)? {display:'none'} : {display:'block'}}>
            <span>{ host }：</span>
            <span>{ directors.length > 0 && directors[0].name }</span>
          </li>
          <li
            style={year == undefined ? {display:'none'} : {display:'block'}}>
            <span>年份：</span>
            <span>{ year }</span>
          </li>
        </ul>
        <ul
          style={(tags == undefined || tags.length == 0) ? {display:'none'} : {display:'block'}}
          className="introduce-type ofhidden">
          <li>
            <span>类型：</span>
            <span>{ tags.length > 0 && tags[tags.length-1].name }</span>
          </li>
        </ul>
        <section
          style={description == undefined ? {display:'none'} : {display:'block'}}
          className="introduce-desc">
          <p>内容简介：{ description } </p>
        </section>
      </section>
    )
    return sel
  }
  renderLiveStyle() {
    let { description, douban_rating, name } = this.props.info
    return(
      <div className="live-box">
        <h1 className="live-name">{name}</h1>
        <div></div>
        <div className="live-rating">
          <span>豆瓣评分:</span>
          <span>{ douban_rating }</span>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div ref="introduce">
        {this.renderEpisodeStyle()}
      </div>
    )
  }
}
