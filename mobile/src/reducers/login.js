import { LOGIN } from '../actions/index';
import objectAssign from 'object-assign'
const initialState = {
  session: false,
  userInfo: {}
}

export default function login(state = initialState, action) {
  //console.log('login reducer');
  switch (action.type) {
    case LOGIN:
      return objectAssign({}, state, { session: true, userInfo: action.userInfo });
    default:
      return state;
  }
}
