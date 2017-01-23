#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];
var files = ['node_modules/react-youtube/node_modules/youtube-player/dist/loadYouTubeIframeAPI.js', 'node_modules/youtube-player/dist/loadYouTubeIframeAPI.js'];
if (rootdir) {
  files.map(function(file) {
    file = path.join(rootdir, file);
    if (fs.existsSync(file)) {
      var content = fs.readFileSync(file, {encoding: 'utf8'});
      if (/protocol\s*\+\s*['"]\/\/www.youtube.com\/iframe_api['"]/i.test(content)) {
        return;
      }
      if (/'\/\/www.youtube.com\/iframe_api'/i.test(content)) {
        content = content.replace(/'\/\/www.youtube.com\/iframe_api'/i, '"https://www.youtube.com/iframe_api"');
        fs.writeFileSync(file, content);
      }
    }
  });
};
