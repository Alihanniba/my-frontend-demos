import { LOGIN } from './index';

export default function loginUser(userInfo) {
  return {
    type: LOGIN,
    userInfo: userInfo
  }
}
