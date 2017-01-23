import React, { Component } from 'react';

import {
    Tabbar,
    Page,
    Toolbar,
    Tab
} from 'react-onsenui';
import Swiper from './Swiper';
import HotPlay from './HotPlay';
import NavBar from './NavBar';
import AboutMe from './AboutMe';

// const HomeMain = (title, navigator) => {
// 	switch(title){
// 		case 'Home':
// 			return (
// 				<div>
// 					<Swiper />
// 					<HotPlay />
// 				</div>
// 			);
// 		case 'Live':
// 			return <HotPlay />
// 		case 'Settings':
// 			return '';
// 	}
// };

// const TabPage = ({title, navigator}) => {
// 	return (
// 		<Page modifier="introPage" >
// 			{ HomeMain(title, navigator) }
//   		</Page>
// 	);
// }

const navStyle = {
	navBox: {
		width: '100%'
	},
	navMain: {
		width: '92%',
		margin: '0 auto'
	},
	navItem: {
		padding: '0 0.4rem',
		fontSize: '0.3733333333rem'
	}
}

class TabPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
    }

	render () {
		return (
			<div style={ navStyle.navBox }>
				<ul style={ navStyle.navMain }>
					<li style={ navStyle.navItem }>经典怀旧</li>
					<li>搞笑都比</li>
					<li>校园青春</li>
					<li>花样年华</li>
					<li>爱奇艺</li>
					<li>youtube</li>
				</ul>
			</div>
		);
	}

}

export default TabPage;
