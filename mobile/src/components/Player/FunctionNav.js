import React, { Component } from 'react'
import Airplay from '../../libs/airplay'
import Storage from '../../libs/storage'
import Toast from '../common/Toast'

class FunctionNav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isCollect: false,
      focusIcon: 0,
      isImage: false,
      toastTitle: '',
      // collectCount: 1234,
      shareVisible: false
    }
    this.videoChange = this.videoChange.bind(this)
    this.getStorageState = this.getStorageState.bind(this)
  }

  componentWillMount() {
    this.getStorageState()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      isCollect: false,
    },()=>{
      // this.getStorageState()
    })
  }

  getStorageState() {
    let _this= this
    Storage.get(Storage.KEYS.FAVOURITE, (item)=>{
      if( item.titleId === +_this.props.titleId ) {
        _this.setState({
          isCollect: true
        })
      }
    })
  }

  handelCollect() {
    let { collectCount, isCollect } = this.state
    let { subTitle, poster, titleId, videoId } = this.props
    if( isCollect ) {
      this.setState({
        isCollect: false,
        toastTitle: '取消收藏'
      },()=>{
        Storage.delete(Storage.KEYS.FAVOURITE, (item) => item.titleId ===  +titleId);
        this.refs.toast.showToast()
      })
      return
    }
    this.setState({
      isCollect: true,
      toastTitle: '收藏成功'
    },()=>{
      Storage.set(Storage.KEYS.FAVOURITE, {titleId: +titleId, episodeId: videoId, name: subTitle, img: poster, time: Date.now(), duration: null, current: 0});
      this.refs.toast.showToast()
    })
  }
  handleImage() {
    // let index = !this.state.isImage ? 1 : 0
    // this.setState({
    //   isImage: !this.state.isImage,
    //   focusIcon: index
    // })
  }

  handleShare() {
    // this.imageClick = !this.imageClick
    // let index = !this.state.shareVisible ? 2 : 0
    // //disabled scroll event
    // document.body.style.overflow = this.state.shareVisible ? '' : 'hidden'
    // this.setState({
    //   shareVisible: !this.state.shareVisible,
    //   focusIcon: index
    // })
  }

  videoChange(info) {
    // if(info.video === undefined) return
    Airplay(info.video, this.refs.monitor);
  }

  renderShareList() {
    const lists = this.props.lists
    const SelectionArr = []
    for (let i = 0; i < lists.length; i++) {
      SelectionArr.push(
        <figure key={i}>
          <img />
          <figcaption>{ lists[i].title }</figcaption>
        </figure>
      )
    }
    return SelectionArr
  }

  render() {
    let width = document.body.offsetWidth;
    if (width > 1024) {
      width = 1024;
    }
    let h = (width / 16 * 9) + 'px'
    return (
      <div ref="func" className="functionNav-box" style={{top: h}}>
        <ul className="function-box">
          <li className="function-item one" >
            <span
              className={ this.state.isCollect ? "func-collected-item" : "func-collect-item" }
              onClick={()=>{ this.handelCollect() }}>
            </span>
            {/**
            <span
              onClick={()=>{ this.handelCollect() }}
              style={{ fontSize: "18px" }}>
              { this.state.collectCount }
            </span>*/}
          </li>
          <li
            ref='monitor'
            className={ (this.state.isImage && this.state.focusIcon === 1) ? 'func-imaged-item' : 'func-image-item'}
            onClick={()=>{this.handleImage()}}>
          </li>
          <li
            onClick={()=>{ this.handleShare() }}
            className={(this.state.shareVisible && this.state.focusIcon === 2) ? 'func-shared-item' : 'func-share-item'}>
          </li>
        </ul>
        <div style={ this.state.shareVisible === true ? {display: 'block'} : {display: "none"} }
        className="share-video-box">
            { this.renderShareList() }
            <div
              onClick={()=>{ this.handleShare() }}
              className="share-box-cancle">取消</div>
        </div>
        <div
          style={ this.state.shareVisible === true ? {display: 'block'} : {display: "none"} }
          className="opacity-shade"> </div>
        <Toast
          ref="toast"
          title={ this.state.toastTitle }/>
      </div>

    )
  }
}

FunctionNav.defaultProps = {
  collect: 1234,
  lists: [
    {title: '微信'},
    {title: '朋友圈'},
    {title: 'facebook'}
  ]
}

export default FunctionNav
