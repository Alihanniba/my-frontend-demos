import falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource';
import Request from './request';
import Storage from '../libs/storage';

const url = 'https://ottcloudapi.herokuapp.com/model.json';
const source = new HttpDataSource(url, {crossDomain: true, withCredentials: false});
const model = new falcor.Model({ source: source });

const uuid = () => {
  return Storage.get('USER_TOKEN')
};
const HOST = 'http://account.ottcloud.tv';
const API = {
  get: HOST + '/api/v1/records.json',                             // 获取历史记录和收藏
  set: HOST + '/api/v1/records.json',                             // 设置历史记录和收藏
  delete: HOST + '/api/v1/records/:episode_id.json',              // 取消收藏
  historyDelete: HOST + '/api/v1/records/batch_records.json',     // 批量删除历史记录接口
  favoriteDelete: HOST + '/api/v1/records/batch_favorite.json',   // 批量删除收藏接口
  syncData: HOST + '/api/v1/records/sync.json'                    // 同步数据
}
const CP_ID = 37;

export const Favorite = (action, val, cb) => {
  if (!cb) {
    cb = () => {}
  }
  if (action != 'post' && action != 'get' && action != 'delete' && action != 'batchDelete') {
    return false;
  }
  let user = uuid();
  if (user != null && action == 'post') {
    let dataParam = {
      cp_id: CP_ID,
      title_id: val.titleId,
      episode_id: val.episodeId,
      duration: '',
      current_time: ''
    }
    Request.post(API.set, dataParam)
    .then((res) => {
      cb(res)
    })
  }
  
  // 获取收藏
  if (user != null && action == 'get') {
    let getFavoriteParams = {
      params: {
        cp_id : CP_ID,
        kind: 'favorite'
      }
    }
    Request.get(API.get, getFavoriteParams)
    .then((res) => {
      cb(res)
    })
  }

  // 批量删除收藏
  if (user != null && action =='batchDelete') {
    if (typeof val == 'object' && val.length <= 0 ) {
      console.log('no ids to delete');
      return;
    }
    let ids = val.join(',')
    let deleteHistoryParams = {
      params : {
        kind: 'records',
        episode_ids: ids
      }
    }
    Request.delete(API.historyDelete, deleteHistoryParams)
    .then((res) => {
      cb(res)
    })
  }

};


export const History = (action, val, cb) => {
  if (action != 'post' && action != 'get' && action != 'delete' && action != 'batchDelete') {
    return false;
  }
  if (!cb) {
    cb = () => {}
  }
  let user = uuid();
  if (user != null && action == 'post') {
    if (!val.titleId || !val.episodeId) {
      console.log('param error')
      return false;
    }

    let dataParam = {
      cp_id : CP_ID,
      kind: 'records',
      title_id: val.titleId,
      episode_id: val.episodeId,
      resource_type: 'title',
      current_time: val.current,
      duration: val.duration
    }
    Request.post(API.set, dataParam)
    .then((res) => {
      cb(res)
    })
  } 

  // 获取线上历史记录
  if (user != null && action == 'get') {
    let getHistoryParams = {
      params: {
        cp_id: CP_ID,
        kind: 'records'
      }
    }
    Request.get(API.get, getHistoryParams)
    .then((res) => {
      cb(res);
    })
  }
  
  // 批量删除历史记录
  if (user != null && action =='batchDelete') {
    if (typeof val == 'object' && val.length <= 0 ) {
      console.log('no ids to delete');
      return;
    }
    let ids = val.join(',')
    let deleteHistoryParams = {
      params : {
        kind: 'records',
        title_ids: ids
      }
    }
    Request.delete(API.historyDelete, deleteHistoryParams)
    .then((res) => {
      cb(res)
    })
  }
};

const localToOnlineFormate = (data) => {
  if (typeof data != 'object' || data.length <= 0) {
    return false;
  }
  let onlineArr = [];
  for( var i in data) {
    let a = {};
    a.id = data[i].titleId;
    // a.name = data[i].name;
    // a.poster = data[i].img;
    // a.latest_episode_id = data[i].episodeId;
    a.episodes = [{
      id: data[i].episodeId,
      duration: data[i].duration,
      current_time: data[i].current
    }]
    onlineArr.push(a);
  }
  return onlineArr;
}

const onlineToLocalFromate = (data) => {
  if (typeof data != 'object' || data.length <= 0) {
    return false;
  }
  let offlineArr = [];
  for( var i in data){
    let a = {}
    a.titleId = data[i].id;
    a.episodeId = data[i].latest_episode_id;
    a.name = data[i].name;
    a.img = data[i].poster;
    a.duration = data[i].episodes[0].duration;
    a.current = data[i].episodes[0].current_time;
    a.time = Date.now();
    offlineArr.push(a);
  }
  return offlineArr;
}

const uploadData = (type, data, cb)=>{
  if (typeof data != 'object' || data.length <= 0) {
    return false;
  }
  if (type != 'favorite' && type != 'records') {
    return false;
  }
  let param = {
    kind: type,
    data: JSON.stringify(data)
  }
  Request.post(API.syncData, param)
  .then((res) =>{
    cb(res)
  })
}

const downloadData = (type, cb) => {
  if (type != 'favorite' && type!= 'records') {
    return false;
  }
  Request.get(API.get, {params: {cp_id: CP_ID, kind: type} })
  .then((res) => {
    cb(res)
  })
}

export const FavoriteSync = () => {
  if (!uuid()) {
    return false;
  }
  let localStorageFavoriteData = JSON.parse(localStorage.getItem(Storage.KEYS.FAVOURITE));
  if (localStorageFavoriteData == null || localStorageFavoriteData.length <= 0) {
    // 本地没有数据 直接拉取线上数据
    downloadData('favorite', (res) =>{
      let localData = onlineToLocalFromate(res.data.data);
      window.localStorage && localStorage.setItem(Storage.KEYS.FAVOURITE, JSON.stringify(localData));
    })
  } else {
    // 本地有数据  先上传数据  再啦取下来
    let uploadFormateData = localToOnlineFormate(localStorageFavoriteData);
    
    uploadData('favorite', {records :uploadFormateData}, (res) => {
      if (res.data.success) {
        // 本地没有数据 直接拉取线上数据
        downloadData('favorite', (res) =>{
          let localData = onlineToLocalFromate(res.data.data);
          window.localStorage && localStorage.setItem(Storage.KEYS.FAVOURITE, JSON.stringify(localData));
        })
      }
    })
  }
}

export const HistorySync = () => {
  if (!uuid()) {
    return false;
  }
  let localStorageHistoryData = JSON.parse(localStorage.getItem(Storage.KEYS.HISTORY));
  if (localStorageHistoryData == null || localStorageHistoryData.length <= 0) {
    // 本地没有数据 直接拉取线上数据
    downloadData('records', (res)=>{
      let localData = onlineToLocalFromate(res.data.data);
      window.localStorage && localStorage.setItem(Storage.KEYS.HISTORY, JSON.stringify(localData));
    })
  } else {
    // 本地有数据  先上传数据  再啦取下来
    let uploadFormateData = localToOnlineFormate(localStorageHistoryData);
    uploadData('records', {records :uploadFormateData}, (res) => {
      if (res.data.success) {
        // 本地没有数据 直接拉取线上数据
        downloadData('records', (res) =>{
          let localData = onlineToLocalFromate(res.data.data);
          window.localStorage && localStorage.setItem(Storage.KEYS.HISTORY, JSON.stringify(localData));
        })
      }
    })
  }
}