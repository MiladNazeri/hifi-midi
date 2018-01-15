"use strict";

//
//  midi.js
//
//  Created by Milad Nazeri on 14 Jan 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
var isUsingToolbar = false,
    EVENT_BRIDGE_TYPE = "midi",
    BODY_LOADED_ACTION = "bodyLoaded"

function onScriptEventReceived(data) {
    var message = JSON.parse(data);
    if (message.type === EVENT_BRIDGE_TYPE){
        switch (message.action) {

        }
    }
}

function signalBodyLoaded(){
    var event = {
        type: EVENT_BRIDGE_TYPE,
        action: BODY_LOADED_ACTION
    }
    var stringifyEvent = JSON.stringify(event);
    EventBridge.emitWebEvent(stringifyEvent);
}

function onBodyLoaded(){
    EventBridge.scriptEventReceived.connect(onScriptEventReceived);

    // get dom and add clicks to buttons
    //elHideInfoButton = document.getElementById("hide-info-button");
    //elHideInfoButton.onclick = hideInstructions;

    signalBodyLoaded();
}
