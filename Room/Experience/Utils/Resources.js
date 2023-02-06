import * as THREE from 'three';
import { EventEmitter } from "events";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import Experience from "../Experience.js";


export default class Resources extends EventEmitter{
constructor(assets) { 
    super(); // need to call super to access the EventEmitter
    this.experience  = new Experience();
    this.renderer = this.experience.renderer;
    this.assets = assets;

    // this will hold all of our assets
    this.items = {};
    this.quue = this.assets.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
    }

    // we are using DRACO loader becuase we conpressed the blender file
    setLoaders(){
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.dracoLoader = new DRACOLoader();
        this.loaders.dracoLoader.setDecoderPath("/draco/");
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader);
        // for some reason it doesn't like this line

    };
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
                this.video[asset.name].play();

                this.video.texture[asset.name] = new THREE.VideoTexture(this.video[asset.name]);
                console.log("Name")
                console.log(this.video.texture[asset.name])
                this.video.texture[asset.name].flipY = false; // may not need this
                // this.video.texture[asset.name].minFilter = true;
                this.video.texture[asset.name].magFilter = THREE.NearestFilter;
                this.video.texture[asset.name].generateMipmaps = false;
                this.video.texture[asset.name].encoding = THREE.sRGBEncoding;

                // now just need to flip the video or the texture 

                this.singleAssetLoaded(asset, this.video.texture[asset.name]); // load the video texture

            }
        }
    }
    singleAssetLoaded(asset, file){
        this.items[asset.name] = file;
        this.loaded++;
        // this.emit("progress", this.loaded/this.quue);
        if(this.loaded === this.quue){
            this.emit("ready");
        }
    }
}