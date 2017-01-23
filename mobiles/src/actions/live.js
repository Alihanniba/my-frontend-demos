import { Home, Classify } from '../api/';
import falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource';
import { GET_LIVE_LIST, BASE_URL } from './index';

function action(data) {
    return {
        type: GET_LIVE_LIST,
        payload: {
            data: data
        }
    };
}

export function getLiveList(fromIndex, toIndex) {
  return (dispatch, param) => {
    var prod = "d8mtab623h"
    var source = new HttpDataSource("http://fapi.ottcloud.tv/production/v4/model.json", {
      crossDomain: true, withCredentials: false});

    var tid = 229;
    var model = new falcor.Model({source: source});
    model.get(['genresById', tid, ['name', 'genreListItems', 'loadMore'],
          [fromIndex], [toIndex],
          ['up']
      ]).subscribe((data)=>{
        let obj = data.json.genresById[tid]
        let json = obj.genreListItems
        let s = 0
        let e = 0

        if (obj.loadMore) {
          s = json[0].id
          e = json[Object.keys(json).length - 1].id;
        }
        obj.s = s
        obj.e = e
        // dispatch(action(data.json.genresById[tid].genreListItems));
        dispatch(action(obj))
      }, (e) => {
        dispatch(action('error'))
      }, () => {
        console.log('completed');
      })
  }
}
