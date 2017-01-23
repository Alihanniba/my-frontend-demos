import axios from 'axios';
import Storage from '../libs/storage';
import Tracker from '../tracker';


/*
接口需要 header 的
http://account.ottcloud.tv/

title 数据
http://api.ottcloud.tv/

首页数据
http://wechat.vego.tv/api/
*/

const TOKEN_LIST = ['N4FAxVXrdsjHNpS', 't2BsR_diiJUV_A6', 'Uea9zx4bstMzdpy', '-VZvByCBxXxUVvD', 'ynigpkxGbdhSBKe', 'aNSaKV6qzjAgB_T', 'KBnCNxaaCe5ZTtb', 'CMunueVzr3shhWD', 'vmi8jaD_2kNx2yw'];

const searchToken = () => {
  let token = TOKEN_LIST[Math.floor(Math.random() * TOKEN_LIST.length)];
  return `Token token=${token}`;
};

//目前登录注册应该没有用到me这个key
// const userToken = () => {
//   let me = Storage.get('me');
//   return me.token;
// };

//token为用户暂存本地的唯一key
const userToken = () => {
  let token = Storage.get(Storage.KEYS.USER_TOKEN);
  return token;
}

// TODO: change to user token
const accountToken = () => {
  return `Token token=${userToken()}`;
};


const ACCOUNT = (config) => {
  if (!/account\.ottcloud\.tv\//i.test(config.url)) {
    return config;
  }
  // signin and signup does not need  Authorization header
  if (/signup\.json/i.test(config.url) || /signin\.json/.test(config.url) || /members\.json/i.test(config.url)) {
    //config.headers['Content-Type'] = "application/x-www-form-urlencoded";
    return config;
  }
  // search api
  if (/search\.json/.test(config.url)) {
    config.headers['Authorization'] = searchToken();
    return config;
  }

  // if (/record\.json/.test(config.url)) {
  //   config.headers['Authorization'] = accountToken();
  // }
  config.headers['Authorization'] = accountToken();
  return config;
};

const API = (config) => {
  return config;
};

const WECHAT = (config) => {
  return config;
};
// https://github.com/mzabriskie/axios
axios.interceptors.request.use((config) => {
  [ACCOUNT, API, WECHAT].map((method) => {
    method(config);
  });
  return config;
}, (error) => {
    // Do something with request error
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  // Do something with response data
  Tracker.performance();
  return response;
}, (error) => {
  Tracker.performance();
  // Do something with response error
  return Promise.reject(error);
});

export default axios;
