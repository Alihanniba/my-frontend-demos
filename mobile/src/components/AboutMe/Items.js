import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, hashHistory} from 'react-router';
import User from '../../actions/user';
import './items.css'
const history = window.config.hashHistory ? hashHistory : browserHistory

class Items extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            main: [
                {
                    icon: 'ion-clock-self',
                    title: '观看记录',
                    link: 'record',
                    record: User.getUserHistory()
                    // record: [
                    //     {
                    //         id: 0,
                    //         name: '暴走漫画',
                    //         img: 'http://res.cloudinary.com/dnz3iwzjm//q_auto:best/v1474875115/zudkaw4ozzc4zxinml9y.jpg'
                    //     },
                    //     {
                    //         id: 1,
                    //         name: '暴走画',
                    //         img: 'http://res.cloudinary.com/dnz3iwzjm//q_auto:best/v1474875115/zudkaw4ozzc4zxinml9y.jpg'
                    //     },
                    //     {
                    //         id: 1,
                    //         name: '暴走画',
                    //         img: 'http://res.cloudinary.com/dnz3iwzjm//q_auto:best/v1474875115/zudkaw4ozzc4zxinml9y.jpg'
                    //     },
                    //     {
                    //         id: 1,
                    //         name: '暴走画',
                    //         img: 'http://res.cloudinary.com/dnz3iwzjm//q_auto:best/v1474875115/zudkaw4ozzc4zxinml9y.jpg'
                    //     },
                    //     {
                    //         id: 1,
                    //         name: '暴走画',
                    //         img: 'http://res.cloudinary.com/dnz3iwzjm//q_auto:best/v1474875115/zudkaw4ozzc4zxinml9y.jpg'
                    //     },
                    //     {
                    //         id: 1,
                    //         name: '暴走画',
                    //         img: 'http://res.cloudinary.com/dnz3iwzjm//q_auto:best/v1474875115/zudkaw4ozzc4zxinml9y.jpg'
                    //     }
                    // ]
                },
                {
                    icon: 'ion-star-self',
                    title: '我的收藏',
                    link: 'collect',
                    num: User.getFavouriteNum()
                },
                {
                    icon: 'ion-email-self',
                    title: '吐槽提意见',
                    link: 'tease',
                },
                {
                    icon: 'ion-edit-self',
                    title: '我来打分',
                    link: '',
                },
                {
                    icon: 'ion-gear-self',
                    title: '关于',
                    link: 'about',
                }
            ]
        };
        this.goToPlay = this.goToPlay.bind(this)
    }

    componentDidMount() {
        User.getUserHistory((res) => {
           
        })
        console.log(this.state.main);
    }

    grade(){
        // if (cordova.platformId == 'ios') {
        //     cordova.InAppBrowser.open('https://itunes.apple.com/us/app/vego-tv/id1142155334?mt=8', '_blank', 'location=no');
        // } else {
        //     cordova.InAppBrowser.open('https://play.google.com/store/apps/details?id=com.vego.tv&hl=en', '_blank', 'location=no');
        // }
        navigator.store.goStore();
    }

    goToPlay(item){
        history.push('/watch/' + item.titleId + '?episodeId=' + item.episodeId + '&current=' + item.current);
        return;
    }

    render() {  
        let mainSource = this.state.main.map((item, key) => {
            // if (item.title == '我的收藏' && !this.props.islogin) {
            //     return
            // }
            return (
               <div key={ key }>
                <div className="item-one" >
                    <div className="item-content" onClick={ 
                    (item.title == '我来打分') ?
                        this.grade.bind(this)
                    :
                        (item.link ? () => { history.push(`/${item.link}/`) } : '')
                } >
                    <span className={ item.icon + " " + "item-icon item-icon-self" }  ></span>
                        <div className="item-main">
                            <h6 className="item-title">{ item.title }</h6>
                            {
                                item.num !== undefined ? <span className="collect-num">{item.num}个视频</span> : ''
                            }
                            <span className="ion-ios-arrow-right item-icon"></span>
                        </div>
                        
                    </div>
                    {
                        item.record && item.record.length > 0 ? (<div className="portion-episode">
                                                                    {
                                                                        item.record.map((episode, index) => {

                                                                            return <figure key={ index } onClick={()=>{this.goToPlay(episode)}}>
                                                                                        <img src={episode.img} alt=""/>
                                                                                        <figcaption>{ episode.name.length > 7 ? episode.name.substring(0, 7) + '...' : episode.name }</figcaption>
                                                                                    </figure>
                                                                        })
                                                                    }
                                                                </div> )
                                                                : ''
                    }
                    
                </div>
                {item.title == '我的收藏' ? (<div className="line5"></div>) : (<div className="line1"></div>)}
                </div>
            )
        }) 
        return (
            <div className="items-container">
                { mainSource }
            </div>
        );
    }
}

export default Items;