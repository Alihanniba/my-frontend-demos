import React, { Component } from 'react'
import VarietyCommon from './VarietyCommon'

export default class Episodes extends Component {
  constructor(props) {
    super(props)
    this.renderEpisodeList = this.renderEpisodeList.bind(this)
    this.renderVarietyEpisodes = this.renderVarietyEpisodes.bind(this)
    this.renderDramaEpisodes = this.renderDramaEpisodes.bind(this)
    this.changeAlbum = this.changeAlbum.bind(this)
    this.unfoldAllEpisodes = this.unfoldAllEpisodes.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.unfoldFlag = false
    this.episodesScroll = false
    this.epiScrollLeft = 0
  }

  renderEpisodeList() {
    let type = this.props.type
    if( type === "综艺" || type === "") {
      return this.renderVarietyEpisodes()
    } else {
      this.episodesScroll = true
      return this.renderDramaEpisodes()
    }
  }

  renderDramaEpisodes() {
    const lists = this.props.episodeLists
    const idArr = []
    for (let k = 0; k < lists.length; k++) {
      idArr.push(lists[k].id)
    }
    let index = idArr.indexOf(+this.props.playingIndex)
    if(this.episodesScroll && +index >= 2) {
      let count = +index + 1
      let sLeft = count - 3
      this.epiScrollLeft = (sLeft * 63)
    }
    const SelectionArr = []
    for (let i in lists) {
      let index = +i + 1;
      SelectionArr.push(
        <li key={i} className={lists[i].id == this.props.playingIndex ? 'playing' : ''}
            onClick={ () => {this.changeAlbum(i)}}>
            { index }
        </li>
      )
    }
    return (
      <ul
        ref="episodes"
        className={`episodes-container`}>
        { SelectionArr }
      </ul>
    )
  }

  renderVarietyEpisodes() {
    const lists = this.props.episodeLists
    const varietyArr = []
    const idArr = []

    for (let k = 0; k < lists.length; k++) {
      idArr.push(lists[k].id)
    }

    let index = idArr.indexOf(+this.props.playingIndex)
    if (index == lists.length - 1 ) { index = index - 2 }
    if (index == lists.length - 2 ) { index = index - 1 }
    let epiLists = lists.slice(index, index+3)
    lists.length <= 3 ? epiLists = lists : epiLists
    // const len = lists.length >= 3 ? 3 : lists.length
    for(let i = 0; i < epiLists.length; i++) {
        varietyArr.push(
          <li key={ i } className={epiLists[i].id == this.props.playingIndex ? 'playing' : ''}
              onClick={ () => {this.changeAlbum(i)} }>
              { epiLists[i].name }
          </li>
        )
    }

    return (
      <div className="episodes-variety-box">
        <div ref="variety">
          { varietyArr }
        </div>
        <VarietyCommon
          current={ this.props.playingIndex }
          ref="varietyCommon"
          displayStyle="none"
          lists={ lists }
          action={ this.changeAlbum }/>
      </div>
    )
  }

  changeAlbum(index) {
    if(this.episodesScroll && +index >= 2) {
      let count = +index + 1
      let sLeft = count - 3
      let epiDom = this.refs.episodes
      epiDom.scrollLeft = this.epiScrollLeft = (sLeft * 63)
    }
    let nextEpisode = this.props.episodeLists[index];
    this.props.dispatchPlayerState({
      canChangeAlbum: false,
      subTitle: nextEpisode.name,
      playingIndex: nextEpisode.id,
      playUrl: nextEpisode.url
    })
  }

  onEnd() {
    let { playingIndex, episodeLists } = this.props

    for (let i = 0; i < episodeLists.length; i++) {
      let item = episodeLists[i]
      if(item.id == playingIndex) {
        let index = i+1 == episodeLists.length ? 0 : i+1
        this.changeAlbum(index);
        return
      }
    }
  }

  unfoldAllEpisodes() {
    this.unfoldFlag = !this.unfoldFlag
    //reset selection top
    if(!this.unfoldFlag) {
      let d = document.getElementsByClassName('functionNav-box')[0]
      let s = document.getElementsByClassName('selections-box')[0]
      let selTop = ''
      if( d !== undefined ) {
        d.style.display = 'block'
        let dTop = +d.style.top.replace('px', '')
        let dHeight = d.clientHeight
        selTop = dTop + dHeight + 'px'
        s.style.top = selTop
      }
    }
    let eBox = this.refs.episodesBox
    let eI = this.refs.episodesIcon
    let eP = this.refs.episodesUpdate
    if( this.props.type === '综艺' || this.props.type === '') {
      if(this.unfoldFlag) {
        this.refs.variety.style.display = "none"
        this.refs.varietyCommon.refs.allVariety.style.display = "block"
        eBox.className="all-episodes-box"
        eI.className = "episodes-arrow-close"
        eP.style.opacity = 0
      } else {
        this.refs.variety.style.display = "block"
        this.refs.varietyCommon.refs.allVariety.style.display = "none"
        eBox.className="episodes-box"
        eI.className = "episodes-arrow-right"
        eP.style.opacity = 1
      }
      // this.refs.allVariety.style.display = "block"
      // this.props.troggleEpisodesBox(this.unfoldFlag)
      return
    }
    // debugger
    let e = this.refs.episodes
    // document.body.style.overflow = this.unfoldFlag ? 'hidden' : ''
    if(this.unfoldFlag) {
      eBox.className="all-episodes-box"
      e.className="all-episodes-container"
      eI.className = "episodes-arrow-close"
      eP.style.opacity = 0
    } else {
      eBox.className="episodes-box"
      e.className="episodes-container"
      eI.className = "episodes-arrow-right"
      eP.style.opacity = 1
      e.scrollLeft = this.epiScrollLeft
      this.epiScrollLeft = 0
    }
    // this.props.troggleEpisodesBox(this.unfoldFlag)
  }
  componentDidMount() {
    if(this.epiScrollLeft > 0) {
      let epiDom = this.refs.episodes
      epiDom.scrollLeft = this.epiScrollLeft
      this.episodesScroll = 0
    }
  }
  render() {
    let typeTitle = ''
    let type = this.props.type
    if(type == '综艺') {
      typeTitle = '期数'
    } else if (type=="电视剧" || type=="电影") {
      typeTitle = '剧集'
    } else {
      typeTitle = '选集'
    }
    return (
      <div
        ref="episodesBox"
        className="episodes-box">
        <div className="episodes-title-update">
          <p
            ref="episodesTitle"
            className="episodes-title">{ typeTitle }</p>
          <p
            onClick={()=>{ this.unfoldAllEpisodes() }}
            style={this.unfoldFlag ? {opacity: '0'} : {opacity: '1'}}
            ref="episodesUpdate"
            className="episodes-update">
            {this.props.buoy[0].r}
          </p>
        </div>
        <div
          onClick={()=>{ this.unfoldAllEpisodes() }}
          ref="episodesIcon"
          className="episodes-arrow-right">
        </div>
          { this.renderEpisodeList() }
      </div>
    )
  }
}
