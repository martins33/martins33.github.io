import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import * as Stats from 'three/addons/libs/stats.module.js';


//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, stereoCamera, scene, renderer, controls;
var ambientLight, directionalLight;
var geometry, material,mesh;
var carroussel, strip, ring1, ring2, ring3;
var innerRad = 1, ringThicc = 2, outerRad = 3;
var ringPoints = [], mobiusLigths = [], underLights = [];

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
    
    stereoCamera = new THREE.StereoCamera();
    stereoCamera.aspect = 0.5; // Set aspect ratio for stereo rendering
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

    material = new THREE.MeshStandardMaterial( { color:  Math.random() * 0xffffff, side: THREE.DoubleSide ,wireframe: false} );  // Normal material
    mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI/2);

    mesh.userData.changeMaterial = true; /*transformar ou nao */
    

    //mesh.position.y += 1;

    parent.add(mesh);
    
}

function createRings(parent) {
    'use strict';

    ring1 = new THREE.Object3D();
    ring1.userData = { goingUp: false, oscillating: true }
    ring2 = new THREE.Object3D();
    ring2.userData = { goingUp: false, oscillating: true }
    ring3 = new THREE.Object3D();
    ring3.userData = { goingUp: false, oscillating: true }

    
    for(let i = 0; i < 3; i++){
        let ring;
        switch (i){
            case 0: ring = ring1; ring1.oscillating = true;
            break;
            case 1: ring = ring2; ring2.oscillating = true;
            break;
            case 2: ring = ring3; ring3.oscillating = true;
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
    const material = new THREE.MeshStandardMaterial( { color:  Math.random() * 0xffffff, side: THREE.DoubleSide ,wireframe: false} );
    ring.rotateX(Math.PI/2);
    const mesh = new THREE.Mesh( ring, material ) ;

    for(let i = 0, angle = 0; i < 8; i++){
        angle = Math.PI/4 * i;
        let x = inR + ringThicc/2;
        let y = 0.5;
        let z = 0;
        addParametricSurface(x, y, z, angle, parent, i);
    }
    
    mesh.userData.changeMaterial = true; /*transformar ou nao */
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

    material = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.userData.changeMaterial = true; /*transformar ou nao */
    surfaceInner.add(mesh);
    surface.add(surfaceInner);
    surface.position.set(x,y,z);

    let spotlight = new THREE.SpotLight(0xffffff);
    spotlight.position.set(0, -0.5, 0); // Position it just below the surface
    spotlight.target.position.set(0, 0, 0); // Pointing upwards towards the surface
    surface.add(spotlight);
    surface.add(spotlight.target);
    underLights.push(spotlight);

    parent.add(surface);

    //positions are flat on top of the rings
    surface.position.set(0,0.5,0);
    surface.rotation.y = (angle);
    surface.translateX(x);

    ringPoints.push(surface); //for easy access
    parent.add(surface);

    
}

//TODO: create objects

//radius - distance to middle of strip , widht of strip , height , number of radial segments , twists
function calcPos(r,w,h,s,t){
    var positions=[];
    var angle = Math.PI / s;
    var twists = t;

    var axiY = new THREE.Vector3(0,1,0);
    var axiZ = new THREE.Vector3(0,0,1);

    var Point = new THREE.Vector3(r,h,0);
    var baseVector = new THREE.Vector3(w/2,0,0);
    var transVector, Vl;
    var light;

    var x1,y1,z1,x2,y2,z2;

    x1 = Point.x + baseVector.x; y1 = Point.y + baseVector.y; z1 = Point.z + baseVector.z;
    x2 = Point.x - baseVector.x; y2 = Point.y - baseVector.y; z2 = Point.z - baseVector.z;

    positions.push(x1);positions.push(y1);positions.push(z1);positions.push(x2);positions.push(y2);positions.push(z2);
    light = new THREE.PointLight( 0xffffff, 5, 100 );
    light.position.set( r, h+0.1, 0 );
    mobiusLigths.push(light);

    for(let i=1;i<s;i++){
        Point.applyAxisAngle(axiY,angle*2);
        transVector = baseVector.clone();
        transVector.applyAxisAngle(axiZ,angle*i*twists);
        transVector.applyAxisAngle(axiY,angle*i*2);

        x1 = Point.x + transVector.x; y1 = Point.y + transVector.y; z1 = Point.z + transVector.z;
        x2 = Point.x - transVector.x; y2 = Point.y - transVector.y; z2 = Point.z - transVector.z;

        positions.push(x1);positions.push(y1);positions.push(z1);positions.push(x2);positions.push(y2);positions.push(z2);

        if((angle*i) % (Math.PI/8) == 0){
            Vl = new THREE.Vector3(0,0.1,0);
            Vl.applyAxisAngle(axiZ,angle*i*twists);
            Vl.applyAxisAngle(axiY,angle*i*2);

            light = new THREE.PointLight( 0xffffff, 5, 100 );
            light.position.set( Point.x+Vl.x, Point.y+Vl.y, Point.z+Vl.z );
            mobiusLigths.push(light);
        }

    }

    return positions;
}

function calcInd(s,t){
    var indices = [];
    var i=0;
    for(;i<s*2 - 2;i++){
        if(i%2 == 0){
            indices.push(i); indices.push(i+2); indices.push(i+1);
        }
        else { 
            indices.push(i); indices.push(i+1); indices.push(i+2);
        }
    }
    
    if(t%2==0){
        indices.push(s*2-1); indices.push(s*2-2); indices.push(0);
        indices.push(s*2-1); indices.push(0); indices.push(1);
    }
    else{
        indices.push(s*2-2); indices.push(0); indices.push(s*2-1);
        indices.push(s*2-2); indices.push(1); indices.push(0); 
    }

    return indices;
}

function createStrip(){

    strip = new THREE.BufferGeometry();

    var segments = 64;
    var twists = 2;

    const positions = calcPos(5,2,7,segments, twists); //radius to strip middle , width , height , twists
    const indices = calcInd(segments,twists);
    
    strip.setIndex(indices);

    material = new THREE.MeshStandardMaterial({ 
        color:  Math.random() * 0xffffff,
        side: THREE.DoubleSide,
        wireframe: false });
    strip.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    strip.computeVertexNormals();
    
    const object = new THREE.Mesh( strip,material);

    for(let i=0;i<8;i++){
        object.add(mobiusLigths[i]);
    }

    object.userData.changeMaterial = true; /*transformar ou nao */
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
    renderer.xr.enabled = true; // Enable WebXR
    document.body.appendChild(renderer.domElement);
    document.body.appendChild( VRButton.createButton( renderer ) );

    createScene();
    createSkyDome();
    createCamera();
    createLights();
    createCarroussel();
    createStrip();

    render(scene,camera);

    window.addEventListener("keydown", onKeyDown);
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
        ring.position.y += 0.02;
    } else {
        ring.position.y -= 0.02;
    }
}

function animate() {
    'use strict';
    //TODO
    //testing();
    
    renderer.setAnimationLoop( function () {

        update(); // Update the scene's state
        render();
    
    } );
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
        console.log("1");
        break;
    case 50:  // Tecla '2' - Oscilar anel 2
        ring2.oscillating = !ring2.oscillating;
        break;
    case 51:  // Tecla '3' - Oscilar anel 3
        ring3.oscillating = !ring3.oscillating;
        break;
    case 84: //T
    case 116: //t
        scene.traverse(function (object) {
            if (object instanceof THREE.Light) {
                object.visible = !object.visible; // Inverte o estado de visibilidade
            }
        });
        console.log('t');
        break;
    case 68:  // Tecla 'D' - Toggle directional light
    case 100: // d
        console.log("d");
        directionalLight.visible = !directionalLight.visible;
        ambientLight.visible = !ambientLight.visible;
        break;
    case 80:  // Tecla 'P' - Toggle point lights
    case 112: // p
        mobiusLigths.forEach(light => { light.visible = !light.visible; });
        break;
    case 83:  // Tecla 'S' - Toggle spotlights
    case 115: // s
        underLights.forEach(light => { light.visible = !light.visible; });
        break;
    case 81:  // Tecla 'Q' - Toggle Gourand (diffuse) shading
    case 113:  // q
        changeMaterialsInScene(scene, 'Lambert');
        console.log('Q');
        break;
    case 87:  // Tecla 'W' - Toggle Phong shading
    case 119: // w
        changeMaterialsInScene(scene, 'Phong');
        console.log('W');
        break;
    case 69:  // Tecla 'E' - Toggle Cartoon shading
    case 101: // e
        changeMaterialsInScene(scene, 'Toon');
        console.log('E');
        break;
    case 82:  // Tecla 'R' - Toggle NormalMap shading
        changeMaterialsInScene(scene, 'NormalMap');
        console.log('R');
        break;    
    case 114: // r

        break;
    }
}

////
/*shading and lighting*/
////
// Function to change the material of an object with a random color
function changeMaterial(object, materialType) {
    if (object instanceof THREE.Mesh && object.userData.changeMaterial) {
        // Generate a new random color for each object
        const randomColor = new THREE.Color(Math.random() * 0xffffff);
        let newMaterial;

        switch (materialType) {
            case 'Lambert':
                newMaterial = new THREE.MeshLambertMaterial({ color: randomColor, side: THREE.DoubleSide });
                break;
            case 'Phong':
                newMaterial = new THREE.MeshPhongMaterial({ color: randomColor, shininess: 100, side: THREE.DoubleSide });
                break;
            case 'Toon':
                newMaterial = new THREE.MeshToonMaterial({ color: randomColor, side: THREE.DoubleSide });
                break;
            case 'NormalMap':
                newMaterial = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
                break;
        }

        object.material = newMaterial;
    }
}

// Function to iterate through all objects in the scene and change their material
function changeMaterialsInScene(scene, materialType) {
    scene.traverse(function (object) {
        // Apply material with random color to each object individually
        changeMaterial(object, materialType);
    });
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