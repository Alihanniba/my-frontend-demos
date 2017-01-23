import React, {Component} from 'react';

import './Wechat.css'

class Wechat extends Component {

	constructor(props) {
		super(props);
		this.state = {
			haveWechatApp: false
		}
	}

	login() {
        var scope = "snsapi_userinfo",
            state = "_" + (+new Date());
        var _this = this;
        navigator.Wechat && navigator.Wechat.auth(scope, state, function (response) {
            // you may use response.code to get the access token.
            // alert(JSON.stringify(response))
            // debugger
            _this.onSuccess(response)
        }, function (reason) {
            _this.onError(reason)
		});
		// _this.onSuccess({
		// 	openid: '121212',
		// 	nickname: '望见',
		// 	headimgurl: 'http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0',
		// 	unionid: 'o6_bmasdasdsad6_2sgVt7hMZOPfL',
		// 	sex: 1,
		// })
    }
	
	componentDidMount(){

		/*
		检测是否安装了微信app
		 */
		let _this = this;
		this.haveWechatApp((res)=>{
			_this.setState({
				haveWechatApp: res
			})
		})
	}

    onSuccess(res){
		if (this.props.onSuccess) {
			this.props.onSuccess(res)
		}
    }

    onError(res){
		if (this.props.onError) {
			this.props.onError(res)
		}
    }

    haveWechatApp(cb){
    	navigator.Wechat && navigator.Wechat.isInstalled(function (installed) {
        	cb(!!installed)
        }, function (reason) {
            //没有微信app
            cb(false)
        });
    }

	render(){
		let wechatClass, wechatCon;
		if (this.state.haveWechatApp) {
			wechatClass = 'wechat';
		} else {
			wechatClass = 'noWechat';
		}
		return (
			<span className={wechatClass}>
				<ons-icon icon="fa-weixin" onClick={this.state.haveWechatApp ? this.login.bind(this) : ''}></ons-icon>
				<div className="wechat_text" onClick={this.state.haveWechatApp ? this.login.bind(this) : ''}>微信登录</div>
			</span>
		)
	}
}

export default Wechat;