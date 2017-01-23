import { GET_EPISODES_LIST, CLEAR_PLAYER_DATA, SET_PLAYER_STATE, GET_RELATED_VIDEO } from '../actions/index';
import objectAssign from 'object-assign'
const initialState = {
  player: null,
  title: '',
  subTitle: '',
  errTip: false,
  playingIndex: null,
  episodeLists: {},
  playUrl: "",
  description: '',
  canChangeAlbum: false,
  start: 0
}
export default function episodesList(state = initialState, action) {
    switch (action.type) {
        case GET_EPISODES_LIST:
            return objectAssign({}, state, { episodes: action.json })
            break
        case  CLEAR_PLAYER_DATA:
          return objectAssign({}, state, { episodes: action.json })
          break
        case  SET_PLAYER_STATE:
          return objectAssign({}, state, action.json)
          break
        case  GET_RELATED_VIDEO:
          return objectAssign({}, state, {relatedVideo: action.json})
          break
        default:
          return state
    }
}
