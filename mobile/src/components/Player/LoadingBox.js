import React, { Component } from 'react';

export default class LoadingBox extends Component {
    constructor(props) {
        super(props);
    }
    render() {
       return (
         <div className="loading-box">
           <div className="loading">
               <div className="rect1"></div>
               <div className="rect2"></div>
               <div className="rect3"></div>
               <div className="rect4"></div>
               <div className="rect5"></div>
           </div>
         </div>
       );
    }
}
