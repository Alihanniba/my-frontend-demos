import React from 'react';
import Storage from '../../libs/storage';

export default class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.renderList = this.renderList.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.selectedLists = []
  }
  componentWillMount() {
    this.props.classifyList && this.props.classifyList.shift()
  }
  //select or cancle selected channels
  selectItem(e, item) {
    const {selectCounts, countSelectCount} = this.props
    if( e.target.className.indexOf('active') > -1 ) {
      e.target.className = '';
      for (let i = 0; i < this.selectedLists.length; i++) {
        if(this.selectedLists[i].id == item.id) {
          this.selectedLists.splice(i, 1)
        }
      }
      this.dealUserSelectedItems(-1)
      return
    }
    e.target.className = 'active'
    this.selectedLists.push(item)
    this.dealUserSelectedItems(1)
  }
  //dispatch selectCounts and save user selected items
  dealUserSelectedItems(num) {
    Storage.set(Storage.KEYS.USER_SELECTED_CHANNEL, this.selectedLists)
    // localStorage.setItem('userSelectedLists', JSON.stringify(this.selectedLists))
    const { selectCounts, countSelectCount } = this.props
    let n = selectCounts + num;
    countSelectCount(n)
  }
  renderList() {
    const lists = this.props.classifyList
    if(lists == undefined) return
    const listArr = [];
    for (let i = 0; i < lists.length; i++) {
      let item = lists[i];
      if( !item.fixed ) {
        listArr.push(
          <li key={ i }
            onClick={ (e)=> { this.selectItem(e, item) }}>
            <img />
            { item.name }
          </li>
        )
      }
    }
    return listArr;
  }
  render() {
    return (
      <div className="select-list-box">
        <ul className="listContainer">
          { this.renderList() }
        </ul>
      </div>
    );
  }
}
