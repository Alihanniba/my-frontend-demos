import Storage from '../libs/storage';
import User from '../api/user';

class user {
	constructor (){
		this.email = '';
		this.password = '';
		this.userToken = '';
		this.isLogin = this._isLogin()
		this.confirmPassword = '';
	}

	_isLogin(){
		// if (this.userToken) {
		// 	return true
		// }
		let token = this.getUserToken()
		if (token) {
			this.userToken = token
			this.getUserInfo();
			return true;
		}
		this.userToken = '';
		this.email = '';
		return false;
	}

	setEmail(email){
		if (!email) {return false}
		this.email = email;
	}

	setPassword(password) {
		if (!password) {return false}
		this.password = password
	}

	setUserToken(token){
		if (!token) {return false}
		this.userToken = token;
		Storage.set(Storage.KEYS.USER_TOKEN, token);
		// storage.set('token', token);
	}

	getUserToken(){
		
		return Storage.get(Storage.KEYS.USER_TOKEN) || false;
		// return storage.get('token') || false;
	}

	getUserInfo(){
		if (!this.userToken) {
			this.isLogin = false
			return false
		}
		let email = '';
		if (!this.email) {
			// email = storage.get('username');
			email = Storage.get(Storage.KEYS.USER_NAME);
			this.email = email;
		} else{
			email = this.email;
		}

		return {
			email: email,
			token: this.getUserToken(),
			nickname: this.getNickname(),
			headimgurl: this.getHeadimgurl()
		}
	}

	getHeadimgurl(){
		return Storage.get(Storage.KEYS.HEAD_IMG_URL) || false;
		// return storage.get('headimgurl') || false;
	}

	setHeadimgurl(headimgurl){
		// return storage.set('headimgurl', headimgurl);
		return Storage.set(Storage.KEYS.HEAD_IMG_URL, headimgurl);
	}

	setUserId(userId){
		return Storage.set(Storage.KEYS.USER_ID, userId);
	}

	getNickname(){
		return Storage.get(Storage.KEYS.NICK_NAME) || false;
		// return storage.get('nickname') || false;
	}

	setNickname(nickname){
		// return storage.set('nickname', nickname)
		return Storage.set(Storage.KEYS.NICK_NAME, nickname);
		
	}

	checkEmailFormate(email){
		if (!email) {
			return false;
		}
		var result = /^([a-zA-Z0-9\+]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email);
		if (!result) {
			return false
		}
		return true;
	}

	checkPasswordFormate(password){
		if (!password) { return false; }
		// 密码为  6-16 子母   数字   特殊符号组成的字符串
		let result = /(?![0-9]+$)[0-9a-zA-Z!@#$%^&*()]+$/.test(password);
		return result;
	}

	login(cb){
		if (!this.email || !this.password) {
			return false;
		}
		let userObj  = new User({
			email: this.email,
			password: this.password
		})
		let self = this;
		userObj.login((res) => {
			if (!res.error) {
				self.setUserToken(res.data.token)
				self.setUserId(res.data.user_id)
				self.storageEmail(self.email);
				// 同步用户记录
				Storage.sync();
			}
			cb(res)
		})
	}

	storageEmail(email){
		if (!email) {
			return false;
		}
		this.email = email;
		// storage.set('username', email)
		Storage.set(Storage.KEYS.USER_NAME, email);
		
	}

	loginOut(){
		// storage.remove('token')
		// storage.remove('username')
		// storage.remove('headimgurl')
		// storage.remove('nickname')
		Storage.remove(Storage.KEYS.USER_TOKEN);
		Storage.remove(Storage.KEYS.USER_NAME);
		Storage.remove(Storage.KEYS.HEAD_IMG_URL);
		Storage.remove(Storage.KEYS.NICK_NAME);
		Storage.remove(Storage.KEYS.USER_ID);
		
		this.isLogin = false
		this.userToken = ''
		this.email = ''
	}
	
	setRegistData(data){
		if (!data.email || !data.password || !data.confirmPassword) {
			return false;
		}
		this.email = data.email;
		this.password = data.password;
		this.confirmPassword = data.confirmPassword;
		return true
	}

	regist(cb){
		if (!this.email || !this.password || !this.confirmPassword) {
			return false;
		}
		//User.regist({})
		//return true
		let UserObj = new User({
			email: this.email,
			password: this.password,
			confirmPassword: this.confirmPassword
		})
		var self = this;
		UserObj.regist((res)=>{
			if (!res.data.error) {
				//存储token and username
				self.setUserToken(res.data.token);
				self.setUserId(res.data.user_id);
				self.storageEmail(res.data.email);
				// 同步用户记录
				Storage.sync();
			}
			cb(res);
		})
	}

	saveWechat(obj, cb){
		if (!obj || !obj.unionid) {
			return false;
		}
		let userObj = new User();
		let _this = this;
		userObj.wechatUserInfo(obj.unionid, (res) => {
			if (res.data.token) {
				// 老用户登录
				console.log('老用户登录成功')
				_this.setUserToken(res.data.token)
				_this.setNickname(res.data.nickname)
				_this.setHeadimgurl(res.data.headimgurl)
				_this.setUserId(res.data.user_id)

				cb(res)
			} else{
				// 新用户注册
				userObj.registWechat(obj, (res) => {
					console.log('新用户注册成功！')
					_this.setUserToken(res.data.token)
					_this.setNickname(res.data.nickname)
					_this.setHeadimgurl(res.data.headimgurl)
					_this.setUserId(res.data.user_id)
					cb(res)
				})
			}
		})

	}

	sendForgetPasswordEmail(email, cb){
		if (this.checkEmailFormate(email)) {
			let userApiObj = new User({
				email: email,
				password: '',
				confirmPassword: ''
			})
			userApiObj.sendForgetPasswordEmail(email, (res)=>{
				cb(res)
			})
		} else {
			return false;
		}
	}

	getUserHistory(cb){
		return Storage.get(Storage.KEYS.HISTORY)
	}

	getFavouriteNum(){
		let favouriteArr = Storage.get(Storage.KEYS.FAVOURITE)
		if (favouriteArr == null || !favouriteArr) {
			return 0;
		}
		return favouriteArr.length;
	}

}
var userObj = new user
export default userObj