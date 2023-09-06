import * as THREE from 'three'

export class GrassGeometry extends THREE.BufferGeometry {
    constructor() {
    super()
    
}


}


class Grass2 extends THREE.Mesh {
    constructor() {

        ////////////
// MATERIAL
////////////

const vertexShader = `
varying vec2 vUv;
uniform float time;

  void main() {

  vUv = uv;
  
  // VERTEX POSITION
  
  vec4 mvPosition = vec4( position, 1.0 );
  #ifdef USE_INSTANCING
      mvPosition = instanceMatrix * mvPosition;
  #endif
  
  // DISPLACEMENT
  
  // here the displacement is made stronger on the blades tips.
  float dispPower = 1.0 - cos( uv.y * 3.1416 / 2.0 );
  
  float displacement = sin( mvPosition.z + time * 10.0 ) * ( 0.1 * dispPower );
  mvPosition.z += displacement;
  
  //
  
  vec4 modelViewPosition = modelViewMatrix * mvPosition;
  gl_Position = projectionMatrix * modelViewPosition;

  }
`;

const fragmentShader = `
varying vec2 vUv;

void main() {
    vec3 baseColor = vec3( 0.41, 1.0, 0.5 );
  float clarity = ( vUv.y * 0.5 ) + 0.5;
  gl_FragColor = vec4( baseColor * clarity, 1 );
}
`;

const uniforms = {
  time: {
    value: 0
}
}

const leavesMaterial = new THREE.ShaderMaterial({
  vertexShader,
fragmentShader,
uniforms,
side: THREE.DoubleSide
});

/////////
// MESH
/////////

const instanceNumber = 5000;
const dummy = new THREE.Object3D();

const geometry = new THREE.PlaneGeometry( 0.1, 1, 1, 4 );
geometry.translate( 0, 0.5, 0 ); // move grass blade geometry lowest point at 0.

const instancedMesh = new THREE.InstancedMesh( geometry, leavesMaterial, instanceNumber );

this.scene.add( instancedMesh );

// Position and scale the grass blade instances randomly.

for ( let i=0 ; i<instanceNumber ; i++ ) {

  dummy.position.set(
    ( Math.random() - 0.5 ) * 10,
  0,
  ( Math.random() - 0.5 ) * 10
);

dummy.scale.setScalar( 0.5 + Math.random() * 0.5 );

dummy.rotation.y = Math.random() * Math.PI;

dummy.updateMatrix();
instancedMesh.setMatrixAt( i, dummy.matrix );

}
    // super(geometry, material)

    // const floor = new THREE.Mesh(
    // new THREE.PlaneGeometry(3, 4).rotateX(Math.PI / 2),
    // material
    // )
    // floor.position.y = -0.09//-Number.EPSILON
    // this.add(floor)
}



setAnimation(){
/**
 * Animate grass
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // this.material.uniforms.uTime.value = elapsedTime
    // Hand a time variable to vertex shader for wind displacement.
	this.leavesMaterial.uniforms.time.value = clock.getElapsedTime();
    this.leavesMaterial.uniformsNeedUpdate = true;
    window.requestAnimationFrame(tick)
}

tick()

    }
}

export default Grass2
