# MorsePlay

MorsePlay uses the [Morse GBoard](https://support.google.com/accessibility/android/answer/9011881) on Android devices to activate switch adapted toys and similar interfaces via a pluggable Bluetooth Low Energy (BLE) module.

It was developed by Adaptive Design and NottLimited.

To see a demo of the project, visit https://youtu.be/Mf9dzT8w3vc.

To see more about switch adapting mass produced toys, visit [DIYAbility.org](https://www.diyability.org/guide/switch-adapting-a-remote-control-toy/) as well as [GoBabyGo Cars](https://www.diyability.org/2014/11/go-baby-go-the-ultimate-toy-hack/) -- or to find out more about [GoBabyGo](https://sites.udel.edu/gobabygo/).

The project comes in 3 parts on this repo.

["MorsePlay -- App"](https://github.com/OllieBck/MorsePlay/tree/master/MorsePlay--App) is builds off an example from Don Coleman's [Cordova BLE Central Library](https://github.com/don/cordova-plugin-ble-central).

["MorsePlay -- BLE_Module"](https://github.com/OllieBck/MorsePlay/tree/master/MorsePlay--BLE_Module) utilizes a RedBear Labs Nano2 and is built off an [example](https://github.com/RedBearLab/arduino-BLEPeripheral/tree/master/examples/SimpleChat) the lab created of Sandeep Mistry's [Arduino BLE Peripheral](https://github.com/sandeepmistry/arduino-BLEPeripheral) library.

["MorsePlay -- Schematics"](https://github.com/OllieBck/MorsePlay/tree/master/MorsePlay%20-%20Schematics) include the Eagle files for the simple circuit for the BLE module relay board.
