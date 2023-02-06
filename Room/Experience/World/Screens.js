// we should be able to delete this file

import * as THREE from 'three'

import Experience from '../Experience.js'

export default class Screens
{
    constructor(_mesh)
    {
        this.experience = new Experience()
        this.resources = this.experience.resources
        this.debug = this.experience.debug
        this.scene = this.experience.scene
        this.world = this.experience.world

        this.mesh = _mesh
        // this.sourcePath = _sourcePath

        this.setModel()
    }

    setModel()
    {
        this.model = {}

        // Element
        this.model.element = document.createElement('video')
        this.model.element.muted = true
        this.model.element.loop = true
        this.model.element.controls = true
        this.model.element.playsInline = true
        this.model.element.autoplay = true
        this.model.element.src = "/Room/public/textures/DemonSlayerLast31.mp4"
        this.model.element.play()

        this.model.element.style.position = 'fixed'
        this.model.element.style.top = 0
        this.model.element.style.left = 0
        this.model.element.style.zIndex = 1
        
        document.body.append(this.model.element)

        // Texture
        this.model.texture = new THREE.VideoTexture(this.model.element)
        this.model.texture.encoding = THREE.sRGBEncoding

        // Material
        this.model.material = new THREE.MeshBasicMaterial({
            map: this.model.texture
        })

        // Mesh
        this.mesh = this.resources.items
        // console.log(this.model)
        this.model.mesh = this.mesh
        this.model.mesh.material = this.model.material
        this.scene.add(this.model.mesh)
    }

    update()
    {
        // this.model.group.rotation.y = Math.sin(this.time.elapsed * 0.0005) * 0.5
    }
}

// import * as THREE from 'three';
// import Experience from "../Experience.js"

// export default class Scree{
//     constructor(){
//         this.experience = new Experience();
//         this.scene = this.experience.scene;

//         this.resources = this.experience.resources;
//         this.room = this.resources.items.room;
//         this.actualRoom = this.room.scene;
        
//         this.setModel();

//         }


//     setModel(){
//         console.log(this.actualRoom);


//         this.model = {}
//         this.model.video = document.createElement('video');
//         this.model.video.muted = false;
//         this.model.video.loop = true;
//         this.model.video.playsInline = true;
//         this.model.video.src = '/Room/public/textures/DemonSlayerLast30.mp4'

//         this.model.video.style.position = "fixed"
//         this.model.video.style.top = 0
//         this.model.video.style.left = 0
//         this.model.video.style.zIndex = 1

//         // this.scene.add(this.actualRoom);
//         // this.actualRoom.scale.set(0.1, 0.1, 0.1);
//     }

//     resize(){

//     }
//     update(){
//     }

// }