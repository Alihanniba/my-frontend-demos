import {History, Favorite, HistorySync, FavoriteSync} from '../api/history';
const LENGTH = 50;

const offine = (key, val) => {
  if (navigator.onLine) {
    return;
  }
  if (key !== Storage.KEYS.FAVOURITE || key !== Storage.KEYS.HISTORY) {
    return;
  }
   // get Sync Data
  let data = Storage.get(Storage.KEYS.SYNC_DATA) || {};
  let items = data.key || [];
  let length = key === Storage.KEYS.FAVOURITE ? 50 : key === Storage.KEYS.HISTORY ? 50 : 200; // Number.MAX_VALUE;
  if (items.length >= length) {
    items.length = length - 1;
  }
  items.push(val);
  data.key = items;
  Storage.set(Storage.KEYS.SYNC_DATA, data);
};

class LocalStorage {
  /**
   * about localStorage api
   */

  // private for FAVOURITE and HISTORY
  // that has same titleId key which use to deduplication.
  _push(key, val) {
    let data = this.get(key) || [];

    for (let i = 0; i < data.length; i++) {
      if (data[i].titleId === val.titleId) {
        data.splice(i, 1);
        break;
      }
    }
    data.unshift(val);
    if (data.lenght >= LENGTH) {
      data.length = LENGTH - 1;
    }
    return window.localStorage && localStorage.setItem(key, JSON.stringify(data));
  }

  set(key, val) {
    // offline
    offine(key, val);
    if (!navigator.onLine) {
      return;
    }
    // FAVOURITE and HISTORY need sync
    if (key === Storage.KEYS.FAVOURITE) {
      // FAVOURITE data {titleId: 8989, name: '', img: '', time: Date.now()}
      Favorite('post', val, () => {});
      return this._push(key, val);
    }
    if (key === Storage.KEYS.HISTORY) {
      // HISTORY data {titleId: 8937, episodeId: 8989, name: '', img: '', current: 676.9, time: Date.now()}
      // History('post', parseInt(val.titleId, 10), parseInt(val.episodeId, 10), val.current, () => {});
      History('post', val, (res) => {});
      return this._push(key, val);
    }
    window.localStorage && localStorage.setItem(key, JSON.stringify(val));
  }
  get(key, iterator) {
    if (!iterator) {
      return window.localStorage && JSON.parse(localStorage.getItem(key));
    }
    let data = window.localStorage && JSON.parse(localStorage.getItem(key)) || [];
    for (let i = 0; i < data.length; i++) {
      if (iterator(data[i])) {
        return data[i];
      }
    }
  }
  remove(key) {
    window.localStorage && localStorage.removeItem(key);
  }
  delete(key, iterator) {
    let data = this.get(key) || [];
    let arr = [];
    for (let i = 0; i < data.length; i++) {
      if (!iterator(data[i])) {
        arr.push(data[i]);
      }
    }
    window.localStorage && localStorage.setItem(key, JSON.stringify(arr));
  }

  deleteItems(key, ids, cb){
    // ids = [12186, 5180, 9139];
    if (typeof ids == 'object' && ids.length > 0 ) {
      if (key == Storage.KEYS.FAVOURITE) {
        // 删除收藏
        Favorite('batchDelete', ids, cb)
      }
      if(key == Storage.KEYS.HISTORY){
        // 删除历史记录
        History('batchDelete', ids, cb)
      }
    }
  }
  /**
   * about sessionStorage api
   */
  s_set(key, val) {
    window.sessionStorage && sessionStorage.setItem(key, JSON.stringify(val));
  }
  s_get(key) {
    return window.sessionStorage && JSON.parse(sessionStorage.getItem(key));
  }
  s_remove(key) {
    window.sessionStorage && sessionStorage.removeItem(key);
  }
  sync() {
    if (!navigator.onLine) {
      return;
    }
    HistorySync() // 同步历史记录
    FavoriteSync() // 同步收藏
  }
  clear() {
    for (let key in Storage.KEYS) {
      this.s_remove(key);
      this.remove(key);
    }
  }
}

let Storage = new LocalStorage();

// https://ottcloudapi-staging.herokuapp.com/model.json?path
/**
 * localStorage
 *
 * WATCH                      -->     视频播放数据
 * ALL_CHANNEL                -->     默认全部频道
 * USER_SELECTED_CHANNEL      -->     用户订购的频道
 * WELCOME_PAGE               -->     欢迎页key
 * USER_TOKEN                 -->     用户token
 * USER_NAME                  -->     用户名
 * HEAD_IMG_URL               -->     用户头像
 * NICK_NAME                  -->     用户昵称
 *
 *
 *
 * ------------------------------------------------
 * sessionStorage
 *
 * BACK_KEY                   -->     其他页面返回首页需定位在某个tab的key
 * BACK_POSITION_KEY          -->     其他页面返回首页 高亮导航 需定位的位置
 * HOME_SCROLL_KEY            -->     从频道点击频道进入首页相同频道时下滑距离
 * LIGHT_KEY                  -->     高亮tab key
 * LIVE_PAGE_KEY              -->     进入直播页面的key
 * PLAY_PAGE_KEY              -->     进入播放页面的key
 * ME_PAGE_KEY                -->     进入我的页面的key
 */

Storage.KEYS = {
  /** localStorage begin */
  SYNC_DATA: 'SYNC_DATA',
  WATCH: 'VIDEO_WATCH',
  ALL_CHANNEL: 'ALL_CHANNEL',
  USER_SELECTED_CHANNEL: 'USER_SELECTED_CHANNEL',
  WELCOME_PAGE: 'WELCOME_PAGE',
  HISTORY: 'WATCH_HISTORY',
  FAVOURITE: 'WATCH_FAVOURITE',
  USER_TOKEN: 'USER_TOKEN',
  USER_NAME: 'USER_NAME',
  HEAD_IMG_URL: 'HEAD_IMG_URL',
  NICK_NAME: 'NICK_NAME',
  USER_ID: 'USER_ID',
  SEARCH_HISTORY: 'SEARCH_HISTORY',
  HOME_LOCALS: {
    CURRENT_CHANNEL_ID: 'CURRENT_CHANNEL_ID',
    EPISODE_DATA: 'EPISODE_DATA',
    LOAD_MORE: 'LOAD_MORE',
    FIRST_KEY: 'FIRST_KEY',
    LAST_KEY: 'LAST_KEY'
  },
  /** localStorage over */
  /**-------------------------------------------------------- */
  /** sessionStorage begin */
  BACK_KEY: 'BACK_KEY',
  BACK_POSITION_KEY: 'BACK_POSITION_KEY',
  HOME_SCROLL_KEY: 'HOME_SCROLL_KEY',
  LIGHT_KEY: 'LIGHT_KEY',
  LIVE_PAGE_KEY: 'LIVE_PAGE_KEY',
  PLAY_PAGE_KEY: 'PLAY_PAGE_KEY',
  ME_PAGE_KEY: 'ME_PAGE_KEY',
  SEARCH_PAGE_KEY: 'SEARCH_PAGE_KEY',
  RECORD_PAGE_KEY: 'RECORD_PAGE_KEY',
  COLLECT_PAGE_KEY: 'COLLECT_PAGE_KEY',
  SEARCH_TEXT: 'SEARCH_TEXT',
  VERIFY_DATA: 'VERIFY_DATA'
  /** sessionStorage over */
};

Object.freeze && Object.freeze(Storage.KEYS);

document.addEventListener('online', () => { Storage.sync(); }, false);

window._History = History;
window._Favorite = Favorite;
window._Storage = Storage;
export default Storage;
