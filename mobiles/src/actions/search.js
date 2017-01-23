import { Search } from '../api/';
import { GET_SEARCH_LIST, GET_SEARCHNAME_LIST, SET_SEARCH_STATE } from './index';

function action(data) {
  return {
    type: GET_SEARCH_LIST,
    json: data
  };
}

export function getSearchList(params) {
  return (dispatch, param) => {
    Search(params)
      .then((data) => {
        dispatch(action(data));
      })
      .catch((e) => {
        console.error(e);
      });
  };
}

function nameAction(data) {
  return {
    type: GET_SEARCHNAME_LIST,
    json: data
  };
}

export function getSearchNameList(params) {
  return (dispatch, param) => {
    Search(params)
      .then((data) => {
        let arr = []
        for(let i in data){
        arr.push(data[i].name)
        }
        dispatch(nameAction(arr));
      })
      .catch((e) => {
        console.error(e);
      });
  };
}

export function setSearchState(state) {
  return {
    type: SET_SEARCH_STATE,
    json: state
  }
}
