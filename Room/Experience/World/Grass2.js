import * as THREE from 'three'

// const BLADE_WIDTH = 0.006
// const BLADE_HEIGHT = 0.008
const BLADE_WIDTH = 0.02
const BLADE_HEIGHT = 0.08
const BLADE_HEIGHT_VARIATION = 0.2
const BLADE_VERTEX_COUNT = 5
const BLADE_TIP_OFFSET = 0.002

function interpolate(val, oldMin, oldMax, newMin, newMax) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
}

export class GrassGeometry extends THREE.BufferGeometry {
    constructor() {
    super()
        this.grassMat = new THREE.MeshBasicMaterial( { color: 0x00FF00 } )

    }
}

const cloudTexture = new THREE.TextureLoader().load('/public/img/Cloud1.png')
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping

class Grass extends THREE.Mesh {
    constructor(size, count) {
        const geometry = new GrassGeometry(size, count)
        const material = new THREE.ShaderMaterial({
            uniforms: 
            {
                uTime: { value: 0 },
                uCloud: { value: cloudTexture }
            },
            side: THREE.DoubleSide,
            vertexShader:`
            uniform float uTime;
            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vNormal;

            float wave(float waveSize, float tipDistance, float centerDistance) {
                // Tip is the fifth vertex drawn per blade
                bool isTip = (gl_VertexID + 1) % 5 == 0;

                float waveDistance = isTip ? tipDistance : centerDistance;
                return sin((uTime / 5.0) + waveSize) * waveDistance;
                // return sin((uTime / 500.0) + waveSize) * uTime;
            }

            void main() {
                vPosition = position;
                vUv = uv;
                vNormal = normalize( normalMatrix * normal );

                if ( vPosition.y < 0.0 ) {
                vPosition.y = 0.0;
                } else {
                vPosition.x += wave(uv.x * 10.0, 0.3, 0.1);      
                }
                gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
            }
            `,
            fragmentShader:`
            uniform sampler2D uCloud;

            varying vec3 vPosition;
            varying vec2 vUv;
            varying vec3 vNormal;

            vec3 green = vec3(0.2, 0.6, 0.3);

            void main() {
                vec3 color = mix(green * 0.7, green, vPosition.y);
                color = mix(color, texture2D(uCloud, vUv).rgb, 0.1);

                float lighting = normalize(dot(vNormal, vec3(10)));
                gl_FragColor = vec4(color + lighting * 0.03, 1.0);
            }
            `
    })
    super()

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
    this.material.uniforms.uTime.value = elapsedTime
    window.requestAnimationFrame(tick)
}

tick()

    }


}

export default Grass
