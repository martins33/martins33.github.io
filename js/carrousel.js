import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
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

function createSkyDome() {
    'use strict';
    geometry = new THREE.SphereGeometry(10, 25, 25);

    var loader = new THREE.TextureLoader(), texture = loader.load("../img/an_optical_poem.png");
    material = new THREE.MeshPhongMaterial({ map: texture, });

    var sky = new THREE.Mesh(geometry, material);
    sky.material.side = THREE.BackSide;
    scene.add(sky);
}

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

///////////////////////////////////
/* PARAMETRIC GEOMETRY FUNCTIONS */
///////////////////////////////////

function deltoid(u, v, target) {
    u *= 2 * Math.PI;

    const x = 2 * Math.cos(u) + Math.cos(2 * u);
    const y = 2 * Math.sin(u) - Math.sin(2 * u);
    const z = v;

    target.set(x, y, z);
}

function mobius(u, t, target) {
    u = u - 0.5;
    const v = 2 * Math.PI * t;

    const x = Math.cos(v) * (1 + 0.5 * u * Math.cos(v / 2));
    const y = Math.sin(v) * (1 + 0.5 * u * Math.cos(v / 2));
    const z = 0.5 * u * Math.sin(v / 2);

    target.set(x, y, z);
}

function torus(u, v, target) {
    u *= 2 * Math.PI;
    v *= 2 * Math.PI;

    const x = (1 + 0.5 * Math.cos(v)) * Math.cos(u);
    const y = (1 + 0.5 * Math.cos(v)) * Math.sin(u);
    const z = 0.5 * Math.sin(v);

    target.set(x, y, z);
}

function plane(u, v, target) {
    const x = u * 2 - 1;
    const y = v * 2 - 1;
    const z = 0;

    target.set(x, y, z);
}

function sphere(u, v, target) {
    u *= Math.PI;
    v *= 2 * Math.PI;

    const x = Math.sin(u) * Math.cos(v);
    const y = Math.sin(u) * Math.sin(v);
    const z = Math.cos(u);

    target.set(x, y, z);
}

function cylinder(u, v, target) {
    u *= 2 * Math.PI;
    const x = Math.cos(u);
    const y = Math.sin(u);
    const z = v * 2 - 1;

    target.set(x, y, z);
}

function cone(u, v, target) {
    u *= 2 * Math.PI;
    const x = (1 - v) * Math.cos(u);
    const y = (1 - v) * Math.sin(u);
    const z = v;

    target.set(x, y, z);
}

function twistedTorus(u, v, target) {
    u *= 2 * Math.PI;
    v *= 2 * Math.PI;

    const R = 1;
    const r = 0.3;
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const y = (R + r * Math.cos(v)) * Math.sin(u);
    const z = r * Math.sin(v) * Math.cos(u * 2);

    target.set(x, y, z);
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

    for(let i = 0, angle = 0; i < 8; i++){
        angle = Math.PI/4 * i;
        let x = inR + ringThicc/2;
        let y = 0.5;
        let z = 0;
        addParametricSurface(x, y, z, angle, parent, i);
    }
 
    parent.add( mesh );
}

function addParametricSurface(x, y, z, angle, parent, index){

    var surface = new THREE.Object3D();
    var surfaceInner = new THREE.Object3D(); // to make the surface rotate around itself

    surfaceInner.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
    );

    let randomSize = Math.random() * (0.5 - 0.2) + 0.2;

    switch (index) {
    case 0:
        geometry = new ParametricGeometry(deltoid, 20, 20);
        geometry.scale(0.8,0.8,0.8); // it's too big compared to the others
        break;
    case 1:
        geometry = new ParametricGeometry(torus, 20, 20);
        break;
    case 2:
        geometry = new ParametricGeometry(mobius, 20, 20);
        break;
    case 3:
        geometry = new ParametricGeometry(plane, 20, 20);
        break;
    case 4:
        geometry = new ParametricGeometry(sphere, 20, 20);
        break;
    case 5:
        geometry = new ParametricGeometry(cylinder, 20, 20);
        break;
    case 6:
        geometry = new ParametricGeometry(cone, 20, 20);
        break;
    case 7:
        geometry = new ParametricGeometry(twistedTorus, 20, 20);
        break;
    }

    geometry.scale(randomSize, randomSize, randomSize);

    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    surfaceInner.add(mesh);
    surface.add(surfaceInner);
    surface.position.set(x,y,z);

    parent.add(surface);

    //positions are flat on top of the rings
    surface.position.set(0,0.5,0);
    surface.rotation.y = (angle);
    surface.translateX(x);

    ringPoints.push(surface); //for easy access
    parent.add(surface);
}

//TODO: create objects

//radisu - distance to middle of strip , widht of strip , height , number of radial segments
function calcPos(r,w,h,s){
    var positions=[];
    var angle = Math.PI*2 / s;

    var axiY = new THREE.Vector3(0,1,0);
    var axiZ = new THREE.Vector3(0,0,1);

    var Point = new THREE.Vector3(r,h,0);
    var baseVector = new THREE.Vector3(w/2,0,0);
    var transVector;

    var x1,y1,z1,x2,y2,z2;

    x1 = Point.x + baseVector.x; y1 = Point.y + baseVector.y; z1 = Point.z + baseVector.z;
    x2 = Point.x - baseVector.x; y2 = Point.y - baseVector.y; z2 = Point.z - baseVector.z;

    positions.push(x1);positions.push(y1);positions.push(z1);positions.push(x2);positions.push(y2);positions.push(z2);

    for(let i=1;i<s;i++){
        Point.applyAxisAngle(axiY,angle);
        transVector = baseVector.clone();
        transVector.applyAxisAngle(axiZ,angle*i);
        transVector.applyAxisAngle(axiY,angle*i);

        x1 = Point.x + transVector.x; y1 = Point.y + transVector.y; z1 = Point.z + transVector.z;
        x2 = Point.x - transVector.x; y2 = Point.y - transVector.y; z2 = Point.z - transVector.z;

        positions.push(x1);positions.push(y1);positions.push(z1);positions.push(x2);positions.push(y2);positions.push(z2);
    }

    return positions;
}

function calcInd(s){
    var indices = [];
    var i=0;
    for(;i<s*2 - 2;i++){
        indices.push(i); indices.push(i+1); indices.push(i+2);
    }
        indices.push(s*2-2); indices.push(s*2-1); indices.push(0);
        indices.push(s*2-1); indices.push(0); indices.push(1);

    return indices;
}

function createStrip(){

    strip = new THREE.BufferGeometry();

    var segments = 64;

    const positions = calcPos(5,2,7,segments); //radius to strip middle , width , height
    const indices = calcInd(segments);
    
    strip.setIndex(indices);

    material = new THREE.MeshBasicMaterial( { color:  Math.random() * 0xffffff, side: THREE.DoubleSide ,wireframe: false} );
    strip.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    
    
    const object = new THREE.Mesh( strip,material);

    scene.add(object);

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
    createSkyDome();
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
        camera.aspect = window.innerWidth / window.innerHeight;
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