class Tools {
    constructor() {}
    isEmpty(obj) {
        for (let name in obj) {
            return false
        }
        return true
    }
    videoType(url) {
      if (url.indexOf('youtube') > -1) {
        return "youtube"
      } else if(/\.m3u8$/.test(url)) {
        return "hls"
      } else {
        return "html5"
      }
    }
    winHeight() {
        let winHeight;
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        } else if ((document.body) && (document.body.clientHeight)) {
            winHeight = document.body.clientHeight;
        }
        return winHeight;
    }

    setSessionOne(key, value) {
        sessionStorage.setItem(key, value);
    }

    setSession(classifyId, type, api, page) {
        this.setSessionOne('navId', classifyId);
        this.setSessionOne('type', type);
        this.setSessionOne('api', api);
        this.setSessionOne('page', page);
    }
    youtubeID(url) {
      let ID = null;
      let REG = /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
      url = url.match(REG)
      if(url && url[1]) {
          ID = url[1];
      }
      return ID;
    }
    isMobile() {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        return true
      } else if (/(Android)/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    }
    array_remove_repeat(a) {
      var r = [];
      for(var i = 0; i < a.length; i ++) {
          var flag = true;
          var temp = a[i];
          for(var j = 0; j < r.length; j ++) {
              if(temp === r[j]) {
                  flag = false;
                  break;
              }
          }
          if(flag) {
              r.push(temp);
          }
      }
      return r;
    }
    array_difference(a, b) {
      var clone = a.slice(0);
      for(var i = 0; i < b.length; i++) {
          var temp = b[i];
          for(var j = 0; j < clone.length; j++) {
              if(temp.id === clone[j].id) {
                  //remove clone[j]
                  clone.splice(j,1);
              }
          }
      }
      return this.array_remove_repeat(clone);
    }
    moveItem(items, old_index, new_index){
        if (new_index >= items.length) {
            var k = new_index - items.length;
            while ((k--) + 1) {
                items.push(undefined);
            }
        }
        items.splice(new_index, 0, items.splice(old_index, 1)[0]);
        return items; 
    }
}

let ToolKit = new Tools()

export default ToolKit
