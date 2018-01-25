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
function log(describer, obj) {
    obj = obj || '';
    print('&======');
    print(describer);
    print(JSON.stringify(obj));
    print('======&');
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

var defaultObj = {
    pos: {x: 0, y: 1, z: -2},
}

var posMap = {
    posFront: {x: 0, y: 1, z: -2},
    posBack: {x: 0, y: 1, z: 2},
    posLeft: {x: -2, y: 1, z: 0},
    posRight: {x: 2, y: 1, z: 0},
}
var posMap2 = {
    posFront: {x: 0, y: 1.5, z: -3},
    posBack: {x: 0, y: 2, z: 3},
    posLeft: {x: -3, y: 3, z: 0},
    posRight: {x: 3, y: 4, z: 0},
}
var posMap3 = {
    posFront: {x: 0, y: 2, z: -4},
    posBack: {x: 0, y: 2, z: 4},
    posLeft: {x: -4, y: 2, z: 0},
    posRight: {x: 4, y: 2, z: 0},
    posup: {x: 0, y: 3, z: 0},
}
var posMap4 = {
    posFront: {x: -2, y: 2, z: -4},
    posFront2: {x: 2, y: 3, z: -4},
    posBack: {x: -2, y: 2, z: 4},
    posBack2: {x: 2, y: 2, z: 4},
    posLeft: {x: -4, y: 2, z: 0},
    posLeft2: {x: -4, y: 3, z: 0},
    posRight: {x: 4, y: 2, z: 0},
    posRight2: {x: 4, y: 3, z: 0},
    posUp: {x: -2, y: 4, z: 0},
    posU2: {x: 2, y: 4, z: 0},
}

var posMapArray = [posMap,posMap2,posMap3,posMap4]

var rotationMap = {
    x1: Quat.fromPitchYawRollDegrees(90,0,0),
    x2: Quat.fromPitchYawRollDegrees(-90,0,0),
    x3: Quat.fromPitchYawRollDegrees(180,0,0),
    y1: Quat.fromPitchYawRollDegrees(0,90,0),
    y2: Quat.fromPitchYawRollDegrees(0,-90,0),
    z1: Quat.fromPitchYawRollDegrees(0,0,90),
    z2: Quat.fromPitchYawRollDegrees(0,0,90)
}

var rotationMapKeys = Object.keys(rotationMap);

var lightSouceMakerObj = {
    allLightSources: [],
    addToLightSource: function(lightSource){
        this.allLightSources.push(lightSource);
    },
    deleteFromLightSource: function(index){
        var lightSource = this.allLightSources.splice(index,1);
        this.lightSource.tearDown;
    },
    resetAll: function(){
        allLightSources.forEach(function(ls){
            ls.tearDown();
            this.allLightSources = [];
        })
    },
    makeLight: function(posMap, rotMap){
        var keys = Object.keys(posMap);
        keys.forEach(function(pos){
            var lightSource = new LightSourceMaker(posMap[pos]);
            this.allLightSources.push(lightSource);
        })
    }

}
var userData = {
    grabbableKey: {
        grabbable: false
    },
    ProceduralEntity: {
        version: 2,
        shaderUrl:
            "http://localhost:3001/shader.fs",
        channels: null,
        uniforms: {
            specular_intensity: 0.8,
            specular_hardness: 380,
            diffuse_color: [
                Math.sin(1 * (1 + 2) + 0),
                Math.sin(
                    2 * (2+ 3) + 2 * Math.PI / 3
                ),
                Math.sin(3 * (2 + 3) + 4 * Math.PI / 3)
            ],
            emit: -10,
            iSpeed: Math.random() / 4,
            hide: [0.0, 0.0, 0.0],
            specular_color: [
                Math.sin(4 * (2 + 3) + 0),
                Math.sin(
                    5 * (2 + 3) + 2 * Math.PI / 3
                ),
                Math.sin(6 * (2 + 3) + 4 * Math.PI / 3)
            ]
        }
    },
}

function LightSourceMaker(pos){
    print("in LIght source Maker")
    pos = pos || defaultObj.pos;
    this.position = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, pos));
    this.box = Entities.addEntity({
        name: "The Spot Light",
        description: "",
        type: "Box",
        position: this.position,
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
        },
    })
    this.sphere = Entities.addEntity({
        name: "Spot Light Sphere",
        description: "",
        type: "Sphere",
        position: this.position,
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
        // userData: JSON.stringify(userData),
        parentID: this.box
    });
    var lightProps = {
        name: "Spot Light Emitter 1",
        description: "",
        type: "Light",
        position: this.position,
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
        parentID: this.box
    };
    this.light0 = Entities.addEntity(lightProps);
    this.lights = [];
    lightProps.isSpotlight = 1;
    rotationMapKeys.forEach(function(rotation){
        lightProps.rotation = rotationMap[rotation];
        this.lights.push(Entities.addEntity(lightProps));
    }, this);
    this.speed = 1;
    this.pitch = 0;
    this.yaw = 0;
    this.roll = 0;
    this.fallOffRadius = 0;
    this.exponent = 0;
    this.cutoff = 0;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.centerRed = 0;
    this.centerGreen = 0;
    this.centerBlue = 0;
    this.lightIntensity = 0;
    this.centerIntensity = 0;
    this.group = 0;
    this.enable = true;
    this.centerEnable = true;
    this.toggleEnable = function(){
        this.enable = !this.enable;
        print("enable " + this.enable);
    };
    this.toggleCenterEnable = function(){
        this.centerEnable = !this.centerEnable;
        print("centerEnable " + this.centerEnable);

    };
    this.changeSpeed = function(newSpeed){
        this.speed = newSpeed
    }
    this.changePitch = function(newPitch){
        this.pitch = lerp (0,127,0,this.speed,newPitch)-this.speed/2;
        Entities.editEntity(this.box,{
            angularVelocity: {x:this.pitch, y:this.yaw, z: this.roll}
        })
    }
    this.changeYaw = function(newYaw){
        this.yaw = lerp (0,127,0,this.speed,newYaw)-this.speed/2;
        Entities.editEntity(this.box,{
            angularVelocity: {x:this.pitch, y:this.yaw, z: this.roll}
        })
    }
    this.changeRoll = function(newRoll){
        this.roll = lerp (0,127,0,this.speed,newRoll)-this.speed/2;
        Entities.editEntity(this.box,{
            angularVelocity: {x:this.pitch, y:this.yaw, z: this.roll}
        })
    }
    this.changeFallOff = function(newRadius){
        this.fallOffRadius = lerp (0,127,0.001,1,newRadius);
        props = {falloffRadius: this.fallOffRadius};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    }
    this.changeExponent = function(newExponent){
        this.exponent = lerp (0,127,1,1000,newExponent);
        props = {exponent: this.exponent};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    }
    this.changeCutoff = function(newCutoff){
        this.cutoff = lerp (0,127,0,1000,newCutoff);
        props = {cutoff: this.cutoff};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    }
    this.changeRed = function(newRed){
        this.red = lerp (0,127,0,255,newRed);
        props = {color: {red: this.red, green: this.green, blue: this.blue}};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    };
    this.changeGreen = function(newGreen){
        this.green = lerp (0,127,0,255,newGreen);
        props = {color: {red: this.red, green: this.green, blue: this.blue}};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    };
    this.changeBlue = function(newBlue){
        this.blue = lerp (0,127,0,255,newBlue);
        props = {color: {red: this.red, green: this.green, blue: this.blue}};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
    };
    this.changeCenterRed = function(newRed){
        this.centerRed = lerp (0,127,0,255,newRed);
        props = {color: {red: this.centerRed, green: this.centerGreen, blue: this.centerBlue}};
        Entities.editEntity(this.light0, props);
        Entities.editEntity(this.sphere, props);
    };
    this.changeCenterGreen = function(newGreen){
        this.centerGreen = lerp (0,127,0,255,newGreen);
        props = {color: {red: this.centerRed, green: this.centerGreen, blue: this.centerBlue}};
        Entities.editEntity(this.light0, props);
        Entities.editEntity(this.sphere, props);
    };
    this.changeCenterBlue = function(newBlue){
        this.centerBlue = lerp (0,127,0,255,newBlue);
        props = {color: {red: this.centerRed, green: this.centerGreen, blue: this.centerBlue}};
        Entities.editEntity(this.light0, props);
        Entities.editEntity(this.sphere, props);
    };
    this.changeIntensity = function(newIntensity){
        this.lightIntensity = lerp (0,127,0,500,newIntensity);
        props = {intensity: this.lightIntensity};
        this.lights.forEach(function(light) {Entities.editEntity(light, props)});
        Entities.editEntity(this.box, props);
    };
    this.changeCenterIntensity = function(newCenterIntensity){
        this.centerIntensity = lerp (0,127,0,1000,newCenterIntensity);
        props = {intensity: this.lightIntensity};
        Entities.editEntity(this.light0, props);
    };
    this.setup = function(){

    }
    this.tearDown = function(){
        print("running TearDown")
        print(JSON.stringify(this));
        Entities.deleteEntity(this.box);
    }
}
function changeSpeed(newSpeed){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeSpeed(newSpeed);
    })
}
function changePitch(newPitch){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changePitch(newPitch);
    })
}
function changeYaw(newYaw){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeYaw(newYaw);
    })
}
function changeRoll(newRoll){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeRoll(newRoll);
    })
}
function changeFallOff(newRadius){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeFallOff(newRadius);
    })
}
function changeExponent(newExponent){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeExponent(newExponent);
    })
}
function changeCutoff(newCutoff){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeCutoff(newCutoff);
    })
}
function changeRed(newRed){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeRed(newRed);
    })
}
function changeGreen(newGreen){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeGreen(newGreen);
    })
}
function changeBlue(newBlue){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeBlue(newBlue);
    })
}
function changeIntensity(newIntensity){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.enable) return;
        source.changeIntensity(newIntensity);
    })
}
function changeCenterIntensity(newIntensity){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterIntensity(newIntensity);
    })
}
function changeCenterRed(newRed){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterRed(newRed);
    })
}
function changeCenterGreen(newGreen){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterGreen(newGreen);
    })
}
function changeCenterBlue(newBlue){
    lightSouceMakerObj.allLightSources.forEach(function(source){
        if (!source.centerEnable) return;
        source.changeCenterBlue(newBlue);
    })
}
function toggleEnable(i){
    lightSouceMakerObj.allLightSources.forEach(function(source, index){
        if (i === index) source.toggleEnable();
    })
};
function toggleCenterEnable(i){
    lightSouceMakerObj.allLightSources.forEach(function(source, index){
        if (i === index) source.toggleCenterEnable();
    })
};

function midiEventReceived(eventData) {
    // if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
    //     return;
    // }
    log("eventData", eventData)
    // Light Speed
    if (eventData.note == novationMap.knob_1){
        var speed = eventData.velocity/2;
        changeSpeed(speed);
    }

    // Light Pitch
    if (eventData.note == novationMap.knob_2){
        changePitch(eventData.velocity);
    }

    // Light Yaw
    if (eventData.note == novationMap.knob_3){
        changeYaw(eventData.velocity);
    }

    // Light Roll
    if (eventData.note == novationMap.knob_4){
        changeRoll(eventData.velocity);
    }

    // Light Fall Off Radius
    if (eventData.note == novationMap.knob_5){
        changeFallOff(eventData.velocity);
    }

    // Light exponent
    if (eventData.note == novationMap.circle_up){
        circleValueEdit(50, 'up');
        changeExponent(circleValue);
    }

    if (eventData.note == novationMap.circle_down){
        circleValueEdit(50, 'down');
        changeExponent(circleValue);
    }

    // Light cutoff
    if (eventData.note == novationMap.up){
        directionValueEdit(50, 'up');
        changeCutoff(directionValue);
    }

    if (eventData.note == novationMap.down){
        directionValueEdit(10, 'down');
        changeCutoff(directionValue);
    }

    // Light Red
    if (eventData.note == novationMap.knob_6){
        changeRed(eventData.velocity);
    }

    // Light green
    if (eventData.note == novationMap.knob_7){
        changeGreen(eventData.velocity);
    }

    // Lightblue
    if (eventData.note == novationMap.knob_8){
        changeBlue(eventData.velocity);
    }

    // Light Intensicty
    if (eventData.note == novationMap.track_left){
        trackValueEdit(5, 'down');
        changeIntensity(trackValue);
    }
    if (eventData.note == novationMap.track_right){
        trackValueEdit(5, 'up');
        changeIntensity(trackValue);
    }

    // Center Light
    if (eventData.note == novationMap.track_left){
        trackValueEdit(50, 'down');
        changeCenterIntensity(trackValue);
    }
    if (eventData.note == novationMap.track_right){
        trackValueEdit(50, 'up');
        changeCenterIntensity(trackValue);
    }

    // Center Light Red
    if (eventData.note == novationMap.knob_6){
        changeCenterRed(eventData.velocity);
    }

    // Center Light green
    if (eventData.note == novationMap.knob_7){
        changeCenterGreen(eventData.velocity);
    }


    // Center Light blue
    if (eventData.note == novationMap.knob_8){
        changeCenterBlue(eventData.velocity);
    }

    if (eventData.note == novationMap.pad_1){
        toggleEnable(0);
    }
    if (eventData.note == novationMap.pad_2){
        toggleEnable(1);
    }
    if (eventData.note == novationMap.pad_3){
        toggleEnable(2);
    }
    if (eventData.note == novationMap.pad_4){
        toggleEnable(3);
    }
    if (eventData.note == novationMap.pad_5){
        toggleCenterEnable(0);
    }
    if (eventData.note == novationMap.pad_6){
        toggleCenterEnable(1);
    }
    if (eventData.note == novationMap.pad_7){
        toggleCenterEnable(2);
    }
    if (eventData.note == novationMap.pad_8){
        toggleCenterEnable(3);
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
    allLightSources.forEach(function(source){
        source.tearDown();
    })
}

midiConfig();
function makeLight(){

}
makeLight();

Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);
Script.scriptEnding.connect(scriptEnding);
