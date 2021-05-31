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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

// Adding Helpers

const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)

const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

// Add object function

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)) // [-100, 100]
  star.position.set(x, y, z)
  scene.add(star)
}
Array(200).fill().forEach(addStar)

// Background Textures

const spaceTexture = new THREE.TextureLoader().load('img/space.jpg')
scene.background = spaceTexture;

// Object Texture Mapping

const markTexture = new THREE.TextureLoader().load('img/square_portrait_2.jpg')
const mark = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: markTexture })
)
scene.add(mark)

const moonTexture = new THREE.TextureLoader().load('img/moon.jpg')
const moonNormalMap = new THREE.TextureLoader().load('img/normal.jpg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 34, 32),
  new THREE.MeshStandardMaterial({  map: moonTexture, normalMap: moonNormalMap,
                                    normalScale: new THREE.Vector2(0.6, 0.6)    })
)
moon.position.set(-10, 0, 10)
moon.rotation.x = 0.5
scene.add(moon)

// Animation & Rendering

function animate(){
  requestAnimationFrame(animate)
  {
    torus.rotation.x += 0.01
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01
    moon.rotation.y += 0.01
  }
  controls.update()
  renderer.render(scene, camera)
}
animate()