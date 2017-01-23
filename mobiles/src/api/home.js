import request from './request';
import Utils from '../libs/utils';
import Tracker from '../tracker';
import falcor from 'falcor';
import HttpDataSource from 'falcor-http-datasource';

const REG = /http(?:s*):\/\/[^/]+/i;
const PREFIX = 'http://chinablue.ottcloud.tv/api/v1/devices/play.js?type=wechat&serial=abc&vid=';

const channels = (list) => {
  let env = /iPad|iPhone/i.test(navigator.userAgent)
    ? 'iOS' : /Android/i.test(navigator.userAgent)
    ? 'MobileAndroid' : window.config.wechat
    ? 'WeChat' : 'UNKNOW';
  return list.indexOf(env) > -1;
};

const channels_country = (country_code, blocked_countries) => {
    return blocked_countries.indexOf(country_code) > -1;
}

const production = 'http://fapi.ottcloud.tv/production/v4/model.json';
//const production = 'https://d8mtab623h.execute-api.us-west-2.amazonaws.com/production/v4/model.json';

export const home = (id, start, end, handle) => {
    const source = new HttpDataSource(production, { crossDomain: true, withCredentials: false });
    const model = new falcor.Model({ source: source, maxSize: 0 });

    let promise = new Promise((resolve, reject) => {
        let genre_id = id;
        let s = start;
        let e = end;
        model.get(['clientInfo'],  ['genresById', genre_id, ['name', 'genreListItems', 'loadMore'],
            [s],
            [e],
            [handle]
        ]).then((data) => {
            try {
                let genresById = data.json.genresById[genre_id];
                let country_code = data.json.clientInfo && data.json.clientInfo.country_code;
                let json = genresById.genreListItems;
                if (json.length < 1) {
                    resolve();
                    return
                }
                let loadMore = genresById.loadMore;
                let items = [];
                let jsonArr;
                let firstKey = json[Object.keys(json)[0]].id;
                let lastKey = json[Object.keys(json).length - 1].id;
                for (var key in json) {
                    let item = json[key];
                    if (item.blocked_channels && !channels(item.blocked_channels.value) && item.blocked_countries && !channels_country(country_code, item.blocked_countries.value)) {
                        items.push(item);
                    } else {
                        console.log('blocked', item.id);
                    }
                }
                jsonArr = {
                    loadMore: loadMore,
                    data: items,
                    firstKey: firstKey,
                    lastKey: lastKey
                }
                resolve(jsonArr);
            } catch (error) {
                console.log(error);
                resolve();
            }
            Tracker.performance();
        })
    });
    return promise;
};

export const episode = (id) => {
    const source = new HttpDataSource(production, { crossDomain: true, withCredentials: false });
    const model = new falcor.Model({ source: source });

    let promise = new Promise((resolve, reject) => {
        model.get(['titlesById', [id],
            ['name', 'description', 'episodes', 'tags', 'blocked_countries', 'blocked_channels', 'actors', 'related_titles', 'play_count', 'douban_rating', 'directors', 'genres', 'buoy', 'year']
        ]).subscribe((data) => {
            let item = data.json.titlesById[id];
            let list = item.blocked_channels;
            // if true, this is blocked episode
            item.blocked = channels(list);
            let episodes = [];
            item.episodes.map((ele) => {
                let episode = ele;
                episode.url = episode.source_url || episode.stream_url || '';
                delete episode.source_url;
                delete episode.stream_url;
                // video mime type
                episode.mimeType = Utils.mimeType(episode.url);
                if (!episode.url.match(REG)) {
                    episode.url = PREFIX + episode.url;
                }
                if (window.config.testcdn) {
                    episode.url = window.config.testcdn;
                    episode.mimeType = Utils.mimeType(episode.url);
                }
                episodes.push(episode);
            });
            item.episodes = episodes;
            resolve(item);
            Tracker.performance();
        });
    });
    return promise;
};

export const compile = (param) => {
    let data = {};
    let url = 'http://account.ottcloud.tv/api/v1/members/customize.json';
    data.genre_position = JSON.stringify(param);
    return request.post(url, data);
};

export const postChannels = (param) => {
    let data = {};
    let url = 'http://account.ottcloud.tv/api/v1/members/update_interests.json';
    data.interests = JSON.stringify(param);
    return request.post(url, data);
};

export const getChannels = () => {
    let data = {};
    let url = 'http://account.ottcloud.tv/api/v1/members/interests.json';
    return request.get(url);
};