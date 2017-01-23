#!/usr/bin/env node

//
// This hook copies various resource files from our version control system directories into the appropriate platform specific location
//

// assetsure all the files to copy.  Key of object is the source file, value is the destination location.  It's fine to put all platforms' icons and splash screen files here, even if we don't build for all platforms on each developer's box.
var appname = 'VegoTV';

var filestocopy = [{
  // android
  'assets/android/drawable-hdpi/icon.png': 'platforms/android/res/drawable-hdpi/icon.png'
}, {
  'assets/android/drawable-ldpi/icon.png': 'platforms/android/res/drawable-ldpi/icon.png'
}, {
  'assets/android/drawable-mdpi/icon.png': 'platforms/android/res/drawable-mdpi/icon.png'
}, {
  'assets/android/drawable-xhdpi/icon.png': 'platforms/android/res/drawable-xhdpi/icon.png'
}, {
  'assets/android/drawable-land-hdpi/screen.png': 'platforms/android/res/drawable-land-hdpi/screen.png'
}, {
  'assets/android/drawable-land-ldpi/screen.png': 'platforms/android/res/drawable-land-ldpi/screen.png'
}, {
  'assets/android/drawable-land-mdpi/screen.png': 'platforms/android/res/drawable-land-mdpi/screen.png'
}, {
  'assets/android/drawable-land-xhdpi/screen.png': 'platforms/android/res/drawable-land-xhdpi/screen.png'
}, {
  'assets/android/drawable-port-hdpi/screen.png': 'platforms/android/res/drawable-port-hdpi/screen.png'
}, {
  'assets/android/drawable-port-ldpi/screen.png': 'platforms/android/res/drawable-port-ldpi/screen.png'
}, {
  'assets/android/drawable-port-mdpi/screen.png': 'platforms/android/res/drawable-port-mdpi/screen.png'
}, {
  'assets/android/drawable-port-xhdpi/screen.png': 'platforms/android/res/drawable-port-xhdpi/screen.png'
}, {
  // ios
  'assets/ios/AppIcon.appiconset/icon.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon.png'
}, {
  'assets/ios/AppIcon.appiconset/icon@2x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon@2x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-small.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-small.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-small@2x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-small@2x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-small@3x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-small@3x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-83.5@2x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-83.5@2x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-40.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-40.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-40@2x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-40@2x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-50.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-50.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-50@2x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-50@2x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-60.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-60.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-60@2x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-60@2x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-60@3x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-60@3x.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-76.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-76.png'
}, {
  'assets/ios/AppIcon.appiconset/icon-76@2x.png': 'platforms/ios/' + appname + '/Images.xcassets/AppIcon.appiconset/icon-76@2x.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default-568h@2x~iphone.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-568h@2x~iphone.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default-667h.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-667h.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default-736h.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-736h.png'
},  {
  'assets/ios/LaunchImage.launchimage/Default-Landscape-736h.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-Landscape-736h.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default-Landscape~ipad.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-Landscape~ipad.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default-Landscape@2x~ipad.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-Landscape@2x~ipad.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default-Portrait~ipad.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-Portrait~ipad.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default-Portrait@2x~ipad.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default-Portrait@2x~ipad.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default@2x~iphone.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default@2x~iphone.png'
}, {
  'assets/ios/LaunchImage.launchimage/Default~iphone.png': 'platforms/ios/' + appname + '/Images.xcassets/LaunchImage.launchimage/Default~iphone.png'
}];

var fs = require('fs');
var path = require('path');

// no need to assetsure below
var rootdir = process.argv[2];

filestocopy.forEach(function(obj) {
  Object.keys(obj).forEach(function(key) {
    var val = obj[key];
    var srcfile = path.join(rootdir, key);
    var destfile = path.join(rootdir, val);
    var destdir = path.dirname(destfile);
    if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
      fs.createReadStream(srcfile).pipe(fs.createWriteStream(destfile));
    }
  });
});
