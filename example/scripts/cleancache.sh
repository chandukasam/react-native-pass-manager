#!/bin/bash
#script to clean absolutely everything and reinstall, when having issues starting

echo 'Cleaning iOS Caches 🔧'
# set -e
# watchman watch-del-all && rm -f yarn.lock && rm -rf node_modules && yarn && yarn start -- --reset-cache

echo '1. Removing all lock files'
rm -f yarn.lock
rm package-lock.json
rm ios/Podfile.lock

echo '2. Removing all dependencies'
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/build

echo '3. Deintegrating Cocoa Pods'
cd ios
pod deintegrate
cd ..

echo '4. Removing metro cache'
rm -rf /tmp/metro-*

echo '5. Removing npm cache'
yarn cache clean

echo '6. Reinstalling npm packages'
yarn 

echo '7. Running postinstall script'
yarn postinstall

echo '8. Reinstalling Cocoa Pods'
npx pod-install

echo '10. Removing watchman cache'
 watchman watch-del-all; watchman watch-project $(pwd)

echo '11. Restarting npm service'
yarn start -- --reset-cache


