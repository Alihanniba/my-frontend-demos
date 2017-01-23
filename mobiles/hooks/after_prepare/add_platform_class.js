#!/usr/bin/env node

// Add Platform Class
// v1.0
// Automatically adds the platform class to the body tag
// after the `prepare` command. By placing the platform CSS classes
// directly in the HTML built for the platform, it speeds up
// rendering the correct layout/style for the specific platform
// instead of waiting for the JS to figure out the correct classes.

var fs = require('fs');
var path = require('path');

//var javascripts = [{source: './index.js', target: 'http://i.vego.tv/www/index.js'}];
var javascripts = [];
var rootdir = process.argv[2];

function addPlatformBodyTag(indexPath, platform) {
  // add the platform class to the body tag
  try {
    var platformClass = platform;
    var cordovaClass = 'cordova webview';
    // add environment
    if (process.env.NODE_ENV === 'production') {
      cordovaClass += ' production';
    }
    var html = fs.readFileSync(indexPath, 'utf8');

    var htmlTag = findHTMLTag(html);
    if (!htmlTag) return; // no opening body tag, something's wrong

    if (htmlTag.indexOf(platformClass) > -1) return; // already added

    var newBodyTag = htmlTag;

    var classAttr = findClassAttr(htmlTag);
    if (classAttr) {
      // body tag has existing class attribute, add the classname
      var endingQuote = classAttr.substring(classAttr.length - 1);
      var newClassAttr = classAttr.substring(0, classAttr.length - 1);
      newClassAttr += ' ' + platformClass + ' ' + cordovaClass + endingQuote;
      newBodyTag = htmlTag.replace(classAttr, newClassAttr);
    } else {
      // add class attribute to the body tag
      newBodyTag = htmlTag.replace('>', ' class="' + platformClass + ' ' + cordovaClass + '">');
    }
    html = html.replace(htmlTag, newBodyTag);
    process.env.NODE_ENV === 'production' && javascripts.map(function(item) {
      html = html.replace(item.source, item.target);
    });
    fs.writeFileSync(indexPath, html, 'utf8');
    process.stdout.write('add to body class: ' + platformClass + '\n');
  } catch (e) {
    process.stdout.write(e);
  }
}

function findHTMLTag(html) {
  // get the body tag
  try {
    return html.match(/<html(?=[\s>])(.*?)>/gi)[0];
  } catch (e) {}
}

function findClassAttr(bodyTag) {
  // get the body tag's class attribute
  try {
    return bodyTag.match(/ class=["|'](.*?)["|']/gi)[0];
  } catch (e) {}
}

if (rootdir) {
  // go through each of the platform directories that have been prepared
  var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

  for (var x = 0; x < platforms.length; x++) {
    // open up the index.html file at the www root
    try {
      var platform = platforms[x].trim().toLowerCase();
      var indexPath, devPath;

      if (platform === 'android') {
        indexPath = path.join('platforms', platform, 'assets', 'www', 'index.html');
        devPath = path.join('platforms', platform, 'assets', 'www', 'dev.html');
      } else {
        indexPath = path.join('platforms', platform, 'www', 'index.html');
        devPath = path.join('platforms', platform, 'www', 'dev.html');
      }
      if (fs.existsSync(indexPath)) {
        addPlatformBodyTag(indexPath, platform);
      }
      if (fs.existsSync(devPath)) {
        fs.unlinkSync(devPath);
      }
    } catch (e) {
      process.stdout.write(e);
    }
  }
};
