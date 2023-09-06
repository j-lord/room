// This is everything in the scene minus the camera/renderer/utils

import * as THREE from 'three';
import Experience from "../Experience.js"

import Bank from "./Bank.js"
import Floor from "./Floor.js"
import Controls from "./Controls.js"
import Environment from "./Environment.js"

export default class World{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        this.resources = this.experience.resources;
        this.theme = this.experience.theme;

        this.resources.on("ready", () => {
            this.environment = new Environment();
            // this.room = new Room();
            this.bank = new Bank();
            this.floor = new Floor();
            this.controls = new Controls();
        });

        this.theme.on("switch", (theme) => {
            this.switchTheme(theme);
        })
    }

    switchTheme(theme){
        if(this.environment){
            this.environment.switchTheme(theme);
        }
    }

    resize(){
    
    }

    update(){
        if(this.room){// if room exists, then update it
            this.room.update();
        }
        if(this.bank){// if room exists, then update it
            this.bank.update();
        }
        if(this.controls){
            this.controls.update();
        }
    }

}