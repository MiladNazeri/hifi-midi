"use strict";

//
//  Midi-Bridge.js
//
//  Created by Milad Nazeri on 5 Apr 2017.
//  Copyright 2017 High Fidelity, Inc.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
// TAGS: #Revisit

(function () {

    // INIT
    var APP_NAME = "MIDI-BRIDGE",
        APP_ICON_INACTIVE = "icons/tablet-icons/avatar-record-i.svg",
        APP_ICON_ACTIVE = "icons/tablet-icons/avatar-record-a.svg",
        APP_URL = Script.resolvePath("html/record.html"),
        isDialogDisplayed = false,
        tablet,
        button,
        isConnected,

        Controls
        Devices,
        Dialog,
        Entities,
        Events,
        Functions,
        Midi,
        PowerUps,
        Properties,
        Utils,


    function log(describer, obj) {
        obj = obj || '';
        print('&======');
        print(APP_NAME + ": \n" + describer);
        print(JSON.stringify(obj));
        print('======&');
    }

    function error(message, info) {
        print('&======');
        print(APP_NAME + ": " + message + (info !== undefined ? " - " + info : ""));
        Window.alert(message);
        print('======&');
    }
        // HIFI_MIDI_BRIDGE_CHANNEL = "Hifi-Midi-Bridge-Channel",

    Controls = (function () {

    })

    Devices = (function () {

    })

    Dialog = (function () {

    })

    Entities = (function () {

    })

    Events = (function () {

    })

    Functions = (function () {

    })

    Midi = (function () {

    })

    PowerUps = (function () {

    })

    Properties = (function () {

    })

    Utils = (function () {

    })

    function onTabletScreenChanged(type, url) {
        // Opened/closed dialog in tablet or window.
        // #REVISIT
        var MIDI_URL = "/html/midi.html";

        if (type === "Web" && url.slice(-MIDI_URL.length) === RECORD_URL {
            if (Dialog.finishOnOpen()) {
                //Timers
            }
            isDialogDisplayed = true;
        } else {
            isDialogDisplayed = false;
        }
        button.editProperties({ isActive: isDialogDisplayed });
    }

    function onTabletShownChanged() {
        // #REVISIT
        if (tablet.tabletShown && Dialog.finishOnOpen()) {
            // if there are timers happening this is where to close them before tablet changes
        }
    }

    function onButtonClicked() {
        if (isDialogDisplayed) {
            tablet.gotoHomeScreen();
            isDialogDisplayed = false;
        } else {
            tablet.gotoWebScreen(APP_URL);
            isDialogDisplayed = true;
        }
    }

    function onUpdate() {
        if (isConnected !== Window.location.isConnected) {
            // Server restarted or domain changed
            isConnected = !isConnected;
            if (!isConnected) {
                // Clear anything with .reset()
            }
        }
    }

    function setUp() {
        tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
        if (!tablet) {
            return;
        }

        // Tablet/toolbar button.
        button = tablet.addButton({
            icon: APP_ICON_INACTIVE,
            activeIcon: APP_ICON_ACTIVE,
            text: APP_NAME,
            isActive: false
        });
        if (button) {
            button.clicked.connect(onButtonClicked);
        }

        // Track showing/hiding tablet/dialog.
        tablet.screenChanged.connect(onTabletScreenChanged);
        tablet.tabletShownChanged.connect(onTabletShownChanged);

        Controls.setUp();
        Devices.setUp();
        Entities.setUp();
        Events.setUp();
        Functions.setUp();
        Midi.setUp();
        PowerUps.setUp();
        Properties.setUp();
        Utils.setUp();

        isConnected = Window.location.isConnected;
        Script.upddate.connect(onUpdate);
    }

    function tearDown() {
        if (!tablet) {
            return;
        }

        Script.update.disconnect(onUpdate);

        Controls.tearDown();
        Devices.tearDown();
        Entities.tearDown();
        Events.tearDown();
        Functions.tearDown();
        Midi.tearDown();
        PowerUps.tearDown();
        Properties.tearDown();
        Utils.tearDown();

        tablet.tabletShownChanged.disconnect(onTabletShownChanged);
        tablet.screenChanged.disconnect(onTabletShownChanged);
        if (button) {
            button.clocked.disconnect(onButtonClicked);
            tablet.removeButton(button);
            button = null;
        }

        if (isDialogDisplayed) {
            tablet.gotoHomeScreen();
        }

        tablet = null;
    }

    setUp();
    Script.scriptEnding.connect(tearDown);

})

/*
SCRIPT_STARTUP_DELAY = 3000;  // 3s

Will see if we have to need this
// FIXME: If setUp() is run immediately at Interface start-up, Interface hangs and crashes because of the line of code:
//     tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
//setUp();
//Script.scriptEnding.connect(tearDown);
Script.setTimeout(function () {
    setUp();
    Script.scriptEnding.connect(tearDown);
}, SCRIPT_STARTUP_DELAY);

*/
