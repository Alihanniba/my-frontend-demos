import { GET_CLASSIFY_LIST, CLEAR_CLASSIFY_LIST, COUNT_SELECT_COUNT, SHOW_CLASSIFY_PAGE, HIDE_CLASSIFY_PAGE } from '../actions/index';
import objectAssign from 'object-assign'
const initialState = {
  selectCounts: 0,
  showClassify: false
}
export default function classifyList(state = initialState, action) {
    switch (action.type) {
        case GET_CLASSIFY_LIST:
        case CLEAR_CLASSIFY_LIST:
          return objectAssign({}, state, { classifyList: action.json })
          break
        case COUNT_SELECT_COUNT:
          return objectAssign({}, state, { selectCounts: action.count })
          break
        case SHOW_CLASSIFY_PAGE:
          return objectAssign({}, state, { showClassify: action.flag })
          break
        case HIDE_CLASSIFY_PAGE:
          return objectAssign({}, state, { showClassify: action.flag })
        default:
            return state
    }
}
