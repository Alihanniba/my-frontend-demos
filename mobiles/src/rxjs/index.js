import { combineEpics } from 'redux-observable';
import { homeEpic } from '../reducers/home';

export const rootEpic = combineEpics(
    homeEpic
);