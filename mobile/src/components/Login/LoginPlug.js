import React, { Component } from 'react';
import {Button, Input} from 'react-onsenui';
import Dialog from '../Dialog';
import { browserHistory, hashHistory} from 'react-router';
import { getChannels } from '../../actions/compile';
import User from '../../actions/user';
import Toast from '../common/Toast';
import './LoginPlus.css';

const history = window.config.hashHistory ? hashHistory : browserHistory;

class LoginPlug extends Component {

	constructor(props){
		super(props);
		if (User.isLogin) {
			// console.log('12234532' + User)
			history.goBack();
			return;
		}
		this.state ={
			username: '',
			password: '',
			// dialogShown : false
			title: '',
			action: ''
		}
		this.goToLogin= this.goToLogin.bind(this);
	}

	successCb(){

	}

	static contextTypes = {
        store: React.PropTypes.object
    }

	goToLogin(){
		//this.showDialog('aaa');
		var email = this.state.username;
		var password = this.state.password;
		if (!email || !password) {
			this.showDialog('请输入邮箱，密码！')
			return false;
		}
		if (User.checkEmailFormate(email)) {
			User.setEmail(email);
			User.setPassword(password);
			let _this = this;
			User.login((res)=>{
				//console.log(res)
				if (res.status == 200 && res.statusText == "OK" && res.data.token) {
					this.context.store.dispatch(getChannels())
					_this.showDialog('恭喜你，登录成功！', ()=>{
						history.goBack();
					});
				} else {
					_this.showDialog('登录失败！')
				}
			});
		} else{
			this.showDialog("邮箱格式错误！")
			return false;
		}
	}

	goRegistPage(){
		history.push('/regist');
	}

	showDialog(text,cb){
		this.setState({
			title: text,
			action: cb
		})
		this.refs.toast.showToast()
	}

	hideDialog(){
		//this.refs.tipText.innerHTML = 'What is the matter!';
		this.setState({dialogShown: false})
		this.successCb()
		this.refs.dialog.hideDialog();
	}

	handleUsername(e){
		this.setState({username: e.target.value});
	}

	handlePassword(e){
		this.setState({password: e.target.value});
	}

	goToForgetPage(){
		history.push('/forget')
	}

	render(){
		return (
			<div>
				<div className="loginTip">邮箱登录</div>
				<div className='inputBox'><Input placeholder="邮箱" type="text" modifier="material" style={{width: '100%'}} onChange={this.handleUsername.bind(this)} /></div>
				<div className='inputBox'><Input type="password" placeholder='密码' modifier="material" style={{width: '100%'}} onChange={this.handlePassword.bind(this)} /></div>
				<div className="buttonCss" style={{marginTop: '0.5rem'}}><Button modifier="large" onClick={this.goToLogin}>登录</Button></div>
				<div className='buttonCss' style={{textAlign: 'center'}} onClick={this.goToForgetPage.bind(this)}>忘记密码</div>
				<Dialog ref="dialog" />
				<Toast ref='toast' title={this.state.title} action={this.state.action} />
			</div>
			
		)
	}
}

export default LoginPlug