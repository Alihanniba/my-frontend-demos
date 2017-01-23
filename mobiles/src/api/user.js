import request from './request'

class user {
	/**
	 * account for test
	 * 
	 * zhoubin@gochinatv.com
	 * mn5652097
	 * 
	 * @param  {[type]} info [description]
	 * @return {[type]}      [description]
	 */
	constructor (info){
		if (info == undefined) {
			info = {}
		}
		let host = 'http://account.ottcloud.tv';
		this.api = {
			login: host + "/api/v1/signin.json",
			regist: host + "/api/v1/signup.json",
			wechatUserInfo: host + '/api/v1/wx/members/:id.json',
			registWechat: host + '/api/v1/wx/members.json',
			sendResetpasswordEmail: host + '/api/v1/members/reset_password.json'
		}
		if (typeof info.email != null) {
			this.email = info.email || '';
		}
		if (typeof info.password != null) {
			this.password = info.password || '';
		}
		if (typeof info.confirmPassword != null) {
			this.confirmPassword = info.confirmPassword || '';
		}
	}

	login(cb){

		if (!this.email || !this.password) {
			return false;
		}
		let param = {
			email: encodeURI(this.email),
			password: this.password
		}

		try{
			
			request.post(this.api.login, param)
			.then((res) => {
				cb(res)
			})
			.catch((err)=> {
				cb({
					error: true
				})
			})
		} catch (err){
			console.log('error')
		}
		
	}

	regist(cb){
		if (!this.email || !this.password || !this.confirmPassword) {
			return false;
		}
		let param ={
			email: this.email,
			password: this.password,
			password_confirmation: this.confirmPassword
		}

		request.post(this.api.regist, param)
		.then((res) => {
			cb(res)
		})
		.catch((err) => {
			cb({
				data: {
					error: true
				}
			})
		})
	}

	wechatUserInfo(unionid, cb){
		if (!unionid) {
			return false;
		}
		request.get(this.api.wechatUserInfo.replace(':id', unionid))
		.then((res) => {
			cb(res)
		})
		.catch((err) => {
			cb({
				data: {
					error: true
				}
			})
		})
	}

	registWechat(data, cb){
		if (!data.unionid) {
			return false;
		}
		let param  = {
			openid: data.unionid,
			nickname: data.nickname,
			headimgurl: data.headimgurl,
			sex: data.sex
		}
		request.post(this.api.registWechat, param)
		.then((res) => {
			cb(res)
		})
	}

	unpdateWechat(data, cb) {
		if (!data.unionid) {
			return false;
		}
		let param = {
			openid: data.unionid,
			nickname:data.nickname,
			headimgurl:data.headimgurl,
			sex: data.sex
		}
		request.put(this.api.wechatUserInfo.replace(':id', data.unionid), param)
		.then((res) => {
			cb(res);
		})
	}

	sendForgetPasswordEmail(email, cb){
		if (!email) {
			return false;
		}
		request.post(this.api.sendResetpasswordEmail, {email: email})
		.then((res) => {
			cb(res)
		})
	}
}

export default user