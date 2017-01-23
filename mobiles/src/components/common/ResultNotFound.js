import React from 'react';

export default class ResultNotFound extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <div style={styles.resultNotFound}>
        <span className="ion-alert-circled" style={{fontSize: "24px"}}></span>
        <span style={{fontSize: "18px", marginLeft: "20px"}}>{ this.props.title }</span>
      </div>
    );
  }
}

ResultNotFound.defaultProps = {
  title: '未找到相关的视频',
}

const styles = {
  resultNotFound: {
    width: "100%",
    position: "absolute",
    top: "40%",
    textAlign: "center"
  }
}
