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

/*
var dial = Nexus.Add.Dial('#instrument',{
  'size': [100,100]
});

var slider = Nexus.Add.Slider('#instrument',{
  'size': [25,100]
});

// then, to remove them tlater
dial.destroy();
slider.destroy();

var dial = new Nexus.Dial("#dial");

dial.on('change',function(v) {
  // v holds the new numeric value of the dial
});


var slider = new Nexus.Slider("#slider");

slider.on('click',function() {
  console.log('clicked!');
});

slider.on('release',function() {
  console.log('released');
});


{
  min: 0,
  max: 10,
  step: 1,
  mode: 'absolute'
}

var dial = new Nexus.Dial('#target',{
  'size': [75,75],
  'interaction': 'radial', // "radial", "vertical", or "horizontal"
  'mode': 'relative', // "absolute" or "relative"
  'min': 0,
  'max': 1,
  'step': 0,
  'value': 0
})
*/
var isUsingToolbar = false,
    EVENT_BRIDGE_TYPE = "midi",
    BODY_LOADED_ACTION = "bodyLoaded",
    elControls,
    elControlsTable,
    elControlsList,
    elInstructions,
    elHideInfoButton,
    elShowInfoButton,
    isDisplayingInstructions,
    elSpinner;

var dialInputMin = new Nexus.Dial('#input-min-dial');
var dialInputMax = new Nexus.Dial('#input-max-dial');
var dialOutputMin = new Nexus.Dial('#output-min-dial');
var dialOutputMax = new Nexus.Dial('#output-max-dial');
var dialCurrent = new Nexus.Dial('#current-dial');



function showInstructions() {
        isDisplayingInstructions = true;
        updateInstructions();
    }

function hideInstructions() {
        isDisplayingInstructions = false;
        updateInstructions();
    }

function updateInstructions() {
    // elHideInfoButton.classList.add("hidden");
    // elShowInfoButton.classList.add("hidden");
    if (isDisplayingInstructions) {
        elControlsList.classList.add("hidden");
        elInstructions.classList.remove("hidden");
    } else {
        elInstructions.classList.add("hidden");
        elControlsList.classList.remove("hidden");
    }
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
