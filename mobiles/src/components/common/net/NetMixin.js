import React from 'react'

const NetMixin = {

  componentDidMount() {
    if( typeof navigator.netStatus === "undefined") return
    var self = this
      navigator.netStatus.registerNetStatus(function(mes){
        if(mes.message === "NONE") {
          self.refs.net.showNetError()
          return
        }
        if(mes.message !== "NONE" && mes.message !== "WIFI") {
          self.refs.toast.showToast()
        }
      })
  },

  componentWillUnmount() {
    navigator.netStatus && navigator.netStatus.unRegisterNetStatus()
  }
}

export default NetMixin
