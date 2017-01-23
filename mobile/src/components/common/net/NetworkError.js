import React from 'react'
// import { browserHistory , hashHistory} from 'react-router'
// const history = window.config.hashHistory ? hashHistory : browserHistory

import './net.styl'

export default class NetworkError extends React.Component {
  constructor(props) {
    super(props)
    this.showNetError = this.showNetError .bind(this)
    this.hideNetError = this.hideNetError.bind(this)
    this.netRetry = this.netRetry.bind(this)
    this.cordovaNetPlugin = this.cordovaNetPlugin.bind(this)
  }

  componentDidMount() {
    if(!this.props.show) {
      this.hideNetError()
    }
  }

  netRetry() {
    this.cordovaNetPlugin()
  }

  cordovaNetPlugin() {
    if(typeof navigator.netStatus === 'undefined') return
    let self = this
    navigator.netStatus.getNetStatus(function(mes){
      if(mes.message === "NONE") {
        self.showNetError()
        return
      }
      self.hideNetError()
    })
  }

  componentWillUnmount() {

  }

  showNetError() {
    let n = this.refs.net
    n.style.display = 'block'
  }

  hideNetError() {
    let n = this.refs.net
    n.style.display = 'none'
  }

  render() {
    return (
      <div
        ref="net"
        onClick={()=>{ this.netRetry() }}
        className="netError">
        <div className="wifi-logo"></div>
        <div className="wifi-text">
          { this.props.title }
        </div>
      </div>
    );
  }
}

NetworkError.defaultProps = {
  title: '无网络连接，请点击屏幕重试',
  show: false
}
