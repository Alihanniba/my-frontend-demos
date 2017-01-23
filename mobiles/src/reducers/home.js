import { GET_HOME_LIST, CLEAR_HOME_DATA } from '../actions/index';
import objectAssign from 'object-assign'
import Storage from '../libs/storage';

const initialState = {
    state: 0
}

// const homeEpic = action$ => action$.ofType(GET_HOME_LIST).takeUntil(action$.ofType(CLEAR_HOME_DATA));

export default function homeList(state = state || initialState, action) {
    if (action.verify_data) {
        state.s_id = action.verify_data.id;
        state.s_start = action.verify_data.start;
        state.s_end = action.verify_data.end;
        state.s_handle = action.verify_data.handle;
    }
    switch (action.type) {
        case GET_HOME_LIST:
        case CLEAR_HOME_DATA:
            return objectAssign({},
                action.payload
            )
        default:
            return state
    }
}


