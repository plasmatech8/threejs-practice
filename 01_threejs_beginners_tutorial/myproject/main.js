import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Initialise scene, camera, and renderer
/* Camera arguments: FOV, Apect Ratio, View Frustum (min/max see-able distance)  */

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGL1Renderer({ canvas: document.querySelector('#bg') })

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(40);
renderer.render(scene, camera)

// Adding geometry

const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 })
const torus = new THREE.Mesh(geometry, material)
scene.add(torus)

// Adding lighting

const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(10, 10, 20)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight('0xffffff', 0.5)
scene.add(ambientLight)

// Adding Helpers

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

// Animation & Rendering

function animate(){
  requestAnimationFrame(animate)
  {
    torus.rotation.x += 0.01
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01
  }
  controls.update()
  renderer.render(scene, camera)
}
animate()