import { POST_COMPILE_LIST, SHOW_COMPILE, HIDE_COMPILE, GET_CHANNELS } from '../actions/index';
import objectAssign from 'object-assign'
const initialState = {
    state: 0
}

export default function compileList(state = initialState, action) {
    switch (action.type) {
        case POST_COMPILE_LIST:
        case GET_CHANNELS:
            return objectAssign({}, {
                data: action.payload
            })
        default:
            return state
    }
}
