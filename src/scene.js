import * as THREE from "./lib/three.js/build/three.module.js";
import { OrbitControls } from "./lib/three.js/examples/jsm/controls/OrbitControls.js";
import { Utils } from "./utils.js";
import { EffectComposer } from "./lib/three.js/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "./lib/three.js/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "./lib/three.js/examples/jsm/postprocessing/ShaderPass.js";
import { BloomPass } from "./lib/three.js/examples/jsm/postprocessing/BloomPass.js";
import { FilmPass } from "./lib/three.js/examples/jsm/postprocessing/FilmPass.js";
import { FocusShader } from "./lib/three.js/examples/jsm/shaders/FocusShader.js";

export class Scene {
  scene;
  camera;
  renderer;
  objects = [];
  controls;
  parent;
  composer;
  effectFocus;
  renderModel;
  clonemeshes = [];
  meshes = [];

  clock = new THREE.Clock();
  isFirstDance = true;
  startAnim;
  duration;

  mixer;

  _x = -9;
  _y = 104;
  _z = 229;

  isMoveCamera = false;
  moveDirection = 1;

  welcomeScene = new THREE.Scene();
  menuScene = new THREE.Scene();
  mainScene = new THREE.Scene();

  sceneNumber;

  utils = new Utils();

  constructor() {
    this.createScene();
    this.createRenderer();
  }

  async loadScene() {
    await this.loadWelcomeScene();
    await this.loadMainScene();
    await this.loadMenuScene();
  }

  switchScene(numberScene) {
    switch (numberScene) {
      case 0:
        this.scene.background = new THREE.Color(0x000104);
        this.scene.fog = new THREE.FogExp2(0x000104, 0.0000675);
        this.camera = new THREE.PerspectiveCamera(
          20,
          window.innerWidth / window.innerHeight,
          1,
          50000
        );
        this.camera.position.set(0, 700, 7000);
        this.camera.lookAt(this.scene.position);
        this.renderModel = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderModel);
        this.scene = this.welcomeScene;
        this.sceneNumber = 0;
        this.render();
        break;
      case 1:
        this.scene = this.menuScene;
        this.camera = new THREE.PerspectiveCamera(
          20,
          window.innerWidth / window.innerHeight,
          1,
          50000
        );
        this.camera.position.set(0, 700, 7000);
        this.camera.lookAt(this.scene.position);
        this.sceneNumber = 1;
        this.render();
        break;
      case 2:
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000104);
        this.scene.fog = new THREE.FogExp2(0x000104, 0.0000675);

        this.createOrbitControl();

        this.scene = this.mainScene;
        this.render();
      default:
        break;
    }
  }

  loadMainScene() {
    return new Promise((resolve, reject) => {
      this.createLight();
      this.createGround();
      console.log("load main");
      resolve(true);
    });
  }

  loadWelcomeScene() {
    return new Promise(async (resolve, reject) => {
      this.parent = new THREE.Object3D();
      let { meshes, clonemeshes, meshList } =
        await this.utils.loadWelcomeScene();
      meshList.map((mesh) => mesh.map((m) => this.parent.add(m)));
      this.clonemeshes = clonemeshes.reduce((a, b) => a.concat(b));
      this.meshes = meshes;

      const grid = new THREE.Points(
        new THREE.PlaneGeometry(15000, 15000, 64, 64),
        new THREE.PointsMaterial({ color: 0xff0000, size: 10 })
      );
      grid.position.y = -400;
      grid.rotation.x = -Math.PI / 2;
      this.parent.add(grid);

      const effectBloom = new BloomPass(0.75);
      const effectFilm = new FilmPass(0.5, 0.5, 1448, false);

      this.effectFocus = new ShaderPass(FocusShader);

      this.effectFocus.uniforms["screenWidth"].value =
        window.innerWidth * window.devicePixelRatio;
      this.effectFocus.uniforms["screenHeight"].value =
        window.innerHeight * window.devicePixelRatio;

      this.composer = new EffectComposer(this.renderer);

      this.composer.addPass(effectBloom);
      this.composer.addPass(effectFilm);
      this.composer.addPass(this.effectFocus);

      this.welcomeScene.add(this.parent);

      console.log("load menu");
      resolve(true);
    });
  }

  loadMenuScene() {
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 200, 100);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 200, 0);

    this.menuScene.add(dirLight);
    this.menuScene.add(hemiLight);
  }

  createOrbitControl() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, 100, 0);
    this.controls.update();
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  setPositionCamera() {
    this.camera.position.x = this._x;
    this.camera.position.y = this._y;
    this.camera.position.z = this._z;
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.autoClear = false;

    const container = document.querySelector("#container");
    container.appendChild(this.renderer.domElement);
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

    this.mainScene.add(hemiLight);
    this.mainScene.add(dirLight);
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

    this.mainScene.add(mesh);
    this.mainScene.add(grid);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);

    this.effectFocus.uniforms["screenWidth"].value =
      window.innerWidth * window.devicePixelRatio;
    this.effectFocus.uniforms["screenHeight"].value =
      window.innerHeight * window.devicePixelRatio;
  }

  moveCamera() {
    this.camera.position.x += 0.5 * this.moveDirection;
    this.camera.position.y += 0.5;
    this.camera.position.z += 0.2;
  }

  objectAnimation(delta) {
    this.objects.forEach((o) => {
      if (o.mixer) {
        o.mixer.update(delta);
      }
    });
  }

  menuSceneAnimation(delta) {
    delta = delta < 2 ? delta : 2;
    this.parent.rotation.y += -0.02 * delta;
    for (let j = 0; j < this.clonemeshes.length; j++) {
      const cm = this.clonemeshes[j];
      cm.mesh.rotation.y += -0.1 * delta * cm.speed;
    }

    for (let j = 0; j < this.meshes.length; j++) {
      const data = this.meshes[j];
      const positions = data.mesh.geometry.attributes.position;
      const initialPositions = data.mesh.geometry.attributes.initialPosition;

      const count = positions.count;

      if (data.start > 0) {
        data.start -= 1;
      } else {
        if (data.direction === 0) {
          data.direction = -1;
        }
      }

      for (let i = 0; i < count; i++) {
        const px = positions.getX(i);
        const py = positions.getY(i);
        const pz = positions.getZ(i);

        // falling down
        if (data.direction < 0) {
          if (py > 0) {
            positions.setXYZ(
              i,
              px + 1.5 * (0.5 - Math.random()) * data.speed * delta,
              py + 3.0 * (0.25 - Math.random()) * data.speed * delta,
              pz + 1.5 * (0.5 - Math.random()) * data.speed * delta
            );
          } else {
            data.verticesDown += 1;
          }
        }

        // rising up
        if (data.direction > 0) {
          const ix = initialPositions.getX(i);
          const iy = initialPositions.getY(i);
          const iz = initialPositions.getZ(i);

          const dx = Math.abs(px - ix);
          const dy = Math.abs(py - iy);
          const dz = Math.abs(pz - iz);

          const d = dx + dy + dx;

          if (d > 1) {
            positions.setXYZ(
              i,
              px -
                ((px - ix) / dx) * data.speed * delta * (0.85 - Math.random()),
              py - ((py - iy) / dy) * data.speed * delta * (1 + Math.random()),
              pz -
                ((pz - iz) / dz) * data.speed * delta * (0.85 - Math.random())
            );
          } else {
            data.verticesUp += 1;
          }
        }
      }

      // all vertices down
      if (data.verticesDown >= count) {
        if (data.delay <= 0) {
          data.direction = 1;
          data.speed = 5;
          data.verticesDown = 0;
          data.delay = 320;
        } else {
          data.delay -= 1;
        }
      }

      // all vertices up
      if (data.verticesUp >= count) {
        if (data.delay <= 0) {
          data.direction = -1;
          data.speed = 15;
          data.verticesUp = 0;
          data.delay = 120;
        } else {
          data.delay -= 1;
        }
      }

      positions.needsUpdate = true;
    }

    this.composer.render(0.01);
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    let delta = this.clock.getDelta();

    if (this.composer && this.sceneNumber === 0)
      this.menuSceneAnimation(delta * 10);

    this.objectAnimation(delta);

    if (this.isMoveCamera) {
      this.moveCamera();
    }

    this.renderer.render(this.scene, this.camera);
  }
}
