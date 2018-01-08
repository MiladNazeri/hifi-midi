/* global Midi */

/* INIT */

var midiInDeviceList;
var midiOutDeviceList;

var entityList;

function midiConfig(){
    Midi.thruModeEnable(false);
    Midi.broadcastEnable(false);
    Midi.typeNoteOffEnable(true);
    Midi.typeNoteOnEnable(true);
    Midi.typePolyKeyPressureEnable(false);
    Midi.typeControlChangeEnable(true);
    Midi.typeProgramChangeEnable(true);
    Midi.typeChanPressureEnable(false);
    Midi.typePitchBendEnable(true);
    Midi.typeSystemMessageEnable(false);

    midiInDeviceList = Midi.listMidiDevices(false);
    midiOutDeviceList = Midi.listMidiDevices(true);
    print(JSON.stringify(midiInDeviceList));
    print(JSON.stringify(midiOutDeviceList));
}
midiConfig();

function bounceCheck(){
    var date = Date.now();
    return function(timeToPass){
        var dateTest = Date.now();
        var timePassed = dateTest-date;

        if (timePassed > timeToPass){
            date = Date.now();
            return true; }
        else {
            return false; } }; }
var bounceCheckStart = bounceCheck();

/* UTIL */

function log(describer, text){
    text = text || '';
    print('&======');
    print(describer + ": ");
    print(JSON.stringify(text));
    print('======&');
}

function randomize(min,max){
    return Math.random() * (max - min) + min; }
function op(accum, type, vel){
    switch (type){
        case '*':
            return accum * vel;
        case '%':
            return accum / vel;
        default:
            return; } }
function makeVec3(x,y,z){
    var obj = {
        "x": x,
        "y": y,
        "z": z };
    return obj; }

function lerp(InputLow, InputHigh, OutputLow, OutputHigh, Input) {
    return ((Input - InputLow) / (InputHigh - InputLow)) * (OutputHigh - OutputLow) + OutputLow; }
function sinCosMaker(type, opArray, transformCallback){
    // opArray = ['accum', 'type', vel]
    switch (type){
        case 'sin':
            return transformCallback(
                Math.sin(op(opArray[0], opArray[1], opArray[2])) );
        case 'cos':
            return transformCallback(
                Math.cos(op(opArray[0], opArray[1], opArray[2])) );
        default: } }
function makeSinVector(scalar){
    var vec = makeVec3(
        lerp(1,127, 0.1,1,scalar),
        lerp(1,127, 0.1,1,scalar),
        lerp(1,127, 0.1,1,scalar) );
    // log("makeSinvector::out", vec);
    return vec; }
function makeSinVector2(scalar){
    var vec = makeVec3(
        sinCosMaker(
            'sin',
            [scalar, '*', 1],
            transformValue(1, transformMultiply, 0) ),
        lerp(1,127,-2,2,scalar),
        sinCosMaker(
            'cos',
            [scalar, '*', 1],
            transformValue(1, transformMultiply, 0) ) );
    log("makeSinvector::out", vec);
    return vec;
}

function makeProps(arrayPropsArray){
    var props = {};
    // log('makeProps::in:arrayProps', arrayPropsArray);
    arrayPropsArray.forEach(function(prop){
        // log('forEach[prop]', prop);
        props[prop[0]] = prop[1]; });
    // log('makeProps::out:props', props);
    return props; }
function makeAllProps(allPropsArray){
    return allPropsArray.map(function(propArray){
        return makeProps(propArray); }); }
function getAllArrayProps(entityIdArray){
    var props = [];
    entityIdArray.forEach(function(id){
        var entProps = Entities.getEntityProperties(id);
        props.push(entProps); });
    return props; }

function getEntityIds(distance){
    return Entities.findEntities(MyAvatar.position, distance); }

function transformValue(scalar, transformFunction, offset){
    return function(sinValue){
        return transformFunction(sinValue, scalar, offset); }; }
function transformMultiply(sinValue, value, offset ){
    // log('value', sinValue * value);
    return (sinValue * value) + offset; }
function transformDivide(sinValue, value, offset ){
    return (sinValue / value) + offset; }

function entityManipulate(entityId, props){
    // log('entityManipulate::in:entityId', entityId);
    // log('entityManipulate::in:props', props);
    // var entProps = Entities.getEntityProperties(entityId, ['position','dimensions'] );
    // log('entityManipulate::entProps:pre', entProps);
    // log('entityManipulate::props:pre', props);
    Entities.editEntity(entityId, props);
    // entProps = Entities.getEntityProperties(entityId, ['position','dimensions'] );
    // log('entityManipulate::entProps:post', entProps);
    /* log('entityManipulate::entProps:post', entProps); */ }
function allEntityManipulate(entityArray, propsArray){
    // log('entityArray', entityArray);
    // log('propsArray', propsArray);
    if (propsArray.length === 1) {
        entityArray.forEach(
            function(entity){
                // log('allEntityManipulate::entityArray::propsArray[0])', propsArray[0]);
                entityManipulate(entity, propsArray[0]); }); }
    else {
        entityArray.forEach(
            function(entity, index){
                // log('allEntityManipulate::entityArray::propsArray[index])', propsArray[index]);
                entityManipulate(entity, propsArray[index]); }); } }
function eventManipulate(entityIds, eventData){
    var currentProps = getAllArrayProps(entityIds);
    var arrayProps = entityIds.map(function(item, index){
        // log("eventManipulate::entityIds[map]::currentProps[index].dimensions", currentProps[index].dimensions);
        // log("eventManipulate::entityIds[map]::currentProps[index].position", currentProps[index].position);
        // log('lerp(1,5,eventData.velocity),', lerp(1,127,1,5,eventData.velocity));
        // log('vec3', makeSinVector(eventData.velocity));
        return [
            [
                'dimensions', Vec3.sum(currentProps[index].dimensions, makeSinVector(eventData.velocity)) ] ]; });
        // return [
        //     [
        //         'dimensions', Vec3.sum(currentProps[index].dimensions, makeSinVector(eventData.velocity)) ],
        //     [
        //         'position', Vec3.sum(currentProps[index].position, makeSinVector(eventData.velocity)) ] ]; });


    // log('arrayProps preMakeProps', arrayProps);
    arrayProps = makeAllProps(arrayProps);
    // log('arrayProps', arrayProps);
    allEntityManipulate(entityIds, arrayProps); }

/* MIDI EVENTS */

var pitch = 0;
var pitch2 = 0;
var pitch3 = 0;
var pitch4 = 0;
var roll = 0;
var roll2 = 0;
var roll3 = 0;
var roll4 = 0;
var yaw = 0;
var yaw2 = 0;
var yaw3 = 0;
var yaw4 = 0;
var sensitivity = 1.0;
var red = 0;
var green = 0;
var blue = 0;
var intensity = 0;

function LightMaker(id){
    this.id = id;
    this.pitch = 0;
    this.roll = 0;
    this.yaw = 0;
    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.intensity = 0;
}

var entityIDs = [];
var myEntities = [];
var target = "midi-light";


function getMyEntities(){
    entityIDs = Entities.findEntities(MyAvatar.position, 1000);
    for (var i = 0; i < entityIDs.length; i++){
    	var props = Entities.getEntityProperties(entityIDs[i]);
 	    if (props.name.indexOf(target) !== -1) {
    		myEntities.push({name:props.name, entityID:entityIDs[i], control: false, controlProps: new LightMaker()});
    	}
        print("myEntities", JSON.stringify(myEntities));
    }
}

getMyEntities();

function midiMessageReceived(eventData){
    // console.log("here")
    // log('eventData', eventData);
    if (bounceCheckStart(50)) {
        if (eventData.note === 21){
            myEntities.forEach(function(entity){
                // print("in for each");
                if (entity.control === true){
                    // print("in true");
                    // print("entity:", JSON.stringify(entity));

                    entity.controlProps.yaw = (eventData.velocity*2-128)*sensitivity;
                    // print("entity.controlProps.pitch:", entity.controlProps.pitch);
                    // print("entity.controlProps.yaw:", entity.controlProps.yaw);
                    // print("entity.controlProps.roll:", entity.controlProps.roll);

                    var newRotation = Quat.fromPitchYawRollDegrees(entity.controlProps.pitch, entity.controlProps.yaw, entity.controlProps.roll);
                    // print("newRotation", JSON.stringify(newRotation) );
                    // print("")
                    Entities.editEntity(entity.entityID, {"rotation": newRotation});
                }
            });
        }
        // if (eventData.note === 22){
        //     pitch = (eventData.velocity*2-128)*sensitivity;
        //     var newRotation = Quat.fromPitchYawRollDegrees(pitch, yaw, roll);
        //     Entities.editEntity('{83e598f9-2441-4be3-898b-cce4af185afb}', {"rotation": newRotation});
        // }
        if (eventData.note === 22){
            myEntities.forEach(function(entity){
                if (entity.control === true){
                    entity.controlProps.pitch = (eventData.velocity*2-128)*sensitivity;
                    var newRotation = Quat.fromPitchYawRollDegrees(entity.controlProps.pitch, entity.controlProps.yaw, entity.controlProps.roll);
                    Entities.editEntity(entity.entityID, {"rotation": newRotation});
                }
            });
        }
        if (eventData.note === 23){
            myEntities.forEach(function(entity){
                if (entity.control === true){
                    entity.controlProps.roll = (eventData.velocity*2-128)*sensitivity;
                    var newRotation = Quat.fromPitchYawRollDegrees(entity.controlProps.pitch, entity.controlProps.yaw, entity.controlProps.roll);
                    Entities.editEntity(entity.entityID, {"rotation": newRotation});
                }
            });
        }
        if (eventData.note === 24){
            myEntities.forEach(function(entity){
                if (entity.control === true){
                    entity.controlProps.intensity = lerp(1,127,0,255,eventData.velocity);
                    Entities.editEntity(entity.entityID, {"intensity": entity.controlProps.intensity});
                }
            });
        }
        // if (eventData.note === 25){
        //     green = lerp(1,127,0,255,eventData.velocity);
        //     var color = { red: red, green: green, blue: blue};
        //     Entities.editEntity('{83e598f9-2441-4be3-898b-cce4af185afb}', {"color": color});
        // }
        if (eventData.note === 25){
            myEntities.forEach(function(entity){
                if (entity.control === true){
                    entity.controlProps.green = lerp(1,127,0,255,eventData.velocity);
                    var color = {
                        red: entity.controlProps.red,
                        green: entity.controlProps.green,
                        blue: entity.controlProps.blue
                    };
                    Entities.editEntity(entity.entityID, {"color": color});
                }
            });
        }
        if (eventData.note === 26){
            myEntities.forEach(function(entity){
                if (entity.control === true){
                    entity.controlProps.blue = lerp(1,127,0,255,eventData.velocity);
                    var color = {
                        red: entity.controlProps.red,
                        green: entity.controlProps.green,
                        blue: entity.controlProps.blue
                    };
                    Entities.editEntity(entity.entityID, {"color": color});
                }
            });
        }
        if (eventData.note === 27){
            myEntities.forEach(function(entity){
                if (entity.control === true){
                    entity.controlProps.red = lerp(1,127,0,255,eventData.velocity);
                    var color = {
                        red: entity.controlProps.red,
                        green: entity.controlProps.green,
                        blue: entity.controlProps.blue
                    };
                    Entities.editEntity(entity.entityID, {"color": color});
                }
            });
        }
        if (eventData.note === 40){
            myEntities.forEach(function(entity, index){

                // print("index:", index);
                // print("entity.control-pre:", entity.control);
                if (index === 0){
                    // print("CORRECT");
                    // print("entity:", JSON.stringify(entity));
                    entity.control = true;
                } else {
                    entity.control = false;
                }
                // print("entity.control-post:", entity.control);
            });
        }
        if (eventData.note === 41){
            myEntities.forEach(function(entity, index){
                if (index === 1){
                    entity.control = true;
                } else {
                    entity.control = false;
                }
            });
        }
        if (eventData.note === 42){
            myEntities.forEach(function(entity, index){
                if (index === 2){
                    entity.control = true;
                } else {
                    entity.control = false;
                }
            });
        }
        if (eventData.note === 43){
            myEntities.forEach(function(entity, index){
                if (index === 3){
                    entity.control = true;
                } else {
                    entity.control = false;
                }
            });
        }
        if (eventData.note === 36){
            myEntities.forEach(function(entity, index){
                entity.control = true;
            });
        }
        if (eventData.note === 37){
            myEntities.forEach(function(entity, index){
                if (index % 2 === 0){
                    entity.control = true;
                } else {
                    entity.control = false;
                }
            });
        }
        if (eventData.note === 38){
            myEntities.forEach(function(entity, index){
                if (index % 2 === 0){
                    entity.control = false;
                } else {
                    entity.control = true;
                }
            });
        }
        if (eventData.note === 39){
            myEntities.forEach(function(entity){
                var oldIntensity = entity.controlProps.intensity;
                entity.controlProps.intensity = 0;
                Entities.editEntity(entity.entityID, {"intensity": entity.controlProps.intensity});
                Script.setTimeout(function(){
                    Entities.editEntity(entity.entityID, {"intensity": oldIntensity});
                }, 50);
                entity.controlProps.intensity = oldIntensity;
            });
        }


        // entityList = getEntityIds(500);
        // eventManipulate(entityList, eventData);
    }
}
Midi.midiMessage.connect(midiMessageReceived);
