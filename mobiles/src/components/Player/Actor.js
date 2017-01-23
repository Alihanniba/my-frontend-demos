import React, { Component } from 'react'

export default class Actor extends Component {
  constructor(props) {
    super(props)
    this.renderActorList = this.renderActorList.bind(this)
  }

  renderActorList() {
    const actors = this.props.actors
    const SelectionArr = []
    for (let i = 0; i < actors.length; i++) {
      SelectionArr.push(
        <figure key={i}>
        <img src={ actors[i].face_avartar }/>
        <figcaption>{ actors[i].name }</figcaption>
        </figure>
      )
    }
    return SelectionArr
  }

  render() {
    let { type } = this.props
    let field = type === "综艺" ? "嘉宾" : "演员"
    return (
      <div className="episodes-box" ref="actor">
      <div className="episodes-title-update">
      <p className="episodes-title">{ field }</p>
      </div>
        <div className="actor-container">
        { this.renderActorList() }
        </div>
        </div>
      )
    }
  }
