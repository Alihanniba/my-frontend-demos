import React from 'react';

export default class LoadFailed extends React.Component {
  constructor(props) {
    super(props)
    this.retry = this.retry.bind(this)
  }
  componentDidMount() {
    if(this.props.show) {
    return this.refs.loadFailed.style.display = 'block'
    }
    this.refs.loadFailed.style.display = 'none'
  }
  componentWillReceiveProps() {
    if(this.props.show) {
      this.refs.loadFailed.style.display = 'block'
    }
  }
  retry() {
    this.props.doRetry && this.props.doRetry()
    this.refs.loadFailed.style.display = 'none'
  }
  render() {
    return (
      <div style={ styles.loadFailedBox } ref="loadFailed" >
        <div style={ styles.loadFailedTitle }>
          { this.props.title }
        </div>
        <div
        style={ styles.loadFailedButton }
        onClick={ ()=>{ this.retry() }}>
        { this.props.buttonText }
        </div>
      </div>
    );
  }
}

LoadFailed.defaultProps = {
  title: '载入失败',
  buttonText: '重新加载',
  show: false
}

const styles = {
  loadFailedBox: {
    width: "100%",
    height: '100%',
    position: "fixed",
    top: "0",
    textAlign: "center",
    zIndex: "99999999",
    backgroundColor: "white"
  },
  loadFailedTitle: {
    position: 'absolute',
    top: '257px',
    left: '160px',
    color: 'rgba(43, 44, 57, .5)',
    fontSize: '14px'
  },
  loadFailedButton: {
    position: 'absolute',
    top: '302.5px',
    left: '127.5px',
    width: '120px',
    height: '30px',
    lineHeight: "30px",
    fontSize: '15px',
    color: '#fff',
    borderRadius: "50px",
    backgroundColor: "#ff566d"
  }
}
