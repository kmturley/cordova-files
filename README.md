# cordova-files

An example showing how to use local file storage, web files and browser for files. All selecting and returning the file objects correctly. Working for browser and devices.

The following technologies are used in the app:
* Apache Cordova `http://cordova.apache.org/`
* Cordova File Plugin `https://github.com/apache/cordova-plugin-file`

## Installation and running tasks

Install [Apache Cordova](http://cordova.apache.org/) then navigate to the site root within terminal.

## Running the app during development

To run as a webpage, navigate to the folder and open the first page in your web browser

    www/index.html
    
Or run the commands:

    cordova platform add browser
    cordova run browser

## Running the app on a device

Install the Android Developer tools from https://developer.android.com/sdk/index.html

To run the app use the commands:

    cordova platform add android
    cordova run android
    
Cordova caches plugins, So if you make any changes to a plugin's code you can force a reset using the following command:

    cordova platform remove android; cordova platform add android; cordova run android
    
If you have issues with cordova not opening the app automatically or not exiting after quitting, you can use the following command in your terminal to force quit all device processes:

    adb kill-server
    adb devices
    
If you have a problem building the app try removing the file generated by Android Studio:

    platforms/android/local.properties

## Directory Layout

    www/                --> Static html templates
      css/              --> Stylesheet files
      img/              --> Image files
      index.html        --> Homepage
      js/               --> Javascript functionality

## Contact

For more information please contact kmturley