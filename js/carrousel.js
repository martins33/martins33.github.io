import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';

//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;
var ambientLight, directionalLight;
var geometry, material, mesh;
var carroussel, cylinder, ring1, ring2, ring3;


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

    createCylinder(carroussel, 1, 64, 8);
    createRings(carroussel, 1);

    scene.add(carroussel);
}

function createCylinder(parent, radius, tubularSegments, radialSegments) {
    'use strict';

    cylinder = new THREE.Object3D();
    cylinder.userData = { rotating: false }

    class StraightLineCurve extends THREE.Curve {
        getPoint(t) {
            return new THREE.Vector3(0, t * 3, 0);
        }
    }

    var path = new StraightLineCurve();
    var closed = true;

    geometry = new THREE.TubeGeometry(path, radialSegments, radius, tubularSegments, closed);
    material = new THREE.MeshNormalMaterial();  // Normal material
    mesh = new THREE.Mesh(geometry, material);
    var tube = new THREE.Mesh(geometry, material);
    
    parent.add(tube);

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
    ring1.userData = { goingUp: false, goingDown: false }
    ring2 = new THREE.Object3D();
    ring2.userData = { goingUp: false, goingDown: false }
    ring3 = new THREE.Object3D();
    ring3.userData = { goingUp: false, goingDown: false }

    geometry = new THREE.RingGeometry(cylinderRadius, cylinderRadius + 1);
    material = new THREE.MeshNormalMaterial();  // Normal material
    ring1 = new THREE.Mesh(geometry, material);
    // ring1.rotation.x = Math.PI / 2; // this makes it disappear, for some reason
    parent.add(ring1);

    geometry = new THREE.RingGeometry(cylinderRadius + 1, cylinderRadius + 2);
    ring2 = new THREE.Mesh(geometry, material);
    // ring2.rotation.x = Math.PI / 2; // this makes it disappear, for some reason
    parent.add(ring2);

    geometry = new THREE.RingGeometry(cylinderRadius + 2, cylinderRadius + 3);
    ring3 = new THREE.Mesh(geometry, material);
    // ring3.rotation.x = Math.PI / 2; // this makes it disappear, for some reason
    parent.add(ring3);
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
    createCarroussel();

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