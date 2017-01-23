import { Home } from '../api/';
import { GET_HOME_LIST, BASE_URL, CLEAR_HOME_DATA } from './index';
import { createStore } from 'redux'

// function action(data) {
//     return {
//         type: GET_HOME_LIST,
//         payload: {
//             data: data
//         }
//     };
// }

// export function getHomeList(url, type, page, id) {
//     url = url ? BASE_URL + url : BASE_URL + 'api/home/';
//     type = type || 'index';
//     page = page || 1;
//     id = id ? id : 0;
//     let sourceUrl = url + type + '/' + page + '/' + id;
//     return (dispatch, param) => {
//         Home(sourceUrl)
//             .then((data) => {
//                 if (data.status === 200 && data.data) {
//                     dispatch(action(data.data));
//                 }
//             })
//             .catch((e) => {
//                 console.error(e);
//             });
//     };
// }


function action(data, id, start, end, handle) {
    return {
        type: GET_HOME_LIST,
        verify_data: {
            id: id,
            start: start,
            end: end,
            handle: handle
        },
        payload: {
            data
        }
    };
}

export function getHomeList(id, start, end, handle) {
    if (!id) {
        return (dispatch) => {
            dispatch(action(undefined, id, start, end, handle));
        }
    }
    return (dispatch, getState, param) => {
        Home(id, start, end, handle)
            .then((data) => {
                const { home } = getState()
                console.log(home)
                if ((!home.s_handle || (home.s_handle && id === home.s_id && start === home.s_start && end === home.s_end && handle === home.s_handle))) {
                    console.log('==相等==')
                    dispatch(action(data, id, start, end, handle))
                } else {
                    console.log('==不等==')
                    dispatch(action(undefined, id, start, end, handle))
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };
}

export function clearHomeData() {
    return {
        type: CLEAR_HOME_DATA,
        payload: undefined
    }
}