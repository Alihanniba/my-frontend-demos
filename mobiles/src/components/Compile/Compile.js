import React, {Component} from 'react';
import { connect } from 'react-redux'
import { browserHistory, hashHistory} from 'react-router';

import { getHomeList } from '../../actions/home';
import { postChannels } from '../../actions/compile';
import { hideCompile } from '../../actions/compileStatus';

import { showChannels, hideChannels } from '../../actions/moreChannels';

import MoreChannels from '../MoreChannels/MoreChannels';

import './compile.css';
import ToolKit from '../../tools/tools'
import User from '../../actions/user'
import Storage from '../../libs/storage';

import ListWrapper from './ListWrapper'

import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';

const history = window.config.hashHistory ? hashHistory : browserHistory

class Compile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            MyChannel: [],
            PushChannel: []
        };
        this.step = 0;

        this.ClickToEditOrOver = this.ClickToEditOrOver.bind(this)
        this.addChannel = this.addChannel.bind(this);
        this.removeChannel = this.removeChannel.bind(this);
        this.hideCompile = this.hideCompile.bind(this);
        this.remoreMoreChannel = this.remoreMoreChannel.bind(this);
        this.updatePushChannels = this.updatePushChannels.bind(this);
        this.setMyChannel = this.setMyChannel.bind(this);
        this.toDragSetState = this.toDragSetState.bind(this);
    }

    static defaultProps = {
        MyChannel: [],
        PushChannel: []
    }

    static contextTypes = {
        store: React.PropTypes.object
    }

    componentWillMount() {
        document.removeEventListener('scroll', this.props.scrollListener)
        document.getElementsByTagName('html')[0].style.overflow = 'hidden';
    }

    componentDidMount () {
        window.config.goBack = this.hideCompile
        document.body.scrollTop = 0;
        document.body.style.overflow = 'hidden';
        let navMainListAll = Storage.get(Storage.KEYS.ALL_CHANNEL) ? Storage.get(Storage.KEYS.ALL_CHANNEL) : [];
        let userSelectedLists = Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL) ? Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL) : [];
        //排除下线频道
        for(let i = 0; i < userSelectedLists.length; i++) {
            let flag;
            for(let j = 0; j < navMainListAll.length; j++) {
                if (userSelectedLists[i].id === navMainListAll[j].id) {
                    flag = true;
                    break;
                }
            }
            !flag && userSelectedLists.splice(i, 1);
        }
        
        let PushChannels = ToolKit.array_difference(navMainListAll, userSelectedLists);
        this.setState({
            MyChannel: userSelectedLists,
            PushChannel: PushChannels
        })

        document.querySelector('.compile-box').addEventListener('scroll', (event) => {
            event.stopPropagation();
            // event.preventDefault();
        }, true)
    }
    
    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.getCompileData.data && nextProps.getCompileData.data.data === 200) {
            //点击完成时,上次用户选择的频道,此处也可不更新用户选择频道缓存
            this.setMyChannel(this.state.MyChannel);
            // alert('您的频道已更新');
        }
    }
    componentWillUnmount() {
        window.config.goBack = null;
        document.getElementsByTagName('html')[0].style.overflow = '';
        document.addEventListener('scroll', this.props.scrollListener)
    }
    
    ClickToEditOrOver (e) {
        //还需判断仅频道变化才上传，否则不上传
        if (this.state.editing === true) {
            //点击完成更新本地缓存及更新首页导航
            this.setMyChannel(this.state.MyChannel);
            this.props.uploadNav(this.state.MyChannel);
            // this.context.store.dispatch(postCompileList('ygrBzTEBcwyN9phd6L-R3w', Storage.get('userSelectedLists')))
        }
        this.setState({
            editing: !this.state.editing
        })
    }

    setMyChannel(source) {
        Storage.set(Storage.KEYS.USER_SELECTED_CHANNEL, source)
    }

    addChannel (key, type) {
        //type: 1 代表频道正常添加, 2代表从更多频道添加
        let PushChannel = this.state.PushChannel;
        if (type === 1) {
            let addChannel = PushChannel.splice(key, 1);
            if (!this.state.editing) {
                this.setMyChannel(this.state.MyChannel.concat(addChannel))
                this.props.uploadNav(this.state.MyChannel.concat(addChannel))
            }
            this.setState({
                MyChannel: this.state.MyChannel.concat(addChannel),
                PushChannel: PushChannel
            })
        } else if (type === 2) {
            let addChannel = PushChannel.slice(key, key + 1);
            if (!this.state.editing) {
                this.setMyChannel(this.state.MyChannel.concat(addChannel))
                this.props.uploadNav(this.state.MyChannel.concat(addChannel))
            }
            this.setState({
                MyChannel: this.state.MyChannel.concat(addChannel)
            })
        }
    }

    removeChannel (key, item) {
        event.preventDefault()
        if (this.state.editing) {
            let MyChannel = this.state.MyChannel;
            if (key >= this.props.freezeNum) {
                let removeChannel = MyChannel.splice(key, 1);
                this.setState({
                    MyChannel: MyChannel,
                    PushChannel: removeChannel.concat(this.state.PushChannel)
                })
            }
            
        } else {
            this.hideCompile()
            this.props.navHandleClick(item.id, key)
            // history.push(`/episode/${item.id}`)
        }
    }

    remoreMoreChannel(key) {
        let MyChannel = this.state.MyChannel;
        let needChannel;
        for(let i = 0, j = MyChannel.length; i < j; i++) {
            if (MyChannel[i].id === key) {
                needChannel = MyChannel[i];
                MyChannel.splice(i, 1)
            }
        }
        
        this.setMyChannel(MyChannel)
        this.props.uploadNav(MyChannel)
        this.setState({
            MyChannel: MyChannel
        })
    }

    updatePushChannels() {
        //从更多频道浮层回到频道浮层之前更新用户选择频道缓存
        this.step = 0;
        if (!this.state.editing) {
            this.setMyChannel(this.state.MyChannel);
        }
        let navMainListAll = Storage.get(Storage.KEYS.ALL_CHANNEL) ? Storage.get(Storage.KEYS.ALL_CHANNEL) : [];
        let userSelectedLists = this.state.MyChannel;
        let PushChannels = ToolKit.array_difference(navMainListAll, userSelectedLists);
        this.setState({
            PushChannel: PushChannels
        })
    }

    hideCompile() {
        //隐藏前需判断当前频道在修改后的频道list中是否存在
        //如不存在默认切换为频道第一个
        let allowClick;
        //此处需判断从频道页返回时当前key值是否存在于nav列表中，如不存在，默认定位于第一个
        // console.log(Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL))
        let userSelectedLists = Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL)
        // Storage.get('userSelectedLists');
        let backKey = Storage.s_get(Storage.KEYS.BACK_KEY)
        
        if (userSelectedLists && userSelectedLists.length > 0) {
            for(let x = 0, y = userSelectedLists.length; x < y; x++) {
                if (userSelectedLists[x].id === Number(backKey)) {
                    allowClick = true;
                    break;
                }
            }
        }

        if (!allowClick) {
            this.props.navHandleClick(Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL)[0].id, 0)
        }

        document.body.style.overflow = '';
        // document.addEventListener('scroll', this.props.scrollListener)
        //当频道页关闭时保存用户导航至服务器

        User.getUserToken() && this.context.store.dispatch(postChannels(userSelectedLists))
        if(this.props.getMoreStatus&&!!this.step) {
            this.context.store.dispatch(hideChannels())
            document.body.style.overflow = 'hidden';
            }else{
            this.context.store.dispatch(hideCompile())
        }
    }
    showMoreChannels() {
        document.body.scrollTop = 0;
        this.step++;
        this.context.store.dispatch(showChannels())
    }

    //点击完成时,给拖拽组件更新state用
    toDragSetState(items) {
        this.setState({
            MyChannel: items
        })
    }

    render() {
        let PushChannel = this.state.PushChannel.length > 0 ? this.state.PushChannel.slice(0, 9).map((item, key) => {
            return (
                <div className="channel-item channel-name other-item push" key={ key } data-id={ item.id } onClick={ () => { this.addChannel(key, 1) } }>
                    { item.name }
                </div>
            )
        }) : <p>当前频道已添加完，再看看其他频道吧</p>

        let moreChannel = this.state.PushChannel.length > 9 ? <div className="channel-item more" onClick={ () => { this.showMoreChannels() } }>更多</div> : '';
        
        return (
            <div className="compile-box" ref="compileBox">
                { this.props.getMoreStatus === true ? <MoreChannels channel={ this.state.PushChannel.slice(9) } clickHandle={ this.addChannel } editing={ this.state.editing } remoreMoreChannel={ this.remoreMoreChannel } updatePushChannels={ this.updatePushChannels } /> : '' }
                <div className="compile-container">
                    <div className="close-button">
                        <div className="close-icon" onClick={() => { this.hideCompile() }}></div>
                    </div>
                    <div className="channel-all">
                        <div className="my-channel channel-type top-center">
                            <div className="compile-head">我的频道 <span className="compile-tip">拖动排序</span> <span className="edit-finish" onClick={ () => {this.ClickToEditOrOver()} }>{ this.state.editing ? '完成' : '编辑' }</span></div>
                        </div>
                        <div className="items-me ">
                            <div className="channel-items me main-center" ref="channelItems" >
                                {/** MyChannel **/}
                                {/** 拖拽组件 **/}
                                <ListWrapper editing={ this.state.editing } freezeNum={ this.props.freezeNum } ClickToEditOrOver={ this.ClickToEditOrOver } toDragSetState={ this.toDragSetState } removeChannel={ this.removeChannel } helperClass="placeholder" items={ this.state.MyChannel }  />
                            </div>
                        </div>
                        <div className="push-channel channel-type top-center">
                            <div className="compile-head">推荐频道</div>
                        </div>
                        <div className="channel-items main-center">
                            { PushChannel }
                            { moreChannel }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const getAppList = state => {
  return {
    getHomeData: state.home,
    getCompileData: state.compile,
    getMoreStatus: state.moreChannels
  }
}

export default connect(getAppList, {getHomeList, postChannels})(Compile)
