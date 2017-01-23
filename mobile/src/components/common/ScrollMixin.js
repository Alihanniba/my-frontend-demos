import React from 'react'
import ToolKit from '../../tools/tools'

const ScrollMixin = {

  componentDidMount() {
    document.addEventListener('scroll', this.scrollListener)
  },
  
  componentWillUnmount() {
    document.removeEventListener('scroll', this.scrollListener)
  },
}

export default ScrollMixin
