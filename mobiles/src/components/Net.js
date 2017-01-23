import React from 'react'
import Toast from './common/Toast'
import reactMixin from 'react-mixin'
import NetMixin from './common/net/NetMixin'
import NetworkError from './common/net/NetworkError'

const Net = React.createClass({
  render() {
    return (
      <div>
        <Toast
          ref="toast"
          title='您正在使用运营商网络' />
        <NetworkError
          ref="net" />
        {this.props.children}
      </div>
    )
  }
})

export default reactMixin.onClass(Net, NetMixin);
