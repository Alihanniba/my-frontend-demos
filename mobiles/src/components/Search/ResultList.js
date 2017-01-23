import React from 'react'
import { browserHistory, hashHistory} from 'react-router'
import Storage from '../../libs/storage'
import ToolKit from '../../tools/tools'
const history = window.config.hashHistory ? hashHistory : browserHistory

export default class ResultList extends React.Component {
  constructor(props) {
    super();
    this.renderList = this.renderList.bind(this);
    this.goToPlayer = this.goToPlayer.bind(this)
  }
  componentWillMount() {
    if (this.props.recordListsVisable) {
      this.props.troggleRecordList(false)
    }
  }
  goToPlayer(item) {
    let val = document.getElementById('search-input').value
    Storage.s_set(Storage.KEYS.SEARCH_TEXT, val)
    history.push(`/watch/${item.id}`)
  }
  renderList(){
    const lists = this.props.lists;
    const listArr = [];
    for (let i in lists) {
      let item = lists[i]
      listArr.push(<div key={i}
                  className="result-list-item"
                  onClick={()=>{this.goToPlayer(item)}} >
                      <img
                        src={item.landscape_poster} />
                      <div className="result-list-desc">
                        <div className="result-name">{ item.name }</div>
                        <div className="result-type">
                          { item.genres.length > 0 ? item.genres[0].name : '' }
                        </div>
                      </div>
                    </div>)
    }
    return listArr;
  }
  render() {
    if( ToolKit.isEmpty(this.props.lists) ) {
    return (<div style={styles.resultNotFound}>
        <span className="ion-alert-circled" style={{fontSize: "24px"}}></span>
        <span style={{fontSize: "18px", marginLeft: "20px"}}>{ this.props.notFoundTitle }</span>
      </div>)
    }
    return (
      <div className="result-list-box">
        <h1>{this.props.title}</h1>
        <div style={{width: "100%", borderBottom: "1px solid #cccaca"}}></div>
        {this.renderList()}
      </div>
    );
  }
}
ResultList.defaultProps = {
  title: '相关视频',
  notFoundTitle: '未找到相关的视频'
}
const styles = {
  resultNotFound: {
    width: "100%",
    position: "absolute",
    top: "40%",
    textAlign: "center"
  }
};
