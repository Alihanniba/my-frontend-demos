import React, {Component} from 'react';
import { browserHistory, hashHistory} from 'react-router';
import {Button, Input} from 'react-onsenui';
import Dialog from '../Dialog';
import Footer from '../Footer/Footer';
import User from '../../actions/user';
import HeaderBar from '../HeaderBar';
import Toast from '../common/Toast';
import './Regist.css'

export default class Regist extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			confirmPassword: '',
			title: '',
			action: ''
		}
	}

	handleEmail(e){
		this.setState({
			email: e.target.value
		})
	}

	handlePassword(e){
		this.setState({
			password: e.target.value
		})
	}

	handleConfirmPassword(e){
		this.setState({
			confirmPassword: e.target.value
		})
	}

	goToRegist(){
		if (!this.state.email) {
			this.showDialog('请输入邮箱！')
			return false;
		}
		if (!User.checkEmailFormate(this.state.email)) {
			this.showDialog('邮箱格式错误！')
			return false;
		}
		if (!this.state.password) {
			this.showDialog('请输入密码！')
			return false;
		}
		if (!User.checkPasswordFormate(this.state.password)) {
			this.showDialog('输入6-16位由子母 和 数字或者特舒符号组成的字符串！')
			return false;
		}
		if (!this.state.confirmPassword) {
			this.showDialog('请输入确认密码！')
			return false
		}
		if (this.state.password != this.state.confirmPassword) {
			this.showDialog('输入的两次密码不一致！')
			return false
		}
		
		User.setRegistData({
			email: this.state.email,
			password: this.state.password,
			confirmPassword: this.state.confirmPassword
		})

		var _this = this;
		let rs = User.regist(
			(res)=>{
				if (!res.data.error) {
					_this.showDialog('欢迎成为我们的一员', ()=>{
						hashHistory.push('/me');
					});
				} else {
					_this.showDialog(res.data.message[0]);
				}
			}
		);

	}

	showDialog(text, cb){
		this.setState({
			title: text,
			action: cb
		})
		this.refs.toast.showToast()
	}

	render(){
		return (
			<div>
				<HeaderBar text="注册" />
				<div className='logo'><img src={require("../../../public/logo@2x.png")} alt="logo"/></div>
				<div className="loginTip">注册</div>
				<div className='inputBox'><Input placeholder="邮箱" type="text" modifier="material" style={{width: '100%'}} onChange={this.handleEmail.bind(this)} /></div>
				<div className='inputBox'><Input type="password" placeholder='密码' modifier="material" style={{width: '100%'}} onChange={this.handlePassword.bind(this)} /></div>
				<div className='inputBox'><Input type="password" placeholder='确认密码' modifier="material" style={{width: '100%'}} onChange={this.handleConfirmPassword.bind(this)} /></div>
				<div className="buttonCss" style={{margin: '1.5rem 1rem'}}><Button modifier="large" onClick={this.goToRegist.bind(this)}>注册</Button></div>
				<Dialog ref="dialog" />
				<Toast ref='toast' title={this.state.title} action={this.state.action} />
			</div>
		)
	}
}