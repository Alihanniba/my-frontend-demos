import { Home } from '../api/';
import { GET_CHANNEL_EPISODES_LIST, BASE_URL, CLEAR_CHANNEL_DATA } from './index';

function getEpisodes(data) {
    return {
        type: GET_CHANNEL_EPISODES_LIST,
        payload: {
            data: data
        }
    };
}

export function getEpisodesList(url, type, page, id) {
    url = url ? BASE_URL + url : BASE_URL + 'api/home/';
    type = type || 'index';
    page = page || 1;
    id = id ? id : 0;
    let sourceUrl = url + type + '/' + page + '/' + id;
    return (dispatch, param) => {
        Home(sourceUrl)
            .then((data) => {
                if (data.status === 200 && data.data) {
                    dispatch(getEpisodes(data.data));
                }
            })
            .catch((e) => {
                console.error(e);
            });
    };
}

export function clearChannelData() {
    return {
        type: CLEAR_CHANNEL_DATA,
        payload: undefined
    }
}