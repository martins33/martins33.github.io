import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer, ambientLight;


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

    //TODO: create other cameras
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////

function createLights() {
    'use strict';
    ambientLight = new THREE.AmbientLight(0xffa500, 5);
    scene.add(ambientLight);

    //TODO: create other lights

}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////

function createCylinder(radius, tubularSegments, radialSegments) {
    class StraightLineCurve extends THREE.Curve {
        getPoint(t) {
            return new THREE.Vector3(0, t * 3, 0); // Adjust length of the cylinder here
        }
    }

    const path = new StraightLineCurve();
    const closed = true;

    const geometry = new THREE.TubeGeometry(path, radialSegments, radius, tubularSegments, closed);
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);

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

//TODO: create objects

//////////////////////
/* CHECK COLLISIONS */
//////////////////////
function checkCollisions(){
    'use strict';
    //TODO
}

///////////////////////
/* HANDLE COLLISIONS */
///////////////////////
function handleCollisions(){
    'use strict';
    //TODO
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    //TODO
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
    createCylinder(1, 64, 8);

    render(scene,camera);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';
    //TODO
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';
    //TODO
}

///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';
    //TODO
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    //TODO
}

init();
animate();