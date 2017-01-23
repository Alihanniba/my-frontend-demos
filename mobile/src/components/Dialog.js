import React, {Component} from 'react';
import {Button, Input, Dialog} from 'react-onsenui';

class DialogObj extends Component {
	constructor(props){
		super(props);
		this.state = {
			dialogShown: false
		}
	}

	afterHide(){

	}

	showDialog(text){
		this.refs.tipText.innerHTML = text;
		this.setState({
			dialogShown: true
		})
	}

	hideDialog(){
		this.setState({
			dialogShown: false
		})

		this.afterHide();
	}

	render (){
		return (
			<Dialog isOpen={this.state.dialogShown} onCancel={this.hideDialog.bind(this)}>
	          	<div className='alert-dialog-content' ref="tipText">
	            	An error has occurred!
	          	</div>
	          	<div className='alert-dialog-footer'>
	            	<button onClick={this.hideDialog.bind(this)} className='alert-dialog-button'>
	              		Ok
	            	</button>
	          	</div>
			</Dialog>
		)
	}
}

export default DialogObj