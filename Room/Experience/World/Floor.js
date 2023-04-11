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
        this.geometry = new THREE.PlaneGeometry( 800, 800, 800 );
        this.material = new THREE.MeshStandardMaterial({
            color: 0x1f2742,
            side: THREE.BackSide,
    });
    this.plane = new THREE.Mesh( this.geometry, this.material );    
    this.plane.rotation.x = Math.PI/2;
    this.plane.position.y = -0.1;
    this.plane.receiveShadow = true;
    this.scene.add( this.plane )
    }

    resize(){

    }
    update(){

    }

}