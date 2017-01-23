import React, { Component } from 'react';
import HeaderBar from './HeaderBar';
import Dialog from './Dialog';
import Toast from './common/Toast';
import TeaseAction from '../actions/tease';

const teaseStyle = {
    header: {
        width: '100%',
        height: '50px',
        lineHeight: '50px',
        background: '#f0f0f0'
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
        color: '#6799ff',
        width: '50px',
        textAlign: 'left',
    },
    center: {
        flex: 1
    },
    right: {
        fontSize: '0.4rem',
    },
    textarea: {
        display: 'block',
        width: '92%',
        margin: '30px auto',
        borderRadius: '4px',
        border: '1px solid #999',
        fontSize: '0.4rem',
        padding: '10px'
    },
    contact: {
        width: '92%',
        height: '30px',
        lineHeight: '30px',
        margin: '0 auto',
        display: 'flex'
    },
    label: {
        
    },
    input: {
        border: '1px solid #999',
        borderRadius: '4px',
        flex: 1,
        fontSize: '0.4rem',
        padding: '10px'
    } 
}



class Tease extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            title: '',
            action: ''
        };
        this.textarea = '';
        this.contact = '';
    }
    
    setTextarea(e){
        this.textarea = e.target.value;
    }
    
    setContact(e){
        this.contact = e.target.value;
    }

   submitTease(){
    if (!this.textarea) {
        this.showToast('您想说点什么')
        return;
    }
    if (this.contact) {
        // 验证一下联系方式
        if (
            /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(this.contact) || //手机号
            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.contact) || //邮箱
            /^[a-zA-Z\d_]{5,}$/.test(this.contact) //微信号
        ) {
            
        } else{
            this.showToast('请输入正确的联系方式')
            return;
        }
    }
    let param = {
        feedback: this.textarea,
        contact: this.contact
    }
    let _this = this;
    TeaseAction.submitTease(param, (res) =>{
        if (res.status == 200 && res.statusText == 'OK') {
            _this.showToast('感谢您对我们的支持！', 
                _this.reset()
            )
            
        } else{
            _this.showToast('出错了， 请重试一下！')
        }
    })
   }

   reset(){
    this.setState({
        title: '',
        action: ''
    })
    this.textarea = '';
    this.contact = '';
    this.refs.feedback.value = ''
    this.refs.contact.value = ''
   }

   showToast(text, cb){
    this.setState({
        title: text,
        action: cb
    })
    this.refs.toast.showToast();
   }

    render() {
            return (
                <div style={{height: '100%'}}>
                    <HeaderBar text="吐槽提意见" rightBtnName="提交" onRightBtnClick={this.submitTease.bind(this)} />
                    <textarea ref="feedback" style={ teaseStyle.textarea  } name="tease" id="tease" rows="10" placeholder="输入您的吐槽意见~" onChange={this.setTextarea.bind(this)}></textarea>
                    <div style={ teaseStyle.contact  }>
                        <span style={ teaseStyle.label  }>联系方式：</span>
                        <input style={ teaseStyle.input  } ref="contact" type="text" placeholder="Email,微信或手机号" onChange={this.setContact.bind(this)}/>
                    </div>
                    <Dialog ref="dialog" />
                    <Toast ref="toast" action={this.state.action} title={this.state.title} />
                </div>
            );
        }
    }

export default Tease;
