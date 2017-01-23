import React, { Component } from 'react';
import { browserHistory, hashHistory} from 'react-router';
import { connect } from 'react-redux';
import { getLiveList } from '../../actions/live';

import ToolKit from '../../tools/tools';
import VTouch from './Refresh';
import './live.styl';
import Storage from '../../libs/storage';
import reactMixin from 'react-mixin';
import ScrollMixin from '../common/ScrollMixin';
import Tracker from '../../tracker';
import LoadFailed from '../common/loadFailed';

const history = window.config.hashHistory ? hashHistory : browserHistory;

class Live extends Component {
    constructor(props) {
      super(props)
      this.state = {
        liveLists: [],
        refreshIcon: false,
        firstLoading: true,
        canLoading: false,
        showError: false
      }
      this.renderLiveList = this.renderLiveList.bind(this)
      this.goToPlayer = this.goToPlayer.bind(this)
      this.showRefresh = this.showRefresh.bind(this)
      this.pullUp = this.pullUp.bind(this)
      this.scrollListener = this.scrollListener.bind(this)
      this.pullUpFlag = false
    }
    //dispatch live data when component first load
    componentWillMount() {
      //设置直播KEY,返回首页时验证用
      Storage.s_set(Storage.KEYS.LIVE_PAGE_KEY, true);
      if(this.props.liveData.data == undefined) {
        this.props.dispatch(getLiveList(0, 0))
      } else {
        let data = this.props.liveData.data.data
        let lists = data.genreListItems
        let arr = []

        for(let i in lists) {
          arr.push(lists[i])
        }

        this.setState({
          liveLists: arr,
          canLoading: data.loadMore
        });
      }
    }
    //hide refresh icon when receive live data
    componentWillReceiveProps(nextProps, prevState) {
      let data = nextProps.liveData.data
      if (data.data === 'error') {
        this.setState({
          showError: true
        })
        return
      }
      if (data != null) {
        let lists = data.data.genreListItems
        let arr = this.pullUpFlag ? [] : this.state.liveLists
        for(let i in lists) {
          arr.push(lists[i])
        }
        this.pullUpFlag = false
        this.setState({
          liveLists: arr,
          refreshIcon: false,
          canLoading: data.data.loadMore
        });
      }
    }
    shouldComponentUpdate(nextProps, nextState) {
      // if(this.state.liveLists === null) return false
      return true
    }
    //init touch component to listener pullUp event
    componentDidMount() {
      this.Touch = new VTouch(this.refs.liveList, "y", this.showRefresh, this.pullUp)
      this.Touch.init()
    }
    scrollListener() {
      //console.log('=========正在滑动============');
      let liveObj =  this.props.liveData.data.data
  		if(document.body.scrollTop + ToolKit.winHeight() > document.body.scrollHeight - 10 && this.state.canLoading){
  			console.log('==============上拉刷新=============')
        this.setState({
          canLoading: false
        },()=>{
          this.props.dispatch(getLiveList(liveObj.s, liveObj.e))
        })
        Tracker.track('send', 'event', 'app', 'pull', 'up', 1);
  		}
    }
    //display refresh icon
    showRefresh() {
      this.setState({
        refreshIcon: true
      });
      console.log('========show refresh icon===========');
    }
    //redispatch live data
    pullUp() {
      this.pullUpFlag = true
      this.props.dispatch(getLiveList(0, 0))
      Tracker.track('send', 'event', 'app', 'pull', 'down', 1);
      console.log('=========下拉刷新==========');
    }
    //uninstall Touch component
    componentWillUnmount() {
      this.props.dispatch(getLiveList(0, 0))
      this.Touch && this.Touch.destory()
    }
    // only have liveLists can render
    renderLiveList() {
      if( this.props.liveData.data === undefined ) return
      let listArr = []
      // let lists = this.props.liveData.data.data.genreListItems
      let lists = this.state.liveLists
      // let lists = this.state.liveLists.length == 0 ? this.state.liveLists : this.props.liveData.data.data.genreListItems
      for (let index =0; index < lists.length; index++) {
        let item = lists[index]
        listArr.push(
          <figure key={ index } onClick={()=>{ this.goToPlayer(item)}}>
            <img src={ item.landscape_poster } />
            <figcaption>{ item.name }</figcaption>
          </figure>
        )
      }
      return listArr
    }
    //go to player page
    goToPlayer(item) {
      history.push(`/watch/${item.id}`)
    }

    render() {
      if (this.state.showError) {
        return (
          <LoadFailed
            ref="loadFailed"
            show={ true }
            doRetry={ this.pullUp }
          />
        )
      }
      return (
          <div className="live-container">
            <div
              style={this.state.refreshIcon ? {display:'block', height: '6em', position: 'relative'} : {display:'none'}}>
              <div ref='spinner' className={this.state.firstLoading ? 'loading-spinner loading-spinner-size6' : 'loading-spinner loading-spinner-size1'}/>
            </div>
            <div className='live-list' ref="liveList">
              { this.renderLiveList() }
            </div>
          </div>
      );
    }
}

const liveList = state => {
	return {
		liveData: state.live,
	}
}

export default connect(liveList)(reactMixin.onClass(Live, ScrollMixin))
