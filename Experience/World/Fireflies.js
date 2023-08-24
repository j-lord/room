import * as THREE from 'three';
import Experience from "../Experience.js"
import GSAP from "gsap"

export default class Fireflies{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        // this.resources = this.experience.resources;
        // this.time = this.experience.time;
        this.setFireFlies();
        
        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        // this.setModel();
        // this.fireflies = this.setFireFlies;
        // this.setAnimation();
        // this.onMouseMove();
        }

    // Finish getting the fireflies to work
    setFireFlies(){
        /**
         * Fireflies
         */
        // Geometry
        this.firefliesGeometry = new THREE.BufferGeometry()
        this.firefliesCount = 30
        this.positionArray = new Float32Array(this.firefliesCount * 3)
        this.scaleArray = new Float32Array(this.firefliesCount)

        for(let i = 0; i < this.firefliesCount; i++)
        {
            this.positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4
            this.positionArray[i * 3 + 1] = Math.random() * 1.5
            this.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4

            this.scaleArray[i] = Math.random()
        }

        this.firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionArray, 3))
        this.firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.scaleArray, 1))

        // Material
        this.firefliesMaterial = new THREE.PointsMaterial({ size: 5, sizeAttenuation: true })
        // const firefliesMaterial = new THREE.ShaderMaterial({
        //     uniforms:
        //     {
        //         uTime: { value: 0 },
        //         uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        //         uSize: { value: 100 }
        //     },
        //     vertexShader: firefliesVertexShader,
        //     fragmentShader: firefliesFragmentShader,
        //     transparent: true,
        //     blending: THREE.AdditiveBlending,
        //     depthWrite: false
        // })

        // gui.add(firefliesMaterial.uniforms.uSize, 'value').min(0).max(500).step(1).name('firefliesSize')

        // Points
        this.fireflies = new THREE.Points(this.firefliesGeometry, this.firefliesMaterial)
        // console.log("fireflies")
        this.scene.add(this.fireflies)
    }

    setAnimation(){
    console.log(this.bank.animations)
    this.mixer = new THREE.AnimationMixer(this.bank);
    // this.swim = this.mixer.clipAction(this.room.animations[0]);
    // this.swim.play(); // play this, once the bank has an actual animation
    }

    // listen for mouse movement and normalize x (-1,1)
    onMouseMove(){
        window.addEventListener("mousemove", (e) => {
            // this.rotation = ((e.clientX - window.innerWidth / 2) * 1) / window.innerWidth;
            this.position = ((e.clientX - window.innerWidth / 2) * 1) / window.innerWidth;
            this.lerp.target = this.position * 0.08;
            this.firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)

            // this.lerp.target = this.rotation * 0.08;
        });
    }

    resize(){

    }
    update() {
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        // this.bank.rotation.y = this.lerp.current;
        this.fireflies.position.y = this.lerp.current;

        this.mixer.update(this.time.delta * 0.0009);
    }

}