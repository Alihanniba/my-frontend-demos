import TeaseApi from '../api/tease'

class TeaseAction {
	constructor(){
		this.errorMes = '';
	}

	submitTease(obj, cb){

		if (!obj.feedback) {
			this.errorMes = "not have content"
			return false
		}
		TeaseApi.submit(obj, (res) => {
			cb(res);
		})
	}
}

export default new TeaseAction;
