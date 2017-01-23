import { SHOW_COMPILE, HIDE_COMPILE } from './index';

export function showCompile() {
    return {
        type: SHOW_COMPILE,
        payload: true
    }
}

export function hideCompile() {
    return {
        type: HIDE_COMPILE,
        payload: false
    }
}