import request from './request';

export const loginGoogleUser = (params) => {
  return request
    .post('http://account.ottcloud.tv/api/v1/google/members.json', params)
    .catch((e) => {
      console.error(e);
    });
};
