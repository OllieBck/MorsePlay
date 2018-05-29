// (c) 2014 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global mainPage, deviceList, refreshButton */
/* global detailPage, resultDiv, messageInput, sendButton, disconnectButton */
/* global ble, cordova  */
/* jshint browser: true , devel: true*/

// Modifications made by Jason Beck @ Adaptive Design Associaiton for MorsePlay Demo May 2018
'use strict';

// ASCII only
function bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
}

// ASCII only
function stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        array[i] = string.charCodeAt(i);
    }
    return array.buffer;
}

// this is RedBear Lab's UART service
var redbear = {
    serviceUUID: "713D0000-503E-4C75-BA94-3148F18D941E",
    txCharacteristic: "713D0003-503E-4C75-BA94-3148F18D941E", // transmit is from the phone's perspective
    rxCharacteristic: "713D0002-503E-4C75-BA94-3148F18D941E"  // receive is from the phone's perspective
};

// array to hold the letter of the alphabet in Morse input
var abc = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];

// variable to determine position in array
var count = 0;

var app = {
    initialize: function() {
        this.bindEvents();
        detailPage.hidden = true;
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener('touchstart', this.refreshDeviceList, false);
        sendButton.addEventListener('click', this.sendData, false);
        disconnectButton.addEventListener('touchstart', this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false); // assume not scrolling
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        deviceList.innerHTML = ''; // empties the list
        if (cordova.platformId === 'android') { // Android filtering is broken
            ble.scan([], 5, app.onDiscoverDevice, app.onError);
        } else {
            ble.scan([redbear.serviceUUID], 5, app.onDiscoverDevice, app.onError);
        }
    },
    onDiscoverDevice: function(device) {
        var listItem = document.createElement('li'),
            html = '<b>' + device.name + '</b><br/>' +
                'RSSI: ' + device.rssi + '&nbsp;|&nbsp;' +
                device.id;

        listItem.dataset.deviceId = device.id;
        listItem.innerHTML = html;
        deviceList.appendChild(listItem);
        //using name of app to handle autoconnection -- MorsePlay is name put out by BLE module
        if (device.name == "MorsePlay"){ // if it is MorsePlay
          app.connect(device.id); // connect to app
        }
    },
    connect: function(be) {
        var deviceId = be,
            onConnect = function() {
                // subscribe for incoming data
                ble.startNotification(deviceId, redbear.serviceUUID, redbear.rxCharacteristic, app.onData, app.onError);
                sendButton.dataset.deviceId = deviceId;
                disconnectButton.dataset.deviceId = deviceId;
                app.showDetailPage(deviceId);
            };
        ble.autoConnect(deviceId, onConnect, app.onError); // using autoConnect to try and re-establish if lost connection
    },
    onData: function(data) { // data received from Arduino
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + bytesToString(data) + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },
    sendData: function(event) { // send data to Arduino

        var success = function() {
            console.log("success");
            resultDiv.innerHTML = resultDiv.innerHTML + "Sent: " + messageInput.value + "<br/>";
            resultDiv.scrollTop = resultDiv.scrollHeight;
        };

        var failure = function() {
            alert("Failed writing data to the redbear hardware");
        };

        var data = stringToBytes(messageInput.value);
        var deviceId = event.target.dataset.deviceId;
        ble.writeWithoutResponse(deviceId, redbear.serviceUUID, redbear.txCharacteristic, data, success, failure);
    },
    disconnect: function(event) {
        var deviceId = event.target.dataset.deviceId;
        ble.disconnect(deviceId, app.showMainPage, app.onError);
    },
    showMainPage: function() {
        mainPage.hidden = false;
        detailPage.hidden = true;
    },
    showDetailPage: function(id) {
        mainPage.hidden = true;
        detailPage.hidden = false;
        app.morseCommands(id);
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    },
    focusElement: function(){
      document.getElementById('messageInput').focus();
    },
    morseCommands: function(id){
      app.focusElement(); // force the cursor into the text field
      window.addEventListener('keyup', function(event){
        if (event.keyCode == 13){ // looking for enter commmand

          var success = function() {
              messageInput.value = '';

              if (count < 26){ // if we are not to the end of the alphabet move to the next number
                count = count + 1;
              }
              else {
                count = 0; // or if completed the alphabet reset back to "a";
              }
          };

          var failure = function() {
              alert("Failed writing data to the BLE hardware");
          };

          var textValue = messageInput.value.toLowerCase();

          if(textValue == abc[count]){ // if the leter entered equals letter in the alphabet, send data
            var data = stringToBytes("f"); // sends an "f" to the BLE module
            var deviceId = id;
            ble.writeWithoutResponse(deviceId, redbear.serviceUUID, redbear.txCharacteristic, data, success, failure);
          }
        }
      });
    }
};
