import { Compile, PostChannels, GetChannels } from '../api/';
import { POST_COMPILE_LIST, GET_CHANNELS } from './index';
import Storage from '../libs/storage';

function action(data) {
    return {
        type: POST_COMPILE_LIST,
        payload: {
            data: data
        }
    };
}

function getChannelsAction(data) {
    return {
        type: GET_CHANNELS,
        payload: {
            data: data
        }
    };
}

export function postChannels(compile) {
    return (dispatch, param) => {
        PostChannels(compile)
            .then((source) => {
                if (source.status === 200) {
                    dispatch(action(200));
                }
            }).catch((e) => {
                console.error(e);
            })
    }
}

export function getChannels() {
    return (dispatch, param) => {
        GetChannels()
            .then((source) => {
                if (source.status === 200) {
                    let items = [];
                    for(let i in source.data) {
                        items.push(source.data[i])
                    }
                    Storage.set(Storage.KEYS.USER_SELECTED_CHANNEL, items)
                    dispatch(getChannelsAction(200));
                }
            }).catch((e) => {
                console.error(e);
            })
    }
}