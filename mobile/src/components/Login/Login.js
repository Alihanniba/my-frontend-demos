import React, { Component } from 'react';
// import {Button, Input, Dialog} from 'react-onsenui';
import Dialog from '../Dialog'
import { browserHistory, hashHistory} from 'react-router';
import LoginPlug from './LoginPlug';
import Google from './Google';
import User from '../../actions/user';
import Wechat from './Wechat';
import Footer from '../Footer/Footer';
import HeaderBar from '../HeaderBar';
import Toast from '../common/Toast';
import { getChannels } from '../../actions/compile';
import './login.css';

const history = window.config.hashHistory ? hashHistory : browserHistory;

class Login extends Component {

	constructor(props){
		super(props);
		this.state = {
			title: '',
			action: ''
		}
	}

	static contextTypes = {
        store: React.PropTypes.object
    }

	googleLoginSuccess(data){
		// hashHistory.back();
		this.context.store.dispatch(getChannels())
		this.showToast("恭喜你，登录成功！", ()=>{
			history.goBack();
		})
		User.setUserToken(data.token)
		User.storageEmail(data.email)
		User.setHeadimgurl(data.avatar_url)
		User.setUserId(data.user_id)
	}

	wechatLoginSuccess(data){
		let _this=this;
		User.saveWechat(data, (res) =>{
			if (res.token || res.data.token) {
				this.context.store.dispatch(getChannels())
				_this.showToast('恭喜您登录成功！', () => {
					if (cordova.platformId == 'ios') {
						history.push('/me');
					} else {
						history.goBack();
					}
				});
			}
		})
	}

	wechatLoginError(data){
		this.showToast('登录异常，请重试', ()=>{})
		//this.showDialog('登录异常，请重试！')
	}

	hideDialog(){
		this.refs.dialog.hideDialog()
	}

	showDialog(text){
		this.refs.dialog.showDialog(text)
	}

	showToast(text, cb){
		this.setState({
			title: text,
			action: cb
		})
		this.refs.toast.showToast()
	}

	googleLoginError(){
		this.showToast('登录异常，请重试', ()=>{})
	}

	goToRegist(){
		history.push('/regist');
	}

	render(){
		return (
			<div>
				<HeaderBar text="登录" rightBtnName="注册" onRightBtnClick={this.goToRegist} />
				<div style={{textAlign: 'center', marginTop: '1rem'}}>
					<Google onSuccess={this.googleLoginSuccess.bind(this)} onError={this.googleLoginError.bind(this)} />
					<Wechat onSuccess={this.wechatLoginSuccess.bind(this)} onError={this.wechatLoginError.bind(this)} />
				</div>
				<LoginPlug style={{marginBottom: '1rem'}} />
				<Dialog ref="dialog" />
				<Toast ref="toast" action={this.state.action} title={this.state.title} />
			</div>
		)
	}
}
export default Login;
