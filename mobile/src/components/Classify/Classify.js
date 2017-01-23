import React from 'react';
import { browserHistory, hashHistory } from 'react-router';
import ListItem from './ListItem';
import './classify.styl';

const history = window.config.hashHistory ? hashHistory : browserHistory;

export default class Classify extends React.Component {
  constructor(props) {
    super(props);
  }
  // only select channel can go home page
  handleClick() {
    // if( this.props.selectCounts === 0) return
    history.push('/home');
  }
  render() {
    let count = this.props.selectCounts;
    let text = count === 0 ? '立刻体验' : `立刻体验(${count})`;
    let content = '';
    if (this.props.classifyList) {
      content = <div><h1>{this.props.title}</h1>
        <h2>{this.props.subTitle}</h2>
        <ListItem
          selectCounts={ this.props.selectCounts }
          classifyList={ this.props.classifyList }
          countSelectCount={ this.props.countSelectCount } />
        <div className='introduceButton'
          onClick={() => { this.handleClick(); }}>
          {text}
          <span className='countTip' style={this.props.selectCounts === 0 ? {display: 'none'} : {display: 'block'}}>
            { this.props.selectCounts }</span>
        </div>
      </div>;
    } else {
      content = <div style={{position: 'relative', paddingTop: '100%'}} >
        <div ref='spinner' className='loading-spinner loading-spinner-size6' />
      </div>;
    }
    return (
      <div className='classifyPage'>
        {content}
      </div>
    );
  }
}

Classify.defaultProps = {
  title: '您喜欢哪类视频?',
  subTitle: '我们将根据您的选择为您定制首页的推荐内容'
};
