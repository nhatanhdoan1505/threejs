import { Controller } from "./controller.js";
import * as THREE from "./lib/three/three.js/build/three.module.js";
import { OrbitControls } from "/src/lib/three/three.js/examples/jsm/controls/OrbitControls.js";

export class Scene {
  scene;
  camera;
  renderer;
  objects = [];
  controls;
  mixer;

  constructor() {
    this.createScene();
    this.createCamera();
    this.createRenderer();
    this.createLight();
    this.createGround();
    this.createOrbitControl();
  }

  createOrbitControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 100, 0);
    this.controls.update();
  }

  createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
  }

  createCamera(
    fieldOfView = 60,
    near = 0.1,
    far = 1000,
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight
  ) {
    const aspectRatio = canvasWidth / canvasHeight;
    this.camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      near,
      far
    );
    this.camera.position.z = 5;
  }

  createRenderer(
    canvasWidth = window.innerWidth,
    canvasHeight = window.innerHeight
  ) {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(canvasWidth, canvasHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  createLight() {
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);

    this.scene.add(hemiLight);
    this.scene.add(dirLight);
  }

  createGround() {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;

    const grid = new THREE.GridHelper(2000, 20, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;

    this.scene.add(mesh);
    this.scene.add(grid);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    let delta = new THREE.Clock().getDelta(); // clock is an instance of THREE.Clock
    if (this.mixer) {
      this.mixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
    // for (let i in this.objects) {
    //   this.objects[i].rotation.x += 0.01;
    // }
  }
}

// const app = () => {
//   let scene = new Scene();
//   let controller = new Controller();
//   window.controller = controller;
//   window.scene = scene;
//   scene.render();
// };

// function loadModel() {
//   window.controller.loadModel().then((danceModel) => {
//     console.log("aaaa");
//     danceModel.scale.setScalar(0, 1);
//     danceModel.traverse((c) => (c.castShadow = true));
//     const anim = new THREE.FBXLoader();
//     const mixer = null;
//     console.log("aaaa");
//     anim.load("./src/model/dance/dancing.fbx", (a) => {
//       mixer = new THREE.AnimationMixer(danceModel);
//       const idle = mixer.clipAction(a.animations[0]);
//       idle.play();
//     });
//     console.log(danceModel);
//     window.scene.addObject(danceModel);
//   });
// }
