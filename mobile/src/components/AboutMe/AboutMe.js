import React, { Component } from 'react';
import { connect } from 'react-redux';
// import GoogleLogin from 'react-google-login';
import { Page, Button } from 'react-onsenui';
import URL from 'url-parse';
import queryString from 'query-string';
import loginUser from '../../actions/login';
import { loginGoogleUser } from '../../api/login';
import Items from './Items'
import { browserHistory, hashHistory} from 'react-router';
import user from '../../actions/user';
import Footer from '../Footer/Footer';
import Storage from '../../libs/storage';
import {comfDialog} from '../collect';
import './aboutMe.css'
const history = window.config.hashHistory ? hashHistory : browserHistory
const aboutMeStyle = {
  avatar: {

  }
}

class AboutMe extends Component {
  constructor(props) {
    super(props);
    var inCordova = false;
    if (typeof(cordova) != 'undefined') {
      inCordova = true;
    }
    this.state = {
      index: 0,
      inCordova: inCordova,
      logined: user.isLogin,
      showConfirmDialog: false
    };
    this.handleChange = this
      .handleChange
      .bind(this);
    this.setIndex = this
      .setIndex
      .bind(this);

    this.googleLoginSuccess = this.googleLoginSuccess.bind(this)
    this.googleLoginFail = this.googleLoginFail.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.goToLogin = this.goToLogin.bind(this)
    this.loginOut = this.loginOut.bind(this)
    this.cancleExitClick = this.cancleExitClick.bind(this)
    this.pos = 0
  }

  componentWillMount(){
    Storage.s_set(Storage.KEYS.ME_PAGE_KEY, true);
    // if (!this.state.logined) {
    //   this.setState({
    //     logined: user._isLogin()
    //   })
    // }
    !this.state.logined && this.setState({
        logined: user._isLogin()
      })
  }

  handleChange(e) {
    this.setState({ index: e.activeIndex });
  }

  setIndex(index) {
    this.setState({ index: index });
  }

  googleLoginSuccess(response) {
    loginGoogleUser({
      uid: response.googleId,
      email: response.profileObj.email,
      name: response.profileObj.name
    }).then((res)=>{
      this.props.dispatch(loginUser(res.data))
    })
  }

  googleLoginFail(response) {
    console.log('fail login with google')
  }

  handleClick(e) {
    var inAppBrowserRef = cordova.InAppBrowser.open('http://account.ottcloud.tv/cordova/google_login', '_blank', 'location=yes');
    var _this = this;
    var loginSuccess = function(url) {
      var parsedUrl = new URL(url);
      var userData = queryString.parse(parsedUrl.query);
      _this.props.dispatch(loginUser(userData));
      inAppBrowserRef.close();
    }
    inAppBrowserRef.addEventListener('loadstart', function(e){
      if(e.url.indexOf('success') != -1) {
        loginSuccess(e.url);
      }
    });
  }


  goToLogin(){
    /**
     * { this.state.inCordova ? (
              <Button onClick={this.login}>登录</Button>
              <Button onClick={this.regist}>注册</Button>
            ) : (
              <GoogleLogin clientId="734603133732-3p0fmabauv7or1ie8gbfq8h3bb87spfk.apps.googleusercontent.com" buttonText="Login" onSuccess={this.googleLoginSuccess} onFailure={this.googleLoginFail} />
            )
          }
     */
    history.push('/login');
  }

  loginOut(){
    user.loginOut();
    this.setState({
      logined: false
    })
    this.hideConfirmDialog()
  }

  showConfirmDialog(){
    this.pos = 6.8 + 'rem'
    document.body.style.overflow = 'hidden'
    this.setState({showConfirmDialog:true})
  }

  hideConfirmDialog(){
    this.setState({showConfirmDialog:false})
    document.body.style.overflow = ''
  }

  cancleExitClick(){
    this.hideConfirmDialog();
  }

  render() {
    console.log('aboutMe.js'+this.state.logined);
    let dialInit  = comfDialog("","您确定要退出登录吗?","取消","确定",this.cancleExitClick,this.loginOut,this.state.showConfirmDialog,this.pos)
    let hidden    = this.state.showConfirmDialog? hidden="visible" : hidden="hidden"
    let userInfo;
    let loginOut;
    let headimgurl;
    if (this.state.logined) {
       userInfo = user.getUserInfo();
       loginOut = 
       (<div>
        <div className="line5"></div>
        <div className="loginOut" onClick={this.showConfirmDialog.bind(this)}>退出登录</div>
        <div className="line1"></div>
       </div>)

       if (userInfo.headimgurl) {
          headimgurl = (
            <img src={userInfo.headimgurl} />
          )
       }
    }
      return (
      <div>
        <div className="ucBox">
          { this.state.logined ? (
            <div>
              <div className="userPhoto">
                {headimgurl}
                <span className="ion-person"></span>
              </div>
              <div className="userInfo">{  userInfo.nickname ? userInfo.nickname : userInfo.email } &nbsp;&nbsp;</div>
            </div>
            ) : (
            <div>
              <div className="userPhoto">
                <span className="ion-person" onClick={this.goToLogin}></span>
              </div>
              <div className="userInfo" onClick={this.goToLogin}>请登录</div> 
            </div>
            )
          }
        </div>
        <Items islogin={this.state.logined} />
        {loginOut}
        <Footer />
        <div className='shadowbox' style={{visibility:`${hidden}`}}></div>
        {dialInit}
      </div>)
  }
}

function mapStateToProps(state, ownProps) {
  return {loggedIn: state.login.session, userInfo: state.login.userInfo};
}

export default connect(mapStateToProps)(AboutMe)
