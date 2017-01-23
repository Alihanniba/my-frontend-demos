import React from 'react'

import './toast.css'

export default class Toast extends React.Component {
  constructor(props) {
    super(props)
    this.showToast = this.showToast.bind(this)
    this.hideToast = this.hideToast.bind(this)
    this.isMoving = false
  }

  componentDidMount() {
    this.props.show && this.showToast()
  }

  componentWillUnmount() {
    let t = this.refs.toast
    t.removeEventListener('animationend', this.hideToast)
    t.removeEventListener('webkitAnimationEnd', this.hideToast)
  }

  showToast() {
    let t = this.refs.toast
    if(this.isMoving) return
    this.isMoving = true
    t.className = "toastt slideInDown"
    t.style.display = 'block'
    clearTimeout(timer)
    let timer =
    setTimeout(()=>{
      t.className = "toastt slideInUp"
      t.addEventListener('animationend', this.hideToast)
      t.addEventListener('webkitAnimationEnd', this.hideToast)
      this.props.action && this.props.action()
    }, 3000)
  }
  hideToast() {
    console.log('animationend')
    let t = this.refs.toast
    t.style.display = 'none'
    this.isMoving = false
    t.removeEventListener('animationend', this.hideToast)
    t.removeEventListener('webkitAnimationEnd', this.hideToast)
    t.className = "toastt slideInDown"
  }

  render() {
    return (
      <div
        ref="toast"
        className="toastt slideInDown">
        { this.props.title }
      </div>
    );
  }
}

Toast.defaultProps = {
  title: '好像出现问题了哦',
  show: false
}
