// this file loads all of the site assets into the website

import * as THREE from 'three';
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Experience from "../Experience.js";


export default class Resources extends EventEmitter{
constructor(assets) { // grab the assets from assets.js
    super(); // need to call super to access the EventEmitter
    this.experience  = new Experience();
    this.renderer = this.experience.renderer;
    this.assets = assets;

    // items array will hold all of our assets
    this.items = {};
    this.que = this.assets.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
    }

    // we are using DRACO loader because we compressed the blender file
    setLoaders(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
        // for some reason it doesn't like this line

    };

    // load the bank model into the scene 
    startLoading(){
        for(const asset of this.assets){
            if(asset.type==="glbModel"){
            this.loaders.gltfLoader.load(asset.path, (file)=>{
                this.singleAssetLoaded(asset, file);
                });
            }else if (asset.type === "videoTexture"){
                this.video = {};
                this.video.texture = {};
                this.video[asset.name] = document.createElement("video");
                this.video[asset.name].muted = true;
                this.video[asset.name].loop = true;
                this.video[asset.name].controls = true;
                this.video[asset.name].playsInline = true;
                this.video[asset.name].autoplay = true;
                this.video[asset.name].src = asset.path;
                
                
                this.video.texture[asset.name] = new THREE.VideoTexture(this.video[asset.name]);
                // console.log("Name")
                // console.log(this.video.texture[asset.name])
                // now just need to flip the video or the texture 
                this.video.texture[asset.name].flipY = false;
                this.video.texture[asset.name].magFilter = THREE.NearestFilter;
                this.video.texture[asset.name].generateMipmaps = false;
                // this.video.texture[asset.name].encoding = THREE.sRGBEncoding;
                this.video.texture[asset.name].encoding = THREE.SRGBColorSpace;
                this.singleAssetLoaded(asset, this.video.texture[asset.name]); // load the video texture
                // commenting out this play as is causing errors
                // this.video[asset.name].play();
                //   // Show loading animation.
                
                // Added this like based on Chrome DOM page: https://developer.chrome.com/blog/play-request-was-interrupted/
                // if (this.video[asset.name].play() !== undefined) {
                //     this.video[asset.name].play().then(_ => {
                //       // Automatic playback started!
                //       // Show playing UI.
                //     })
                //     .catch(error => {
                //       // Auto-play was prevented
                //       // Show paused UI.
                //     });
                // }
            }
        }
    }
    singleAssetLoaded(asset, file){
        this.items[asset.name] = file;
        this.loaded++;
        // this.emit("progress", this.loaded/this.que);
        if(this.loaded === this.que){
            this.emit("ready");
        }
    }
}