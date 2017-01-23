import React, {Component} from 'react';
import { browserHistory, hashHistory} from 'react-router';
import { connect } from 'react-redux'

import { getEpisodesList, clearChannelData } from '../../actions/getChannelEpisodes';

import '../EpisodeItem/episodeItem.css';
import ToolKit from '../../tools/tools'

const history = window.config.hashHistory ? hashHistory : browserHistory

class ChannelEpisode extends Component {
    constructor(props) {
        super(props);
        this.state = {
            channelEpisodes: []
        };
        this.api = '';
        this.classify = '';
        this.index = 0;
        this.page = 1;
        this.isLoading = false;
        this.key = 0;

        this.goToPlayer = this.goToPlayer.bind(this);
        this.scrollListener = this.scrollListener.bind(this);
        this.calculate = this.calculate.bind(this);
    }

    static contextTypes = {
        store: React.PropTypes.object
    }

    componentWillMount() {
       document.body.style.overflow = '';
    }

    componentDidMount () {
        document.addEventListener('scroll', this.scrollListener)
        const id = this.props.router ? this.props.router.params.id : '';
        if (id) {
            if (Number(id) !== 100) {
                this.api = 'api/cps/cps/';
                this.classify = 'youtube';
                this.index = Number(id);
            } else {
                this.api = 'api/home/';
                this.classify = 'index';
                this.index = 0;
            }
            this.context.store.dispatch(getEpisodesList(this.api, this.classify, this.page, this.index))
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        console.log(nextProps.getChannelEpisodes)
        console.log(nextProps.getChannelEpisodes.data);
        // debugger
        if (nextProps.getChannelEpisodes.data) {
            let channelEpisodes = nextProps.getChannelEpisodes.data.data.result[0];
            console.log(channelEpisodes);
            // debugger
            if (channelEpisodes[0].id !== this.key) {
                this.calculate(channelEpisodes[0]);
                this.setState({
                    channelEpisodes: this.state.channelEpisodes.concat(channelEpisodes)
                })
                this.key = channelEpisodes[0].id;
            }
        } 
    }

    componentWillUnmount() {
        this.context.store.dispatch(clearChannelData())
        document.removeEventListener('scroll', this.scrollListener)
    }
    
    scrollListener() {
      console.log('=========正在滑动============');
    //   let footerHeight = (window.innerWidth / 10) * 1.18;
      if(document.body.scrollTop + ToolKit.winHeight() > document.body.scrollHeight - 10 && this.isLoading === true){
          console.log('==============到屏幕最底部了!!!=============')
          this.context.store.dispatch(getEpisodesList(this.api, this.classify, this.page, this.index))
          this.isLoading = false
      }
    }

    calculate (data) {
        if (data.classifyNum) {
            if (data.currentPage === data.totalPage) {
                if (data.classifyNum - data.classifyId === 1) {
                    this.isLoading = false;
                } else {
                    this.page = 1;
                    console.log(this.page)
                    this.index = data.classifyId + 1;
                    this.isLoading = true;
                }
            } else {
                this.page = this.page + 1;
                console.log(this.page)
                this.index = data.classifyId;
                this.isLoading = true;
            }
        } else {
            if (data.currentPage === data.totalPage) {
                this.isLoading = false;
            } else {
                this.isLoading = true;
            }
            this.page = this.page + 1;
        }
    }

    goToPlayer(item) {
        history.push(`/watch/${item.id}`)
    }

    render() {
        let channelEpisodes = this.state.channelEpisodes.length > 0 ? this.state.channelEpisodes.map((item, index) => {
                                return <figure onClick={()=>{this.goToPlayer(item)}} key={ index } data-id={ item.id } data-istitle="true" >
                                    <img src={ item.landscape_poster } />
                                    <figcaption>{ item.name }</figcaption>
                                    <p>{ item.description }</p>
                                </figure>
                            }) : '';
        return (
            <div style={{ height: "100%" }}>
                <main>
                    <content ref="contents">
                        { channelEpisodes }
                    </content>
                    <div className={ this.isLoading ? 'loader-child' : 'loader-child on' }>
                        <i></i>
                        <i></i>
                    </div>
                </main>
            </div>
        );
    }
}

// ChannelEpisode.propTypes = {
//     id: PropTypes.string.isRequired,
// }

const getAppList = state => {
  return {
    getChannelEpisodes: state.getChannelEpisodes
  }
}

export default connect(getAppList, {getEpisodesList})(ChannelEpisode)
