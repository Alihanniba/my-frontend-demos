import React, { Component } from 'react';
import {Button} from 'react-onsenui';
import Storage from '../libs/storage';
import HeaderBar from './HeaderBar';
import { browserHistory, hashHistory} from 'react-router';
const history = window.config.hashHistory ? hashHistory : browserHistory;

const aboutStyle = {
   container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: '2.5rem'
    },
    main: {
        textAlign: 'center',
        display: 'inline-block',
    },
    cover: {
        height: '33px',
        width: '122px',
    },
    title: {
        fontSize: '16px',
        display: 'block',
        marginTop: '8px'
    },
    version: {
        fontSize: '14px',
        display: 'block',
        marginTop: '5px',
        color: '#999'
    },
    hint: {
        fontSize: '16px',
        marginTop: '10px',
        color: '#999'
    },
    welcome: {
        width: '200px',
        height: '40px',
        borderRadius: '20px',
        backgroundColor: '#F13956',
        color: '#fff',
        marginTop: '12px',
        fontSize: '0.8rem',
    }
}



class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }  

    componentWillMount() {
        document.getElementById('root').style.height = '100%';
        document.getElementById('root').style.width = '100%';
    } 

    componentDidMount(){
      this.refs.version.innerHTML = window.config.cordova_v ? window.config.cordova_v : '1.0';
    }

    componentWillUnmount() {
        document.getElementById('root').style.height = '';
        document.getElementById('root').style.width = '';
    } 

    goWelcomPage(e){
        //LocalStorage.remove("navMain");
        //LocalStorage.remove("userSelectedLists");
        // LocalStorage.set('welcomePage', '1')
        Storage.set(Storage.KEYS.WELCOME_PAGE, '1');
        history.push("/");
        return;
    }

    render() {
            return (
                <div>
                    <HeaderBar text="关于" /> 
                    <div style={ aboutStyle.container }>
                        <div style={ aboutStyle.main  }>
                            <img style={ aboutStyle.cover  } src={require('../../public/logo@2x.png')} alt=""/>
                            <label style={ aboutStyle.title  } htmlFor="">VegoTV</label>
                            <span style={ aboutStyle.version  }>版本号：V <span ref="version">1.0</span></span>
                            <p style={ aboutStyle.hint  }>东方嘉禾&nbsp;版权所有</p>
                            <div style={{height: '1rem'}}></div>
                            <Button modifier="large" onClick={this.goWelcomPage.bind(this)}>欢迎页</Button>
                        </div>
                    </div>
                </div>
            );
        }
    }

export default About;
