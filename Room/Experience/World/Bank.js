// import BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import * as dat from 'lil-gui'
import * as THREE from 'three';
import Experience from "../Experience.js"
import GSAP from "gsap"
import Grass from './Grass.js';

import Time from '../Utils/Time';
export default class Bank{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        // Grass2 constructor(size, count)
        // this.grass = new Grass(5, 30);
        this.grass = new Grass();

        // Resources.js pulls the assets in from assets.js file and this file then takes the assets from Resources
        // and assigns a name to each (i.e. this is the Bank)
        // this.bank = this.resources.items.bank.scene;
        this.bank = this.resources.items.bank.scene;    // Grabs the Bank from Resources
        this.tree = this.resources.items.bank.scene.children[0];
        console.log(this.tree)

        
        this.group = new THREE.Group();                 // Group for Bank and Fireflies
        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        // set bank
        // this.setBank(); 

        this.setTree();
        this.setFireFlies();
        this.setGrass();
        // this.setTestPoint();
        this.setAnimation();
        this.onMouseMove();
        this.update();
    }
    
    setBank(){
            // This ensures that everything in the screen receives a shadow
            this.bank.children.forEach(child => {
                child.castShadow = true;
                child.receiveShadow = true; 
                if(child instanceof THREE.Group){
                    child.children.forEach(groupchild => {
                        groupchild.castShadow = true;
                        groupchild.receiveShadow = true;
                    });
                }
            // if (child.name === "Grass"){
            //     console.log(this.resources.items)
            //     child.material = new THREE.MeshStandardMaterial({
            //         map: this.resources.items.grassTexture,
            //         color: "#ff00ff",
            //     });
            
            // }

        // Will leave this here in case there is a time you want to 
        // put an ATM screen next to the bank or something similar
        // if (child.name === "Computer") {
        //     // child.material = new THREE.MeshBasicMaterial({  // this is for the computer screen
        //     child.children[1].material = new THREE.MeshBasicMaterial({  // this is for the joined computer screen
        //         // we need to select the screen mesh(material)
        //                 map: this.resources.items.screen, // commenting this screen play for now
        //             });
        // }

        });
        
        //////////////  TESTING /////////////////////
        const gridHelper = new THREE.GridHelper(5,5);
        this.scene.add(gridHelper)
        //////////////  TESTING /////////////////////
        this.group.add(this.bank)
    }

    setTree(){
        this.tree.children[0].children.forEach(child => {
            child.castShadow = true;
            child.receiveShadow = true;
        })
        this.group.add(this.tree)
        // this.group.add(this.tree)
    }

    setFireFlies(){
        // const debugObject = {}
        const gui = new dat.GUI({   width: 400  })

        // Create the shape the fireflies will sit in BufferGeometry is a cube
        const firefliesGeometry = new THREE.BufferGeometry()
        
        // Number of fireflies to occupy the geometry
        const firefliesCount = 30 // this must be divisible by 3 as the for loops are broken into thirds (1/3)
        // the max/min (x,z) coordinates where the particles will exist outside of
        const exclusionRad = 0.4 // radius of point exclusion
        const particleHeight = 0.2 // y-axis of particles - > 0 so particles stay above ground if animated 
        const spreadMultiplier = 0.5 // spread distance of particles
        const length = 1.3 // length and depth of particles

        // Create the random position array where the fireflies will be located
        const positionArray = new Float32Array(firefliesCount * 3) // * 3 because 3 dimensions
        // Create the random scale array that will hold the fireflies size
        const scaleArray = new Float32Array(firefliesCount)
        // Location of all of the points

        this.firefliesMaterial = new THREE.ShaderMaterial({
            blending: THREE.AdditiveBlending,
            uniforms:
            {   
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 30 } // change this value once testing is finished
            },
            vertexShader:
            `
            uniform float uTime;
            uniform float uPixelRatio;
            uniform float uSize;
            attribute float aScale;
            varying vec3 vColor;
            
            void main()
            {
                vec4 modelPosition = modelMatrix * vec4(position, 0.8);
                // the multiplier at the end is the speed the particles move
                modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.06;
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectionPosition = projectionMatrix * viewPosition;

                // Twinkle effect based on time and modelPosition
                //                sin(time * speed of blink * x-position) * time dark + time light
                // If time light >= time dark the the particles won't go all the way dark but will fade
                float twinkling;
                twinkling = -sin(-cos(uTime * 1.5 * modelPosition.x)) * 0.9 + 0.7;
                vColor = vec3(twinkling);

                gl_Position = projectionPosition;
                gl_PointSize = uSize * aScale * uPixelRatio;
            
            }`,
            fragmentShader:
            `
            varying vec3 vColor;

            void main()
            {
                // get the distance from the center of the particle to the outside
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                // then the distance to the strength so the particle is bright in the center and diffuses quickly
                float strength = (0.05 / distanceToCenter) - 0.08 * 2.0;
                
                // color of the fireflies (vec4 (R,G,B,A))
                // gl_FragColor = vec4(0.9, 0.6, 1, strength); // purple
                vec3 green = vec3(0.0, 0.9, 0.0);
                gl_FragColor = vec4(vColor, strength); // green
                // gl_FragColor = vec4(1, 0, 0, strength); // red
            }`,
            transparent: true,
            // blends the colors of the particles with its background - rough on performances if there are a lot 
            // blending: THREE.AdditiveBlending, 
            // Allows particles to be shown on top of others without blocking whats behind 
            depthWrite: false
        })
        // set position of the first 1/3 particles
        for(let i = 0; i < firefliesCount/3; i++)
        {
            // // Random number between +exclusionRadius (inclusive) and 1 (exclusive)
            // const randomNumberGreaterRadius = Math.random() * (exclusionRad) + exclusionRad;
            // // Random number between -1 (exclusive) and -exclusionRadius (inclusive)

            positionArray[i * 3 + 0] = (Math.random() * (exclusionRad) + exclusionRad);
            positionArray[i * 3 + 1] = (Math.random() + particleHeight) * spreadMultiplier
            positionArray[i * 3 + 2] = (Math.random() - spreadMultiplier) * length
            scaleArray[i] = Math.random()
        }
        // set position of the second 2/3 particles
        for(let i = firefliesCount/3; i < (firefliesCount/3)*2 ; i++){
            // positionArray[i * 3 + 0] = (Math.random() + 0.5)// * 2.3
            positionArray[i * 3 + 0] = Math.random() * (-exclusionRad) - exclusionRad;
            positionArray[i * 3 + 1] = (Math.random() + particleHeight) * spreadMultiplier
            positionArray[i * 3 + 2] = (Math.random() - spreadMultiplier) * length
            scaleArray[i] = Math.random()
            }
        // set position of the third 3/3 particles - no need for a 4th as we don't care about particles behind the model
        for(let i = (firefliesCount/3)*2; i < firefliesCount ; i++){
            positionArray[i * 3 + 0] = (Math.random() - spreadMultiplier) * length
            positionArray[i * 3 + 1] = (Math.random() + particleHeight) * spreadMultiplier
            positionArray[i * 3 + 2] = Math.random() * (exclusionRad) + exclusionRad;
            scaleArray[i] = Math.random()
            }
        
        firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))
        gui.add(this.firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')

        // if debugging
        // this.setTestPoint();

        // Points
        this.fireflies = new THREE.Points(firefliesGeometry, this.firefliesMaterial)        
        this.group.add(this.fireflies)
        this.scene.add(this.group);
    }

    // next step is to apply realistic grass to the green lawn around the bank
    setGrass(){

    }
    setTestPoint(){
        const testArray = new Float32Array(3)
        testArray[0]=-0.5
        testArray[1]=0.004
        testArray[2]=0.5
        const testScaleArray = new Float32Array(3)         
        testScaleArray[0] = 2

        // create random red point
        const testGeometry = new THREE.BufferGeometry()

        this.testMaterial = new THREE.ShaderMaterial({
            uniforms:
            {   
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 100 } // change this value once testing is finished (20)
            },
            vertexShader:
            `
            uniform float uTime;
            uniform float uPixelRatio;
            uniform float uSize;
            attribute float aScale;

            // particle movement
            void main()
            {
                vec4 modelPosition = modelMatrix * vec4(position, 0.8);
                // the multiplier at the end is the speed the particles move
                // changed the modelPosition to use the z index as the index that influences movement
                modelPosition.z += sin(uTime + modelPosition.z * 100.0) * aScale * 0.08;
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectionPosition = projectionMatrix * viewPosition;
            
                gl_Position = projectionPosition;
                gl_PointSize = uSize * aScale * uPixelRatio;
            
            }`,
            fragmentShader:
            `
            // particle color
            void main()
            {
                // get the distance from the center of the particle to the outside
                // then sent to alpha so the particle is bight in the center and diffuses quickly
                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float strength = (0.05 / distanceToCenter) - 0.08 * 2.0;
                
                // color of the fireflies (vec4 (R,G,B,A))
                // gl_FragColor = vec4(0.9, 0.6, 1, strength); // purple
                // gl_FragColor = vec4(0.2, 0.9, 0.6, strength); // green
                gl_FragColor = vec4(1, 0, 0, strength); // red
            }`,
            transparent: true,
            // blends the colors of the particles with its background - rough on performances if there are a lot 
            // blending: THREE.AdditiveBlending, 
            // Allows particles to be shown on top of others without blocking whats behind 
            depthWrite: false
        })
        testGeometry.setAttribute('position', new THREE.BufferAttribute(testArray, 3))
        testGeometry.setAttribute('aScale', new THREE.BufferAttribute(testScaleArray, 1))

        this.testPoint = new THREE.Points(testGeometry, this.testMaterial)
        this.group.add(this.testPoint)
        this.scene.add(this.group);    
    }
    // this is for the fish tank animation
    // still need to figure out how to make the fish move correctly
    // https://youtu.be/nfvPq__Prts?t=617
    // look at the link above for animation reference for bouncing

    setAnimation(){
        // this.mixer = new THREE.AnimationMixer(this.resources.items.tree.animations[0]);
        // this.mixer = new THREE.AnimationMixer(this.tree);
        // console.log(this.resources.items.tree.animations[0])
        // this.sway = this.mixer.clipAction(this.tree);
        // console.log(this.sway)
        // this.sway.play(); // play this, once the bank has an actual animation


    // this is how it was done for the fish tank
    // this.mixer = new THREE.AnimationMixer(this.bank);
    // this.swim = this.mixer.clipAction(this.room.animations[0]);
    // this.swim.play(); // play this, once the bank has an actual animation

    this.mixer = new THREE.AnimationMixer(this.tree);
    // this.sway = this.mixer.clipAction(this.resources.items.bank.animations[0])
    this.mixer.clipAction(this.resources.items.tree.animations[0]).play();
    
    // need to figure out what to do about the leaves animation
    // this.sway = this.mixer.clipAction(THREE.AnimationUtils.subclip(this.resources.items.tree.animations[0], 'action', 0,20)).setDuration(10);
    console.log("this.resources.items.tree")
    console.log(this.resources.items.tree)
    // this.sway.play();
    // console.log(this.resources.items.bank.animations)

/*
 * Animate fireflies
 */
// can we replace with clock with this.time.something?
const clock = new THREE.Clock()

const tick = () =>
{
    var elapsedTime = clock.getElapsedTime()
    // bounce between +/- 2s  =>  (Math.sin(time * 4)) / 2 
    this.firefliesMaterial.uniforms.uTime.value = (Math.sin(elapsedTime/4) * 4)
    window.requestAnimationFrame(tick)
}

tick()

    }
    // listen for mouse movement and normalize x (-1,1)
    onMouseMove(){
        window.addEventListener("mousemove", (e) => {
            this.rotation = ((e.clientX - window.innerWidth / 2) * 1) / window.innerWidth;
            this.lerp.target = this.rotation * 0.06;
            // this.lerp.target = this.rotation * 4;
        });
    }

    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        // update the fireflies material if the pixel ratio changes
        this.firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
        this.group.rotation.y = this.lerp.current;
        this.mixer.update(this.time.delta * 0.0005);
        
    }

}