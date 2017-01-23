import React, { Component } from 'react'

export default class VarietyCommon extends Component {
  constructor(props) {
    super(props)
    this.renderVariety = this.renderVariety.bind(this)
    this.changeAlbum = this.changeAlbum.bind(this)
  }

  changeAlbum(index, item) {
    let { action, relatedVideo } = this.props

    let id = relatedVideo ? item.id : index
    this.props.action(id)
  }

  renderVariety() {
    const { lists, action } = this.props
    // const changeAlbum = this.props.changeAlbum
    let varietyArr = []
    for(let j = 0; j < lists.length; j++) {
      varietyArr.push(
        <figure
          className={ lists[j].id == this.props.current ? 'playing' : ''}
          onClick={ () => {this.changeAlbum(j, lists[j])}}
          key={j}>
          <img src={lists[j].landscape_poster} ></img>
          <figcaption>{ lists[j].name }</figcaption>
        </figure>
      )
    }
    return varietyArr
  }

  render() {
    return (
      <div
        className="all-varietys"
        style={{display: this.props.displayStyle}}
        ref="allVariety">
        { this.renderVariety() }
      </div>
    )
  }
}

VarietyCommon.defaultProps = {
  relatedVideo: false
}
