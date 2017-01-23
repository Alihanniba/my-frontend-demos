import { GET_SEARCH_LIST, GET_SEARCHNAME_LIST, SET_SEARCH_STATE } from '../actions/index';
import objectAssign from 'object-assign'
const initialState = {
  recordLists: [],
  renderSearchFlag: false,
  recordListsVisable: false,
  notFoundVisable: false,
  nameListVisable: true,
  resultList: {},
}

export default function searchList(state = initialState, action) {
    switch (action.type) {
        case GET_SEARCH_LIST:
            return objectAssign({}, state, { searchList: action.json })
            break
        case GET_SEARCHNAME_LIST:
            return objectAssign({}, state, { searchNameList: action.json })
            break
        case SET_SEARCH_STATE:
            return objectAssign({}, state, action.json)
            break
        default:
            return state
    }
}
