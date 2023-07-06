import * as THREE from 'three';
import Experience from "../Experience.js"
import GSAP from "gsap"

export default class Bank{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        // Resources.js pulls the assets in from assets.js file and this file then takes the assets from Resources
        // and assigns a name to each (i.e. this is the Bank)
        // this.bank = this.resources.items.bank.scene;
        this.bank = this.resources.items.bank.scene;
        this.bank
        this.lerp = {
            current: 0,
            target: 0,
            ease: 0.1,
        };

        this.setModel();
        this.setAnimation();
        this.onMouseMove();
        }

// this is to set up the model and color of water
    setModel(){
        console.log(this.resources.items.bank.scene)
        this.bank.children.forEach(child => {
            child.castShadow = true;
            child.receiveShadow = true; 
            if(child instanceof THREE.Group){
                child.children.forEach(groupchild => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }

            // console.log(child);

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

        this.scene.add(this.bank);
        this.bank.scale.set(1.1, 1.1, 1.1);
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
    }

    // listen for mouse movement and normalize x (-1,1)
    onMouseMove(){
        window.addEventListener("mousemove", (e) => {
            this.rotation = ((e.clientX - window.innerWidth / 2) * 1) / window.innerWidth;
            this.lerp.target = this.rotation * 0.08;
        });
    }

    resize(){

    }
    update(){
        this.bank.rotation.y = this.lerp.current;
        this
        this.mixer.update(this.time.delta * 0.001);
        this.lerp.current = GSAP.utils.interpolate(this.lerp.current, this.lerp.target, this.lerp.ease);

    }

}