import * as THREE from 'three';
import Experience from "./Experience.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Camera{
    constructor(){
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.createPerspectiveCamera();
        this.createOrthographicCamera();
        this.setOrbitControls();
    }

    createPerspectiveCamera(){
        this.perspectiveCamera = new THREE.PerspectiveCamera(35, this.sizes.aspect, 0.1, 1000);
        // this.scene.add(this.perspectiveCamera);
        this.perspectiveCamera.position.x = -2;
        this.perspectiveCamera.position.y = 5;
        this.perspectiveCamera.position.z = 4;
    }

    // OTRHO CAMERA HERE
    createOrthographicCamera(){
        const value = 2.6;
        this.orthographicCamera = new THREE.OrthographicCamera(
            (-this.sizes.aspect * this.sizes.frustrum/value),
            (this.sizes.aspect * this.sizes.frustrum/value),
            this.sizes.frustrum/value,
            -this.sizes.frustrum/value,
            -20,
            20);
            
            // this.orthographicCamera = new THREE.OrthographicCamera(
                //     (-this.sizes.aspect * this.sizes.frustrum/2.2),
                //     (this.sizes.aspect * this.sizes.frustrum/2.2),
                //     this.sizes.frustrum/2.2,
                //     -this.sizes.frustrum/2.2,
                //     -40,
                //     40);

                this.orthographicCamera.position.x = 1.5;
                this.orthographicCamera.position.y = 0.5;
                this.orthographicCamera.position.z = 1.5; 

                this.orthographicCamera.zoom = 0.8;
                this.orthographicCamera.rotation.order = 'YXZ';
                this.orthographicCamera.rotation.y = Math.PI / 4;
                this.orthographicCamera.rotation.x = Math.atan( - 1 / Math.sqrt( 4.5 ) );
                

        // this.scene.add(this.perspectiveCamera);
        this.scene.add(this.orthographicCamera);

        this.helper = new THREE.CameraHelper(this.orthographicCamera);
        // this.scene.add(this.helper);

        
        // this.scene.add(this.orthographicCamera);

    const size = 10;
    const divisions = 10;

    // helper lines for the camera's position 
    const gridHelper = new THREE.GridHelper( size, divisions );
    // this.scene.add( gridHelper );

    const axesHelper = new THREE.AxesHelper( 10 );
    // this.scene.add( axesHelper );

    }

    setOrbitControls(){ // this is where you allow the user to move the camera around
        // Updating Orbit Controls
        this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enableZoom = true; // enable and disable zoom
    }
    resize(){
        // Updating Perspective Camera on resize
        // this.perspectiveCamera.aspect = this.sizes.aspect;
        // this.perspectiveCamera.updateProjectionMatrix();

        // Updating Orthographic Camera on resize
        this.orthographicCamera.left = (-this.sizes.aspect * this.sizes.frustrum/2);
        this.orthographicCamera.right = (this.sizes.aspect * this.sizes.frustrum/2);
        this.orthographicCamera.top = this.sizes.frustrum/2;
        this.orthographicCamera.bottom = -this.sizes.frustrum/2;
        this.orthographicCamera.updateProjectionMatrix();
    }
    update(){
        this.controls.update();
        this.helper.matrixWorldNeedsUpdate = true;
        this.helper.update();
        this.helper.position.copy(this.orthographicCamera.position);
        this.helper.rotation.copy(this.orthographicCamera.rotation);
    }

}