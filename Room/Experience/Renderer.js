// can play around with these setting for the post processing effects
import * as THREE from 'three';
import Experience from "./Experience.js"

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


export default class Camera{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;

        this.setRenderer();
        }

    setRenderer(){
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            // alpha: true,
            antialias: true
        });
        this.renderer.physicallyCorrectLights = true;
        // this.renderer.outputEncoding = THREE.sRGBEncoding; // Depreciated
        // this.renderer.outputEncoding = THREE.SRGBColorSpace; // Depreciated
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.CineonToneMapping;
        this.renderer.toneMappingExposure = 1.75;
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
        this.renderer.gammaOutput = true;
        // this.renderer.outputEncoding = THREE.sRGBEncoding // Depreciated
        // this.renderer.outputEncoding = THREE.SRGBColorSpace // Depreciated
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.5;
        this.renderer.setClearColor(0x000000, 0);
        // // bloom pass
        // this.composer = new EffectComposer(this.renderer);
        // this.composer.addPass(new RenderPass(this.scene, this.camera.orthographicCamera));
        // this.bloomPass = new UnrealBloomPass(new THREE.Vector2(this.sizes.width, this.sizes.height), 1.5, 0.4, 0.85);
        // // this.bloomPass.threshold = 1;
        // // this.bloomPass.strength = 1.5;
        // // this.bloomPass.radius = 5;
        // this.composer.addPass(this.bloomPass);
        
        

        // THREE.ColorManagement.legacyMode = false;


    }


    resize(){
        // this.renderer.setSize(this.sizes.width, this.sizes.height);
        this.renderer.setPixelRatio(this.sizes.pixelRatio);
    }
    update(){
        this.renderer.setViewport(0, 0, this.sizes.width, this.sizes.height);
        this.renderer.render(this.scene, this.camera.orthographicCamera);
        // this.renderer.render(this.scene, this.camera.perspectiveCamera);
        // second screen on window
        // this.renderer.setScissorTest(true);
        // this.renderer.setViewport(
        //     this.sizes.width - this.sizes.width / 3, 
        //     this.sizes.height - this.sizes.height / 3, 
        //     this.sizes.width / 3,
        //     this.sizes.height / 3);
 
        // this.renderer.setScissor(
        //     this.sizes.width - this.sizes.width / 3, 
        //     this.sizes.height - this.sizes.height / 3, 
        //     this.sizes.width / 3,
        //     this.sizes.height / 3);


        // this.renderer.render(this.scene, this.camera.perspectiveCamera);
        // this.renderer.setScissorTest(false);
        
    }

}