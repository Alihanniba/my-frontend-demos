
const DailyMotion = {
  cache: {},
  get(url, cb) {
    console.log(url);
    cordovaHTTP.get(url, {}, {
      Accept: '*',
      'Cache-Control': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
    }, (res) => {
      cb(null, res.data);
      //console.log(res.status);
      //console.log(res.data);
    }, (res) => {
      console.error(res.status);
      //console.error(res.error);
      cb(new Error(res.error));
    });
  },
  fetch: function(id, callback) {
    callback = callback || ((res) => { console.log(res); });
    if (this.cache[id]) {
      return callback(null, this.cache[id].video);
    }
    this.cache[id] = {};
    let url = `http://www.dailymotion.com/json/video/${id}?fields=stream_h264_url,stream_h264_ld_url,stream_h264_hq_url,stream_h264_hd_url,stream_h264_hd1080_url`;
    this.get(url, (err, json) => {
      if (err) {
        return callback(err);
      }
      let source;
      try {
        source = JSON.parse(json);
      } catch (e) {
        return callback(e);
      }
      source = source['stream_h264_hd1080_url'] || source['stream_h264_hd_url'] || source['stream_h264_hq_url'] || source['stream_h264_url'];
      var info = { url: source, type: 'application/x-mpegURL' };
      callback(null, info);
    });
  }
};

export default DailyMotion;
