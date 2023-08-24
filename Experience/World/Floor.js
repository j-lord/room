import * as THREE from 'three';
import Experience from "../Experience.js"
import GSAP from "gsap"

export default class Room{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.setFloor();
        }
// this sets the floor in place, make larger than the scene to hide edges
    setFloor(){
        // make the ground plane so small that you can't see it
        // will most likely bring this back later on
        this.geometry = new THREE.PlaneGeometry( 10,10,10 );
        this.material = new THREE.MeshStandardMaterial({
            color: 0x1f3742,
            // color: 0xCD5C5C,
            side: THREE.BackSide,
    });
    this.plane = new THREE.Mesh( this.geometry, this.material );    
    this.plane.rotation.x = Math.PI/2;
    this.plane.position.y = -0.1;
    this.plane.receiveShadow = true;
    // this.scene.add( this.plane )
    }

    resize(){

    }
    update(){
        this.lerp.current = GSAP.utils.interpolate(
            this.lerp.current,
            this.lerp.target,
            this.lerp.ease
        );

        this.floor.rotation.y = this.lerp.current;

    }

}