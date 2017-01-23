git pull
npm i
npm i -g cordova
sed -i -e "s/id=\"[a-zA-Z0-9.]*\"/id=\"com.gochinatv.instore\"/" config.xml
V=`date +%m%d.%H%M`; echo $V |sed -i -e "s/version=\"[0-9.]*\"/version=\"$V\"/" config.xml
cordova platform rm ios
cordova platform add ios
npm install -g ios-deploy
cp build.testflight.json build.json
npm run ios-release
open ./platforms/ios/VegoTV.xcodeproj
