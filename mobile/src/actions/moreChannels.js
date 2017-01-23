import { SHOW_MORE_CHANNELS, HIDE_MORE_CHANNELS } from './index';

export function showChannels() {
    return {
        type: SHOW_MORE_CHANNELS,
        payload: true
    }
}

export function hideChannels() {
    return {
        type: HIDE_MORE_CHANNELS,
        payload: false
    }
}