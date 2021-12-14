import * as THREE from "./lib/three.js/build/three.module.js";
import { OrbitControls } from "./lib/three.js/examples/jsm/controls/OrbitControls.js";

export class Scene {
  scene;
  camera;
  renderer;
  objects = [];
  controls;
  clock = new THREE.Clock();
  isFirstDance = true;
  startAnim;
  duration;

  mixer;

  constructor() {
    this.createScene();
    this.createCamera();
    this.createLight();
    this.createGround();
    this.createRenderer();
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
    fieldOfView = 120,
    near = 0.1,
    far = 10000,
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
    this.camera.position.x = -9;
    this.camera.position.y = 104;
    this.camera.position.z = 229;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);
    window.addEventListener("resize", this.onWindowResize.bind(this));
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

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    let delta = this.clock.getDelta();
    this.objects.forEach((o) => {
      if (o.mixer) {
        o.mixer.update(delta);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}
