import { GET_CHANNEL_EPISODES_LIST, CLEAR_CHANNEL_DATA } from '../actions/index';
import objectAssign from 'object-assign'
const initialState = {
    state: 0
}

export default function channelEpisodesList(state = initialState, action) {
    switch (action.type) {
        case GET_CHANNEL_EPISODES_LIST:
        case CLEAR_CHANNEL_DATA:
            return objectAssign({}, {
                data: action.payload
            })
        default:
            return state
    }
}
