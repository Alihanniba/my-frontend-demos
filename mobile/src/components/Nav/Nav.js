import React, { Component } from 'react';
import { Link } from 'react-router';
import './nav.css' 

const Nav = ({children}) => (
  <div className="header-container">
        <div className="header-main">
            <div className="header-logo"></div>
            <div className="icon-box">
                <ul className="icon-main">
                    <Link to='search'><li className="icon-one search" ></li></Link>
                    <Link to='record'><li className="icon-one compile" ></li></Link>
                    <Link to='collect'><li className="icon-one collect" ></li></Link>
                </ul>
            </div>
        </div>
  </div>
);

export default Nav;
