import React, {Component} from 'react';
import { browserHistory, hashHistory} from 'react-router';
import { connect } from 'react-redux'
import { getHomeList } from '../../actions/home';
import Tracker from '../../tracker';
import './episodeItem.css';
import ToolKit from '../../tools/tools'
import Storage from '../../libs/storage';
import Ripple from '../../libs/ripple';

const history = window.config.hashHistory ? hashHistory : browserHistory

class TabPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainSource: []
        };
        this.startTouchX = 0;
        this.startTouchY = 0;
        this.endTouchX = 0;
        this.endTouchY = 0;
        this.prevId = '';
        this.prevIndex = '';
        this.nextId = '';
        this.nextIndex = '';
        this.slideAroundStart = this.slideAroundStart.bind(this);
        this.slideAroundEnd = this.slideAroundEnd.bind(this);
        this.slideAroundMove = this.slideAroundMove.bind(this);
    }

    static contextTypes = {
        store: React.PropTypes.object
    }

    componentWillMount() {}

    componentDidMount () {
      let main = document.getElementsByTagName('main')[0];
      main.addEventListener('touchstart', this.slideAroundStart, false)
      main.addEventListener('touchmove', this.slideAroundMove, false)
      main.addEventListener('touchend', this.slideAroundEnd, false)
    }

    slideAroundStart (event) {
        console.log('slideAroundStart')
        this.startTouchX = event.touches[0].clientX;
        this.startTouchY = event.touches[0].clientY;
        let activeIndex = document.getElementsByClassName('active')[0];
        this.prevId = activeIndex.previousSibling ? activeIndex.previousSibling.dataset.id : '';
        this.prevIndex = activeIndex.previousSibling ? activeIndex.previousSibling.dataset.index : '';
        this.nextId = activeIndex.nextSibling ? activeIndex.nextSibling.dataset.id : '';
        this.nextIndex = activeIndex.nextSibling ? activeIndex.nextSibling.dataset.index : '';
    }

    slideAroundMove(event) {
        //阻止默认事件是为解决三星安卓4.4不触发touchend的bug
        console.log("slideAroundMove");
        this.endTouchX = event.changedTouches[0].clientX;
        this.endTouchY = event.changedTouches[0].clientY;
        let x = this.endTouchX - this.startTouchX;
        let y = this.startTouchY - this.endTouchY;
        console.log('x--------:    ' + x);
        console.log('y--------:    ' + y);
        if (Math.abs(x) > Math.abs(y)) {
            event.preventDefault();
        }
    }

    slideAroundEnd (event) {
        console.log('slideAroundEnd')
        let navChildLen = document.querySelector('.nav-main').childNodes.length;
        this.endTouchX = event.changedTouches[0].clientX;
        this.endTouchY = event.changedTouches[0].clientY;
        if (Math.abs(this.endTouchX - this.startTouchX) > 100 && Math.abs(this.startTouchY - this.endTouchY) < 100 ) {
            if (this.endTouchX < this.startTouchX) {
                console.log('===========应该向左滑动,下一个==============')
                if (this.nextIndex) {
                    this.props.navHandleClick(Number(this.nextId), Number(this.nextIndex));
                }
            } else {
                console.log('===========应该向右滑动,上一个==============')
                if (this.prevIndex) {
                    this.props.navHandleClick(Number(this.prevId), Number(this.prevIndex));
                }
            }
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.data && nextProps.data.length > 0) {
            this.setState({
                mainSource: nextProps.data
            })
        }
    }

    componentWillUnmount() {
        //卸载组件上时，取消事件监听与绑定
      let main = document.getElementsByTagName('main')[0];
      main.removeEventListener('touchstart', this.slideAroundStart)
      main.removeEventListener('touchend', this.slideAroundEnd)
    }


    goToPlayer(evt, item) {
      Ripple(evt, () => {
        Storage.s_set(Storage.KEYS.BACK_KEY, Number(this.props.classifyId))
        Storage.s_set(Storage.KEYS.BACK_POSITION_KEY, Number(document.querySelector('.active').dataset.index))
        history.push(`/watch/${item.id}`)
      });
    }
    render() {
        
        return (
            <div className="container">
                <main>
                    <content ref="contents">
                        {
                            this.state.mainSource.length > 0 ? this.state.mainSource.map((item, index) => {
                                return (item.background_poster || item.landscape_poster) ? <figure onClick={(evt)=>{this.goToPlayer(evt,item)}} key={ index } data-id={ item.id } >
                                    <img src={ item.background_poster || item.landscape_poster } onError={Tracker.youtubeError}/>
                                    <div className="episode-info">
                                        <span className={ item.buoy.value && item.buoy.value[0].l && "episode-type" }>{ item.buoy.value && item.buoy.value[0].l }</span>
                                        <span className={ item.buoy.value && item.buoy.value[0].r && "episode-grade" }>{ item.buoy.value && item.buoy.value[0].r }</span>
                                    </div>
                                    <figcaption>{ item.name }</figcaption>
                                    {/* <p>{ item.description }</p> */}
                                </figure> : ''
                            }) : ''
                        }
                    </content>
                </main>
            </div>
        );
    }
}

const getAppList = state => {
  return {
    getHomeData: state.home
  }
}

export default connect(getAppList, {getHomeList})(TabPage)
