import React, { Component } from 'react';
import { connect } from 'react-redux'

import EpisodeItem from '../EpisodeItem/EpisodeItem';
import Compile from '../Compile/Compile';
import { getHomeList, clearHomeData } from '../../actions/home';
import { showCompile } from '../../actions/compileStatus';
import { getClassifyList, clearClassifyList } from '../../actions/classify'


import { getChannels } from '../../actions/compile';


import Immutable from 'immutable';
import ToolKit from '../../tools/tools'
// import Storage from '../../tools/storage'
import Storage from '../../libs/storage';
import VTouch from '../Live/Refresh';
import Tracker from '../../tracker';

import { browserHistory, hashHistory} from 'react-router';

const history = window.config.hashHistory ? hashHistory : browserHistory

import './home.css';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			isUpLoading: true,
			isDownLoading: true,
      		firstLoading: true,
			freezeNum: 0,
      		refreshIcon: false,
			navSource: [],
			mainSource: []
		};
		this.start = this.end = 0;
		this.firstUpKey = this.lastUpKey = this.firstDownKey = this.lastDownKey = null;
		this.isUpLoading = this.isDownLoading = true;
		this.fromScroll = this.refreshKey = false;
		this.handle = 'up';
		this.channelKey = '';
		this.Touch = null;
		/* home start */
		this.showCompile = this.showCompile.bind(this);
		this.navHandleClick = this.navHandleClick.bind(this);
		this.uploadNav = this.uploadNav.bind(this);
		/* home end */
		
		/* episode start */
    	// this.calculate = this.calculate.bind(this);
    	this.scrollListener = this.scrollListener.bind(this);
		/* episode end */

		/* pull down start  */
		this.showRefresh = this.showRefresh.bind(this);
		this.pullUp = this.pullUp.bind(this);
		/* pull down end  */
	}

	static contextTypes = {
		store: React.PropTypes.object
	}

	componentWillMount() {
		//表示第一次进入,频道刷新key
		this.channelKey = 1;
		this.refreshKey = true;
		//获取全部导航tab
		!(Storage.s_get(Storage.KEYS.PLAY_PAGE_KEY) || Storage.s_get(Storage.KEYS.SEARCH_PAGE_KEY) || Storage.s_get(Storage.KEYS.RECORD_PAGE_KEY) || Storage.s_get(Storage.KEYS.COLLECT_PAGE_KEY) || Storage.s_get(Storage.KEYS.LIVE_PAGE_KEY) || Storage.s_get(Storage.KEYS.ME_PAGE_KEY)) && this.context.store.dispatch(clearClassifyList());
		
		this.context.store.dispatch(getClassifyList());
		
		//其他页面返回首页先清除list  store
		(Storage.s_get(Storage.KEYS.SEARCH_PAGE_KEY) || Storage.s_get(Storage.KEYS.RECORD_PAGE_KEY) || Storage.s_get(Storage.KEYS.COLLECT_PAGE_KEY) || Storage.s_get(Storage.KEYS.PLAY_PAGE_KEY) || Storage.s_get(Storage.KEYS.LIVE_PAGE_KEY) || Storage.s_get(Storage.KEYS.ME_PAGE_KEY)) && this.context.store.dispatch(clearHomeData());
	}

	componentDidMount() {
		//pull-down init
		this.Touch = new VTouch(this.refs.homeList, "y", this.showRefresh, this.pullUp)
    this.Touch.init()
	  document.addEventListener('scroll', this.scrollListener)
	}

	// shouldComponentUpdate(nextProps, nextState) {
	// 	return !Immutable.is(nextProps.getHomeData, this.props.getHomeData)
	// }

	componentWillReceiveProps(nextProps, nextState) {
		//存储频道
		if (nextProps.classifyList && nextProps.classifyList.length > 0 && this.channelKey === 1) {
			let freezeChannelList = [];
			let noFreezeChannelList = [];
			let userShowLists = [];
			for (let i in nextProps.classifyList) {
				nextProps.classifyList[i].fixed && freezeChannelList.push(nextProps.classifyList[i]);
			}
			let userSelectedLists = Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL) ? Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL) : [];
			for (let i in userSelectedLists) {
				!userSelectedLists[i].fixed && noFreezeChannelList.push(userSelectedLists[i])
			}
			
			userShowLists = freezeChannelList.concat(noFreezeChannelList);
			//首次进入设置初始channel_id
			!Storage.get(Storage.KEYS.HOME_LOCALS.CURRENT_CHANNEL_ID) && Storage.set(Storage.KEYS.HOME_LOCALS.CURRENT_CHANNEL_ID, userShowLists[0].id);

			if (!Storage.s_get(Storage.KEYS.PLAY_PAGE_KEY) && !Storage.s_get(Storage.KEYS.LIVE_PAGE_KEY) && !Storage.s_get(Storage.KEYS.ME_PAGE_KEY) && !Storage.s_get(Storage.KEYS.SEARCH_PAGE_KEY) && !Storage.s_get(Storage.KEYS.RECORD_PAGE_KEY) && !Storage.s_get(Storage.KEYS.COLLECT_PAGE_KEY)) {
				//当从播放页及我的页回来时会携带一个key值,以此判断是否清除store数据
				//console.log(this.start);
				//console.log(this.end);
				this.handle = 'up';
				this.context.store.dispatch(getHomeList(userShowLists[0].id, this.start, this.end, this.handle))
				// this.navHandleClick(userShowLists[0].id, 0)
			} else {
				this.context.store.dispatch(clearHomeData())
			}

			//缓存所有的频道
			Storage.set(Storage.KEYS.ALL_CHANNEL, nextProps.classifyList)
			
			//设置导航条
			Storage.set(Storage.KEYS.USER_SELECTED_CHANNEL, userShowLists);
			userShowLists.length !== 0 && this.setState({
				index: userShowLists[0].id,
				freezeNum: freezeChannelList.length,
				navSource: userShowLists
			})
			userShowLists = null;
			//设置频道刷新key, 仅当刷新页面时才请求服务器全部频道api
			this.channelKey = 2;
		}

		//由pull down 引起的render
		if (this.state.refreshIcon) {
			this.setState({
				refreshIcon: false,
				firstLoading: false
			})
		}

		if (nextProps.getCompileStatus !== true && nextProps.getCompileStatus !== this.props.getCompileStatus) {
			document.body.scrollTop = Storage.s_get(Storage.KEYS.HOME_SCROLL_KEY)
			this.Touch.init();
			Storage.s_remove(Storage.KEYS.HOME_SCROLL_KEY);
		}

		if ( nextProps.getHomeData.data && nextProps.getHomeData.data.data.length > 0) {
			this.refreshKey = false;
			let newPropsObj = nextProps.getHomeData.data;
			let newPropsData = newPropsObj.data;
			this.handle === 'up' ? this.isUpLoading = newPropsObj.loadMore : this.isDownLoading = newPropsObj.loadMore
			let loadMore = newPropsObj.loadMore;
			//设置返回首页所需缓存
			// (Number(Storage.get(Storage.KEYS.HOME_LOCALS.CURRENT_CHANNEL_ID)) !== this.state.index || !Storage.get(Storage.KEYS.HOME_LOCALS.EPISODE_DATA)) ? 
			// Storage.set(Storage.KEYS.HOME_LOCALS.EPISODE_DATA, newPropsData) : Storage.get(Storage.KEYS.HOME_LOCALS.EPISODE_DATA).length < 40 ? 
			// Storage.set(Storage.KEYS.HOME_LOCALS.EPISODE_DATA, this.state.mainSource.concat(newPropsData)) : Storage.get(Storage.KEYS.HOME_LOCALS.EPISODE_DATA).splice(19, Storage.get(Storage.KEYS.HOME_LOCALS.EPISODE_DATA).length - 20).concat(newPropsData)
			// Storage.set(Storage.KEYS.HOME_LOCALS.LOAD_MORE, loadMore);
			// Storage.set(Storage.KEYS.HOME_LOCALS.FIRST_KEY, newPropsObj.firstKey);
			// Storage.set(Storage.KEYS.HOME_LOCALS.LAST_KEY, newPropsObj.lastKey);
			if (!this.fromScroll) {
				document.body.scrollTop = 0;
			}

			//从浮层回来时不再渲染
			if (this.props.getHomeData.data && nextProps.getHomeData.data.data[0].id === this.props.getHomeData.data.data[0].id) {
				return 
			}

			this.start = (!this.firstUpKey && !this.lastUpKey && !this.firstDownKey && !this.lastDownKey) ? newPropsObj.firstKey : this.start;
			this.end = (!this.firstUpKey && !this.lastUpKey && !this.firstDownKey && !this.lastDownKey) ? newPropsObj.lastKey : this.end;

			this.firstUpKey = this.handle === 'up' ? newPropsObj.firstKey : this.firstUpKey;
			this.lastUpKey = this.handle === 'up' ? newPropsObj.lastKey : this.lastUpKey;

			this.firstDownKey = this.handle === 'down' ? newPropsObj.firstKey : this.firstDownKey;
			this.lastDownKey = this.handle === 'down' ? newPropsObj.lastKey : this.lastDownKey;

			console.log(this.state.firstLoading);
			

			this.handle === 'down' ? this.setState({
				isDownLoading: this.isDownLoading,
        		firstLoading: false,
				mainSource: newPropsData.concat(this.state.mainSource)
			}) : this.fromScroll ? this.setState({
        		isUpLoading: this.isUpLoading,
        		firstLoading: false,
				mainSource: this.state.mainSource.concat(newPropsData)
			}) : this.setState({
        		isUpLoading: this.isUpLoading,
        		firstLoading: false,
				mainSource: newPropsData
			})

			// if (this.props.getCompileStatus === true) {
        	// 	this.isUpLoading = false;
        	// 	this.isDownLoading = false;
			// }
		} else {
			this.refreshKey ? this.setState({
				isUpLoading: true,
        		firstLoading: true
			}, () => {
        		removeSessionStHandler()
			}) : this.handle === 'down' ? this.setState({
				isDownLoading: false
			}) : this.setState({
        		isUpLoading: false,
        		firstLoading: false
			}, () => {
        		removeSessionStHandler()
			})
		}

		const removeSessionStHandler = () => {
			this.isUpLoading = false;
			if (Storage.s_get(Storage.KEYS.SEARCH_PAGE_KEY) || Storage.s_get(Storage.KEYS.RECORD_PAGE_KEY) || Storage.s_get(Storage.KEYS.COLLECT_PAGE_KEY) || Storage.s_get(Storage.KEYS.PLAY_PAGE_KEY) || Storage.s_get(Storage.KEYS.LIVE_PAGE_KEY) || Storage.s_get(Storage.KEYS.ME_PAGE_KEY)) {
				Storage.s_remove(Storage.KEYS.PLAY_PAGE_KEY)
				Storage.s_remove(Storage.KEYS.LIVE_PAGE_KEY)
				Storage.s_remove(Storage.KEYS.ME_PAGE_KEY)
				Storage.s_remove(Storage.KEYS.SEARCH_PAGE_KEY)
				Storage.s_remove(Storage.KEYS.RECORD_PAGE_KEY)
				Storage.s_remove(Storage.KEYS.COLLECT_PAGE_KEY)
				//根据backKey值返回至相应的tab
				let firstChannelID = Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL)[0].id;
				this.handle = 'up';
				this.start = this.end = 0;
				this.firstUpKey = this.lastUpKey = this.firstDownKey = this.lastDownKey = null;
				!Storage.s_get(Storage.KEYS.BACK_KEY) ? 
				this.navHandleClick(Number(firstChannelID), 0) : Number(Storage.s_get(Storage.KEYS.BACK_POSITION_KEY)) === 0 ? 
				this.context.store.dispatch(getHomeList(Number(Storage.s_get(Storage.KEYS.BACK_KEY)), 0, 0, this.handle)) : this.navHandleClick(Number(Storage.s_get(Storage.KEYS.BACK_KEY)), Number(Storage.s_get(Storage.KEYS.BACK_POSITION_KEY)));
			}
		}


	}

	componentWillUnmount() {
		this.refreshKey = false;
		//卸载组件上时，取消事件监听与绑定
		document.removeEventListener('scroll', this.scrollListener)
    }

	//传给频道组件更新导航
	uploadNav(source) {
		this.setState({
			navSource: source
		})
	}

	//display refresh icon
  showRefresh() {
		this.setState({
			refreshIcon: true,
      		firstLoading: false
		});
		console.log('========show refresh icon===========');
  }

	//redispatch live data
  pullUp() {
		console.log('=============document.body.scrollTop==================' + document.body.scrollTop)
		//console.log(this.props.getCompileStatus)
		if (document.body.scrollTop <= 50) {
			this.handle = 'down';
			let firstDownKey = this.firstDownKey ? this.firstDownKey : this.start;
			let lastDownKey = this.lastDownKey ? this.lastDownKey : this.end;
			this.context.store.dispatch(getHomeList(this.state.index, firstDownKey, lastDownKey, this.handle));
			Tracker.track('send', 'event', 'app', 'pull', 'down', 1);
			console.log('=========下拉刷新==========');
		}
  }

	navHandleClick(i, index) {
		//index表示当前元素在nav中的index位数
		let linkageKey;
		//频道点击同一tab返回
		// console.log(Storage.s_get(Storage.KEYS.HOME_SCROLL_KEY));
		if (Storage.s_get(Storage.KEYS.HOME_SCROLL_KEY) !== null && this.state.index === Number(i)) {
			return;
		} 
		Storage.s_get(Storage.KEYS.HOME_SCROLL_KEY) && this.context.store.dispatch(clearHomeData());
		this.fromScroll = false;
		
		this.setState({
			index: Number(i),
			firstLoading: true,
			isUpLoading: true
		})
		//设置页面返回定义key
		Storage.s_set(Storage.KEYS.BACK_KEY, Number(i))
		Storage.s_set(Storage.KEYS.BACK_POSITION_KEY, Number(index))

		let active = document.querySelector('.active');
		//样式联动
		let navMain = this.refs.navMain;
		let navHeader = this.refs.navHeader;
		let navChildLen = navMain.childNodes.length;
		let scrollLeft;
		//此处用于判断从频道页跳转回首页时选中tab被删除情况
		if (index >= 3) {
			let dw = document.body.offsetWidth; //网页可见区域宽
			// let nw = navMain.clientWidth //navMain元素宽度
			let nol = active.offsetLeft //当前元素的获取对象相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置
			let ncw = active.clientWidth //当前元素的宽度
			
			nol = (index !== '') ? navMain.children[Number(index)].offsetLeft : nol;
			
			//相对距离 = 绝对坐标(offsetLeft) - scrollLeft
			scrollLeft = Math.abs(nol - (dw - ncw) / 2); //计算位移距离
		}
		navHeader.scrollLeft = index < 3 ? 0 : scrollLeft;
		this.handle = 'up';
		this.start = this.end = 0;
		this.isUpLoading = this.isDownLoading = true;
		this.firstUpKey = this.lastUpKey = this.firstDownKey = this.lastDownKey = null;
		this.context.store.dispatch(getHomeList(Number(i), 0, 0, this.handle));
		let name = navMain.children[index] && navMain.children[index].innerText || ''
		Tracker.track('send', 'event', 'genre', 'click', i + '-' + name , 1);
	}

	//控制频道浮层显示消失
	showCompile() {
		// console.log(document.body.scrollTop);
		Storage.s_set(Storage.KEYS.HOME_SCROLL_KEY, document.body.scrollTop)
		// sessionStorage.setItem('home_scroll', document.body.scrollTop);
		this.Touch.destory();
		this.context.store.dispatch(showCompile())
		Tracker.track('send', 'event', 'genre', 'edit', 'genre', 1);
	}
	
	scrollListener() {
		if(document.body.scrollTop + ToolKit.winHeight() > document.body.scrollHeight - 10 && this.isUpLoading === true){
			console.log('=========上拉加载==========')
			this.fromScroll = true;
			this.isUpLoading = false;
			this.handle = 'up';
			this.context.store.dispatch(getHomeList(this.state.index, this.firstUpKey, this.lastUpKey, this.handle))
			Tracker.track('send', 'event', 'app', 'pull', 'up', 1);
		}
  }

	render () {
		let style, childStyle, spinner = '';
        if (this.state.firstLoading) {
            style = {
                position: 'fixed',
				top: '50%',
				left: '50%',
				zIndex: 99
            }
        } else {
            style= {
                position: 'relative',
                height: '2em'
            }
        }
        if(this.state.isUpLoading){
			console.log('-------------show   loading------------')
            spinner = <div style={ style }>
                        <div className='loading-spinner loading-spinner-size6' />
                    </div>
        }

		let $navMain = this.state.navSource.length > 0 ? this.state.navSource.map((nav, index) => {
				return <li onClick={ () => {this.navHandleClick(nav.id, index)} } data-index={ index } data-id={ nav.id } key={ index } className={ this.state.index == nav.id ? 'active' : '' }>{ nav.name }</li>
			}) : '';
		return (
			<div>
				{ this.props.getCompileStatus === true ? <Compile navHandleClick={ this.navHandleClick } scrollListener={ this.scrollListener } freezeNum={ this.state.freezeNum } uploadNav={ this.uploadNav } /> : '' }
				<div className="nav-box" >
					<div className="nav-content">
						<div className="nav-header" ref="navHeader">
							<ul className="nav-main" ref="navMain">
							{ $navMain }
							</ul>
						</div>
						
						<div className="right add"  onClick={ () => { this.showCompile() } }>
						</div>
					</div>
				</div>
				<div ref="homeList" className="home-list">
					<div style={this.state.refreshIcon ? {display:'block', position: 'relative', height:'1em'} : {display:'none'}}
						className="">
						<div ref='spinner' className={this.state.firstLoading ? 'loading-spinner loading-spinner-size6' : 'loading-spinner loading-spinner-size1'}/>
					</div>
					<EpisodeItem navHandleClick = { this.navHandleClick } data={ this.state.mainSource } isLoading={ this.state.isUpLoading } classifyId={ this.state.index }/>
					{ spinner }
				</div>
			</div>
		);
	}
}

const getAppList = state => {
	return {
		getHomeData: state.home,
		getCompileStatus: state.compileStatus,
		classifyList: state.classify.classifyList
	}
}

export default connect(getAppList, { getHomeList, clearHomeData, getClassifyList, clearClassifyList })(Home)
