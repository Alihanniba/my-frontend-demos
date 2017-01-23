import { SHOW_MORE_CHANNELS, HIDE_MORE_CHANNELS } from '../actions/index';

const initialState = {
    state: 0
}

export default function moreChannels(state = initialState, action) {
    switch (action.type) {
        case SHOW_MORE_CHANNELS:
            return action.payload
        case HIDE_MORE_CHANNELS:
            return action.payload
        default:
            return state
    }
}