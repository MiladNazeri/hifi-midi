//
//  danceFloor.js
//
//  Created by Bruce Brown on 7/15/17.
//

var lifetime = -1;
var sizeFactor = 1.5;
var userData;
var colorFrequency = 0.5;

var wantAnimation = true;
var animFolder = "https://hifi-content.s3.amazonaws.com/wadewatts/Dance/";
var animationData = [];
/*
var animationMap = [
    {
        keyNote: 88,
        keyColor: 40,
        animURL: animFolder + "Swing Dancing 699.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 699
    },
    {
        keyNote: 87,
        keyColor: 40,
        animURL: animFolder + "Swing Dancing 156.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 156
    },
    {
        keyNote: 86,
        keyColor: 40,
        animURL: animFolder + "Swing Dancing 74.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 74
    },
    {
        keyNote: 85,
        keyColor: 72,
        animURL: animFolder + "Snake Hip Hop Dance 458.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 458
    },
    {
        keyNote: 84,
        keyColor: 40,
        animURL: animFolder + "Slide Hip Hop Dance 519.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 519
    },
    {
        keyNote: 83,
        keyColor: 40,
        animURL: animFolder + "Silly Dancing 163.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 163
    },
    {
        keyNote: 82,
        keyColor: 40,
        animURL: animFolder + "Silly Dancing 115.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 115
    },
    {
        keyNote: 81,
        keyColor: 40,
        animURL: animFolder + "Shuffling 225.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 225
    },

    {
        keyNote: 78,
        keyColor: 50,
        animURL: animFolder + "Samba Dancing 594.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 594
    },
    {
        keyNote: 77,
        keyColor: 50,
        animURL: animFolder + "Samba Dancing 559.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 559
    },
    {
        keyNote: 76,
        keyColor: 72,
        animURL: animFolder + "Salsa Dancing 135.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 135
    },
    {
        keyNote: 75,
        keyColor: 40,
        animURL: animFolder + "Salsa Dancing 73.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 73
    },
    {
        keyNote: 74,
        keyColor: 72,
        animURL: animFolder + "Salsa Dancing 68.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 68
    },
    {
        keyNote: 73,
        keyColor: 72,
        animURL: animFolder + "Rumba Dancing 71.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 71
    },
    {
        keyNote: 72,
        keyColor: 50,
        animURL: animFolder + "Robot Hip Hop Dance 463.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 463
    },
    {
        keyNote: 71,
        keyColor: 20,
        animURL: animFolder + "Macarena Dance 247.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 247
    },

    {
        keyNote: 68,
        keyColor: 72,
        animURL: animFolder + "Jazz Dancing 163.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 163
    },
    {
        keyNote: 67,
        keyColor: 40,
        animURL: animFolder + "Jazz Dancing 70.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 70
    },
    {
        keyNote: 66,
        keyColor: 40,
        animURL: animFolder + "Jazz Dancing 61.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 61
    },
    {
        keyNote: 65,
        keyColor: 20,
        animURL: animFolder + "House Dancing 641.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 641
    },
    {
        keyNote: 64,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 557.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 557
    },
    {
        keyNote: 63,
        keyColor: 72,
        animURL: animFolder + "Hip Hop Dancing 473.fbx",
        playbackRate: 15,
        animLoop: true,
        startFrame: 0,
        endFrame: 473
    },
    {
        keyNote: 62,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 413.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 413
    },
    {
        keyNote: 61,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 409.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 409
    },

    {
        keyNote: 58,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 391.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 391
    },
    {
        keyNote: 57,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 212.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 212
    },
    {
        keyNote: 56,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 190.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 190
    },
    {
        keyNote: 55,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 156.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 156
    },
    {
        keyNote: 54,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 142.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 142
    },
    {
        keyNote: 53,
        keyColor: 72,
        animURL: animFolder + "Hip Hop Dancing 134.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 134
    },
    {
        keyNote: 52,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 123.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 123
    },
    {
        keyNote: 51,
        keyColor: 54,
        animURL: animFolder + "Hip Hop Dancing 101.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 101
    },

    {
        keyNote: 48,
        keyColor: 20,
        animURL: animFolder + "Hokey Pokey 350.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 350
    },
    {
        keyNote: 47,
        keyColor: 20,
        animURL: animFolder + "Gangnam Style 371.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 371
    },
    {
        keyNote: 46,
        keyColor: 72,
        animURL: animFolder + "Dancing Twerk 456.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 465
    },
    {
        keyNote: 45,
        keyColor: 20,
        animURL: animFolder + "Dancing Running Man 325.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 325
    },
    {
        keyNote: 44,
        keyColor: 20,
        animURL: animFolder + "Dancing 243.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 243
    },
    {
        keyNote: 43,
        keyColor: 20,
        animURL: animFolder + "Dancing 220.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 220
    },
    {
        keyNote: 42,
        keyColor: 20,
        animURL: animFolder + "Chicken Dance 143.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 143
    },
    {
        keyNote: 41,
        keyColor: 72,
        animURL: animFolder + "Can Can 110.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 110
    },

    {
        keyNote: 38,
        keyColor: 20,
        animURL: animFolder + "Brooklyn Uprock 146.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 146
    },
    {
        keyNote: 37,
        keyColor: 20,
        animURL: animFolder + "Breakdance Uprock Var 1 63.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 63
    },
    {
        keyNote: 36,
        keyColor: 20,
        animURL: animFolder + "Breakdance Uprock 63.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 63
    },
    {
        keyNote: 35,
        keyColor: 20,
        animURL: animFolder + "Breakdance Ready 63.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 63
    },
    {
        keyNote: 34,
        keyColor: 20,
        animURL: animFolder + "Bboy Uprock 69.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 69
    },
    {
        keyNote: 33,
        keyColor: 20,
        animURL: animFolder + "Bboy Hip Hop Move 68.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 68
    },
    {
        keyNote: 32,
        keyColor: 20,
        animURL: animFolder + "Bboy Hip Hop Move 66.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 66
    },
    {
        keyNote: 31,
        keyColor: 72,
        animURL: animFolder + "Arms Hip Hop Dance 659.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 659
    },

    {
        keyNote: 28,
        keyColor: 20,
        animURL: animFolder + "Wave Hip Hop Dance 479.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 479
    },
    {
        keyNote: 27,
        keyColor: 20,
        animURL: animFolder + "Wave Hip Hop Dance 35.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 35
    },
    {
        keyNote: 26,
        keyColor: 20,
        animURL: animFolder + "Twist Dance 283.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 283
    },

// ];
*/
var animationMap = [
    {
        keyNote: 88,
        keyColor: 40,
        animURL: animFolder + "Swing Dancing 699.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 699
    },
    {
        keyNote: 87,
        keyColor: 40,
        animURL: animFolder + "Swing Dancing 156.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 156
    },
    {
        keyNote: 24,
        keyColor: 20,
        animURL: animFolder + "Swing Dancing 741.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 741
    },
    {
        keyNote: 25,
        keyColor: 20,
        animURL: animFolder + "Tut Hip Hop Dance 508.fbx",
        playbackRate: 30,
        animLoop: true,
        startFrame: 0,
        endFrame: 508
    },

];

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
var target = "Dance Tile";
var uuidTarget = Uuid.generate();
var wantDebug = true;

function printDebug(message) {
    if (wantDebug) {
        print(message);
    }
}

function getMyEntities(myEntities) {
    // log("myEntities", myEntities);
    entityIDs = Entities.findEntities(MyAvatar.position, 1000);
    // log("entityIDs",entityIDs);
    for (var i = 0; i < entityIDs.length - 1; i++) {
        // log("i", i);
        try {
            props = Entities.getEntityProperties(entityIDs[i]);
            // log("props",props);
            if (
                props.name.indexOf(target) !== -1 ||
                props.name.indexOf(uuidTarget) !== -1
            ) {
                myEntities.push({ name: props.name, entityID: entityIDs[i] });
            }
        } catch (e) {
            // log("e", e);
        }
    }
    log("danceTitles", myEntities);
}

function listMyEntities(myEntities) {
    print("Listing: " + myEntities.length);
    for (var i = 0; i < myEntities.length; i++) {
        print(myEntities[i].name + " " + myEntities[i].entityID);
    }
}

function deleteMyEntities(myEntities) {
    printDebug("Deleting: " + myEntities.length);
    for (var i = 0; i < myEntities.length; i++) {
        printDebug(myEntities[i].name + " " + myEntities[i].entityID);
        Entities.deleteEntity(myEntities[i].entityID);
    }
}

function MyIdentifier(myEntity) {
    return (myEntity = myEntity + " " + uuidTarget);
}

function newUuidTarget() {
    allUuidTargets.push(uuidTarget);
    uuidTarget = Uuid.generate();
}

//* *******************************************************************************

function log(describer, text) {
    text = text || "";
    print("&======");
    print(describer + ": ");
    print(JSON.stringify(text));
    print("======&");
}

/
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
                    // script: "(function () { return { clickDownOnEntity: function(entityID, mouseEvent) { this.a=!this.a; if(mouseEvent.isLeftButton) {if (this.a) MyAvatar.overrideAnimation(\"" + animationMap[dance].animURL + "\"," + animationMap[dance].playbackRate + "," + animationMap[dance].animLoop + "," + animationMap[dance].startFrame + "," + animationMap[dance].endFrame + "); else MyAvatar.restoreAnimation();}}};})",
                    userData: JSON.stringify(userData)
                },
                wantLocal
            );

        }
    }
}

function crazy(myEntities) {
    var i = Math.floor(Math.random() * myEntities.length) + 1;
    print(i);
    var j = Math.random();
    userData = {
        ProceduralEntity: {
            version: 2,
            shaderUrl:
                "http://192.241.189.145:8083/hifi/mat_shiny.fs?1488780575304",
            channels: null,
            uniforms: {
                specular_intensity: Math.random(), // 0.8,
                specular_hardness: 380,
                diffuse_color: [
                    j, // Math.random(),
                    j, // Math.random(),
                    j // Math.random()
                ],
                emit: -1,
                iSpeed: Math.random(),
                hide: [0.0, 0.0, 0.0],
                specular_color: [-1, 1, 1]
            }
        },
        grabbableKey: { cloneable: true, grabbable: false }
    };
    Entities.editEntity(myEntities[i].entityID, {
        userData: JSON.stringify(userData)
    });
}
function scriptEnding() {
    log("scriptEnding")
    deleteMyEntities(myEntities);
    if (wantLocal) {
        MyAvatar.setAvatarEntityData({});
    }
}

danceFloor();
getMyEntities(myEntities); // Locates all tiles
// listMyEntities(myEntities);

Script.scriptEnding.connect(scriptEnding);
