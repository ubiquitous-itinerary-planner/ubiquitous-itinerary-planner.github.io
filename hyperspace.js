/**
 * A hyperspace jump animation, based on https://www.youtube.com/watch?v=So8xNYMhnPc
 * and https://github.com/mrdoob/three.js/blob/master/examples/webgl_buffergeometry_custom_attributes_particles.html
 *
 * Code based on various examples from https://github.com/mrdoob/three.js/
 */

import * as THREE from './libraries/three.module.js'
import {UnrealBloomPass} from "./libraries/UnrealBloomPass.js";
import {RenderPass} from "./libraries/RenderPass.js";
import {EffectComposer} from "./libraries/EffectComposer.js";
import {get_string} from "./databases/dictionaryUIP2.js";

let renderer, composer, scene, camera, clock, clockJump;
let starSystem, uniforms;
const numStars = 100000;
const cameraStartPos = 300;

let animate;
let audioPlayer;

/**
 * Sets up the hyperspace
 */
function hyperspaceSetup(){
    // Initialise clocks
    clock = new THREE.Clock();
    clockJump = new THREE.Clock(false);
    // Initialise vars
    animate = true;
    audioPlayer = new Audio("./audio/hyperjump.mp3");
    // Find the canvas
    const canvas = document.getElementById("background");
    // Label the canvas
    canvas.setAttribute("alt", get_string("backgroundAltText"));
    // Create the renderer
    renderer = new THREE.WebGLRenderer({canvas});
    // Create the scene
    scene = new THREE.Scene();

    // Create the star particle system
    const positions = [];
    const colors = [];
    const color = new THREE.Color();
    const sizes = [];
    const radius = 10000;
    const tunnelWidth = 10; // Tunnel has W = H
    // Each star is a vertex of the particle system
    for(let i = 0; i < numStars; i+=4){
        // N wall
        // Star coordinates
        positions.push((Math.random() * 2 - 1) * tunnelWidth);
        positions.push(tunnelWidth);
        positions.push((Math.random() * 2 - 1) * radius);
        // Star color
        color.setHSL(200, 1.0, 80 + Math.random() * 10);
        colors.push(color.r, color.g, color.b);
        // Star size
        sizes.push(Math.random() * 2);

        // E wall
        // Star coordinates
        positions.push(tunnelWidth);
        positions.push((Math.random() * 2 - 1) * tunnelWidth);
        positions.push((Math.random() * 2 - 1) * radius);
        // Star color
        color.setHSL(200, 1.0, 80 + Math.random() * 10);
        colors.push(color.r, color.g, color.b);
        // Star size
        sizes.push(Math.random() * 2);

        // S wall
        // Star coordinates
        positions.push((Math.random() * 2 - 1) * tunnelWidth);
        positions.push(-tunnelWidth);
        positions.push((Math.random() * 2 - 1) * radius);
        // Star color
        color.setHSL(200, 1.0, 80 + Math.random() * 10);
        colors.push(color.r, color.g, color.b);
        // Star size
        sizes.push(Math.random() * 2);

        // W wall
        // Star coordinates
        positions.push(-tunnelWidth);
        positions.push((Math.random() * 2 - 1) * tunnelWidth);
        positions.push((Math.random() * 2 - 1) * radius);
        // Star color
        color.setHSL(200, 1.0, 80 + Math.random() * 10);
        colors.push(color.r, color.g, color.b);
        // Star size
        sizes.push(Math.random() * 2);
    }

    uniforms = {
        pointTexture: {
            value: new THREE.TextureLoader().load("images/star.png")
        }
    };
    /* The shaders, written in GLSL, are part of the material of the star system.
     * The vertex shader calculates the size and position of each vertex (=star)
     * The fragment shader uses the passed texture and color to color the fragments of the vertex
     */
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
        attribute float size;

        varying vec3 vColor;

        void main() {

            vColor = color;

            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

            gl_PointSize = size * ( 300.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;

        }
        `,
        fragmentShader: `
        uniform sampler2D pointTexture;

        varying vec3 vColor;

        void main() {

            gl_FragColor = vec4( vColor, 1.0 );
            gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

        }
        `,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: true,
        vertexColors: true
    });
    // Define the geometry of the star system
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1).setUsage(THREE.DynamicDrawUsage));
    // Create and add the star system to the scene
    starSystem = new THREE.Points(starGeometry, shaderMaterial);
    scene.add(starSystem);

    // Create the camera
    camera = new THREE.PerspectiveCamera( 40, 2, 1, 10000 );
    camera.position.z = cameraStartPos;

    // Render pass
    const renderScene = new RenderPass( scene, camera );
    // Bloom pass
    const bloomPass = new UnrealBloomPass( new THREE.Vector2( canvas.innerWidth, canvas.innerHeight));
    bloomPass.threshold = 0;
    bloomPass.strength = 1.5;
    bloomPass.radius = 0;
    // Compose the passes
    composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    // Configure the renderer
    renderer.setPixelRatio(window.devicePixelRatio);
}

/**
 * Animates the stars in the background
 */
function hyperspaceAnimate(){

    if(animate) {
        // Do things that happens at every frame
        const dTime = clock.getDelta(); // Time since last call to hyperspaceAnimate
        camera.position.z -= 0.1 * dTime;
        starSystem.rotateZ(0.1 * dTime);
        // If we are jumping, do move
        if (clockJump.running) {
            hyperspaceMove(dTime);
        }
    }
    // Render scene
    composer.render();
    // Continue animating the scene on next frame
    requestAnimationFrame(hyperspaceAnimate);
}

/**
 * Do a hyperspace jump
 */
export function hyperjump(){
    /* Play the hyperspace jump sound file */
    // Error handling based on example from https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/play
    try{
        audioPlayer.play();
    }
    catch (err){
        console.log(err);
    }
    /* Set the clock to signal that we are to jump. The hyperspaceMove function will re-set the clock
    * when the jump is over */
    clockJump.start();
}

/**
 * Moves the camera along a trajectory, to simulate a hyperspace jump
 */
function hyperspaceMove(deltaTime){
    // Find for how long we have moved
    const elapsedTime = clockJump.getElapsedTime();

    // Accelerate preparing for the jump
    if(elapsedTime <= 0.5){
        camera.position.z -= 5 * deltaTime;
    }
    else if(elapsedTime <= 0.7){
        camera.position.z -= 7 * deltaTime;
    }
    else if(elapsedTime <= 1.0){
        camera.position.z -= 10 * deltaTime;
    }

    // The jump is fast
    else if(elapsedTime <= 2.5){
        camera.position.z -= 1000* deltaTime;
        // While in the middle of the hyperspace jump, jump back to the beginning
        if(elapsedTime >= 1.5 && elapsedTime <= 2.0){
            if(camera.position.z <= -1 * cameraStartPos){
                camera.position.z = cameraStartPos;
            }
        }
    }

    // Slow down at the end
    else if(elapsedTime <= 2.6){
        camera.position.z -= 20 * deltaTime;
    }
    else if(elapsedTime <= 2.7){
        camera.position.z -= 10 * deltaTime;
    }
    else if(elapsedTime <= 2.8){
        camera.position.z -= 8 * deltaTime;
    }
    else if(elapsedTime <= 2.9){
        camera.position.z -= 5 * deltaTime;
    }
    else if(elapsedTime <= 3.0){
        camera.position.z -= 2 * deltaTime;
    }

    // Stop the clock after jumping
    else {
        clockJump.stop();
    }
}

/**
 * Toggles the mute of the hyperjump animation
 */
export function hyperspaceToggleMute(){
    audioPlayer.muted = !audioPlayer.muted;
}

/**
 * Toggles the animation of the hyperjump animation
 */
export function hyperspaceToggleAnimate(){
    if(clock.running){
        clock.stop();
    }
    else{
        clock.start();
    }
    animate = !animate;
}

/**
 * Gets whether or not the animation is toggled on
 * @return {*} True iff the animation is toggled to be on
 */
export function hyperspaceIsAnimated(){
    return animate;
}
// Call setup and animate
hyperspaceSetup();
hyperspaceAnimate();