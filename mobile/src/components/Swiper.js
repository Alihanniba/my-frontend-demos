import React, { Component } from 'react';
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


export default class Swiper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                [
                    '#F1948A', '笑傲江湖'
                ],
                [
                    '#D7BDE2', '天仙配'
                ],
                [
                    '#85C1E9', '西游记和梁山伯'
                ],
                ['#73C6B6', '猫和老鼠']
            ],
            index: 0
        };
        this.handleChange = this
            .handleChange
            .bind(this);
        this.setIndex = this
            .setIndex
            .bind(this);
    }

    handleChange(e) {
        this.setState({ index: e.activeIndex });
    }

    setIndex(index) {
        this.setState({ index: index });
    }

    render() {
        return ( <
            Carousel onPostChange = { this.handleChange }
            index = { this.state.index }
            swipeable style = {
                {
                    height: '200px'
                }
            }
            autoScroll overscrollable > {
                this
                .state
                .items
                .map((item, index) => ( <
                    CarouselItem key = { index }
                    style = {
                        {
                            backgroundColor: item[0]
                        }
                    } >
                    <
                    div style = {
                        {
                            marginTop: '100px',
                            textAlign: 'center'
                        }
                    } > { item[1] } <
                    /div> < /
                    CarouselItem >
                ))
            } <
            /Carousel>
        );
    }
}