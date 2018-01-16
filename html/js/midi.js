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
    BODY_LOADED_ACTION = "bodyLoaded",
    elControls,
    elControlsTable,
    elControlsList,
    elInstructions,
    elHideInfoButton,
    elShowInfoButton,
    elSpinner;

    function showInstructions() {
        isDisplayingInstructions = true;
        updateInstructions();
    }

    function hideInstructions() {
        isDisplayingInstructions = false;
        updateInstructions();
    }

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

    elControls = document.getElementById("controls");

    elControlsTable = document.getElementById("controls-table");
    elControlsList = document.getElementById("controls-list");
    elInstructions = document.getElementById("instructions");
    // elPlayersUnused = document.getElementById("players-unused");

    elHideInfoButton = document.getElementById("hide-info-button");
    elHideInfoButton.onclick = hideInstructions;
    elShowInfoButton = document.getElementById("show-info-button");
    elShowInfoButton.onclick = showInstructions;

    // elLoadButton = document.getElementById("load-button");
    // elLoadButton.onclick = onLoadButtonClicked;

    elSpinner = document.getElementById("spinner");
    // elCountdownNumber = document.getElementById("countdown-number");

    // elRecordButton = document.getElementById("record-button");
    // elRecordButton.onclick = onRecordButtonClicked;
    //
    // elFinishOnOpen = document.getElementById("finish-on-open");
    // elFinishOnOpen.onclick = onFinishOnOpenClicked;

    // elFinishOnOpenLabel = document.getElementById("finish-on-open-label");
    // get dom and add clicks to buttons
    //elHideInfoButton = document.getElementById("hide-info-button");
    //elHideInfoButton.onclick = hideInstructions;

    signalBodyLoaded();
}
