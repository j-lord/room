// {import firefliesFragmentShader from '/Shaders/Fireflies/fragment.glsl';}
import * as dat from 'lil-gui'
import * as THREE from 'three';
import Experience from "../Experience.js"
import GSAP from "gsap"

// import firefliesVertexShader from '/Shaders/Fireflies/vertex.glsl';
// console.log(firefliesVertexShader)
// import firefliesFragmentShader from './shaders/fireflies/fragment.glsl'


export default class Bank{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
                
        // Resources.js pulls the assets in from assets.js file and this file then takes the assets from Resources
        // and assigns a name to each (i.e. this is the Bank)
        // this.bank = this.resources.items.bank.scene;
        this.bank = this.resources.items.bank.scene;    // Grabs the Bank from Resources
        this.group = new THREE.Group();                 // Group for Bank and Fireflies
        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };


        this.setBank();
        this.setFireFlies();    
        this.setAnimation();
        this.onMouseMove();
        // this.update();
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
        // Will leave this here in case there is a time you want to 
        // put an ATM screen next to the bank or something similar
        if (child.name === "Computer") {
            // child.material = new THREE.MeshBasicMaterial({  // this is for the computer screen
            child.children[1].material = new THREE.MeshBasicMaterial({  // this is for the joined computer screen
                // we need to select the screen mesh(material)
                        map: this.resources.items.screen, // commenting this screen play for now
                    });
        }

        });
        
        this.group.add(this.bank)
    }


    setFireFlies(){
        const debugObject = {}
        const gui = new dat.GUI({   width: 400  })
        
        const firefliesGeometry = new THREE.BufferGeometry()
        const firefliesCount = 60
        const positionArray = new Float32Array(firefliesCount * 3)
        const scaleArray = new Float32Array(firefliesCount)

        // location of all of the points
        for(let i = 0; i < firefliesCount; i++)
        {
            positionArray[i * 3 + 0] = (Math.random() - 0.5) * 2.3
            positionArray[i * 3 + 1] = (Math.random() + 0.4) * 0.5
            positionArray[i * 3 + 2] = (Math.random() - 0.5) * 2.3            
            scaleArray[i] = Math.random()
        }

        firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))
        firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1))

        // 
        this.firefliesMaterial = new THREE.ShaderMaterial({
            uniforms:
            {   
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 10 } // change this value once testing is finished
            },
            vertexShader:
            `
            uniform float uTime;
            uniform float uPixelRatio;
            uniform float uSize;
            attribute float aScale;

            void main()
            {
                vec4 modelPosition = modelMatrix * vec4(position, 0.8);
                modelPosition.y += sin(uTime + modelPosition.y * 100.0) * aScale * 0.2;
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectionPosition = projectionMatrix * viewPosition;
            
                gl_Position = projectionPosition;
                gl_PointSize = uSize * aScale * uPixelRatio;
            
            }`,
            fragmentShader:
            `
            void main()
            {
                // get the distance from the center of the particle to the outside
                // then sent to alpha so its bring in the center and diffuses quickly

                float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                float strength = (0.05 / distanceToCenter) - 0.08 * 2.0;
                
                // color of the fireflies (vec4 (R,G,B,A))
                // gl_FragColor = vec4(0.7, 0.6, 1, strength); // purple
                gl_FragColor = vec4(0.2, 0.9, 0.6, strength); // green
            }`,
            transparent: true,
            // blends the colors of the particles with its background - rough on performances if there are a lot 
            blending: THREE.AdditiveBlending, 
            // allows particles to be shown on top of others without blocking whats behind 
            depthWrite: false
        })

        gui.add(this.firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')


        // Points
        this.fireflies = new THREE.Points(firefliesGeometry, this.firefliesMaterial)        
        this.group.add(this.fireflies)
        this.scene.add(this.group);
        }

    // this is for the fish tank animation
    // still need to figure out how to make the fish move correctly
    // https://youtu.be/nfvPq__Prts?t=617
    // look at the link above for animation reference for bouncing
    
    setAnimation(){

    console.log(this.bank.animations)
    this.mixer = new THREE.AnimationMixer(this.bank);

    // this.swim = this.mixer.clipAction(this.room.animations[0]);
    // this.swim.play(); // play this, once the bank has an actual animation

/**
 * Animate fireflies
 */
// can we replace with clock with this.time.something?
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update materials
    this.firefliesMaterial.uniforms.uTime.value = elapsedTime
    window.requestAnimationFrame(tick)
}

tick()

    }

    // listen for mouse movement and normalize x (-1,1)
    onMouseMove(){
        window.addEventListener("mousemove", (e) => {
            this.rotation = ((e.clientX - window.innerWidth / 2) * 1) / window.innerWidth;
            this.lerp.target = this.rotation * 0.1;
            
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
        this.mixer.update(this.time.delta * 0.0009);
    }

}