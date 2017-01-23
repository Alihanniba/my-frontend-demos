import React, { Component } from 'react';
import { Toolbar, BackButton, Icon } from 'react-onsenui';
import Attention from './Attention';
import Collect from './Collect';


const navBarStyle = {
    nav: {
        height: '44px',
        lineHeight: '44px',
        padding: '0 10px',
        width: '100%'
    },
    iconCont: {
        display: 'inline-block',
        float: 'right'
    },
    iconItem: {
        fontSize: '22px',
        marginLeft: '10px',
        overflow: 'hidden'
    }
}

const iconStyle = [
    [
        'ion-ios-search-strong',
        'Search'
    ],
    [
        'ion-ios-clock-outline',
        'Attention'
    ],
    [
        'ion-ios-star-outline',
        'Collect'
    ]
];

export default class NavApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
        };
        this.handleClickIcon = this.handleClickIcon.bind(this, navigator);
    }

    handleClickIcon (navigator, type) {
        // this.props.navigator.pushPage({component: type, key: 1});
    }

    render() {
            return (
                <Toolbar>
                    < div className = 'left' >
                    {
                        this.props.backButton ?
                        <BackButton onClick = {() => this.props.navigator.popPage()}> 后退 < /BackButton> : null
                    }
                    </div>
                    <div style = { navBarStyle.nav } >
                        < strong > { this.props.title }< /strong>
                        <div style = { navBarStyle.iconCont } >
                        {
                            iconStyle.map((icon) => {
                                    return ( < Icon icon = {
                                                    icon[0]
                                                }
                                                key = {
                                                    icon[0]
                                                }
                                                onClick={ this.handleClickIcon(icon[1]) }
                                                style = { navBarStyle.iconItem }
                                            / >
                                            )
                                        })
                        }
                        </div>
                    </div>
                </Toolbar>
            );
        }
    }
