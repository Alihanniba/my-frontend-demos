import React, { Component } from 'react';
import queryString from 'query-string';
// import GoogleLogin from 'react-google-login';
import './google.css';
class Google extends Component {

	constructor(pops){
		super(pops)
		this.googleId = '734603133732-3p0fmabauv7or1ie8gbfq8h3bb87spfk.apps.googleusercontent.com'
		this.success = this.success.bind(this)
		this.failure = this.failure.bind(this)
		this.handleClick = this.handleClick.bind(this)
		//this.success({a: 1, b: 2})
	}

	success(data){
		if (this.props.onSuccess) {
			this.props.onSuccess(data);
		}
	}

	failure(data){
		// <div className='icon_box'><span className="ion-social-googleplus"></span></div>
		if (this.props.onError) {
			this.props.onError(data);
		}
	}

	handleClick(e) {
	  var inAppBrowserRef = cordova.InAppBrowser.open('http://account.ottcloud.tv/cordova/google_login', '_blank', 'location=no,clearsessioncache=yes,clearcache=yes');
	  var _this = this;
	  var loginSuccess = function(url) {
	    var parsedUrl = new URL(url);
	    var userData = queryString.parse(parsedUrl.search.replace('?', ''));
	    //_this.props.dispatch(loginUser(userData));
	    _this.success(userData);
	    inAppBrowserRef.close();
	  }
	  inAppBrowserRef.addEventListener('loadstart', function(e){
	    if(e.url.indexOf('success') != -1) {
	      loginSuccess(e.url);
	    }
	  });

	  //<GoogleLogin clientId={this.googleId} buttonText="google" className="ion-social-googleplus" onSuccess={this.success} onFailure={this.failure} style={{
	  	//backgroundColor: "#000",
	  	//width: "70px",
	  	//height: "70px",
	  	//background: "#000",
	  	// borderRadius: "50%",
	  	// color: '#fff',
	  	// fontSize: "50px",
	  	// textAlign: "center",
	  	// lineHeight: "70px",
	  	// border: 'none'
	  // }} />
	}

	render(){
		return (
			<span className='google_box'>
				
				<div style={{textAlign:'center'}}  onClick={this.handleClick}><span className="ion-social-googleplus" style={{
					backgroundColor: "#e4ae2d",
					width: "70px",
					height: "70px",
					background: "#e4ae2d",
					borderRadius: "50%",
					color: '#fff',
					fontSize: "50px",
					textAlign: "center",
					lineHeight: "70px",
					border: 'none',
					display: 'inline-block'
				}}></span></div>
				<div className="google_text" onClick={this.handleClick}>Google+登录</div>
			</span>
		)
	}
}

export default Google