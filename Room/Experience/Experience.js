// This is where everything is consolidated 
// all of the pieces are put together here

import * as THREE from "three";
import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import Resources from "./Utils/Resources.js";
import assets from "./Utils/assets.js";

import Camera from "./Camera.js";
import Theme from "./Theme.js";
import Renderer from "./Renderer.js";
import World from "./World/World.js";

export default class Experience {
    static instance
    constructor(canvas) {
        if(Experience.instance) {
            return Experience.instance
        }

        Experience.instance = this
        this.canvas = canvas;                   // Creates the canvas where the scene will be
        this.scene = new THREE.Scene();         // Creates the scene
        this.time = new Time();                 // Event emitter for time updates
        this.sizes = new Sizes();               // Event emitter for resize updates
        this.camera = new Camera();             // Well, the camera stuff
        this.renderer = new Renderer();         // The renderer
        this.resources = new Resources(assets); // Where all of the page assets are stored
        this.theme = new Theme();               // This toggles between dark and light mode
        this.world = new World();               // ???
        
        this.sizes.on("resize", () => {
            this.resize();
            });

        this.time.on("update", () => {
            this.update();
            });
    }

    resize() {
        this.camera.resize();
        this.world.resize();
        this.renderer.resize(); 
        }
    update() {
        this.camera.update();
        this.world.update();
        this.renderer.update(); 
        }
}