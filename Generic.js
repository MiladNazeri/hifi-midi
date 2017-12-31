//
//  example
//
//  Created by Milad Nazeri, 12/10/17
//  Copyright 2015 High Fidelity, Inc.
//
//  A project to build a virtual physics classroom to simulate the solar system, gravity, and orbital physics.
//
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

// init-------------------------------------------------------------------------

var config =
        Script.require(Script.resolvePath('Tablet/config.json?v=' + Date.now()));


// Tablet-----------------------------------------------------------------------

var APP_URL =
        Script.resolvePath('Tablet/UI.html');
var buttonActivated =
        false;
var tablet =
        Tablet.getTablet("com.highfidelity.interface.tablet.system");
var button =
        tablet.addButton({
            // icon: ICONS.icon,
            // activeIcon: ICONS.activeIcon,
            text: 'appName',
            sortOrder: 1 });

function onWebEventReceived(event) {
    var htmlEvent =
            JSON.parse(event);
    switch (htmlEvent.type){
        case 'slider':
            // config[htmlEvent.id].val = htmlEvent.value;
            // restart();
            break;
        default:
    }
}

function onClicked() {
    if (buttonActivated) {
        button.editProperties({isActive: false});
        buttonActivated = false;
        tablet.gotoHomeScreen();
        tablet.webEventReceived.disconnect(onWebEventReceived);
    } else {
        tablet.gotoWebScreen(APP_URL);
        tablet.webEventReceived.connect(onWebEventReceived);
        button.editProperties({isActive: true});
        buttonActivated = true;
    }
}

button.clicked.connect(onClicked);

// Controller Mapping-----------------------------------------------------------

var MAPPING_NAME = "mapping";

var mapping = Controller.newMapping(MAPPING_NAME);

mapping.from(Controller.Hardware.Keyboard["1"]).to(function(value) {

});

Controller.enableMapping(MAPPING_NAME);

// Messages---------------------------------------------------------------------

var CHANNEL_NAME = "Generic-Channel";

function messageHandler(channel, messageString, messageID) {
    if (channel != CHANNEL_NAME) {
        return; }
    var message = {};
    message = JSON.parse(messageString);
    if (message.key === "all") {
        switch (location.hostname) {
            case 'case1' :
                break;
            default: } } }

Messages.subscribe(CHANNEL_NAME);

Messages.messageReceived.connect(messageHandler);

// Messages.sendMessage(Channel, JSON.stringify({key: "switch-on"}));

// Cleanup----------------------------------------------------------------------

function scriptEnding() {
    // Entities.deleteEntity(GenericEntity);
    Controller.disableMapping(MAPPING_NAME);
    Messages.unsubscribe(CHANNEL_NAME);
    button.clicked.disconnect(onClicked);
    tablet.removeButton(button); }

Script.scriptEnding.connect(scriptEnding);
