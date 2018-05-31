# MorsePlay Cordova App

Open up Android device and go to "Settings > About device".

Find the "Build number" and click on that repeatedly until you enter developer mode.

Install the [Cordova Command Line Tool](https://cordova.apache.org/docs/en/latest/guide/cli/).

Download the repo, open Terminal, and `cd` into the `MorsePlay--App` folder.

```
cd MorsePlay--App
```

Add the Android platform by typing:

```
cordova platform add android
```

Add the BLE Central Plugin by typing:

```
cordova plugin add cordova-plugin-ble-central
```

Upload the app to the Android device.

```
cordova run android
```
