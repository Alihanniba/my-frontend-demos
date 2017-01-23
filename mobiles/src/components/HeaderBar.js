import React, { Component } from 'react';
import { browserHistory, hashHistory} from 'react-router';
const history = window.config.hashHistory ? hashHistory : browserHistory;

const teaseStyle = {
    header: {
        width: '100%',
        height: '50px',
        lineHeight: '50px',
        background: '#fff',
        position: 'fixed',
        left: '0',
        top: '0',
        zIndex: 99,
        boxShadow: '0 1px 4.5px 0 rgba(0, 0, 0, 0.11)'
    },
    top: {
        width: '92%',
        margin: '0 auto',
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'space-between'
    },
    left: {
        display: 'inline-block',
        fontSize: '0.7rem',
        color: '#000',
        width: '50px',
        textAlign: 'left',
    },
    center: {
        flex: 1,
        fontWeight: 500
    },
    right: {
        fontSize: '0.4rem',
        width:'50px'
    }
}

class HeaderBar extends Component {
	constructor (props){
		super(props)

	}

	rightBtnClick(){
		if (this.props.onRightBtnClick) {
			this.props.onRightBtnClick()
		}
	}

	render(){
        let rightBtn;
        if (this.props.rightBtnName) {
            rightBtn = <span style={ teaseStyle.right  } onClick={this.rightBtnClick.bind(this)}>{this.props.rightBtnName}</span>;
        } else {
            rightBtn = <span style={ teaseStyle.right  }></span>
        }
		return (
            <div>
                <header style={ teaseStyle.header }>
                    <div style={ teaseStyle.top  }>
                        <span style={ teaseStyle.left  } className="ion-ios-arrow-left" onClick={ ()=> { history.goBack() } }></span>
                        <h6 style={ teaseStyle.center }>{this.props.text}</h6>
                        {rightBtn}
                    </div>
                </header>
                <div style={{height: '50px'}}></div>
            </div>
			
		)
	}
}
export default HeaderBar;