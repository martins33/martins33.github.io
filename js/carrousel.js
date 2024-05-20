import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer, controls;
var ambientLight, directionalLight;
var geometry, material,mesh;
var carroussel, strip, ring1, ring2, ring3;
var innerRad = 1, ringThicc = 2, outerRad = 3;
var ringPoints = [];

var extrudeSettings = {
    amount : 2,
    steps : 1,
    depth: 1, // ring heigth
    bevelEnabled: false,
    curveSegments: 32
};


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000000);

    // Create objects

}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////

function createCamera() {
    'use strict';
    camera = new THREE.PerspectiveCamera(20,
                                         window.innerWidth / window.innerHeight,
                                         1,
                                         1000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = 50;
    camera.lookAt(scene.position);

    controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
    //TODO: create other cameras
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLights() {
    'use strict';
    ambientLight = new THREE.AmbientLight(0xffa500, 0.5);
    scene.add(ambientLight);

    // This isn't doing anything at the moment
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.lookAt(scene.position);
    scene.add(directionalLight);

    //TODO: create other lights

}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createCarroussel() {
    'use strict';
    carroussel = new THREE.Object3D();
    carroussel.userData = { rotating:true } //fix for testing

    createCylinder(carroussel, 1, 64, 8);
    createRings(carroussel, 1);

    scene.add(carroussel);
}

function createCylinder(parent, radius, tubularSegments, radialSegments) {
    'use strict';

    var arcShape = new THREE.Shape();
    arcShape.absarc(0, 0,1, 0, Math.PI * 2, 0, false);
    
    geometry = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);

    material = new THREE.MeshNormalMaterial();  // Normal material
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI/2);

    //mesh.position.y += 1;

    parent.add(mesh);

    //TODO: cada objeto deve ter 4 tipos de materiais, e devemos podemos mudar o tipo de shading com teclas
    /*
    const materials = [
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),  // Red Lambert material
        new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100 }),  // Green Phong material
        new THREE.MeshToonMaterial({ color: 0xffffff }),  // Yellow Toon material
        new THREE.MeshNormalMaterial()  // Normal material
    ];
    */
}

function createRings(parent, cylinderRadius) {
    'use strict';

    ring1 = new THREE.Object3D();
    ring1.userData = { goingUp: false, oscillating: false }
    ring2 = new THREE.Object3D();
    ring2.userData = { goingUp: false, oscillating: false }
    ring3 = new THREE.Object3D();
    ring3.userData = { goingUp: false, oscillating: false }

    
    for(let i = 0; i < 3; i++){
        let ring;
        switch (i){
            case 0: ring = ring1;
            break;
            case 1: ring = ring2;
            break;
            case 2: ring = ring3;
            break;
        }

        addRing(innerRad,outerRad,ring);
        innerRad = outerRad;
        outerRad += ringThicc;
        
        parent.add(ring);
    }
}

function addRing(inR,otR,parent){
    var arcShape = new THREE.Shape();
    arcShape.absarc(0, 0, otR, 0, Math.PI * 2, 0, false);
    
    var holePath = new THREE.Path();
    holePath.absarc(0, 0, inR, 0, Math.PI * 2,0, true);
    arcShape.holes.push(holePath);
    
    var ring = new THREE.ExtrudeGeometry(arcShape, extrudeSettings);
    const material = new THREE.MeshBasicMaterial( { color:  Math.random() * 0xffffff, side: THREE.DoubleSide ,wireframe: false} );
    ring.rotateX(Math.PI/2);
    const mesh = new THREE.Mesh( ring, material ) ;

    for(let i = 0,angle = 0; i<8;i++){
        angle = Math.PI/4 * i;
        let x= inR + ringThicc/2;
        let y= 0.5;
        let z= 0;
        addPoint(x,y,z,angle,parent);
    }
 
    parent.add( mesh )
}

function addPoint(x,y,z,angle,parent){

    var point = new THREE.Object3D();

    //add stuff

    addBox(0,0,0,point); //enable to visualiza positions , temporary


    //positions are flat on top of the rings
    point.position.set(0,0.5,0);
    point.rotation.y = (angle);
    point.translateX(x);

    ringPoints.push(point); //for easy access
    parent.add(point);

}

function addBox( x,y,z,parent){ //for testing
    'use strict';

    var box = new THREE.Object3D();
    box.userData ={falling:false};

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    geometry = new THREE.BoxGeometry(2,2,2);
    mesh = new THREE.Mesh(geometry, material);

    box.add(mesh);
    box.position.set(x, y, z);

    parent.add(box);

}

//TODO: create objects

function createStrip(){

    strip = new THREE.BufferGeometry();

    const positions = [
        0   ,6 ,3.65,
        0   ,6 ,2,
        1.45 ,6 ,3.3,
        0.8 ,6 ,1.9,
        2.6 ,6 ,2.6,
        1.45 ,6 ,1.45,
        3.3 ,6 ,1.45,
        1.9 ,6 ,0.8,
        3.65   ,6 ,0,
        2   ,6 ,0,

        1.9 ,6 ,-0.8,
        3.3 ,6 ,-1.45,
        1.45 ,6 ,-1.45,
        2.6 ,6 ,-2.6,
        0.8 ,6 ,-1.9,
        1.45 ,6 ,-3.3,
        0   ,6 ,-2,
        0   ,6 ,-3.65,

        -1.45 ,6 ,-3.3,
        -0.8 ,6 ,-1.9,
        -2.6 ,6 ,-2.6,
        -1.45 ,6 ,-1.45,
        -3.3 ,6 ,-1.45,
        -1.9 ,6 ,-0.8,
        -3.65   ,6 ,0,
        -2   ,6 ,0,

        -3.3 ,6 ,1.45,
        -1.9 ,6 ,0.8,
        -2.6 ,6 ,2.6,
        -1.45 ,6 ,1.45,
        -1.45 ,6 ,3.3,
        -0.8 ,6 ,1.9,
    ];

    const indices = [
        0,1,2,
        1,2,3,
        2,3,4,
        3,4,5,
        4,5,6,
        5,6,7,
        6,7,8,
        7,8,9,
        8,9,10,
        9,8,10,
        8,10,11,
        10,11,12,
        11,12,13,
        12,13,14,
        13,14,15,
        14,15,16,
        15,16,17,
        17,16,18,
        16,18,19,
        18,19,20,
        19,20,21,
        20,21,22,
        21,22,23,
        22,23,24,
        23,24,25,
        24,25,26,
        25,26,27,
        26,27,28,
        27,28,29,
        28,29,30,
        29,30,31,
        30,31,0,
        31,0,1
      ];
    
    strip.setIndex(indices);

    material = new THREE.MeshBasicMaterial( { color:  Math.random() * 0xffffff, side: THREE.DoubleSide ,wireframe: false} );
    strip.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    
    
    const object = new THREE.Mesh( strip,material);

    scene.add(object);

}

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    //TODO: is this necessary for this project?
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';
    //TODO: is this necessary for this project?
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    //TODO: rotate carroussel

    let ring;
    for (let i = 1; i <= 3; i++) {
        switch(i) {
        case 1: ring = ring1;
            break;
        case 2: ring = ring2;
            break;
        case 3: ring = ring3;
            break;
        }

        if (ring.oscillating) {
            oscillateRing(i);
        }
    }

    spin();
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    createLights();
    createCarroussel();
    createStrip();

    render(scene,camera);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////

function spin(){
    if(carroussel.userData.rotating){
        carroussel.rotateY(-0.02);
        if(carroussel.rotation.y >= Math.PI*2) carroussel.rotation.y - Math.PI*2;
    }
}

function oscillateRing(ringIndex) {
    let ring;
    switch(ringIndex) {
    case 1: ring = ring1;
        break;
    case 2: ring = ring2;
        break;
    case 3: ring = ring3;
        break;
    }

    if (ring.position.y <= -1 || ring.position.y >= 1) {
        // Switch directions if upper or lower limit is reached
        ring.goingUp = !ring.goingUp;
    }

    if (ring.goingUp) {
        ring.position.y += 0.05;
    } else {
        ring.position.y -= 0.05;
    }
}

function animate() {
    'use strict';
    //TODO
    //testing();
    
    update();
    render();
    requestAnimationFrame(animate);
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = renderer.getSize().width/renderer.getSize().height;
        camera.updateProjectionMatrix();
    }
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch (e.keyCode) {
    case 49:  // Tecla '1' - Oscilar anel 1
        ring1.oscillating = !ring1.oscillating;
        break;
    case 50:  // Tecla '2' - Oscilar anel 2
        ring2.oscillating = !ring2.oscillating;
        break;
    case 51:  // Tecla '3' - Oscilar anel 3
        ring3.oscillating = !ring3.oscillating;
        break;
    case 68:  // Tecla 'D' - Toggle directional light
    case 100: // d

        break;
    case 80:  // Tecla 'P' - Toggle point light
    case 112: // p

        break;
    case 83:  // Tecla 'S' - Toggle spotlight
    case 115: // s

        break;
    case 81:  // Tecla 'Q' - Toggle Gourand (diffuse) shading
    case 113:  // q
        
        break;
    case 87:  // Tecla 'W' - Toggle Phong shading
    case 119: // w
        
        break;
    case 69:  // Tecla 'E' - Toggle Cartoon shading
    case 101: // e

        break;
    case 82:  // Tecla 'R' - Toggle NormalMap shading
    case 114: // r

        break;
    }
}


///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    
    switch (e.keyCode) {
    //TODO: remove this?
    }
}

init();
animate();