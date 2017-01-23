import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import dialog from './dialog';
import home from './home';
import player from './player';
import search from './search';
import login from './login';
import compile from './compile';
import compileStatus from './compileStatus';
import classify from './classify';
import moreChannels from './moreChannels';
import getChannelEpisodes from './getChannelEpisodes';
import live from './live';


const vegoApp = combineReducers({
    dialog,
    home,
    player,
    search,
    login,
    compile,
    compileStatus,
    classify,
    moreChannels,
    getChannelEpisodes,
    live,
    routing: routerReducer
});

export default vegoApp;