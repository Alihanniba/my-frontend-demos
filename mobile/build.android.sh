git pull
npm i
npm i -g cordova
sed -i -e "s/id=\"[a-zA-Z0-9.]*\"/id=\"com.vego.tv\"/" config.xml
V=`date +%m%d.%H%M`; echo $V |sed -i -e "s/version=\"[0-9.]*\"/version=\"$V\"/" config.xml

#for i in `cordova plugin ls | grep '^[^ ]*' -o`; do cordova plugin rm $i -f; done

cordova plugin save
cordova platform rm android
cordova platform add android
npm run android-release
cp ./platforms/android/build/outputs/apk/android-release.apk ~/Downloads/vego-release-$V.apk
