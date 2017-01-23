import React, { Component } from 'react';
import { Link } from 'react-router';
import './footer.css';
import Storage from '../../libs/storage';

const content = [
  {
    name: '首页',
    icon: 'home-icon',
    link: '/home'
  },
  {
    name: '直播',
    icon: 'live-icon',
    link: '/live'
  },
  {
    name: '我的',
    icon: 'me-icon',
    link: '/me'
  }
];

class Footer extends Component {
	constructor(props) {
      super(props);
      this.state = {
          light: 0
      };
      this.HandlehignLight = this.HandlehignLight.bind(this);
  }

  componentWillMount() {
    //进入我的页面会刷新页面,跟我的页面逻辑相关
    Storage.s_get(Storage.KEYS.LIGHT_KEY) && this.setState({
          light: Number(Storage.s_get(Storage.KEYS.LIGHT_KEY))
    })
  }

	HandlehignLight(key) {
    Storage.s_set(Storage.KEYS.LIGHT_KEY, key)
    this.setState({
      light: key
    })
	}

	render () {
		return (
      <div>
        <div style={{height: '49px'}}></div>
        <div className="footer-container">
          <div className="footer-main">
            {
              content.map((item, index) => {
              return (
                <Link to={ item.link } key={ index }  className={ this.state.light === index ? 'foot-active footer-tab-one' : 'footer-tab-one' } onClick={ () => { this.HandlehignLight(index) } }>
                  <div>
                  <span  className={ this.state.light === index ? item.icon + '1 ' + "footer-tab-icon" : item.icon + ' ' + "footer-tab-icon" } ></span>
                  <label  className="footer-tab-name"  >{ item.name }</label>
                  </div>
                </Link>
              );
              })
            }
          </div>
        </div>
      </div>
      
		)
	}
}

export default Footer;
