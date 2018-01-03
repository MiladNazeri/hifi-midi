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

/* Tablet */

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

function makeLerpVector(scalar){
    var vec = makeVec3(
        lerp(1, 127, 1, 3, scalar),
        lerp(1, 127, 1, 3, scalar),
        lerp(1, 127, 1, 3, scalar) );
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
    return vec; }

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
                // 'dimensions', Vec3.sum(currentProps[index].dimensions, makeLerpVector(eventData.velocity)) ] ]; });
                'dimensions', makeLerpVector(eventData.velocity) ],
                'dimensions', makeLerpVector(eventData.velocity) ]; });

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

function midiMessageReceived(eventData){
    // console.log("here")
    // log('eventData', eventData);
    if (bounceCheckStart(17)) {
        entityList = getEntityIds(500);
        eventManipulate(entityList, eventData); } }

Midi.midiMessage.connect(midiMessageReceived);


/* Cleanup */

function scriptEnding() {
    // Entities.deleteEntity(GenericEntity);
    // Controller.disableMapping(MAPPING_NAME);
    // Messages.unsubscribe(CHANNEL_NAME);
    button.clicked.disconnect(onClicked);
    Midi.midiMessage.disconnect(midiMessageReceived);
    tablet.removeButton(button); }

Script.scriptEnding.connect(scriptEnding);
