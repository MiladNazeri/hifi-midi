//
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

var lifetime = -1;
var sizeFactor = 1.5;
var userData;
var colorFrequency = 0.5;


var wantDynamic= false;

var speed1 = 8;
var pitch1 = 0;
var yaw1 = 0;
var roll1 = 0;
var cutoff1 = 0;
var exponent1 = 0;
var falloffRadius1 = 0;
var red1 = 0;
var green1 = 0;
var blue1 = 0;
var light1;
var box1;

// LaunchPad *******************************************
var xbuttons = 2;
var ybuttons = 2;
var offset = 1.05 * sizeFactor; //
var buttonXSize = 1 * sizeFactor;
var buttonYSize = 0.025 * sizeFactor;
var buttonZSize = 1 * sizeFactor;
// Options **********************************************
var wantLocal = false;
var wantCollisionless = false;
var wantDynamic = false;
var wantUserData = false; // Adds Tim's Shader


// Entity Manager ****************************************************************
var props;
var myEntities = [];
var entityIDs = [];
var allUuidTargets = [];
var target = "Spot Light Emitter";
var uuidTarget = Uuid.generate();
var wantDebug = true;
var particles = [];


// FLOOR Entity Manager ****************************************************************
var floor_props;
var floor_myEntities = [];
var floor_entityIDs = [];
var floor_allUuidTargets = [];
var floor_target = "Dance Tile";

var position1 = {
    x: 4.5,
    y: -0.7,
    z: 30.9
};
var position2 = {
    x: 15.7,
    y: -0.7,
    z: 25.8
};
var position3 = {
    x: 12.7,
    y: -0.7,
    z: 34.0
};
var position4 = {
    x: 8.0,
    y: 0.7,
    z: 22.5
};

var positionXHigh = Math.max(position1.x, position2.x, position3.x, position4.x);
var positionXLow = Math.min(position1.x, position2.x, position3.x, position4.x);
var positionZHigh = Math.max(position1.z, position2.z, position3.z, position4.z);
var positionZLow = Math.min(position1.z, position2.z, position3.z, position4.z);;


var positionXOffset = ((positionXHigh - positionXLow) / 2) + positionXLow;
var positionZOffset = ((positionZHigh - positionZLow) / 2) + positionZLow;

/*
function danceFloor(params) {
    var pos = Vec3.sum(
        MyAvatar.position,
        Vec3.multiplyQbyV(MyAvatar.orientation, { x: 0, y: -1, z: -2 })
    );
    log("log", pos);
    var prevEntityID = null;
    var buttons = 0;
    var dance = -1;
    for (var i = 0; i < ybuttons; i++) {
        for (var j = 0; j > -xbuttons; j--) {
            buttons++;
            print("animationMap.length", animationMap.length);
            if (dance < animationMap.length - 1) {
                dance++;
            } else {
                dance = 1;
            }
            print(dance);
            // ______________________________________________________________________________________
            userData = {
                ProceduralEntity: {
                    version: 2,
                    shaderUrl:
                        "http://192.241.189.145:8083/hifi/mat_shiny.fs?1488780575304",
                    channels: null,
                    uniforms: {
                        specular_intensity: 0.8,
                        specular_hardness: 380,
                        diffuse_color: [
                            Math.sin(colorFrequency * (i + j) + 0),
                            Math.sin(
                                colorFrequency * (i + j) + 2 * Math.PI / 3
                            ),
                            Math.sin(colorFrequency * (i + j) + 4 * Math.PI / 3)
                        ],
                        emit: -10,
                        iSpeed: Math.random() / 4,
                        hide: [0.0, 0.0, 0.0],
                        specular_color: [
                            Math.sin(colorFrequency * (i + j) + 0),
                            Math.sin(
                                colorFrequency * (i + j) + 2 * Math.PI / 3
                            ),
                            Math.sin(colorFrequency * (i + j) + 4 * Math.PI / 3)
                        ]
                    }
                },
                grabbableKey: {
                    cloneable: false,
                    kinematic: false,
                    grabbable: false
                }
            };
            // ______________________________________________________________________________________
            if (!wantUserData) {
                userData = {
                    grabbableKey: {
                        cloneable: false,
                        kinematic: false,
                        grabbable: false
                    }
                };
            }

            var newID = Entities.addEntity(
                {
                    name: "Dance Tile " + buttons,
                    description: buttons,
                    type: "Box",
                    color: {
                        blue: Math.round(
                            Math.sin(colorFrequency * i + j + 0) * 127
                        ),
                        green: Math.round(
                            Math.sin(colorFrequency * i + j + 1 * Math.PI / 3) *
                                127
                        ),
                        red: Math.round(
                            Math.sin(colorFrequency * i + j + 2 * Math.PI / 3) *
                                127
                        )
                    },
                    dimensions: {
                        x: buttonXSize,
                        y: buttonYSize,
                        z: buttonZSize
                    },
                    position: Vec3.sum(pos, {
                        x: offset * j,
                        z: offset * i,
                        y: 0
                    }),
                    dynamic: wantDynamic,
                    collisionless: wantCollisionless,
                    gravity: { x: 0, y: -9, z: 0 },
                    lifetime: lifetime,
                    userData: JSON.stringify(userData)
                },
                wantLocal
            );

        }
    }
}
*/

function log(describer, text){
    text = text || '';
    print('&======');
    print(describer + ": ");
    print(JSON.stringify(text));
    print('======&');
}
function printDebug(message) {
    if (wantDebug) {
        print(message);
    }
}

function getMyEntities(myEntities){
    entityIDs = Entities.findEntities(MyAvatar.position, 1000);
    for (var i = 0; i < entityIDs.length; i++){
        props = Entities.getEntityProperties(entityIDs[i]);
        if (props.name.indexOf(target) !== -1
            || props.name.indexOf(uuidTarget) !== -1) {
            myEntities.push({name:props.name, entityID:entityIDs[i]});
        };
    };
}

function listMyEntities(myEntities){
    print("Listing: " + myEntities.length);
    for (var i = 0; i < myEntities.length; i++) {
        print(myEntities[i].name + " " + myEntities[i].entityID);
    };
}

function deleteMyEntities(myEntities){
    printDebug("Deleting: " + myEntities.length);
    for (var i = 0; i < myEntities.length; i++) {
        printDebug(myEntities[i].name + " " + myEntities[i].entityID);
        Entities.deleteEntity(myEntities[i].entityID);
    };
}

function MyIdentifier(myEntity){
    return myEntity = myEntity+" "+uuidTarget;
}

function newUuidTarget(){
    allUuidTargets.push(uuidTarget);
    uuidTarget = Uuid.generate();
}

//********************************************************************************

function lightSource(){
	print("Creating Spotlight");
    // var pos = {x:positionXOffset,y:1.5,z:positionZOffset}
    var ambLight = {x:positionXOffset,y:0.5,z:positionZOffset}
	var pos = Vec3.sum(MyAvatar.position, Vec3.multiplyQbyV(MyAvatar.orientation, {x: 0, y: 2, z: -2}));

	box1 = Entities.addEntity({
		name: "Spot Light Box 1",
		description: "",
		type: "Box",
		position: pos,
		//rotation: ,
		dimensions: {
			x: .5,
			y: .5,
			z: .5
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
  	  	friction: 0,
		color:{red: 100,
			blue: 0,
			green: 0
		},
	});

	light1 = Entities.addEntity({
		name: "Spot Light Emitter 1",
		description: "",
		type: "Light",
		position: pos,
		rotation: Quat.fromPitchYawRollDegrees(90,0,0),
		dimensions: {
			x: .1,
			y: 100,
			z: .1
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
		color:{red: 255,
			blue: 255,
			green: 255
		},
		intensity: 1000,
		falloffRadius: 0,
		isSpotlight: 1,
        exponent: 1,
        cutoff: 10,
		parentID: box1
	});

	light2 = Entities.addEntity({
		name: "Spot Light Emitter 2",
		description: "",
		type: "Light",
		position: pos,
		rotation: Quat.fromPitchYawRollDegrees(-90,0,0),
		dimensions: {
			x: .1,
			y: 100,
			z: .1
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
		color:{red: 255,
			blue: 255,
			green: 255
		},
		intensity: 1000,
		falloffRadius: 0,
		isSpotlight: 1,
        exponent: 1,
        cutoff: 10,
		parentID: box1
	});

	light3 = Entities.addEntity({
		name: "Spot Light Emitter 3",
		description: "",
		type: "Light",
		position: pos,
		rotation: Quat.fromPitchYawRollDegrees(0,90,0),
		dimensions: {
			x: .1,
			y: 100,
			z: .1
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
		color:{red: 255,
			blue: 255,
			green: 255
		},
		intensity: 1000,
		falloffRadius: 0,
		isSpotlight: 1,
        exponent: 1,
        cutoff: 10,
		parentID: box1
	});

	light4 = Entities.addEntity({
		name: "Spot Light Emitter 4",
		description: "",
		type: "Light",
		position: pos,
		rotation: Quat.fromPitchYawRollDegrees(0,-90,0),
		dimensions: {
			x: .1,
			y: 100,
			z: .1
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
		color:{red: 255,
			blue: 255,
			green: 255
		},
		intensity: 1000,
		falloffRadius: 0,
		isSpotlight: 1,
        exponent: 1,
        cutoff: 10,
		parentID: box1
	});

	light5 = Entities.addEntity({
		name: "Spot Light Emitter 5",
		description: "",
		type: "Light",
		position: pos,
		rotation: Quat.fromPitchYawRollDegrees(0,0,90),
		dimensions: {
			x: .1,
			y: 100,
			z: .1
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
		color:{red: 255,
			blue: 255,
			green: 255
		},
		intensity: 1000,
		falloffRadius: 0,
		isSpotlight: 1,
        exponent: 1,
        cutoff: 10,
		parentID: box1
	});

	light6 = Entities.addEntity({
		name: "Spot Light Emitter 6",
		description: "",
		type: "Light",
		position: pos,
		rotation: Quat.fromPitchYawRollDegrees(180,0,0),
		dimensions: {
			x: .1,
			y: 100,
			z: .1
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
		color:{red: 255,
			blue: 255,
			green: 255
		},
		intensity: 1000,
		falloffRadius: 0,
		isSpotlight: 1,
        exponent: 1,
        cutoff: 10,
		parentID: box1
	});

    light7 = Entities.addEntity({
		name: "Amb Light Emitter 7",
		description: "",
		type: "Light",
		position: ambLight,
		rotation: Quat.fromPitchYawRollDegrees(180,0,0),
		dimensions: {
			x: .1,
			y: 100,
			z: .1
		},
		//registration:,
  	  	dynamic: wantDynamic,
  	  	gravity: {x:0, y:-2, z:0},
  	  	angularDamping: 0,
		color:{red: 255,
			blue: 255,
			green: 255
		},
		intensity: 150,
		falloffRadius: 0,
		isSpotlight: 0,
        exponent: 1,
        cutoff: 10,
		parentID: box1
	});
}
// function getParticles(){
//     entityIDs = Entities.findEntities(MyAvatar.position, 1000);
//     for (var i = 0; i < entityIDs.length; i++){
//         props = Entities.getEntityProperties(entityIDs[i]);
//         if (props.name.indexOf("midi-particle") !== -1) {
//             particles.push({name:props.name, entityID:entityIDs[i]});
//         };
//     };
//     log("e",particles);
// }
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
function logProps(id){
    var props = Entities.getEntityProperties(id);
    log(props.name, props);
}
function midiEventReceived(eventData) {
    // log("eventData",  eventData);
    // print("MatchedKey: " + matchNoteToKey(eventData.note))
	// if (eventData.device != midiInDeviceId || eventData.channel != midiChannel ){
	// 	return;
	// }


// Light 1 Speed
    if (eventData.note == novationMap.knob_1){
    	speed1 = eventData.velocity/2;
	}


// Light 1 Pitch
    if (eventData.note == novationMap.knob_2){
    	//pitch = (eventData.velocity -64) * speed;
    	//pitch = lerp (0,127,0,360,eventData.velocity);
    	pitch1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
		//var newRotation = Quat.fromPitchYawRollDegrees(pitch, yaw , roll);
		Entities.editEntity(box1,{
			//rotation: newRotation
			angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
		})
	}

// Light 1 Yaw
    if (eventData.note == novationMap.knob_3){
		//yaw = (eventData.velocity -64) * speed;
    	//yaw = lerp (0,127,0,360,eventData.velocity);
    	yaw1 = lerp (0,127,0,speed1,eventData.velocity)-speed1/2;
		//var newRotation = Quat.fromPitchYawRollDegrees(pitch, yaw , roll);
		Entities.editEntity(box1,{
			//rotation: newRotation
			angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
		})
	}

// Light 1 Roll
    if (eventData.note == novationMap.knob_4){
    	//roll = (eventData.velocity -64) * speed;
    	//roll = lerp (0,127,0,360,eventData.velocity);
    	roll1 = lerp (0,127,0,speed1,eventData.velocity) -speed1/2;
		//var newRotation = Quat.fromPitchYawRollDegrees(pitch, yaw , roll);
		Entities.editEntity(box1,{
			//rotation: newRotation
			angularVelocity: {x:pitch1, y:yaw1 , z: roll1}
		})
	}

//-----------------------------------------------------------------
// Light 1 Fall Off Radius
    if (eventData.note == novationMap.knob_5){
    	falloffRadius1 = lerp (0,127,0,10,eventData.velocity);
		Entities.editEntity(light1,{
			falloffRadius: falloffRadius1
		})
		Entities.editEntity(light2,{
			falloffRadius: falloffRadius1
		})
		Entities.editEntity(light3,{
			falloffRadius: falloffRadius1
		})
		Entities.editEntity(light4,{
			falloffRadius: falloffRadius1
		})
		Entities.editEntity(light5,{
			falloffRadius: falloffRadius1
		})
		Entities.editEntity(light6,{
			falloffRadius: falloffRadius1
		})
        // Entities.editEntity(light7,{
        //     falloffRadius: falloffRadius1
        // })
	}


// Light 1 exponent
    if (eventData.note == novationMap.circle_up){
        circleValueEdit(5, 'up');
    	exponent1 = lerp (0,127,0,255,circleValue);
		Entities.editEntity(light1,{
			exponent: exponent1
		})
		Entities.editEntity(light2,{
			exponent: exponent1
		})
		Entities.editEntity(light3,{
			exponent: exponent1
		})
		Entities.editEntity(light4,{
			exponent: exponent1
		})
		Entities.editEntity(light5,{
			exponent: exponent1
		})
		Entities.editEntity(light6,{
			exponent: exponent1
		})
        log("exponent1",exponent1);
        // Entities.editEntity(light7,{
        //     exponent: exponent1
        // })
        // logProps(light1);
	}
    // Light 1 exponent
    if (eventData.note == novationMap.circle_down){
        circleValueEdit(5, 'down');
    	exponent1 = lerp (0,127,0,255,circleValue);
		Entities.editEntity(light1,{
			exponent: exponent1
		})
		Entities.editEntity(light2,{
			exponent: exponent1
		})
		Entities.editEntity(light3,{
			exponent: exponent1
		})
		Entities.editEntity(light4,{
			exponent: exponent1
		})
		Entities.editEntity(light5,{
			exponent: exponent1
		})
		Entities.editEntity(light6,{
			exponent: exponent1
		})
        Entities.editEntity(light7,{
            exponent: exponent1
        })
        // logProps(light1);
	}

// Light 1 cutoff
    if (eventData.note == novationMap.up){
        directionValueEdit(10, 'up');
    	cutoff1 = lerp (0,127,0,64,directionValue);
		Entities.editEntity(light1,{
			cutoff: cutoff1
		})
		Entities.editEntity(light2,{
			cutoff: cutoff1
		})
		Entities.editEntity(light3,{
			cutoff: cutoff1
		})
		Entities.editEntity(light4,{
			cutoff: cutoff1
		})
		Entities.editEntity(light5,{
			cutoff: cutoff1
		})
		Entities.editEntity(light6,{
			cutoff: cutoff1
		})
        Entities.editEntity(light7,{
            cutoff: cutoff1
        })

	}
    if (eventData.note == novationMap.down){
        directionValueEdit(10, 'down');
    	cutoff1 = lerp (0,127,0,64,directionValue);
		Entities.editEntity(light1,{
			cutoff: cutoff1
		})
		Entities.editEntity(light2,{
			cutoff: cutoff1
		})
		Entities.editEntity(light3,{
			cutoff: cutoff1
		})
		Entities.editEntity(light4,{
			cutoff: cutoff1
		})
		Entities.editEntity(light5,{
			cutoff: cutoff1
		})
		Entities.editEntity(light6,{
			cutoff: cutoff1
		})
        Entities.editEntity(light7,{
            cutoff: cutoff1
        })
        // logProps(light1);
	}


// Light 1 Red
    if (eventData.note == novationMap.knob_6){
    	red1 = lerp (0,127,0,255,eventData.velocity);
		Entities.editEntity(light1,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light2,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light3,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light4,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light5,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light6,{
			color: {red: red1, green: green1, blue: blue1}
		});
        Entities.editEntity(light7,{
            color: {red: blue1, green: green1, blue: red1} });
		Entities.editEntity(box1,{
			color: {red: red1, green: green1, blue: blue1}
		});
	}

// Light 1 green
    if (eventData.note == novationMap.knob_7){
    	green1 = lerp (0,127,0,255,eventData.velocity);
		Entities.editEntity(light1,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light2,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light3,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light4,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light5,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light6,{
			color: {red: red1, green: green1, blue: blue1}
		});
        Entities.editEntity(light7,{
            color: {red: blue1, green: green1, blue: red1}
        });
		Entities.editEntity(box1,{
			color: {red: blue1, green: green1, blue: red1}
		});
	}

// intensity
    if (eventData.note == novationMap.track_left){
        trackValueEdit(5, 'down');
    	intensity = lerp (0,127,0,200,trackValue);
        intensityAmb = lerp (0,127,0,150,trackValue);
		Entities.editEntity(light1,{
			intensity: intensity
		})
		Entities.editEntity(light2,{
			intensity: intensity
		})
		Entities.editEntity(light3,{
			intensity: intensity
		})
		Entities.editEntity(light4,{
			intensity: intensity
		})
		Entities.editEntity(light5,{
			intensity: intensity
		})
		Entities.editEntity(light6,{
            intensity: intensity
		})
        Entities.editEntity(light7,{
            intensity: intensityAmb
        })
    }
    if (eventData.note == novationMap.track_right){
        trackValueEdit(5, 'up');
        intensity = lerp (0,127,0,1000,trackValue);
        intensityAmb = lerp (0,127,0,150,trackValue);
        Entities.editEntity(light1,{
            intensity: intensity
        })
        Entities.editEntity(light2,{
            intensity: intensity
        })
        Entities.editEntity(light3,{
            intensity: intensity
        })
        Entities.editEntity(light4,{
            intensity: intensity
        })
        Entities.editEntity(light5,{
            intensity: intensity
        })
        Entities.editEntity(light6,{
            intensity: intensity
        })
        Entities.editEntity(light7,{
            intensity: intensityAmb
        })
    }

// Light 1 blue
    if (eventData.note == novationMap.knob_8){
    	blue1 = lerp (0,127,0,255,eventData.velocity);
		Entities.editEntity(light1,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light2,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light3,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light4,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light5,{
			color: {red: red1, green: green1, blue: blue1}
		});
		Entities.editEntity(light6,{
			color: {red: red1, green: green1, blue: blue1}
		});
        Entities.editEntity(light7,{
            color: {red: blue1, green: green1, blue: red1}
        });
		Entities.editEntity(box1,{ color: {red: red1, green: green1, blue: blue1}
		});
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
    listMidiInputs();
    listMidiOutputs();
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
	Entities.deleteEntity(light1);
	Entities.deleteEntity(light2);
	Entities.deleteEntity(light3);
	Entities.deleteEntity(light4);
	Entities.deleteEntity(light5);
	Entities.deleteEntity(light6);
    Entities.deleteEntity(light7);
    Entities.deleteEntity(box1);
}

midiConfig();
lightSource();
//getMyEntities();

//Midi.midiNote.connect(midiEventReceived);
Midi.midiReset.connect(midiHardwareResetReceieved);
Midi.midiMessage.connect(midiEventReceived);
Script.scriptEnding.connect(scriptEnding);
