//
//  FlockOfFish.js
//  marketplace
//
//  Philip Rosedale
//  Modified by Cain Kilgore
//  Copyright 2017 High Fidelity, Inc.
//  Fish smimming around in a space in front of you in an aquarium
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function() { // BEGIN LOCAL_SCOPE

    var APP_NAME = "FISHTANK";
    var APP_URL = 'https://s3.us-east-2.amazonaws.com/hifi-fishtank/fishTankUI.html'
    var buttonActivated = false;
    var ICONS = {
        icon: "http://mpassets.highfidelity.com/4535b57c-f35a-4d9d-a3ee-1233c457dc8e-v1/fish-i.svg",
        activeIcon: "http://mpassets.highfidelity.com/4535b57c-f35a-4d9d-a3ee-1233c457dc8e-v1/fish-a.svg"
    };


    var fishConfig = Script.require(Script.resolvePath('fishDefault.json?v=' + Date.now()));

    function makeCopy(originalObj) {
        var newObj = {};
        for (var key in originalObj) {
            if (originalObj.hasOwnProperty(key)){
                newObj[key] = originalObj[key];
            }
        }
        return newObj;
    }

    var backupFish = makeCopy(fishConfig);

    var fishLoaded = false;
    var fish = [];

    var aquariumModel = null;

    var lowerCorner = { x: 0, y: 0, z: 0 };
    var upperCorner = { x: 0, y: 0, z: 0 };
    var center = { x: 0, y: 0, z: 0 };
    var initialAvatarPosition = null;
    var initialAvatarOrientation = null;

    var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");

    var button = tablet.addButton({
        icon: ICONS.icon,
        activeIcon: ICONS.activeIcon,
        text: APP_NAME,
        sortOrder: 1
    });

    function onClicked() {
        if (buttonActivated) {
            cleanupFish();
            button.editProperties({isActive: false});
            buttonActivated = false;
            tablet.gotoHomeScreen();
            tablet.webEventReceived.disconnect(onWebEventReceived);
            Script.update.disconnect(updateFish);
            fishLoaded = false;
        } else {
            if (!initialAvatarPosition) initialAvatarPosition = MyAvatar.position;
            if (!initialAvatarOrientation) initialAvatarOrientation = MyAvatar.orientation;
            tablet.gotoWebScreen(APP_URL);
            tablet.webEventReceived.connect(onWebEventReceived);
            Script.update.connect(updateFish);
            button.editProperties({isActive: true});
            buttonActivated = true;
        }
    }

    button.clicked.connect(onClicked);

    function onWebEventReceived(event) {
        var htmlEvent = JSON.parse(event);
        switch (htmlEvent.type){
            case 'slider':
                fishConfig[htmlEvent.id].val = htmlEvent.value;
                if (htmlEvent.reset === true) {
                    cleanupFish();
                    fishLoaded = false;
                }
                break;
            case 'reset':
                initialAvatarPosition = MyAvatar.position;
                initialAvatarOrientation = MyAvatar.orientation;
                fishConfig = makeCopy(backupFish);
                fishLoaded = false;
                cleanupFish();
                break;
            default:
        }
        print(JSON.stringify(htmlEvent));
    }

    function updateFish(deltaTime) {
        if (!Entities.serversExist() || !Entities.canRez()) {
            return;
        }
        if (!fishLoaded) {
            setBounds();

            aquariumModel = Entities.addEntity({
                name: 'aquariumModel',
                dimensions: { x: fishConfig.tankLength.val, y: fishConfig.tankHeight.val, z: fishConfig.tankWidth.val },
                type: 'Model',
                position: { x: center.x, y: center.y, z: center.z },
                modelURL: 'http://mpassets.highfidelity.com/4535b57c-f35a-4d9d-a3ee-1233c457dc8e-v1/aquarium.fbx',
                shapeType: 'box'
            });

            fish = loadFish(fishConfig.numFish.val);
            fishLoaded = true;
            return;

        }

        var averageVelocity = { x: 0, y: 0, z: 0 };
        var averagePosition = { x: 0, y: 0, z: 0 };

        // First pre-load an array with properties  on all the other fish so our per-fish loop
        // isn't doing it.
        var flockProperties = [];
        for (var i = 0; i < fish.length; i++) {
            var otherProps = Entities.getEntityProperties(fish[i].entityId, ["position", "velocity", "rotation"]);
            flockProperties.push(otherProps);
        }

        for (var i = 0; i < fish.length; i++) {
            if (fish[i].entityId) {
                // Get only the properties we need, because that is faster
                var properties = flockProperties[i];
                //  If fish has been deleted, bail
                if (properties.id !== fish[i].entityId) {
                    fish[i].entityId = false;
                    return;
                }

                // Store old values so we can check if they have changed enough to update
                var velocity = { x: properties.velocity.x, y: properties.velocity.y, z: properties.velocity.z };
                var position = { x: properties.position.x, y: properties.position.y, z: properties.position.z };
                averageVelocity = { x: 0, y: 0, z: 0 };
                averagePosition = { x: 0, y: 0, z: 0 };

                var othersCounted = 0;
                for (var j = 0; j < fish.length; j++) {
                    if (i !== j) {
                        // Get only the properties we need, because that is faster
                        var otherProps = flockProperties[j];
                        var separation = Vec3.distance(properties.position, otherProps.position);
                        if (separation < fishConfig.maxSightDistance.val) {
                            averageVelocity = Vec3.sum(averageVelocity, otherProps.velocity);
                            averagePosition = Vec3.sum(averagePosition, otherProps.position);
                            othersCounted++;
                        }
                        if (separation < fishConfig.minSeparation.val) {
                            var pushAway = Vec3.multiply(Vec3.normalize(Vec3.subtract(properties.position, otherProps.position)), fishConfig.avoidanceForce.val);
                            velocity = Vec3.sum(velocity, pushAway);
                        }
                    }
                }

                if (othersCounted > 0) {
                    // print("Others counted");
                    averageVelocity = Vec3.multiply(averageVelocity, 1.0 / othersCounted);
                    averagePosition = Vec3.multiply(averagePosition, 1.0 / othersCounted);
                    //  Alignment: Follow group's direction and speed
                    velocity = Vec3.mix(
                        velocity,
                        Vec3.multiply(Vec3.normalize(averageVelocity), Vec3.length(velocity)),
                        fishConfig.alignmentForce.val
                    );
                    // Cohesion: Steer towards center of flock
                    var towardCenter = Vec3.subtract(averagePosition, position);
                    velocity = Vec3.mix(
                        velocity,
                        Vec3.multiply(Vec3.normalize(towardCenter), Vec3.length(velocity)),
                        fishConfig.cohesionForce.val
                    );
                }

                //  Try to swim at a constant speed
                velocity = Vec3.mix(
                    velocity,
                    Vec3.multiply(Vec3.normalize(velocity), fishConfig.swimmingSpeed.val),
                    fishConfig.swimmingForce.val
                );

                //  Keep fish in their 'tank'

                if (position.x - fishConfig.fishMarginFromTankWall.val < lowerCorner.x) {
                    position.x = lowerCorner.x + fishConfig.fishMarginFromTankWall.val;
                    velocity.x *= -1.0;
                } else if (position.x + fishConfig.fishMarginFromTankWall.val > upperCorner.x) {
                    position.x = upperCorner.x - fishConfig.fishMarginFromTankWall.val;
                    velocity.x *= -1.0;
                }
                if (position.y - fishConfig.fishMarginFromTankWall.val < lowerCorner.y) {
                    position.y = lowerCorner.y + fishConfig.fishMarginFromTankWall.val;
                    velocity.y *= -1.0;
                } else if (position.y + fishConfig.fishMarginFromTankWall.val > upperCorner.y) {
                    position.y = upperCorner.y - fishConfig.fishMarginFromTankWall.val;
                    velocity.y *= -1.0;
                }
                if (position.z - fishConfig.fishMarginFromTankWall.val < lowerCorner.z) {
                    position.z = lowerCorner.z + fishConfig.fishMarginFromTankWall.val;
                    velocity.z *= -1.0;
                } else if (position.z + fishConfig.fishMarginFromTankWall.val > upperCorner.z) {
                    position.z = upperCorner.z - fishConfig.fishMarginFromTankWall.val;
                    velocity.z *= -1.0;
                }

                //  Orient in direction of velocity
                var rotation = Quat.rotationBetween(Vec3.UNIT_NEG_Z, velocity);
                // print("properties.position: ", JSON.stringify(properties.position));
                // print("position: ", JSON.stringify(position));
                // print("fishConfig.minPositionChangeForUpdate.val: ", fishConfig.minPositionChangeForUpdate.val);

                //  Only update properties if they have changed, to save bandwidth
                if (Vec3.distance(properties.position, position) < fishConfig.minPositionChangeForUpdate.val) {
                    // print("not updated");
                    Entities.editEntity(fish[i].entityId, {
                        velocity: velocity,
                        rotation: Quat.mix(properties.rotation, rotation, fishConfig.velocityFollowRate.val) });
                } else {
                    // print("updated");
                    Entities.editEntity(fish[i].entityId, {
                        position: position,
                        velocity: velocity,
                        rotation: Quat.slerp(properties.rotation, rotation, fishConfig.velocityFollowRate.val) });
                }
            }
        }
    }

    Script.scriptEnding.connect(function() {
        cleanupFish();
        button.clicked.disconnect(onClicked);
        tablet.removeButton(button);
    });

    function cleanupFish() {
        // Delete all of the fish
        for (var i = 0; i < fish.length; i++) {
            Entities.deleteEntity(fish[i].entityId);
        }
        checkEntities.forEach(function(ent){
            Entities.deleteEntity(ent);
        });
        // Delete the Aquarium
        Entities.deleteEntity(aquariumModel);
    }

    var lowerCornerEntity;
    var upperCornerEntity;
    var centerEntity;
    var checkEntities = [];

    function setBounds() {
        center = Vec3.sum(initialAvatarPosition, Vec3.multiply(Quat.getFront(initialAvatarOrientation), 2 * fishConfig.initDistance.val));
        lowerCorner = {
            x: center.x - fishConfig.tankLength.val / 2,
            y: center.y - fishConfig.tankHeight.val / 2,
            z: center.z - fishConfig.tankWidth.val / 2
        };
        upperCorner = {
            x: center.x + fishConfig.tankLength.val / 2,
            y: center.y + fishConfig.tankHeight.val / 2,
            z: center.z + fishConfig.tankWidth.val / 2
        };
        // uncomment to test bounds
        // lowerCornerEntity = Entities.addEntity({ type: "Box", name: "_lower-corner", position: lowerCorner });
        // upperCornerEntity = Entities.addEntity({ type: "Box", name: "_higher-corner", position: upperCorner });
        // centerEntity = Entities.addEntity({ type: "Box", name: "_center", position: center});
        // checkEntities.push(lowerCornerEntity, upperCornerEntity, centerEntity);
    }

    function loadFish(howMany) {
        var fish = [];
        for (var i = 0; i < howMany; i++) {
            var position = {
                x: lowerCorner.x + (upperCorner.x - lowerCorner.x) / 2.0 + (Math.random() - 0.5) * (upperCorner.x - lowerCorner.x) * fishConfig.startingFraction.val,
                y: lowerCorner.y + (upperCorner.y - lowerCorner.y) / 2.0 + (Math.random() - 0.5) * (upperCorner.y - lowerCorner.y) * fishConfig.startingFraction.val,
                z: lowerCorner.z + (upperCorner.z - lowerCorner.z) / 2.0 + (Math.random() - 0.5) * (upperCorner.z - lowerCorner.z) * fishConfig.startingFraction.val
            };

            fish.push({
                entityId: Entities.addEntity({
                    type: "Model",
                    position: position,
                    rotation: { x: 0, y: 0, z: 0, w: 1 },
                    dimensions: {
                        x: fishConfig.fishWidth.val,
                        y: fishConfig.fishWidth.val,
                        z: fishConfig.fishLength.val },
                    velocity: {
                        x: fishConfig.swimmingSpeed.val,
                        y: fishConfig.swimmingSpeed.val,
                        z: fishConfig.swimmingSpeed.val },
                    damping: 0.0,
                    dynamic: false,
                    modelURL: "http://mpassets.highfidelity.com/4535b57c-f35a-4d9d-a3ee-1233c457dc8e-v1/goldfish.fbx",
                    shapeType: "sphere"
                })
            });
        }
        return fish;
    }
}());
