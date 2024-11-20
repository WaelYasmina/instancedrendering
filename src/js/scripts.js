import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sets the color of the background.
renderer.setClearColor(0xfefefe);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Sets orbit control to move the camera around.
const orbit = new OrbitControls(camera, renderer.domElement);

// Camera positioning.
camera.position.set(6, 8, 14);
// Has to be done everytime we update the camera position.
orbit.update();

// const ambientLight = new THREE.AmbientLight(0x333333);
// scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 10, 10);
// scene.add(directionalLight);

// const geometry = new THREE.IcosahedronGeometry();
// const material = new THREE.MeshPhongMaterial();
// const mesh = new THREE.InstancedMesh(geometry, material, 10000);
// scene.add(mesh);

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

let starMesh;
const dummy = new THREE.Object3D();

rgbeLoader.load('/rosendal_plains_1_1k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = texture;

  gltfLoader.load('/star.glb', function (glb) {
    const mesh = glb.scene.getObjectByName('Star_Star_0');
    const geometry = mesh.geometry.clone();
    const material = mesh.material;

    starMesh = new THREE.InstancedMesh(geometry, material, 10000);
    scene.add(starMesh);

    for (let i = 0; i < 10000; i++) {
      dummy.position.x = Math.random() * 40 - 20;
      dummy.position.y = Math.random() * 40 - 20;
      dummy.position.z = Math.random() * 40 - 20;

      dummy.rotation.x = Math.random() * 2 * Math.PI;
      dummy.rotation.y = Math.random() * 2 * Math.PI;
      dummy.rotation.z = Math.random() * 2 * Math.PI;

      dummy.scale.x = dummy.scale.y = dummy.scale.z = 0.04 * Math.random();

      dummy.updateMatrix();
      starMesh.setMatrixAt(i, dummy.matrix);
      starMesh.setColorAt(i, new THREE.Color(Math.random() * 0xffffff));
    }
  });
});

const matrix = new THREE.Matrix4();
function animate(time) {
  if (starMesh) {
    for (let i = 0; i < 10000; i++) {
      starMesh.getMatrixAt(i, matrix);
      matrix.decompose(dummy.position, dummy.rotation, dummy.scale);

      dummy.rotation.x = ((i / 10000) * time) / 1000;
      dummy.rotation.y = ((i / 10000) * time) / 500;
      dummy.rotation.z = ((i / 10000) * time) / 1200;

      dummy.updateMatrix();
      starMesh.setMatrixAt(i, dummy.matrix);
    }
    starMesh.instanceMatrix.needsUpdate = true;

    starMesh.rotation.y = time / 10000;
  }

  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
