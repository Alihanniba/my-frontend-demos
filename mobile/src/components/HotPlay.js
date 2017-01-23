import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import {
    Page,
    Toolbar,
    Tabbar,
    Tab,
    Icon,
    List,
    ListItem,
    Carousel,
    CarouselItem
} from 'react-onsenui';

// import Player from './Player';
import './common.css';

const hotPLayStyle = {
    contain: {
        width: '100%',
        padding: '10px',
        margin: '0 auto'
    },
    item: {
        paddingBottom: '10px',
        margin: '0',
        width: '49%',
        display: 'inline-block'
    },
    cover: {
        margin: '0 auto',
        width: '100%',
        borderRadius: '4px'
    },
    figcaption: {
        fontSize: '14px',
        marginTop: '5px'
    }
}

export default class HotPlay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            items: [
                '中国好声音',
                '中国好歌曲',
                '西游记',
                '麻将',
                '麻雀',
                '天天向上'
            ]
        };
      this.goToPlayer = this.goToPlayer.bind(this);
    }
    goToPlayer() {
      browserHistory.push('/player')
    }
    render() {
        return ( < div style = { hotPLayStyle.contain } > {
                this.state.items.map((item) => {
                    return <figure className = 'item'
                    onClick={this.goToPlayer}
                    style = { hotPLayStyle.item }
                    key = { item.toString() } >
                        <
                        img src = { `http://placekitten.com/g/39` }
                    className = ''
                    style = { hotPLayStyle.cover }
                    /> <
                    figcaption style = { hotPLayStyle.figcaption } > { item } <
                        /figcaption> < /
                    figure >
                })
            } <
            /div>
        )
    }
}
