import { SHOW_COMPILE, HIDE_COMPILE } from '../actions/index';

const initialState = {
    state: 0
}

export default function compileList(state = initialState, action) {
    switch (action.type) {
        case SHOW_COMPILE:
            return action.payload
        case HIDE_COMPILE:
            return action.payload
        default:
            return state
    }
}