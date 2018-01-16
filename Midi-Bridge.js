"use strict";
/*

Adding setup for utility to do inits


*/

if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) { // .length of function is 2
            'use strict';
            if (target == null) { // TypeError if undefined or null
                throw new TypeError('Cannot convert undefined or null to object');
            }

            var to = Object(target);

            for (var index = 1; index < arguments.length; index++) {
                var nextSource = arguments[index];

                if (nextSource != null) { // Skip over if undefined or null
                    for (var nextKey in nextSource) {
                        // Avoid bugs when hasOwnProperty is shadowed
                        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                            to[nextKey] = nextSource[nextKey];
                        }
                    }
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
}

(function () {

    // INIT
    var APP_NAME = "MIDI-BRIDGE",
        APP_ICON_INACTIVE = "icons/tablet-icons/avatar-record-i.svg",
        APP_ICON_ACTIVE = "icons/tablet-icons/avatar-record-a.svg",
        APP_URL = Script.resolvePath("html/midi.html"),
        isDialogDisplayed = false,
        tablet,
        button,
        isConnected,

        Controls;
        // Devices,
        Dialog,
        EntitiesManager,
        // Events,
        // Functions,
        MidiManager,
    // PowerUps,
    // Properties,
        Utils,

    function log(describer, obj) {
        obj = obj || '';
        print('&======');
        print(APP_NAME + ": \n" + describer);
        print(JSON.stringify(obj));
        print('======&');
    };

    function error(message, info) {
        print('&======');
        print(APP_NAME + ": " + message + (info !== undefined ? " - " + info : ""));
        Window.alert(message);
        print('======&');
    }
    // HIFI_MIDI_BRIDGE_CHANNEL = "Hifi-Midi-Bridge-Channel",

    Controls = (function () {
        var HIFI_MIDI_CONTROLS_CHANNEL = "Hifi-Midi-Controls-Channel",
            CONTROLS_COMMAND_ERROR = "error",
            CONTROLS_COMMAND_ADD = "add",
            CONTROLS_COMMAND_COPY = "copy",
            CONTROLS_COMMAND_FIND = "find",
            CONTROLS_COMMAND_LOOKUP = "lookup",
            CONTROLS_COMMAND_MODIFY = "modify",
            CONTROLS_COMMAND_PIPE = "pipe",
            CONTROLS_COMMAND_REMOVE = "remove",
            ControlsList = ["Test:ControlsList"];

        var defaultOptions = {
            name: "",
            id: 0,
            inputMin: 0,
            inputMax: 255,
            outputMin: 0,
            outputMax: 255,
            currentControlValue: 0,
            controlGroup: [],
            channelGroup: [],
            deviceGroup: [],
            entityGroup: [],
            propertiesGroup: [],
            powerUpsGroup: [],
            functionsGroup: []
        };

        function ControlMaker(optionsObj) {
            var combinedOptions = Object.assign({}, defaultOptions, optionsObj);
            for (var key in combinedOptions){
                this[key] = combinedOptions[key];
            }
        }
        ControlMaker.prototype = {
            groupMap: {
                'control': this.controlGroup,
                'channel': this.channelGroup,
                'device': this.deviceGroup,
                'entity': this.entityGroup,
                'properties': this.propertiesGroup,
                'powerUps': this.powerUpsGroup,
                'functions': this.functionsGroup
            },
            add: function (groupType, itemToAdd) {
                this.groupMap[groupType].push(itemToAdd);
            },
            copy: function (groupType, indexToCopy, newProps) {
                var itemToCopy = this.groupMap[groupType][indexToCopy];
                var newItem = Object.assign({}, itemToCopy, newProps);
                this.groupMap[groupType].push(itemToCopy);
            },
            find: function (groupType, query) {
                var listToSearch = this.groupMap[groupType];
                for (var i = 0; i < listToSeasrch.length; i++){
                    if (listToSearch[i].indexOf(query) != -1) {
                        return i;
                    }
                }
            },
            lookup: function (groupType, indexToLookUp) {
                return this.groupMap[groupType][indexToLookUp];
            },
            modify: function(groupType, indexToModify, newProps) {
                var itemToModify = this.groupMap[groupType][indexToModify];
                var newItem = Object.assign({}, itemToModify, newProps);
                this.groupMap[groupType][indexToModify] = newItem;
            },
            pipe: function(groupType, indexToPipe, whereToPipe) {
                var itemToPipe = this.groupMap[groupType][indexToPipe];
            },
            remove: function(groupType, indexToRemove) {
                var itemToRemove = this.groupMap[groupType].splice(indexToRemove,1);
            }
        };

        function onMessageReceived(channel, message, sender) {
            var index;

            if (channel !== HIFI_MIDI_CONTROLS_CHANNEL) {
                return;
            }

            message = json.parse(message);

            if (message.command === CONTROLS_COMMAND_ERROR) {
                if (message.user === MyAvatar.sessionUUID) {
                    error(message.message);
                }
            } else {

            }
        }

        function reset() {
            ControlsList = [];
            Dialog.updateControllerDetails(ControlsList);
        }

        function setUp(){
            Messages.messageReceived.connect(onMessageReceived);
            Messages.subscribe(HIFI_MIDI_CONTROLS_CHANNEL);
        }

        function tearDown() {
            Messages.unsubscribe(HIFI_MIDI_CONTROLS_CHANNEL);
            Messages.messageReceived.disconnect(onMessageReceived);
        }

        return {
            reset: reset,
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    /*
    Devices = (function () {
        var HIFI_MIDI_DEVICES_CHANNEL = "Hifi-Midi-Devices-Channel",
            DEVICES_COMMAND_ERROR = "error",
            DEVICES_COMMAND_ADD = "add",
            DEVICES_COMMAND_COPY = "copy",
            DEVICES_COMMAND_FIND = "find",
            DEVICES_COMMAND_LOOKUP = "lookup",
            DEVICES_COMMAND_MODIFY = "modify",
            DEVICES_COMMAND_PIPE = "pipe",
            DEVICES_COMMAND_REMOVE = "remove",
            DevicesList = [];

        var defaultOptions = {
            name: "",
            id: 0,
            midiIn: "",
            midiOut: ""
        };

        function DeviceMaker(optionsObj) {
            var combinedOptions = Object.assign({}, defaultOptions, optionsObj);
            for (var key in combinedOptions){
                this[key] = combinedOptions[key];
            }
        }
        DeviceMaker.prototype = {
            groupMap: {
                'midiIn': this.midiIn,
                'midiOut': this.midiOut
            },
            add: function (groupType, itemToAdd) {
                this.groupMap[groupType] = itemToAdd;
            },
            lookup: function (groupType, indexToLookUp) {
                return this.groupMap[groupType];
            },
            modify: function(groupType, newProp) {
                this.groupMap[groupType] = newProp;
            },
            pipe: function(groupType, indexToPipe, whereToPipe) {
                var itemToPipe = this.groupMap[groupType];
            },
            remove: function(groupType, indexToRemove) {
                this.groupMap[groupType] = "";
            }
        };

        function onMessageReceived(channel, message, sender) {
            var index;

            if (channel !== HIFI_MIDI_DEVICES_CHANNEL) {
                return;
            }

            message = json.parse(message);

            if (message.command === DEVICES_COMMAND_ERROR) {
                if (message.user === MyAvatar.sessionUUID) {
                    error(message.message);
                }
            } else {

            }
        }

        function reset() {
            DevicesList = [];
            Dialog.updateDevicesDetails(DevicesList);
        }

        function setUp(){
            Messages.messageReceived.connect(onMessageReceived);
            Messages.subscribe(HIFI_MIDI_DEVICES_CHANNEL);
        }

        function tearDown() {
            Messages.unsubscribe(HIFI_MIDI_DEVICES_CHANNEL);
            Messages.messageReceived.disconnect(onMessageReceived);
        }

        return {
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    */
    Dialog = (function () {
        var isFinishedOnOpen = false,
            EVENT_BRIDGE_TYPE = "midi",
            BODY_LOADED_ACTION = "bodyLoaded",
            USING_TOOLBAR_ACTION = "usingToolbar",
            UPDATE_CONTROLLERS_ACTION = "updateControllers",
            UPDATE_DEVICES_ACTION = "updateDevices",
            UPDATE_MIDI_ACTION = "updateMidi",
            UPDATE_ENTITIES_ACTION = "updateEntities";

        function isUsingToolbar() {
            return ((HMD.active && Settings.getValue("hmdTabletBecomesToolbar"))
                || (!HMD.active && Settings.getValue("desktopTabletBecomesToolbar")));
        }

        function updateControllerDetails(controls){
            var length,
                i;
            for (i = 0, length = controls.length; i < length; i += 1) {
                if (controls[i]) {

                }
            }

            tablet.emitScriptEvent(JSON.stringify({
                type: EVENT_BRIDGE_TYPE,
                action: UPDATE_CONTROLLERS_ACTION,
                value: JSON.stringify(controls)
            }));

        }
        /*
        function updateDevicesDetails(devices){
            var length,
                i;
            for (i = 0, length = devices.length; i < length; i += 1) {
                if (devices[i]) {

                }
            }

            tablet.emitScriptEvent(JSON.stringify({
                type: EVENT_BRIDGE_TYPE,
                action: UPDATE_DEVICES_ACTION,
                value: JSON.stringify(devices)
            }));

        }
        */
        function updateEntitiesDetails(entitiesList){
            var length,
                i;
            for (i = 0, length = entities.length; i < length; i += 1) {
                if (entitiesList[i]) {

                }
            }

            tablet.emitScriptEvent(JSON.stringify({
                type: EVENT_BRIDGE_TYPE,
                action: UPDATE_DEVICES_ACTION,
                value: JSON.stringify(entitiesList)
            }));

        }

        function updateMidiDetails(midiList){
            var length,
                i;
            for (i = 0, length = midiList.length; i < length; i += 1) {
                if (midiList[i]) {

                }
            }

            tablet.emitScriptEvent(JSON.stringify({
                type: EVENT_BRIDGE_TYPE,
                action: UPDATE_DEVICES_ACTION,
                value: JSON.stringify(midiList)
            }));

        }

        function onWebEventReceived(data) {
            var message,

                mmessage = JSON.parse(data);
            if (message.type === EVENT_BRIDGE_TYPE) {
                switch (message.action) {
                    case BODY_LOADED_ACTION:
                        var usingToolbarEvent = {
                            type: EVENT_BRIDGE_TYPE,
                            action: USING_TOOLBAR_ACTION,
                            value: isUsingToolbar()
                        };
                        var usingToolbarMessage = JSON.stringify(usingToolbarEvent);
                        tablet.emitScriptEvent(usingToolbarMessage);
                        var FinishOnOpenAction = {
                            type: EVENT_BRIDGE_TYPE,
                            action: USING_TOOLBAR_ACTION,
                            value: isUsingToolbar()
                        };
                        break;
                    case UPDATE_CONTROLLERS_ACTION:
                        break;
                    // case UPDATE_DEVICES_ACTION:
                        // break;
                    case UPDATE_MIDI_ACTION:
                        break;
                    case UPDATE_ENTITIES_ACTION:
                        break;
                }
            }
        }

        function setUp(){
            // isFinishOnOpen = Settings.getValue(SETTINGS_FINISH_ON_OPEN) === true;
            tablet.webEventReceived.connect(onWebEventReceived);
        }

        function tearDown() {
            tablet.webEventReceived.disconnect(onWebEventReceived);
        }

        return {
            updateMidiDetails: updateMidiDetails,
            updateEntitiesDetails: updateEntitiesDetails,
            updateControllerDetails: updateControllerDetails,
            setUp: setUp,
            tearDown: tearDown
        };
    }());

    EntitiesManager = (function () {
        var HIFI_MIDI_ENTITIES_CHANNEL = "Hifi-Midi-Entities-Channel",
            ENTITIES_COMMAND_ERROR = "error",
            ENTITIES_COMMAND_ADD = "add",
            ENTITIES_COMMAND_COPY = "copy",
            ENTITIES_COMMAND_FIND = "find",
            ENTITIES_COMMAND_LOOKUP = "lookup",
            ENTITIES_COMMAND_MODIFY = "modify",
            ENTITIES_COMMAND_PIPE = "pipe",
            ENTITIES_COMMAND_REMOVE = "remove",
            EntitiesList = ["Test:EntitiesList"];

        var defaultOptions = {
            name: "",
            id: 0,
            entityID: "",
            currentProps: {}
        };

        function EntityMaker(optionsObj) {
            var combinedOptions = Object.assign({}, defaultOptions, optionsObj);
            for (var key in combinedOptions){
                this[key] = combinedOptions[key];
            }
        }
        EntityMaker.prototype = {
            groupMap: {
                'entityID': this.entityID,
                'currentProps': this.currentProps
            },
            add: function (groupType, itemToAdd) {
                this.groupMap[groupType] = itemToAdd;
            },
            lookup: function (groupType, indexToLookUp) {
                return this.groupMap[groupType];
            },
            modify: function(groupType, newProp) {
                this.groupMap[groupType] = newProp;
            },
            pipe: function(groupType, indexToPipe, whereToPipe) {
                var itemToPipe = this.groupMap[groupType];
            },
            remove: function(groupType, indexToRemove) {
                this.groupMap[groupType] = "";
            }
        };

        function onMessageReceived(channel, message, sender) {
            var index;

            if (channel !== HIFI_MIDI_ENTITIES_CHANNEL) {
                return;
            }

            message = json.parse(message);

            if (message.command === ENTITIES_COMMAND_ERROR) {
                if (message.user === MyAvatar.sessionUUID) {
                    error(message.message);
                }
            } else {

            }
        }

        function reset() {
            EntitiesList = [];
            Dialog.updateEntitiesDetails(EntitiesList);
        }

        function setUp(){
            Messages.messageReceived.connect(onMessageReceived);
            Messages.subscribe(HIFI_MIDI_ENTITIES_CHANNEL);
        }

        function tearDown() {
            Messages.unsubscribe(HIFI_MIDI_ENTITIES_CHANNEL);
            Messages.messageReceived.disconnect(onMessageReceived);
        }

        return {
            reset: reset,
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    /*
    Events = (function () {
        var IDLE = 0

        function setUp(){

        }

        function tearDown() {

        }

        return {
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    */
    /*
    Functions = (function () {
        var IDLE = 0

        function setUp(){

        }

        function tearDown() {

        }

        return {
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    */
    MidiManager = (function () {
        var HIFI_MIDI_MIDI_CHANNEL = "Hifi-Midi-Midi-Channel",
            MIDI_COMMAND_ERROR = "error",
            MIDI_COMMAND_ADD = "add",
            MIDI_COMMAND_COPY = "copy",
            MIDI_COMMAND_FIND = "find",
            MIDI_COMMAND_LOOKUP = "lookup",
            MIDI_COMMAND_MODIFY = "modify",
            MIDI_COMMAND_PIPE = "pipe",
            MIDI_COMMAND_REMOVE = "remove",
            MIDI_INPUT = false,
            MIDI_OUTPUT = true,
            MIDI_ENABLE = true,
            MIDI_DISABLE = false,
            midiInDeviceList,
            midiOutDeviceList,
            MidiList = ["Test:MidiList"];

        var defaultOptions = {
            name: "",
            id: 0,
            midiInDeviceId: 0,
            midiOutDeviceId: 0,
            midiInDevice: "",
            midiOutDevice: "",
            midiInDeviceSelected: false,
            midiOutDeviceSelected: false,
            midiInBlock: false,
            midiOutBlock: false
        };

        function MidiMaker(optionsObj) {
            var combinedOptions = Object.assign({}, defaultOptions, optionsObj);
            for (var key in combinedOptions){
                this[key] = combinedOptions[key];
            }
        }

        MidiMaker.prototype = {
            groupMap: {
                'midiInDeviceId': this.midiInDeviceId,
                'midiOutDeviceId': this.midiOutDeviceId,
                'midiInDevice': this.midiInDevice,
                'midiOutDevice': this.midiOutDevice
            },
            add: function (groupType, itemToAdd) {
                this.groupMap[groupType] = itemToAdd;
            },
            lookup: function (groupType, indexToLookUp) {
                return this.groupMap[groupType];
            },
            modify: function(groupType, newProp) {
                this.groupMap[groupType] = newProp;
            },
            pipe: function(groupType, indexToPipe, whereToPipe) {
                var itemToPipe = this.groupMap[groupType];
            },
            remove: function(groupType, indexToRemove) {
                this.groupMap[groupType] = "";
            }
        };

        var defaultMidiConfigOptions = {
            thruModeEnable: MIDI_DISABLE,
        	broadcastEnable: MIDI_DISABLE,
        	typeNoteOffEnable: MIDI_ENABLE,
        	typeNoteOnEnable: MIDI_ENABLE,
        	typePolyKeyPressureEnable: MIDI_DISABLE,
        	typeControlChangeEnable: MIDI_ENABLE,
        	typeProgramChangeEnable: MIDI_ENABLE,
        	typeChanPressureEnable: MIDI_DISABLE,
        	typePitchBendEnable: MIDI_DISABLE,
        	typeSystemMessageEnable: MIDI_DISABLE
        };

        function midiConfig(optionsObj){
            var combinedOptions = Object.assign({}, defaultMidiConfigOptions, optionsObj);
            for (var key in combinedOptions){
                Midi[key] = combinedOptions[key];
            }
        	midiHardwareResetReceieved();
        }

        function getMidiDevices(){
            getMidiInputs();
            getMidiOutputs();
        }
        function getMidiInputs(){
            midiInDeviceList = Midi.listMidiDevices(MIDI_INPUT);
        }
        function getMidiOutputs(){
            midiOutDeviceList = Midi.listMidiDevices(MIDI_OUTPUT);
            midiOutDeviceList.shift();
        }
        function getMidiDeviceIds(){
            MidiList.forEach(function(midiItem){
                for (var i = 0; i < midiInDeviceList.length; i++){
                    if (midiInDeviceList[i] === midiItem.midiInDevice){
                        midiItem.midiInDeviceId = i;
                    }
                }
                for (var i = 0; i < midiOutDeviceList.length; i++){
                    if (midiOutDeviceList[i] === midiItem.midiOutDevice){
                        midiItem.midiOutDeviceId = i + 1;
                    }
                }
            })
        }
        function listMidiInputs(){
        	print("Input Devices:");
        	for (var i = 0; i < midiInDeviceList.length; i++) {
            	print("(" + i + ") " + midiInDeviceList[i]);
            }
        }
        function listMidiOutputs(){
            print("Output Devices:");
        	for (var i = 0; i < midiOutDeviceList.length; i++) {
            	print("(" + (i+1) + ") " + midiOutDeviceList[i]); // Get rid of MS wavetable synth
        	}
        }

        function buildMidiList(){

        }
        // Adjust for all devices
        // #Revist
        function unblockMidiDevice(){
            MidiList.forEach(function(midiItem){
                if (!midiItem.midiInBlock) {
                    Midi.unblockMidiDevice(midiItem.midiOutDevice, MIDI_OUTPUT);
                }
                if (!midiItem.midiOutBlock) {
                    Midi.unblockMidiDevice(midiItem.midiInDevice, MIDI_INPUT);
                }
            });
        }

        function midiHardwareResetReceieved(){
        	getMidiInputs();
        	getMidiOutputs();
            buildMidiList();
            getMidiDeviceIds();
        	// blockAllDevices();
            listMidiInputs();
            listMidiOutputs();
        	unblockMidiDevice();
        }

        function onMessageReceived(channel, message, sender) {
            var index;

            if (channel !== HIFI_MIDI_MIDI_CHANNEL) {
                return;
            }

            message = json.parse(message);

            if (message.command === MIDI_COMMAND_ERROR) {
                if (message.user === MyAvatar.sessionUUID) {
                    error(message.message);
                }
            } else {

            }
        }

        function reset() {
            MidiList = [];
            Dialog.updateMidiDetails(MidiList);
        }

        function setUp(){
            midiConfig();
            Messages.messageReceived.connect(onMessageReceived);
            Messages.subscribe(HIFI_MIDI_MIDI_CHANNEL);

            Midi.midiReset.connect(midiHardwareResetReceieved);
            Midi.midiMessage.connect(midiEventReceived); }

        function tearDown() {
            Messages.unsubscribe(HIFI_MIDI_CONTROLS_CHANNEL);
            Messages.messageReceived.disconnect(onMessageReceived);

            Midi.midiReset.disconnect(midiHardwareResetReceieved);
            Midi.midiMessage.disconnect(midiEventReceived);

        }

        return {
            getMidiDevices: getMidiDevices,
            midiHardwareResetReceieved: midiHardwareResetReceieved,
            midiConfig: midiConfig,
            reset: reset,
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    /*
    Nodes = (function () {
        var HIFI_MIDI_Nodes_CHANNEL = "Hifi-Midi-Nodes-Channel",


        return {

        }
    }());

    PowerUps = (function () {
        var IDLE = 0

        function setUp(){

        }

        function tearDown() {

        }

        return {
            setUp: setUp,
            tearDown: tearDown
        };
    }());

    Properties = (function () {
        var IDLE = 0

        function setUp(){

        }

        function tearDown() {

        }

        return {
            setUp: setUp,
            tearDown: tearDown
        };
    }());

    Routes = (function () {
        var IDLE = 0

        function setUp(){

        }

        function tearDown() {

        }

        return {
            setUp: setUp,
            tearDown: tearDown
        };
    }());
    */
    Utils = (function () {

        transform = {
            lerp: function(inMin, inMax, outMin, outMax, inVal){
                return (
                    ((inVal - inMin) /
                    (inMax - inMin)) *
                    (outMax - outMin) + outMin);
            }
        };

        registry = {
            records: {
            }
        };

        objectMakers = {
            setup: function(optsObj, context) {
                for (var key in optsObj){
                    context[key] = optsObj[key];
                }
            },
            nodeInit: function(nodeName) {
                nodeName = nodeName.toUpperCase();

                var nodeInitObj = {};
                nodeInitObj["HIFI_MIDI_" + nodeName + "_CHANNEL"] = "Hifi-Midi-" + nodeName + "-Channel",
                nodeInitObj[nodeName + "_COMMAND_ERROR"] = "error",
                nodeInitObj[nodeName + "_COMMAND_ADD"] = "add",
                nodeInitObj[nodeName + "_COMMAND_COPY"] = "copy",
                nodeInitObj[nodeName + "_COMMAND_LOOKUP"] = "lookup",
                nodeInitObj[nodeName + "_COMMAND_MODIFY"] = "modify",
                nodeInitObj[nodeName + "_COMMAND_PIPE"] = "pipe",
                nodeInitObj[nodeName + "_COMMAND_REMOVE"] = "remove",
                nodeInitObj[nodeName + "List"] = [];

                return nodeInitObj;
            }
        };

        function setUp() {

        }

        function tearDown() {

        }

        return {
            objectMakers: objectMakers,
            registry: registry,
            transform: transform,
            setUp: setUp,
            tearDown: tearDown
        };
    }());

    function onTabletScreenChanged(type, url) {
        // Opened/closed dialog in tablet or window.
        // #REVISIT
        var MIDI_URL = "/html/midi.html";

        if (type === "Web" && url.slice(-MIDI_URL.length) === MIDI_URL) {
            if (Dialog.finishOnOpen()) {
                // Timers
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
        // Devices.setUp();
        EntitiesManager.setUp();
        // Events.setUp();
        // Functions.setUp();
        MidiManager.setUp();
        // PowerUps.setUp();
        // Properties.setUp();
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
        // Devices.tearDown();
        EntitiesManager.tearDown();
        // Events.tearDown();
        // Functions.tearDown();
        MidiManager.tearDown();
        // PowerUps.tearDown();
        // Properties.tearDown();
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

});

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
