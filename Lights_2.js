//  MidiSpotlight.js
//
//  Created by Bruce Brown on 1/9/2018
//

var novationMap = {
    knob_1: 21,
    knob_2: 22,
    knob_3: 23,
    knob_4: 24,
    knob_5: 25,
    knob_6: 26,
    knob_7: 27,
    knob_8: 28,
    pad_1: 40,
    pad_2: 41,
    pad_3: 42,
    pad_4: 43,
    pad_5: 48,
    pad_6: 49,
    pad_7: 50,
    pad_8: 51,
    pad_9: 36,
    pad_10: 37,
    pad_11: 38,
    pad_12: 39,
    pad_13: 44,
    pad_14: 45,
    pad_15: 46,
    pad_16: 47,
    circle_up: 108,
    circle_down: 109,
    up: 104,
    down: 105,
    track_left: 106,
    track_right: 107
}

var novationKeys = Object.keys(novationMap);
function matchNoteToKey(note){
    var keyMatched;
    novationKeys.forEach(function(key){
        if (novationMap[key] === note) {
            keyMatched = key;
        }
    })
    return keyMatched;
}


var circleValue = 0;
var directionValue = 0;
var trackValue = 0;
function circleValueEdit(amount, direction){
    if (direction === 'up'){
        circleValue += amount;
        if (circleValue >= 127) circleValue = 127
        if (circleValue <= 0) circleValue = 0
    } else {
        circleValue -= amount;
        if (circleValue >= 127) circleValue = 127
        if (circleValue <= 0) circleValue = 0
    }
}
function directionValueEdit(amount, direction){
    if (direction === 'up'){
        directionValue += amount;
        if (directionValue >= 127) directionValue = 127
        if (directionValue <= 0) directionValue = 0
    } else {
        directionValue -= amount;
        if (directionValue >= 127) directionValue = 127
        if (directionValue <= 0) directionValue = 0
    }
}
function trackValueEdit(amount, direction){
    if (direction === 'up'){
        trackValue += amount;
        if (trackValue >= 127) trackValue = 127
        if (trackValue <= 0) trackValue = 0
    } else {
        trackValue -= amount;
        if (trackValue >= 127) trackValue = 127
        if (trackValue <= 0) trackValue = 0
    }
}

// Controls
var speedControl = 77;
var pitchControl = 49;
var yawControl = 29;
var rollControl = 13;
var cutOffControl = 14;
var exponentControl = 30;
var fallOffRadiusControl = 50;
var redControl1 = 51;
var greenControl1 = 31;
var blueControl1 = 15;
var intensityControl1 = 79;
var redControl2 = 52;
var greenControl2 = 32;
var blueControl2 = 16;
var intensityControl2 = 80;

// Misc
var wantDynamic = false;

// Midi
var midiInDevice = "Launchkey Mini"
var midiOutDevice = "Launchkey Mini"
var midiInDeviceId = -1;
var midiOutDeviceId = -1;
var midiChannel = 1; // set midi channel
var midiInDeviceList = [];
var midiOutDeviceList = [];
const INPUT = false;
const OUTPUT = true;
const ENABLE = true;
const DISABLE = false;

// Motion vars
var speed1, pitch1, yaw1, roll1;
// General Light vars
var red1, red2, green1, green2, blue1, blue2, intensity1, intensity2, falloffRadius1;
// Spotlight vars
var cutoff1, exponent1;
// Array Vars
var lights = [];
var lightProps = {};
// Entity Vars
var light, light0, box1, sphere1;

function lightSource(){
    print("Creating Spotlight");
    var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: 1, z: -2}));

    box1 = Entities.addEntity({
        name: "The Spot Light",
        description: "",
        type: "Box",
        position: pos,
        dimensions: {
            x: 0.35,
            y: 0.35,
            z: 0.35
        },
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        friction: 0,
        color:{
            red: 100,
            blue: 0,
            green: 0
        }
    });

    sphere1 = Entities.addEntity({
        name: "Spot Light Sphere",
        description: "",
        type: "Sphere",
        position: pos,

        dimensions: {
            x: 0.5,
            y: 0.5,
            z: 0.5
        },
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        friction: 0,
        color:{
            red: 100,
            blue: 0,
            green: 0
        },
        collisionless: true,
        userData: "{ \"grabbableKey\": { \"grabbable\": false} }",
        parentID: box1
    });

    var lightProps = {
        name: "Spot Light Emitter 1",
        description: "",
        type: "Light",
        position: pos,
        dimensions: {
            x: 60,
            y: 60,
            z: 60
        },
        dynamic: wantDynamic,
        gravity: {x:0, y:-2, z:0},
        angularDamping: 0,
        color:{red: 255,
            blue: 255,
            green: 255
        },
        intensity: 1000,
        falloffRadius: 0,
        isSpotlight: 0,
        exponent: 1,
        cutoff: 10,
        collisionless: true,
        userData: "{ \"grabbableKey\": { \"grabbable\": false} }",
        parentID: box1
    };

    // Iluminator
    lightProps.isSpotlight = 0;
    light0 = Entities.addEntity(lightProps);

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(90,0,0)
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(-90,0,0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0,90,0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0,-90,0);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(0,0,90);
    lights.push(Entities.addEntity(lightProps));

    lightProps.isSpotlight = 1;
    lightProps.rotation = Quat.fromPitchYawRollDegrees(180,0,0);
    lights.push(Entities.addEntity(lightProps));
}

function midiEventReceived(eventData) {
    if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
        return;
    }

// Light Speed
    if (eventData.note == novationMap.knob_1){
        speed1 = eventData.velocity/2;
    }

// Light Pitch
    if (eventData.note == novationMap.knob_2){
        pitch1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
        Entities.editEntity(box1,{
            angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        })
    }

// Light Yaw
    if (eventData.note == novationMap.knob_3){
        yaw1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
        Entities.editEntity(box1,{
            angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        })
    }

// Light Roll
    if (eventData.note == novationMap.knob_4){
        roll1 = lerp (0,127,0,speed1,eventData.velocity) -speed1/2;
        Entities.editEntity(box1,{
            angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
        })
    }

// Light Fall Off Radius
    if (eventData.note == novationMap.knob_5){
        falloffRadius1 = lerp (0,127,0.001,1,eventData.velocity);
        props = {falloffRadius: falloffRadius1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light exponent
    if (eventData.note == novationMap.circle_up){
        circleValueEdit(100, 'up');
        exponent1 = lerp (0,127,0.001,20,circleValue);
        props = {exponent: exponent1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

    if (eventData.note == novationMap.circle_down){
        circleValueEdit(100, 'down');
        exponent1 = lerp (0,127,0.001,20,circleValue);
        props = {exponent: exponent1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light cutoff
    if (eventData.note == novationMap.up){
        directionValueEdit(10, 'up');

        cutoff1 = lerp (0,127,0,100,directionValue);
        props = {cutoff: cutoff1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

    if (eventData.note == novationMap.down){
        directionValueEdit(10, 'down');

        cutoff1 = lerp (0,127,0,100,directionValue);
        props = {cutoff: cutoff1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light Re d
    if (eventData.note == novationMap.knob_6){
        red1 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red1, green: green1, blue: blue1}};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light green
    if (eventData.note == novationMap.knob_7){
        green1 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red1, green: green1, blue: blue1}};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Lightblue
    if (eventData.note == novationMap.knob_8){
        blue1 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red1, green: green1, blue: blue1}};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
    }

// Light Intensicty
    if (eventData.note == novationMap.track_left){
        trackValueEdit(5, 'down');
        intensity1 = lerp (0,127,0,500,trackValue);
        props = {intensity: intensity1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
        Entities.editEntity(box1, props);
    }
    if (eventData.note == novationMap.track_right){
        trackValueEdit(5, 'up');
        intensity1 = lerp (0,127,0,500,trackValue);
        props = {intensity: intensity1};
        lights.forEach(function(light) {Entities.editEntity(light, props)});
        Entities.editEntity(box1, props);
    }

// Center Light
    if (eventData.note == novationMap.track_left){
        trackValueEdit(5, 'down');
        intensity2 = lerp (0,127,0,1000,eventData.velocity);
        props = {intensity: intensity2};
        Entities.editEntity(light0, props);
    }
    if (eventData.note == novationMap.track_right){
        trackValueEdit(5, 'up');
        intensity2 = lerp (0,127,0,1000,eventData.velocity);
        props = {intensity: intensity2};
        Entities.editEntity(light0, props);
    }

// Center Light Red
    if (eventData.note == novationMap.knob_6){
        red2 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red2, green: green2, blue: blue2}};
        Entities.editEntity(light0,props);
        Entities.editEntity(sphere1, props);
    }

// Center Light green
    if (eventData.note == novationMap.knob_7){
        green2 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red2, green: green2, blue: blue2}};
        Entities.editEntity(light0, props);
        Entities.editEntity(sphere1, props);
    }


// Center Light blue
    if (eventData.note == novationMap.knob_8){
        blue2 = lerp (0,127,0,255,eventData.velocity);
        props = {color: {red: red2, green: green2, blue: blue2}};
        Entities.editEntity(light0, props);
        Entities.editEntity(sphere1, props);
    }
}

function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow;
}
//lerp (0,127,0,360,eventData.velocity);

function getMidiInputs(){
    var midiInDevices = Midi.listMidiDevices(INPUT);
    midiInDeviceList = midiInDevices;
}

function getMidiOutputs(){
    var midiOutDevices = Midi.listMidiDevices(OUTPUT);
    midiOutDevices.shift(); // Get rind of MS wavetable synth
    midiOutDeviceList = midiOutDevices;
}

function getMidiDeviceIds(){
    for (var i = 0; i < midiInDeviceList.length; i++){
        if (midiInDeviceList[i] == midiInDevice){
            midiInDeviceId = i;
        }
    }
    for (var i = 0; i < midiOutDeviceList.length; i++){
        if (midiOutDeviceList[i] == midiOutDevice){
            midiOutDeviceId = i + 1;
        }
    }
}

// List Midi Input Devices
function listMidiInputs(){
    print("Input Devices:");
    for(var i = 0; i < midiInDeviceList.length; i++) {
        print("(" + i + ") " + midiInDeviceList[i]);
    };
}

// List Midi ouput Devices
function listMidiOutputs(){
    print("Output Devices:");
    for(var i = 0; i < midiOutDeviceList.length; i++) {
        print("(" + (i+1) + ") " + midiOutDeviceList[i]); // Get rid of MS wavetable synth
    };
}

function midiHardwareResetReceieved(){
    getMidiInputs();
    getMidiOutputs();
    getMidiDeviceIds();
    //blockAllDevices();
    unblockMidiDevice();
}

function unblockMidiDevice(){
    Midi.unblockMidiDevice(midiOutDevice, OUTPUT);
    Midi.unblockMidiDevice(midiInDevice, INPUT);
}

function midiConfig(){
    Midi.thruModeEnable(DISABLE);
    Midi.broadcastEnable(DISABLE);
    Midi.typeNoteOffEnable(ENABLE);
    Midi.typeNoteOnEnable(ENABLE);
    Midi.typePolyKeyPressureEnable(DISABLE);
    Midi.typeControlChangeEnable(ENABLE);
    Midi.typeProgramChangeEnable(ENABLE);
    Midi.typeChanPressureEnable(DISABLE);
    Midi.typePitchBendEnable(DISABLE);
    Midi.typeSystemMessageEnable(DISABLE);
    midiHardwareResetReceieved();
}

function scriptEnding() {
    Entities.deleteEntity(box1);
}

midiConfig();
lightSource();

Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);
Script.scriptEnding.connect(scriptEnding);
