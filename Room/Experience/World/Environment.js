// this file will deal with all of the lighting theme switching for the environment 

import * as THREE from 'three';
import Experience from "../Experience.js"
import GSAP from "gsap";
import GUI from 'lil-gui';

export default class Environment{
    constructor(){
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // need to provide a container for the GUI so we can move it
        this.gui = new GUI({ container: document.querySelector('.hero-main') });
        this.obj = {
            colorObj: { r: 0, g: 0, b: 0 },
            intensity: 3,
        };

        this.resources = this.experience.resources;
        this.setSunLight();
        this.setGUI();
        }

        setGUI(){
            this.gui.addColor(this.obj, "colorObj").onChange(()=>{
                this.sunLight.color.copy(this.obj.colorObj);
                this.ambientLight.color.copy(this.obj.colorObj);
                console.log(this.obj.colorObj);
            });
            this.gui.add(this.obj, "intensity", 0, 10).onChange(()=>{
                this.sunLight.intensity = this.obj.intensity; // the copy method doesn't work for intensity
                this.sunLight.ambientLight = this.obj.intensity;
            });
        }


    setSunLight(){
        this.sunLight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.camera.far = 10;
        this.sunLight.shadow.mapSize.set(2048, 2048);
        this.sunLight.shadow.normalBias = 0.05;
        // const helper = new THREE.CameraHelper(this.sunLight.shadow.camera);
        // this.scene.add(helper);
        this.sunLight.position.set(1.5, 7, 3);
        this.scene.add(this.sunLight);

        this.ambientLight = new THREE.AmbientLight( "#ffffff", 1); // soft white light
        this.scene.add(this.ambientLight)
    }

    
    switchTheme(theme){
        if(theme === "dark"){
            // console.log("dark theme");
            GSAP.to(this.sunLight.color,{
                r: 0.36,
                g: 0.38,
                b: 0.50,                
            });
            GSAP.to(this.ambientLight.color,{
                r: 0.38,
                g: 0.40,
                b: 0.53,
            });
            GSAP.to(this.sunLight.intensity, {
                intensity: 0.5,
            })
            GSAP.to(this.ambientLight.intensity, {
                intensity: 0.5,
            })
        }
        else{
            GSAP.to(this.sunLight.color,{
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255,
            });
            GSAP.to(this.ambientLight.color,{
                r: 255 / 255,
                g: 255 / 255,
                b: 255 / 255,
            });
            GSAP.to(this.sunLight.intensity, {
                intensity: 3,
            })
            GSAP.to(this.ambientLight.intensity, {
                intensity: 3,
            })
        }
    }

    resize(){

    }
    update(){
    }

}