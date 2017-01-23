import React, { Component } from 'react';
import { connect } from 'react-redux'
import { browserHistory, hashHistory} from 'react-router';
import './moreChannels.css';
import { getHomeList } from '../../actions/home';
import { showChannels, hideChannels } from '../../actions/moreChannels';
import Storage from '../../libs/storage';
import Toast from '../common/Toast'
const history = window.config.hashHistory ? hashHistory : browserHistory

class MoreChannels extends Component {
    constructor(props) {
        super(props);
        this.state = {
           Channel: [],
           showToast: false
        };
        this.toastTitle = '';
        this.addedChannels = [];
        this.hideMoreChannels = this.hideMoreChannels.bind(this);
        this.addChannels = this.addChannels.bind(this);
        this.hideToast = this.hideToast.bind(this);
    }

    static defaultProps = {
        MyChannel: [
            "联播台"
        ],
        PushChannel: [
            "生活"
        ]
    }

    static contextTypes = {
        store: React.PropTypes.object
    }

    componentWillMount() {
        document.querySelector('.compile-box').scrollTop = 0;
        document.querySelector('.compile-box').style.overflowY = 'hidden';
    }

    componentDidMount () {
        // document.body.scrollTop = 0;
        console.log('===========componentDidMount==============')
        this.setState({
            Channel: this.props.channel
        })
    }
   
    componentWillReceiveProps(nextProps, nextState) {
        console.log('===========componentWillReceiveProps==============')
        this.setState({
            Channel: this.props.channel
        })
    }
    componentWillUnmount() {
        document.querySelector('.compile-box').style.overflowY = 'scroll'
    }

    hideMoreChannels() {
        this.props.updatePushChannels();
        this.context.store.dispatch(hideChannels())
    }

    addChannels(event) {
        // this.refs.toast.className = 'toast toast-show';
        // let timeout = setTimeout(() => {
        //     this.refs.toast.className = 'toast';
        //     clearTimeout(timeout);
        // }, 500)

        if (event.target.dataset.ishandle === 'false') {
            // this.refs.toast.innerHTML = '已添加至首页';
            this.toastTitle = '已添加至首页';
            
            event.target.dataset.ishandle = 'true';
            event.target.className = 'mc-butt mc-cancel-butt';
            event.target.innerHTML = '取消';
            //添加过的序号放进统一🙆的数组,点击返回时统一消除
            // this.addedChannels.push(Number(event.target.dataset.key));
            this.props.clickHandle(Number(event.target.dataset.key), 2);
        } else {
            // this.refs.toast.innerHTML = '已从首页取消';
            this.toastTitle = '已从首页取消';
            event.target.dataset.ishandle = 'false';
            event.target.className = 'mc-butt mc-add-butt';
            event.target.innerHTML = '添加';
            //把取消的元素序号在addedChannels数组里删除
            // let index = this.addedChannels.indexOf(Number(event.target.dataset.key));
            // if (index > -1) {
            //     this.addedChannels.splice(index, 1);
            // }
            this.props.remoreMoreChannel(Number(event.target.dataset.id))
        }
        this.setState({
            showToast: true
        })
    }

    hideToast() {
        this.setState({
            showToast: false
        })
    }

    render() {
        let channelItem = this.state.Channel.length > 0 ? this.state.Channel.map((item, key) => {
            return (
                <li key={ key + 9 }>
                    <div className="mc-item">
                        <div className="mc-name">{ item.name }</div>
                        <button className="mc-butt mc-add-butt" data-id={ item.id } data-key={ key + 9 } data-ishandle="false" onClick={ this.addChannels.bind(this)  }>添加</button>
                    </div>
                </li>
            )
        }) : '没有更多频道了';
        return (
            <div className="more-compile" ref="moreCompile">
                { this.state.showToast ? <Toast title={ this.toastTitle } show={ this.state.showToast } action={ () => { this.hideToast() }  } /> : '' }
                {/* <div className="toast" ref="toast">已添加至首页</div>*/ }
                <div className="mc-header">
                    <div className="mc-nav">
                        <span className="back-com ion-chevron-left" onClick={ () => { this.hideMoreChannels(this) } }></span>
                        更多频道
                    </div>
                </div>
                {/* ul外层div为滑动用 */}
                <div className="mc-content">
                    <ul className="mc-main">
                        { channelItem }
                    </ul>
                </div>
            </div>
        );
    }
}

const getAppList = state => {
  return {
    getCompileData: state.compile
  }
}

export default connect(getAppList, {getHomeList})(MoreChannels)
