#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];


function mkdirp(dirPath, mode) {
  var paths = dirPath.split(path.sep);
  var f = [];
  paths.forEach(function(p) {
    f.push(p);
    var t = path.join.apply(path, f);
    if (!fs.existsSync(t)) {
      fs.mkdirSync(t, mode);
    }
  });
}

function android(from, to) {
  /*
  var files = fs.readdirSync(from);
  files.forEach(function(file) {
    if (/\.jar$/.test(file)) {
      var outfile = path.join(to, 'libs', file);
      return fs.createReadStream(path.join(from, file)).pipe(fs.createWriteStream(outfile));
    }
    // package tv.vego.vegotv
    var p = path.join(to, 'src', 'tv', 'vego', 'vegotv');
    if (!fs.existsSync(p)) {
      mkdirp(p);
    }
    fs.createReadStream(path.join(from, file)).pipe(fs.createWriteStream(path.join(p, file)));
  });
  var def = 'android:name=".BaseAplication"';
  var mainfest = path.join(to, 'AndroidManifest.xml');
  var content = fs.readFileSync(mainfest, {encoding: 'utf8'});
  if (content.indexOf(def) > -1) {
    return;
  }
  content = content.replace('<application', '<application ' + def);
  fs.writeFileSync(mainfest, content);
  */
}

function ios(from, to) {

}


if (rootdir) {
  // go through each of the platform directories that have been prepared
  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

  for (var x = 0; x < platforms.length; x++) {
    // open up the index.html file at the www root
    try {
      var platform = platforms[x].trim().toLowerCase();
      var from, to;
      if (platform === 'android') {
        from = path.join('src', 'java');
        to = path.join('platforms', platform);
        android(from, to);
      }
      if (platform === 'ios') {
        ios(from, to);
      }
    } catch (e) {
      process.stdout.write(e);
    }
  }
};
