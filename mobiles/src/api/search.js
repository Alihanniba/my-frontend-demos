import request from './request';
import json from '../mock/search';

export const Search = (params, cb) => {
  if (!params.cp) {
    params.cp = 'DCNKzQd_d_9k3macDWIH_g';
  }
  return request
    .get('http://account.ottcloud.tv/api/v1/search.json', {params: params})
    .then((res) => {
      return res.data.jsonGraph.titlesById;
    })
    .catch((e) => {
      console.error(e);
    });
};
