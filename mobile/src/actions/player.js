import { Episode, Home } from '../api/';
import { GET_EPISODES_LIST, CLEAR_PLAYER_DATA, SET_PLAYER_STATE, GET_RELATED_VIDEO, BASE_URL } from './index';

function action(data) {
  return {
    type: GET_EPISODES_LIST,
    json: data
  };
}

export function getEpisodesList(id) {
  return (dispatch, param) => {
    Episode(id)
      .then((data) => {
        dispatch(action(data));
      })
      .catch((e) => {
        console.error(e);
      });
  };
}

export function clearPLayerData() {
  return {
    type: CLEAR_PLAYER_DATA,
    json: undefined
  }
}

export function setPLayerState(state) {
  return {
    type: SET_PLAYER_STATE,
    json: state
  }
}

export function getRelatedVideo(url, type, page, id) {
  url = url ? BASE_URL + url : BASE_URL + 'api/home/';
  type = type || 'index';
  page = page || 1;
  id = id ? id : 0;
  let sourceUrl = url + type + '/' + page + '/' + id;
  return (dispatch, param) => {
      Home(sourceUrl)
          .then((data) => {
              if (data.status === 200 && data.data) {
                  dispatch({type: 'GET_RELATED_VIDEO', json: data.data.result
});
              }
          })
          .catch((e) => {
              console.error(e);
          });
  };
}
