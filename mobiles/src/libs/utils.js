/*
  "video/mp4":["mp4","mp4v","mpg4"],
  "video/quicktime":["qt","mov"],
  "video/x-msvideo":["avi"],
  "video/x-ms-wmv":["wmv"],
  "video/x-flv":["flv"],
  "video/ogg;":["ogv"],
  "video/3gpp":["3gp","3gpp"],
  "video/webm":["webm"],
  "application/x-mpegURL":["m3u8"],
  "application/dash+xml":["mpd"]
*/
const MP4_REG = /\.(mp4|mp4v|mpg4)(\?.+|$)/i;
const M3U8_REG = /\.m3u8(\?.+|$)/i;
const YOUTUBE_REG = /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^'&?/ ]{11})/i;
const DM_REG = /dailymotion\.com/i
const GPP_REG = /\.(3gp|3gpp)(\?.+|$)/i;
const OGG_REG = /\.ogv(\?.+|$)/i;
const DASH_REG = /\.mpd(\?.+|$)/i;

class Utils {
  mimeType(url) {
    if (DM_REG.test(url)) {
      return 'x-dailymotion';
    }
    if (this.youtubeID(url)) {
      return 'x-youtube';
    }
    if (M3U8_REG.test(url)) {
      return 'application/x-mpegURL';
    }
    if (MP4_REG.test(url)) {
      return 'video/mp4';
    }
    if (GPP_REG.test(url)) {
      return 'video/3gpp';
    }
    if (OGG_REG.test(url)) {
      return 'video/ogg';
    }
    if (DASH_REG.test(url)) {
      return 'application/dash+xml';
    }
    return 'video/mpeg';
  }
  youtubeID(url) {
    let ID = null;
    url = url.match(YOUTUBE_REG);
    if (url && url[1]) {
      ID = url[1];
    }
    return ID;
  }
  dailyMotionID(url) {
    let parts = url.split('/');
    return parts.pop();
  }
}
export default new Utils();
