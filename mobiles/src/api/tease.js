import Request from './request';

class TeastApi {
	constructor(){
		let apiHost = 'http://account.ottcloud.tv/';
		this.api = {
			setApi: apiHost + '/api/v1/members/feedback.json'
		}
	}
	
	submit(obj, cb){
		Request.post(this.api.setApi, obj)
		.then((res) => {
			cb(res)
		})
	}
	
}

export default new TeastApi;
