import { Classify } from '../api/';
import { GET_CLASSIFY_LIST, CLEAR_CLASSIFY_LIST, ADD_SELECT_COUNT, REDUCE_SELECT_COUNT, SHOW_CLASSIFY_PAGE, HIDE_CLASSIFY_PAGE } from './index';

function action(data) {
  return {
    type: GET_CLASSIFY_LIST,
    json: data
  };
}

export function getClassifyList() {
  return (dispatch, param) => {
    Classify()
      .then((data) => {
        dispatch(action(data));
      })
      .catch((e) => {
        console.error(e);
      });
  };
}

export function countSelectCount(n) {
  return {
    type: 'COUNT_SELECT_COUNT',
    count: n
  }
}

export function showClassityPage() {
  return {
    type: 'SHOW_CLASSIFY_PAGE',
    flag: true
  }
}

export function clearClassifyList() {
  return {
    type: 'CLEAR_CLASSIFY_LIST',
    json: undefined
  }
}

export function hideClassityPage() {
  return {
    type: 'HIDE_CLASSIFY_PAGE',
    flag: false
  }
}
