import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const debug = false;
const free  = false;

if (free) {
  (<HTMLElement>document.getElementById('app')).remove()
}

// Initialise scene and renderer
const canvasElemement = <HTMLCanvasElement>document.getElementById('bg')
const scene = new THREE.Scene()
const renderer = new THREE.WebGL1Renderer({ canvas: canvasElemement })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const controls = new OrbitControls(camera, renderer.domElement)
let targetCoords: [number, number, number] = [10, 1, 10] // For interpolation
camera.position.set(...targetCoords)
scene.add(camera)

// Mark Cube
const markTexture1 = new THREE.TextureLoader().load('assets/mark/square_portrait_1.jpg')
const markTexture2 = new THREE.TextureLoader().load('assets/mark/square_portrait_2.jpg')
const mark = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.4, 0.4),
  new THREE.MeshBasicMaterial({ map: markTexture1 })
)
camera.add(mark)
mark.rotation.x = 0.2
mark.position.set(0.8, 0.5, -2)

// Ambient lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.04)
scene.add(ambientLight)

// Background image
const spaceTexture = new THREE.TextureLoader().load('assets/space/2k_stars_milky_way.jpg')
scene.background = spaceTexture;

// Sun (w/ point light)
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(10, 34, 32),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('assets/sun/2k_sun.jpg'),
  })
)
const pointLight = new THREE.PointLight(0xffffff, 2)
sun.add(pointLight)
scene.add(sun)
sun.position.set(100, 0, 5)

// Earth
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(3, 34, 32),
  new THREE.MeshPhongMaterial({
    map         : new THREE.TextureLoader().load('assets/earth/2k_earth_daymap.jpg'),
    normalMap   : new THREE.TextureLoader().load('assets/earth/2k_earth_normal_map.jpg'),
    normalScale : new THREE.Vector2(7, 7),
    specularMap : new THREE.TextureLoader().load('assets/earth/2k_earth_specular_map.jpg'),
    shininess   : 50
  })
)
const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(3.02, 34, 32),
  new THREE.MeshPhongMaterial({
    map         : new THREE.TextureLoader().load('assets/earth/2k_earth_clouds.jpg'),
    side        : THREE.DoubleSide,
    opacity     : 0.3,
    transparent : true,
    depthWrite  : false,
  })
)
earth.position.set(0, 0, 0)
scene.add(earth)
earth.add(clouds)

// Moon
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(1, 34, 32),
  new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('assets/moon/2k_moon.jpg')
  })
)
scene.add(moon)

// Stars
function addStar(){
  const geometry = new THREE.SphereGeometry(0.1, 24, 24)
  const material = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)
  let [x, y, z] = [0, 0, 0]
  while (Math.sqrt(x**2 + y**2 + z**2) < 20) {
    // Repeat until we find coordates are >= 20 from origin
    [x, y, z] = Array(3).fill(null).map(() => THREE.MathUtils.randFloatSpread(300)) // [-300, 300]
  }
  star.position.set(x, y, z)
  scene.add(star)
}
Array(200).fill(null).forEach(addStar)

// Debug Helpers
if (debug) {
  const pointLightHelper = new THREE.PointLightHelper(pointLight)
  const gridHelper = new THREE.GridHelper(200, 50)
  scene.add(pointLightHelper)
  scene.add(gridHelper)
}

// On resize window (update FOV & mark cube position)
window.addEventListener("resize", () => {
  //
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight )
  mark.position.x = window.innerWidth * 0.001
});

// On scroll (animation & camera movement)
function handleScroll() {

  // Zoom-out effect (in conjunction with OrbitControls)
  const scrollPos = -document.body.getBoundingClientRect().top // Scroll position
  const scrollMax =  Math.max(
    document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight,
    document.documentElement.scrollHeight, document.documentElement.offsetHeight
  ) - window.innerHeight;
  const t = (2 * scrollPos / scrollMax)**3
  targetCoords = [10 - 50*t, 1 + 2*t, 10]

}
document.body.onscroll = handleScroll

// Animation & Rendering
function animate(){
  requestAnimationFrame(animate)

  // Mark Rotation (rotation)
  mark.rotation.y += 0.01

  // Earth animation (rotation)
  earth.rotation.y += 0.005
  clouds.rotation.y += 0.0015
  if(mark.rotation.y % 10 < 0.01){
    mark.material.map = mark.material.map === markTexture1 ? markTexture2 : markTexture1
  }

  // Moon (rotation & orbit)
  const time = new Date().getTime() / 1000
  const rps = 0.3
  moon.rotation.y = time * rps * Math.PI + 0.5*Math.PI
  moon.position.x = Math.sin(time * rps * Math.PI) * 10
  moon.position.z = Math.cos(time * rps * Math.PI) * 10

  // Camera (interpolated movement)
  if(!free){
    camera.position.lerp(new THREE.Vector3(...targetCoords), 0.05)
  }

  controls.update()
  renderer.render(scene, camera)
}
animate()