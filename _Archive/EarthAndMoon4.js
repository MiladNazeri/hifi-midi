//  solarsystem.js
//  example
//
//  Created by Bridget Went, 5/28/15.
//  Copyright 2015 High Fidelity, Inc.
//
//  A project to build a virtual physics classroom to simulate the solar system, gravity, and orbital physics.
//
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
var planetConfig =
        Script.require(Script.resolvePath('Tablet/planetDefault.json?v=' + Date.now()));

var theEarth;
var theMoon;

var center =
        {   x: 0,
            y: 0,
            z: 0 };

var APP_URL =
        Script.resolvePath('Tablet/planetUI.html');
var buttonActivated =
        false;
var tablet =
        Tablet.getTablet("com.highfidelity.interface.tablet.system");

var button =
        tablet.addButton({
        // icon: ICONS.icon,
        // activeIcon: ICONS.activeIcon,
        text: 'planet',
        sortOrder: 1 });

function onClicked() {
    if (buttonActivated) {
        button.editProperties({isActive: false});
        buttonActivated = false;
        tablet.gotoHomeScreen();
        tablet.webEventReceived.disconnect(onWebEventReceived); }
    else {
        tablet.gotoWebScreen(APP_URL);
        tablet.webEventReceived.connect(onWebEventReceived);
        button.editProperties({isActive: true});
        buttonActivated = true; }
}
button.clicked.connect(onClicked);

function onWebEventReceived(event) {
    var htmlEvent = JSON.parse(event);
    switch (htmlEvent.type){
        case 'slider':
            planetConfig[htmlEvent.id].val = htmlEvent.value;
            restart();
            break;
        default: }
    // print(JSON.stringify(htmlEvent));
}

function getGravity(){
    return (Math.pow(planetConfig.referenceRadius.val, 3.0) /
    Math.pow((planetConfig.referencePeriod.val / (2.0 * Math.PI)), 2.0)) /
        planetConfig.LARGE_BODY_MASS.val;
}
function makeEarth(){
    if (theEarth) {
        Entities.deleteEntity(theEarth);
        theEarth =
            null;
    }
    Entities.addEntity({
        type: "Model",
        modelURL: Script.resolvePath("Earth/earth.obj"),
        position: center,
        dimensions: {
            x: planetConfig.EARTH_SIZE.val,
            y: planetConfig.EARTH_SIZE.val,
            z: planetConfig.EARTH_SIZE.val },
        angularVelocity: {
            x: 0.0,
            y: 0.1,
            z: 0.0 },
        angularDamping: planetConfig.DAMPING.val,
        damping: planetConfig.DAMPING.val,
        ignoreCollisions: false,
        dynamic: false });
}
function makeMoon(){
    if (theMoon) {
        Entities.deleteEntity(theMoon);
        theMoon =
            null; }
    theMoon =
        new Moon(planetConfig.MOON_SCALE.val, planetConfig.MOON_RADIUS.val);
}
function restart(){
    makeEarth();
    makeMoon();
}
function Moon(radiusScale, sizeScale) {
    this.radius =
        radiusScale * planetConfig.referenceRadius.val;
    this.position =
        Vec3.sum(center, {
            x: this.radius,
            y: 0.0,
            z: 0.0 });

    this.initialVelocity =
        Math.sqrt((getGravity() * planetConfig.LARGE_BODY_MASS.val) / this.radius);

    this.velocity =
        Vec3.multiply(this.initialVelocity, Vec3.normalize({
            x: 0,
            y: planetConfig.VELOCITY_OFFSET_Y.val,
            z: planetConfig.VELOCITY_OFFSET_Z.val }));
    this.dimensions =
        sizeScale * planetConfig.referenceDiameter.val;

    theMoon =
        Entities.addEntity({
            type: "Model",
            modelURL: Script.resolvePath("Moon/moon.FBX"),
            position: this.position,
            dimensions: {
                x: this.dimensions,
                y: this.dimensions,
                z: this.dimensions },
            velocity: this.velocity,
            angularDamping: planetConfig.DAMPING.val,
            damping: planetConfig.DAMPING.val,
            ignoreCollisions: false,
            dynamic: false, });

    this.computeAcceleration =
        function() {
        var acc =
            -(getGravity() * planetConfig.LARGE_BODY_MASS.val) * Math.pow(this.radius, (-2.0));
        return acc;
    };

    this.update =
        function(deltaTime) {
        var between =
            Vec3.subtract(this.position, center);
        var speed =
            this.computeAcceleration(this.radius) * deltaTime;
        var vel =
            Vec3.multiply(speed, Vec3.normalize(between));

        // Update velocity and position
        this.velocity =
            Vec3.sum(this.velocity, vel);
        this.position =
            Vec3.sum(this.position, Vec3.multiply(deltaTime, this.velocity));
        Entities.editEntity(this.moon, {
            velocity: this.velocity,
            position: this.position });
    };
}
function CreateSimulation() {
    MyAvatar.position =
        center;
    restart();
}

CreateSimulation();

function scriptEnding() {
    Entities.deleteEntity(theEarth);
    Entities.deleteEntity(theMoon);
    button.clicked.disconnect(onClicked);
    tablet.removeButton(button);
};

function update(deltaTime){
    theMoon.update(deltaTime);
}

Script.update.connect(update);
Script.scriptEnding.connect(scriptEnding);
