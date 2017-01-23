import { Home } from '../api/';
import { GET_HOME_LIST, BASE_URL, CLEAR_HOME_DATA } from './index';

function action(data) {
    return {
        type: GET_HOME_LIST,
        payload: {
            data: data
        }
    };
}

export function getHomeList(url, type, page, id) {
    url = url ? BASE_URL + url : BASE_URL + 'api/home/';
    type = type || 'index';
    page = page || 1;
    id = id ? id : 0;
    let sourceUrl = url + type + '/' + page + '/' + id;
    return (dispatch, param) => {
        Home(sourceUrl)
            .then((data) => {
                if (data.status === 200 && data.data) {
                    dispatch(action(data.data));
                }
            })
            .catch((e) => {
                console.error(e);
            });
    };
}

export function clearHomeData() {
    return {
        type: CLEAR_HOME_DATA,
        payload: undefined
    }
}