import React, { Component } from 'react';
import { browserHistory , hashHistory} from 'react-router'
import { connect } from 'react-redux';
import Classify from './Classify/Classify'
import { getClassifyList,  countSelectCount, showClassityPage, hideClassityPage } from '../actions/classify'

import Storage from '../libs/storage'
const history = window.config.hashHistory ? hashHistory : browserHistory

import SplashImg from '../../public/splash.png';

class Splash extends Component {
  constructor(props) {
    super(props);
    this.goChannels = this.goChannels.bind(this)
    this.countClassifyCount = this.countClassifyCount.bind(this)
  }

  static contextTypes = {
    store: React.PropTypes.object
  }
  //dispatch classify lists
  componentWillMount() {
    let usLists = Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL);
    // localStorage.getItem('userSelectedLists');
    let showWelcomePage = Storage.get(Storage.KEYS.WELCOME_PAGE);
    if (usLists !== null && (showWelcomePage == null || showWelcomePage == false)) {
      if(usLists.length > 0) {
        history.push('/home')
        return
      }
    }

    this.context.store.dispatch(getClassifyList())
  }

  componentWillReceiveProps(a, b) {
  }

  componentWillUnmount() {
    this.countClassifyCount(0)
    this.context.store.dispatch(hideClassityPage());
  }
  //show channels page
  goChannels() {
    console.log('=========show channels========');
    let usLists = Storage.get(Storage.KEYS.USER_SELECTED_CHANNEL);
    // localStorage.getItem('userSelectedLists');
    let welcomePage = Storage.get(Storage.KEYS.WELCOME_PAGE);
    // localStorage.getItem('welcomePage');
    if (usLists !== null) {
      if (welcomePage) {
        Storage.remove(Storage.KEYS.WELCOME_PAGE);
        // localStorage.removeItem('welcomePage')
      }
      history.push('/home')
      return
    }
    this.context.store.dispatch(showClassityPage())
  }
  //dispatch addSelectCount when select or cancle channel
  countClassifyCount(n) {
    this.context.store.dispatch(countSelectCount(n))
  }
  //if this.props.showClassify === true render classify page
  renderPage() {
    if(this.props.showClassify) {
      return (
        <Classify
          countSelectCount={ this.countClassifyCount }
          selectCounts={ this.props.selectCounts }
          classifyList={ this.props.classifyList }
        />
      )
    }
    return (
      <div style={ styles.splashBox }>
        <div style={ styles.splashIntroduce }>{ this.props.introduce }</div>
        <div style={ styles.splashText } onClick={()=>{ this.goChannels() }}>{ this.props.btnText }</div>
			</div>
    )
  }

	render () {
		return (
      <div>
        {this.renderPage()}
      </div>
		);
	}
}

Splash.defaultProps = {
  introduce: '“女人缺少的不是衣服，而是下一件新衣服。”在几乎无穷无尽的内容面前，却茫然而找不到视频的你，想不想在Vego TV里找到自己志趣相投的圈子？',
  btnText: '进入应用'
}

const styles = {
	splashBox: {
    position: 'absolute',
    top: 0,
		width: '100%',
    height: '100%',
    backgroundImage: `url(${ SplashImg })`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat'
	},
  splashIntroduce: {
    position: 'absolute',
    width: '78%',
    left: '11%',
    fontSize: '18px',
    top: '30%',
    color: '#2b2c39',
    fontWeight: 500
  },
  splashText: {
    position: 'absolute',
    width: '4.266666666666667rem',
    height: '1.12rem',
    lineHeight: '1.12rem',
    fontSize: '16px',
    textAlign: 'center',
    top: '81%',
    left: '29%',
    backgroundColor: '#ff566d',
    color: '#fff',
    borderRadius: '50px'
  }
}

const classifyList = state => {
  return {
    showClassify: state.classify.showClassify,
    selectCounts: state.classify.selectCounts,
    classifyList: state.classify.classifyList
  }
}

export default connect(classifyList)(Splash)
