import React, {Component} from 'react';
import {Button, Input} from 'react-onsenui';
import User from '../../actions/user';
import Toast from '../common/Toast';
import './Forget.css';
import HeaderBar from '../HeaderBar';

class Forget extends Component {
	
	constructor(props){
		super(props)
		this.state = {
			email: '',
			title: ''
		}
	}
	
	submit(){
		let emailType = User.checkEmailFormate(this.state.email)
		if (emailType) {
			let _this = this;
			User.sendForgetPasswordEmail(this.state.email, (res) => {
				debugger
				if (res.data.success) {
					_this.showToast('邮件已经发送至您邮箱，请注意查收！')

				} else {
					if (res.data.error) {
						_this.showToast('未找到该用户！')
					}
				}
				// res.data.success ? _this.showToast('邮件已经发送至您邮箱，请注意查收！') : res.data.error && _this.showToast('未找到该用户！')
			})
		} else{
			this.showToast("邮箱错误！")
		}
	}

	handleEmail(e){
		this.setState({
			email: e.target.value
		})
	}

	showToast(text){
		this.setState({
			title: text
		})
		this.refs.toast.showToast();
	}

	render(){
		return (
			<div>
				<HeaderBar text="找回密码" />
				<div className='logo'><img src={require("../../../public/logo@2x.png")} alt="logo"/></div>
				<div className="loginTip">邮箱找回</div>
				<div className='inputBox'><Input placeholder="邮箱" type="text" modifier="material" style={{width: '100%'}} onChange={this.handleEmail.bind(this)} /></div>
				<div className="buttonCss" style={{marginTop: '0.5rem'}}><Button modifier="large" onClick={this.submit.bind(this)}>找回密码</Button></div>
				<Toast title={this.state.title} ref="toast" />
			</div>
		)
	}
}

export default Forget