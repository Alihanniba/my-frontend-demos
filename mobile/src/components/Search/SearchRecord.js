import React, { Component } from 'react'

import Storage from '../../libs/storage'

export default class SearchRecord extends Component {
    constructor(props) {
      super(props)
      this.state = {
        clearDialog: false
      }
      this.showClearDialog = this.showClearDialog.bind(this)
      this.ClearRecord = this.ClearRecord.bind(this)
    }
    showClearDialog(flag) {
      this.setState({
        clearDialog: flag
      })
    }
    ClearRecord() {
      Storage.remove(Storage.KEYS.SEARCH_HISTORY)
      this.props.updateLists([])
      console.log('clearRecord')
    }
    setInputText(item) {
      this.props.hideNameList(item)
    }
    renderSearchList() {
      let lists = this.props.list
      let listArr = []
      for (let i = 0; i < lists.length; i++) {
        let str = lists[i].length > 5 ? lists[i].substring(0, 5) + '...' : lists[i]
        listArr.push (
          <li key={i}
            onClick={()=>{this.setInputText(lists[i])}}>
            { str }
          </li>
        )
      }
      return listArr
    }
    render() {
       return (
         <div className="search-record-box">
            <div className="search-record-button">
              <span className="search-record-text">历史搜索:</span>
              <span
                className="search-record-trash"
                onClick={()=>{this.showClearDialog(true)}}>
              </span>
            </div>
            <ul className="search-record-container">
              {this.renderSearchList()}
            </ul>
            <ClearRecordbox
              clearDialog = {this.state.clearDialog}
              showClearDialog = {this.showClearDialog}
              ClearRecord = {this.ClearRecord} />
         </div>
       );
    }
}

class ClearRecordbox extends Component {
  constructor(props) {
    super(props)
    this.setSelectedStyle = this.setSelectedStyle.bind(this)
  }
  setSelectedStyle(flag) {
    let cancle = this.refs.cancle
    let confirm = this.refs.confirm
    if(flag) {
      cancle.className = ''
      confirm.className = 'active'
      this.props.ClearRecord()
    } else {
      cancle.className = 'active'
      confirm.className = ''
      this.props.showClearDialog(false)
    }
  }
  render() {
    return (
      <div className="clear-record-box" style={this.props.clearDialog == true ? {display: 'block'} : {display: 'none'}}>
        <div className="clear-record-container">
          <h1>确定清空历史记录吗？</h1>
          <div className="operation-container">
            <span
              ref="cancle"
              className="active" onClick={()=>{this.setSelectedStyle(false)}}>取消</span>
            <span
              ref="confirm"
              onClick={()=>{this.setSelectedStyle(true)}}>清空</span>
          </div>
        </div>
      </div>
    )
  }
}
