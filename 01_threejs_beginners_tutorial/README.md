# Three.js Beginner’s Tutorial

See:
* [Build a Mindblowing 3D Portfolio Website // Three.js Beginner’s Tutorial](https://youtu.be/Q7AOvWpIVHU) by Fireship on YouTube

Contents:
- [Three.js Beginner’s Tutorial](#threejs-beginners-tutorial)
  - [01. Setup](#01-setup)
  - [02. Initial Configuration](#02-initial-configuration)
  - [03. Adding Geometry](#03-adding-geometry)
  - [04. Animation loop](#04-animation-loop)
  - [05. Adding Lighting](#05-adding-lighting)
  - [06. Adding Helpers](#06-adding-helpers)
  - [07. Function to Create Objects](#07-function-to-create-objects)
  - [08. Background Textures](#08-background-textures)
  - [09. Object Texture Mapping](#09-object-texture-mapping)
  - [10. Scrolling Animation & Moving the Camera](#10-scrolling-animation--moving-the-camera)

## 01. Setup

We will create an app using the Vite module bundler, using the Vite template: `npm init @vitejs/app`
```
✔ Project name: · myproject
✔ Select a framework: · vanilla
✔ Select a variant: · JavaScript
```

Install ThreeJS: `npm install three`

Run the dev server: `npm run dev`

We will add a canvas to the body.
```html
<canvas id="bg"></canvas>
```
And add CSS:
```css
canvas {
    position: fixed;
    top: 0;
    left: 0;
}
```

## 02. Initial Configuration

We will always need three objects:
* Scene
* Camera
* Renderer

```js
import * as THREE from 'three'

// Initialise scene, camera, and renderer
/* Camera arguments: FOV, Apect Ratio, View Frustum (min/max see-able distance)  */

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGL1Renderer({ canvas: document.querySelector('#bg') })

renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

camera.position.setZ(30);
renderer.render(scene, camera)
```

Here, we need to configure the renderer to be equal to the side of the page/element, and the
camera is positioned. The scene can then be rendered.

## 03. Adding Geometry

To add a shape, we need a Geometry and Mesh. Then create a Mest object.
```js
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true })
const torus = new THREE.Mesh(geometry, material)

scene.add(torus)
```

We still need lighting to view our materials.

## 04. Animation loop

To run the render method continuously, we should use `requestAnimationFrame` to tell the browser
that we want to activate on animation frames.
```js
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}
animate()
```

We can also add our animation logic in this loop!!!
```js
function animate(){
  requestAnimationFrame(animate)
  {
    torus.rotation.x += 0.01
    torus.rotation.y += 0.005
    torus.rotation.z += 0.01
  }
  renderer.render(scene, camera)
}
animate()
```

> Note: X is left/right, Y is up/down, Z is depth

## 05. Adding Lighting

We will change our Material from `MeshBasicMaterial` to `MestStandardMaterial`.
```js
const geometry = new THREE.TorusGeometry(10, 3, 16, 100)
const material = new THREE.MeshBasicMaterial({ color: 0xFF6347, wireframe: true })
const torus = new THREE.Mesh(geometry, material)
scene.add(torus)
```

Then we can add a 'point' light source:
```js
const pointLight = new THREE.PointLight(0xffffff)
pointLight.position.set(30, 30, 30)
scene.add(pointLight)
```

We can also add an 'ambient' lighting source:
```js
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)
```

## 06. Adding Helpers

We can add a point-light helper to show the position of a light:
```js
const pointLightHelper = new THREE.PointLightHelper(pointLight)
scene.add(pointLightHelper)
```

We can also add a grid-helper to view coordinates better:
```js
const gridHelper = new THREE.GridHelper(200, 50)
scene.add(gridHelper)
```

To view our grid and move around, we will use orbit controls:
```js
const controls = new OrbitControls(camera, renderer.domElement)

function animate(){
    // ...etc
    controls.update()
    renderer.render(scene, camera)
}
```
Now we can pan/zoom around the scene using mouse buttons.

## 07. Function to Create Objects

We can add multiple objects by defining a function that we can call.
```js
function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 24, 24)
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff })
  const star = new THREE.Mesh(geometry, material)
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100)) // [-100, 100]
  star.position.set(x, y, z)
  scene.add(star)
}
Array(200).fill().forEach(addStar)
```

## 08. Background Textures

We can add a background texture to a scene (though it will not move)
```js
const spaceTexture = new THREE.TextureLoader().load('img/space.jpg')
scene.background = spaceTexture;
```

## 09. Object Texture Mapping

We can create a Cube object and add our image to it:
```js
const markTexture = new THREE.TextureLoader().load('img/square_portrait_2.jpg')
const mark = new THREE.Mesh(
  new THREE.BoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: markTexture })
)
scene.add(mark)
```

We can create a sphere and add a moon texture and a normalmap:
```js
const moonTexture = new THREE.TextureLoader().load('img/moon.jpg')
const moonNormalMap = new THREE.TextureLoader().load('img/normal.jpg')
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 34, 32),
  new THREE.MeshStandardMaterial({  map: moonTexture, normalMap: moonNormalMap,
                                    normalScale: new THREE.Vector2(0.6, 0.6)    }))
moon.position.set(-10, 0, 10)
moon.rotation.x = 0.5
scene.add(moon)
```

## 10. Scrolling Animation & Moving the Camera

Now we will create scrollable overlayed text content over our background.

Add a `main` tag and add lots of written content.

Set position of main to absolute (otherwise it will be below background):
```css
main {
    position: absolute;
}
```

Add a `moveCamera` function on scroll to move objects:
```js
function moveCamera() {
  const t = document.body.getBoundingClientRect().top
  moon.rotation.x += 0.05
  moon.rotation.y += 0.075
  moon.rotation.z += 0.05

  mark.rotation.y += 0.01
  mark.rotation.z += 0.01

  camera.position.x = t * -0.01
  camera.position.z = t * 0.2 + 10
  camera.position.y = t * -0.0002

}
document.body.onscroll = moveCamera
```

Update CSS to add styling and format the text to a grid.

Now we have an awesome looking website!