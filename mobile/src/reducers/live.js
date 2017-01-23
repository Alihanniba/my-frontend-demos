import { GET_LIVE_LIST } from '../actions/index';
import objectAssign from 'object-assign'
const initialState = {
}

export default function homeList(state = initialState, action) {
    switch (action.type) {
        case GET_LIVE_LIST:
            return objectAssign({}, {
                data: action.payload
            })
        default:
            return state
    }
}
