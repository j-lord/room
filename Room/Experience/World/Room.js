import * as THREE from 'three';
import Experience from "../Experience.js"
import GSAP from "gsap"
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;

        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        
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
        this.actualRoom.children.forEach(child => {
            child.castShadow = true;
            child.receiveShadow = true; 
            if(child instanceof THREE.Group){
                child.children.forEach(groupchild => {
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                });
            }

            // console.log(child);

            if (child.name === "Aquarium") { // this is why naming is important in blender
                console.log(child)
                child.children[7].material = new THREE.MeshPhysicalMaterial(); // this is for the fish tank
                child.children[7].material.roughness = 0;
                child.children[7].material.color.set(0x549dd2);
                child.children[7].material.ior = 8;
                child.children[7].material.tranmission = 1;
                child.children[7].material.transparent = true; // water needs to be transparent
                child.children[7].material.opacity = 0.4;
            }

        if (child.name === "Computer") {
            // child.material = new THREE.MeshBasicMaterial({  // this is for the computer screen
            child.children[1].material = new THREE.MeshBasicMaterial({  // this is for the joined computer screen
                // we need to select the screen mesh(material)
                map: this.resources.items.screen, // commenting this screen play for now
            });
        }

        });

        // this is light for the fish tank
        const width = 0.4;
        const height = 0.8;
        const intensity = 3;
        const rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
        rectLight.position.set( 9, 7, -1 );
        rectLight.rotation.x = - Math.PI / 2;
        // rectLight.rotation.y = - Math.PI / 2;
        rectLight.rotation.z = 180;
        this.actualRoom.add( rectLight )

        // const rectLightHelper = new RectAreaLightHelper( rectLight );
        // rectLight.add( rectLightHelper );


        this.scene.add(this.actualRoom);
        this.actualRoom.scale.set(0.1, 0.1, 0.1);
    }
    // this is for the fish tank animation
    // still need to figure out how to make the fish move correctly
    // https://youtu.be/nfvPq__Prts?t=617
    // look at the link above for animation reference for bouncing
    setAnimation(){
    console.log(this.room.animations)
    this.mixer = new THREE.AnimationMixer(this.actualRoom);
    this.swim = this.mixer.clipAction(this.room.animations[0]);
    this.swim.play();
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
        this.actualRoom.rotation.y = this.lerp.current;
        this
        this.mixer.update(this.time.delta * 0.001);
        this.lerp.current = GSAP.utils.interpolate(this.lerp.current, this.lerp.target, this.lerp.ease);

    }

}