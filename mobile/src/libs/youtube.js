const jsvarStr = '[a-zA-Z_\\$][a-zA-Z_0-9]*';
const reverseStr = ':function\\(a\\)\\{' +
  '(?:return )?a\\.reverse\\(\\)' +
  '\\}';
const sliceStr = ':function\\(a,b\\)\\{' +
  'return a\\.slice\\(b\\)' +
  '\\}';
const spliceStr = ':function\\(a,b\\)\\{' +
  'a\\.splice\\(0,b\\)' +
  '\\}';
const swapStr = ':function\\(a,b\\)\\{' +
  'var c=a\\[0\\];a\\[0\\]=a\\[b%a\\.length\\];a\\[b\\]=c(?:;return a)?' +
  '\\}';
const actionsObjRegexp = new RegExp(
  `var (${jsvarStr})=\\{((?:(?:${jsvarStr}${reverseStr}|${jsvarStr}${sliceStr}|${jsvarStr}${spliceStr}|${jsvarStr}${swapStr}),?\\n?)+)\\};`);

const actionsFuncRegexp = new RegExp(`function(?: ${jsvarStr})?\\(a\\)\\{a=a\\.split\\(""\\);\\s*((?:(?:a=)?${jsvarStr}\\.${jsvarStr}\\(a,\\d+\\);)+)return a\\.join\\(""\\)\\}`);

const reverseRegexp = new RegExp(`(?:^|,)(${jsvarStr})${reverseStr}`, 'm');

const sliceRegexp = new RegExp(`(?:^|,)(${jsvarStr})${sliceStr}`, 'm');

const spliceRegexp = new RegExp(`(?:^|,)(${jsvarStr})${spliceStr}`, 'm');

const swapRegexp = new RegExp(`(?:^|,)(${jsvarStr})${swapStr}`, 'm');


const Youtube = {

  cache: {},

  fetch(id, callback) {
    callback = callback || ((res) => { console.log(res); });
    if (this.cache[id]) {
      return callback(null, this.cache[id].video);
    }
    this.cache[id] = {};
    this.getHTML(id, callback);
  },
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
      cb(res);
    });
  },
  getHTML(id, callback) {
    let self = this;
    // force the desktop version
    this.get(`https://www.youtube.com/watch?app=desktop&v=${id}`, (err, data) => {
      // fuck the cordova-http iOS plugin
      if (err && err.status !== 200) {
        return callback(err);
      }
      if(err){
       return self.parseBody({id: id}, err.error, callback);
      }
      self.parseBody({id: id}, data, callback);
    });
  },

  parseBody(params, body, callback) {
    if (!body) {
      return callback(new Error('empty body'));
    }
    if (!body.match(/\"url_encoded_fmt_stream_map\":\s?\"(.+?)\"/)) {
      return callback(new Error('invalid'));
    };
    const id = params.id;
    let jsonStr = between(body, 'ytplayer.config = ', '</script>');
    let config;
    if (!jsonStr) {
      return callback(new Error('parse error'));
    }
    if (jsonStr) {
      jsonStr = jsonStr.slice(0, jsonStr.lastIndexOf(';ytplayer.load'));
      try {
        config = JSON.parse(jsonStr);
      } catch (err) {
        return callback(new Error(`Error parsing config: ${err.message}`));
      }
      if (!config) {
        return callback(new Error('Could not parse video page config'));
      }
    }
    this.cache[id] = this.cache[id] || {};
    this.cache[id].config = config;
    const videoSources = [];
    //config.args.url_encoded_fmt_stream_map.split(',');
    const formats = RegExp.$1.split(',');
    for (let i = 0; i < formats.length; i++) {
      const videoParams = {};
      const seg = formats[i].split('\\u0026');
      for (let j = 0; j < seg.length; j++) {
        const p = seg[j].split('=');
        videoParams[p[0]] = decodeURIComponent(p[1]);
      };
      videoSources.push(videoParams);
    }
    let filtered = videoSources.filter((video) => {
      video.signature = video.signature || video.sig || video.s;
      // Detail please see Youtube.md
      // format support see https://developer.mozilla.org/en-US/docs/Web/HTML/Supported_media_formats and http://caniuse.com/#feat=webm
      if (video.type) {
        video.type = video.type.replace(/\+/ig, ' ');
      }
      return video.itag === '22' || video.itag === '18' ||
       video.itag === '92' || video.itag === '93' || video.itag === '94' || video.itag === '95' || video.itag === '132';
    });
    // sort the videos?
    if (!filtered.length) {
      if (body.match(/\"hlsvp\":\s?\"(.+?)\"/)) {
        let url = decodeURIComponent(RegExp.$1);
        url = url.replace(/\\/g, '');
        return callback(null, {url: url, type: 'application/x-mpegURL'});
      } else {
        return callback(new Error('no video'));
      }
    }
    this.cache[id].videoSources = filtered;
    let selectedVideoSource = filtered[0];
    this.cache[id].video = selectedVideoSource;
    let self = this;
    this.get(`https:${config.assets.js}`, (err, body) => {
      // fuck the cordova-http iOS plugin
      if (err && err.status !== 200) {
        return callback(err);
      }
      if(err){
        return self.decipher({id: id}, err.error, callback);
      }
      self.decipher({id: id}, body, callback);
    });
  },
  decipher(params, body, callback) {
    const id = params.id;
    const objResult = actionsObjRegexp.exec(body);
    if (!objResult) { return null; }
    const funcResult = actionsFuncRegexp.exec(body);
    if (!funcResult) { return null; }
    const obj      = objResult[1].replace(/\$/g, '\\$');
    const objBody  = objResult[2].replace(/\$/g, '\\$');
    const funcbody = funcResult[1].replace(/\$/g, '\\$');
    let result = reverseRegexp.exec(objBody);
    const reverseKey = result && result[1].replace(/\$/g, '\\$');
    result = sliceRegexp.exec(objBody);
    const sliceKey = result && result[1].replace(/\$/g, '\\$');
    result = spliceRegexp.exec(objBody);
    const spliceKey = result && result[1].replace(/\$/g, '\\$');
    result = swapRegexp.exec(objBody);
    const swapKey = result && result[1].replace(/\$/g, '\\$');
    const myreg = `(?:a=)?${obj}\\.(${[reverseKey, sliceKey, spliceKey, swapKey].join('|')})\\(a,(\\d+)\\)`;
    const tokenizeRegexp = new RegExp(myreg, 'g');
    const tokens = [];
    while ((result = tokenizeRegexp.exec(funcbody)) !== null) {
      switch (result[1]) {
        case swapKey:
          tokens.push(`w${result[2]}`);
          break;
        case reverseKey:
          tokens.push('r');
          break;
        case sliceKey:
          tokens.push(`s${result[2]}`);
          break;
        case spliceKey:
          tokens.push(`p${result[2]}`);
          break;
      }
    }
    if (typeof (this.cache[id].video) !== 'undefined' && this.cache[id].video.signature) {
      let sig = this.cache[id].video.signature;
      sig = sig.split('');
      let pos;
      for (let i = 0, len = tokens.length; i < len; i++) {
        const token = tokens[i];
        switch (token[0]) {
          case 'r':
            sig = sig.reverse();
            break;
          case 'w':
            pos = ~~token.slice(1);
            sig = swapHeadAndPosition(sig, pos);
            break;
          case 's':
            pos = ~~token.slice(1);
            sig = sig.slice(pos);
            break;
          case 'p':
            pos = ~~token.slice(1);
            sig.splice(0, pos);
            break;
        }
      }
      this.cache[id].video.url = `${this.cache[id].video.url}&signature=${sig.join('')}`;
    } else {
      this.cache[id].video.url = this.cache[id].video.url;
    }

    callback(null, this.cache[id].video);
  }
};

const between = (haystack, left, right) => {
  let pos;
  pos = haystack.indexOf(left);
  if (pos === -1) { return ''; }
  haystack = haystack.slice(pos + left.length);
  pos = haystack.indexOf(right);
  if (pos === -1) { return ''; }
  haystack = haystack.slice(0, pos);
  return haystack;
};

const swapHeadAndPosition = (arr, position) => {
  const first = arr[0];
  arr[0] = arr[position % arr.length];
  arr[position] = first;
  return arr;
};

export default Youtube;
