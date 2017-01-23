import React, { Component } from 'react';
import SearchRecord from './SearchRecord';
import { connect } from 'react-redux';
import {browserHistory, hashHistory} from 'react-router';
import { getSearchList, getSearchNameList, setSearchState } from '../../actions/search';
import { Icon } from 'react-onsenui'
import './search.styl';

const history = window.config.hashHistory ? hashHistory : browserHistory;
import ResultList from './ResultList'
import ToolKit from '../../tools/tools'
import Storage from '../../libs/storage'

import Toast from '../common/Toast'

class Search extends Component {
    constructor(props) {
      super(props);
      this.state = {
        fromVideo: false,
        recordLists: [],
        renderSearchFlag: false,
        recordListsVisable: false,
        notFoundVisable: false,
        nameListVisable: true,
        resultList: {},
      }
      this.renderSearchList = this.renderSearchList.bind(this)
      this.renderResultList = this.renderResultList.bind(this)
      this.updateLists = this.updateLists.bind(this)
      this.requestAPI = this.requestAPI.bind(this)
      this.dispathNameLists = this.dispathNameLists.bind(this)
      this.troggleRecordList = this.troggleRecordList.bind(this)
      this.setInputText = this.setInputText.bind(this)
      this.hideNameList = this.hideNameList.bind(this)
      this.showNameList = this.showNameList.bind(this)
      this.disPatchSearchState = this.disPatchSearchState.bind(this)
      this.saveSearchRecord = this.saveSearchRecord.bind(this)
    }

    static contextTypes = {
      store: React.PropTypes.object
    }
    // whether have search record
    componentWillMount() {
      Storage.s_set(Storage.KEYS.SEARCH_PAGE_KEY, true);
      let lists = Storage.get(Storage.KEYS.SEARCH_HISTORY)
      let rlists = lists == null ? [] : lists
      if(this.props.searchList) {
        this.setState({
          fromVideo: true,
          resultList: this.props.searchList,
          recordLists: rlists,
          recordListsVisable: false,
          nameListVisable: false})
          return
      }

      if( rlists == null || rlists.length === 0) {
        this.setState({
          recordLists: []
        })
      } else {
        this.setState({
          recordLists: rlists,
          recordListsVisable: true
        })
      }
    }
    //if have search results display results else display not found|| document.getElementById('search-input').value == ''
    componentWillReceiveProps(a, b) {
      if (!this.state.renderSearchFlag) return
      if(document.getElementById('search-input').value == '') {
        this.setState({nameListVisable: false, recordListsVisable: true,resultList:{}})
        return
      }
      if(a.searchList && !ToolKit.isEmpty(a.searchList)) {
        this.setState({resultList: a.searchList, recordListsVisable: false})
      } else {
        this.setState({resultList: a.searchList, notFoundVisable: true})
      }
    }
    //component uninstall initialize renderSearchFlag state
    componentWillUnmount() {
      // this.setState({
      //   renderSearchFlag: false
      // })
    }
    //update search result lists
    updateLists(arr) {
      if(arr.length === 0) {
        this.setState({
          recordLists: arr,
          recordListsVisable: false
        })
        return
      }
      this.setState({
        recordLists: arr,
      })
    }
    disPatchSearchState(st) {
      this.context.store.dispatch(setSearchState(st))
    }
    dispathNameLists(val){
      this.setState({
        renderSearchFlag: true,
        recordListsVisable: false
      }, ()=>{
        let params = {
          // cp: 'DCNKzQd_d_9k3macDWIH_g',
          q: val
        }
        this.context.store.dispatch(getSearchNameList(params))
      })
    }
    //request search api
    requestAPI(val) {
      console.log(document.getElementById('search-input').value);
      if(val == '' || document.getElementById('search-input').value == '') {
        this.disPatchSearchState({searchList: undefined})
        // if(this.state.recordLists.length === 0) {
        //   this.disPatchSearchState({searchList: undefined})
        //   return
        // }
        this.setState({
          recordListsVisable: true
        },()=>{
          // this.disPatchSearchState({searchList: undefined})
        })
        return
      }
      this.setState({
        renderSearchFlag: true,
        recordListsVisable: false
      }, ()=>{
        let params = {
          // cp: 'DCNKzQd_d_9k3macDWIH_g',
          q: val
        }
        this.context.store.dispatch(getSearchList(params))
      })
    }
    // only have search history can render SearchRecord component
    renderSearchList() {
      if(this.state.recordListsVisable) {
        return (<SearchRecord
                hideNameList={this.hideNameList}
                setInputText={this.setInputText}
                list={this.state.recordLists}
                requestAPI={this.requestAPI}
                updateLists={this.updateLists} />)
      }
    }
    // only have search results can render ResultList component
    renderResultList() {
      if(this.state.nameListVisable) {
        if(ToolKit.isEmpty(this.state.resultList)) return
        return (
          <NameList
            troggleRecordList = { this.troggleRecordList }
            updateLists={ this.updateLists }
            saveSearchRecord={ this.saveSearchRecord }
            hideNameList={ this.hideNameList }
            recordLists={ this.state.recordLists }
            lists={ this.state.resultList }
          />)
      } else {
        if( this.props.searchList == undefined ) return
        let d = document.getElementById('search-input')
        if (d && d.value == "") return
        return (
          <ResultList
          nameListVisable={this.state.nameListVisable}
          troggleRecordList={this.troggleRecordList }
          recordListsVisable = {this.state.recordListsVisable}
          lists = {this.props.searchList} />
        )
      }
    }
    setInputText(item) {
      this.refs.searchNav.clearInputText(item)
      this.requestAPI(item)
    }
    // hide nameList
    hideNameList(name) {
      this.setState({
        recordListsVisable: false,
        nameListVisable: false
      },()=>{
        this.setInputText(name)
      })
    }
    showNameList() {
      this.setState({
        nameListVisable: true
      })
    }
    // hide recordList
    troggleRecordList(flag) {
      this.setState({
        recordListsVisable: flag
      })
    }
    saveSearchRecord(item) {
      this.refs.searchNav.saveSearchRecord(item)
    }
    render() {
       return (
         <div className="search-box">
          <SearchNav
            ref="searchNav"
            fromVideo={ this.state.fromVideo }
            searchList={ this.props.searchList }
            hideNameList={ this.hideNameList }
            showNameList={ this.showNameList }
            updateLists={ this.updateLists }
            disPatchSearchState={ this.disPatchSearchState }
            dispathNameLists={ this.dispathNameLists }
            disableFromVideo={ this.disableFromVideo }
            requestAPI={this.requestAPI}/>
          { this.renderSearchList() }
          { this.renderResultList() }
         </div>
       );
    }
}
class NameList extends Component {
  constructor(props) {
    super(props)
    this.renderNameList = this.renderNameList.bind(this)
    this.saveSearchRecord = this.saveSearchRecord.bind(this)
  }
  shouldComponentUpdate() {
    if(document.getElementById('search-input').value == '') {
      console.log('====search-input=====');
      return false
    }
    return true
  }
  saveSearchRecord(val) {
    let r = Storage.get(Storage.KEYS.SEARCH_HISTORY)
    let arr = []
    if(r == null) {
      arr.push(val)
      Storage.set(Storage.KEYS.SEARCH_HISTORY, arr)
      this.props.updateLists(arr)
    } else {
      if(r.indexOf(val) === -1) {
        r.length >= 4 ? r.splice(0, 1, val) : r.unshift(val)
      } else {
        let index = r.indexOf(val)
        r.splice(index, 1)
        r.unshift(val)
      }
      Storage.set(Storage.KEYS.SEARCH_HISTORY, r)
      this.props.updateLists(r)
    }

    this.props.hideNameList(val)
  }

  renderNameList() {
    // let st = sessionStorage.getItem('searchText')
    let st = Storage.s_get(Storage.KEYS.SEARCH_TEXT)
    if(st) {
      console.log('shouldComponentUpdate');
      // sessionStorage.removeItem('searchText')
      Storage.s_remove(Storage.KEYS.SEARCH_TEXT)
      return
    }
    let lists = this.props.lists
    let nameArr = []
    for (let i in lists) {
      let name = lists[i].name
      nameArr.push(
        <li key={ i } onClick={()=>{ this.saveSearchRecord(name) }}>
          { name }
        </li>
      )
    }
    return nameArr
  }
  render() {
    if(document.getElementById('search-input').value == '') {
      return (
        <div></div>
      )
    }
    return(
      <ul className="search-name-list">
        {this.renderNameList()}
      </ul>
    )
  }
}
/**
 * search navbar
 */
class SearchNav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      showDelIcon: false
    }
    this.clearInputText = this.clearInputText.bind(this)
  }
  componentWillMount() {
  }
  // save or update search-history Storage
  saveSearchRecord(val) {
    let r = Storage.get(Storage.KEYS.SEARCH_HISTORY)
    let arr = []
    if(r == null) {
      arr.push(val)
      // Storage.set('search-history', arr)
      Storage.set(Storage.KEYS.SEARCH_HISTORY, arr)
      this.props.updateLists(arr)
    } else {
      if(r.indexOf(val) === -1) {
        r.length >= 4 ? r.splice(0, 1, val) : r.unshift(val)
        // Storage.set('search-history', r)
      } else {
        let index = r.indexOf(val)
        r.splice(index, 1)
        r.unshift(val)
      }
      Storage.set(Storage.KEYS.SEARCH_HISTORY, r)
      this.props.updateLists(r)
    }
    this.props.hideNameList(val)
  }
  //searching user input text
  submit(e) {
    let text = document.querySelector('#search-input');
    if(text.value != "") {
      this.saveSearchRecord(text.value)
    } else {
      this.refs.toast.showToast()
    }
  }
  // focus search input
  componentDidMount() {
    let text = this.refs.input
    //focus input
    text.focus()
    //from video set search text
    if (this.props.fromVideo) {
      text.blur()
      // let val = sessionStorage.getItem('searchText')
      let val = Storage.s_get(Storage.KEYS.SEARCH_TEXT)
      this.setState({
        text: val,
        showDelIcon: true
      })
    }
    //text change show del button
    text.addEventListener('input', (e)=>{
      let flag = text.value !== '' ? true : false

      this.setState({
        text: text.value,
        showDelIcon: flag
      },()=>{
        this.props.showNameList()
        // clearTimeout(this.timer)
        this.timer = setTimeout(()=>{
          this.props.requestAPI(text.value)
        }, 300)
      })
    })
  }
  clearInputText(str) {
    let text = this.refs.input
    let flag = str !== '' ? true : false
    this.setState({
      text: str,
      showDelIcon: flag
    },()=>{
      text.focus()
      if(flag) {
        this.props.disPatchSearchState({
          searchList: undefined,
        })
      }
      this.props.requestAPI(str)
    })
  }
  backToHome() {
    // sessionStorage.removeItem('searchText')
    Storage.s_remove(Storage.KEYS.SEARCH_TEXT)
    this.props.disPatchSearchState({
      searchList: undefined,
    })
    history.goBack()
  }
  render() {
     return (
       <div className="search-nav-box">
        <form
          style={{verticalAlign: "middle"}}
          onSubmit={(e) => { this.submit(e); }} action="javascript:">
         <input
           className="search-nav-input"
           ref="input"
           id="search-input"
           value={ this.state.text }
           type="search"
           name="search"
           autoComplete="off"
           placeholder="片名，导演，主演等" />
         <span
           style={this.state.showDelIcon ? {display:'block'} : {display:'none'}}
           className="search-del ion-ios-close-empty"
           onClick={()=>{ this.clearInputText("") }}>
         </span>
         <span
           className="search-cancle"
           onClick={()=>{ this.backToHome() }}>
           取消
         </span>
        </form>
        <div className="search-nav-shadow"></div>
        <Toast
          ref="toast"
          title="请输入搜索内容"/>
       </div>
     );
  }
}

const searchList = state => {
  return {
    recordLists: state.search.recordLists,
    renderSearchFlag: state.search.recordLists,
    recordListsVisable: state.search.recordListsVisable,
    notFoundVisable: state.search.notFoundVisable,
    nameListVisable: state.search.nameListVisable,
    resultList: state.search.resultList,
    searchNameList: state.search.searchNameList,
    searchList: state.search.searchList
  }
}

export default connect(searchList)(Search)
