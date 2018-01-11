/* global Midi */
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

function op(accum, type, vel){
    switch (type){
        case '*':
            return accum * vel;
        case '%':
            return accum / vel;
        default:
            return; } }
// opArray = ['accum', 'type', vel]
function sinCosMaker(type, opArray, transformCallback){
    switch (type){
        case 'sin':
            return transformCallback(
                Math.sin(op(opArray[0], opArray[1], opArray[2])) );
        case 'cos':
            return transformCallback(
                Math.cos(op(opArray[0], opArray[1], opArray[2])) );
        default: } }

function makeProps(arrayProps){
    var props = {};
    // log('makeProps::in:arrayProps', arrayProps);
    arrayProps.forEach(function(prop){
        props[prop[0]] = prop[1]; });
    // log('makeProps::out:props', props);
    return props; }

function makeVec3(x,y,z){
    var obj = {
        "x": x,
        "y": y,
        "z": z };
    return obj; }

function entityManipulate(entityId, props){
    // log('entityManipulate::in:entityId', entityId);
    log('entityManipulate::in:props', props);
    var entProps = Entities.getEntityProperties(entityId);
    log('entityManipulate::entProps:pre', entProps,['position','dimensions']);
    Entities.editEntity(entityId, props);
    entProps = Entities.getEntityProperties(entityId);
    log('entityManipulate::entProps:post', entProps, ['position','dimensions']);

}

function allEntityManipulate(entityArray, propsArray){
    // log('entityArray', entityArray);
    // log('propsArray', propsArray);
    if (propsArray.length === 1) {
        entityArray.forEach(
            function(entity){
                entityManipulate(entity, propsArray[0]); }); }
    else {
        entityArray.forEach(
            function(entity, index){
                entityManipulate(entity, propsArray[index]); }); } }

// todo - make arrayPropsMaker?

function transformValue(scalar, transformFunction, offset){
    return function(sinValue){
        return transformFunction(sinValue, scalar, offset); }; }

function transformMultiply(sinValue, value, offset ){
    log('value', sinValue * value);
    return (sinValue * value) + offset; }

function transformDivide(sinValue, value, offset ){
    return (sinValue / value) + offset; }

function randomize(min,max){
    return Math.random() * (max - min) + min;
}

function eventManipulate(entityIds, eventData){
    var arrayProps = [
        [
            'dimensions', makeVec3(
                sinCosMaker('sin', [eventData.velocity, '*', 100], transformValue(1, transformMultiply, randomize(1,2))),
                0,
                sinCosMaker('cos', [eventData.velocity, '*', 100], transformValue(5, transformMultiply, randomize(1,2))) )],
        [
            'position', makeVec3(
                sinCosMaker('sin', [eventData.velocity, '*', 100], transformValue(5, transformMultiply, randomize(1,2))),
                0
                sinCosMaker('sin', [eventData.velocity, '*', 100], transformValue(5, transformMultiply, randomize(1,2))) )] ];

    allEntityManipulate(
        entityIds, [makeProps(arrayProps)] );
}

function getEntityIds(distance){
    return Entities.findEntities(MyAvatar.position, distance);
}

var counter = 0;
function midiMessageReceived(eventData){
    // console.log("here")
    // log('eventData', eventData);
    if (bounceCheckStart(100)) {
        entityList = getEntityIds(100);
        eventManipulate(entityList, eventData); } }

Midi.midiMessage.connect(midiMessageReceived);

function log(describer, text){
    text = text || '';
    print('&======');
    print(describer + ": ");
    print(JSON.stringify(text));
    print('======&');
}
