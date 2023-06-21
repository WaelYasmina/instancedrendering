import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {RGBELoader} from 'three/examples/jsm/loaders/RGBELoader.js';

const renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

renderer.setClearColor(0xFFEA00);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 6, 15);
camera.lookAt(scene.position);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 10, 10);
scene.add(directionalLight);

const gltfLoader = new GLTFLoader();
const rgbeLoader = new RGBELoader();

renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2;

rgbeLoader.load('./assets/MR_INT-005_WhiteNeons_NAD.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;

    gltfLoader.load('./assets/star.glb', function(glb) {
        const mesh = glb.scene.getObjectByName('Star_Star_0');
        const geometry = mesh.geometry.clone();
        const material = mesh.material;
        const starMesh = new THREE.InstancedMesh(geometry, material, 10000);
        scene.add(starMesh);

        const dummy = new THREE.Object3D();
        for(let i = 0; i < 10000; i++) {
            dummy.position.x = Math.random() * 40 - 20;
            dummy.position.y = Math.random() * 40 - 20;
            dummy.position.z = Math.random() * 40 - 20;

            dummy.rotation.x = Math.random() * 2 * Math.PI;
            dummy.rotation.y = Math.random() * 2 * Math.PI;
            dummy.rotation.z = Math.random() * 2 * Math.PI;

            dummy.scale.x = dummy.scale.y = dummy.scale.z = 0.04 * Math.random();

            dummy.updateMatrix();
            starMesh.setMatrixAt(i, dummy.matrix);
            starMesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
        }
    });
});

// const geometry = new THREE.IcosahedronGeometry();
// const material = new THREE.MeshPhongMaterial({color: 0xFFEA00});
// const mesh = new THREE.InstancedMesh(geometry, material, 10000);
// scene.add(mesh);

// const dummy = new THREE.Object3D();
// for(let i = 0; i < 10000; i++) {
//     dummy.position.x = Math.random() * 40 - 20;
//     dummy.position.y = Math.random() * 40 - 20;
//     dummy.position.z = Math.random() * 40 - 20;

//     dummy.rotation.x = Math.random() * 2 * Math.PI;
//     dummy.rotation.y = Math.random() * 2 * Math.PI;
//     dummy.rotation.z = Math.random() * 2 * Math.PI;

//     dummy.scale.x = dummy.scale.y = dummy.scale.z = Math.random();

//     dummy.updateMatrix();
//     mesh.setMatrixAt(i, dummy.matrix);
//     mesh.setColorAt(i, new THREE.Color(Math.random() * 0xFFFFFF));
// }

// const matrix = new THREE.Matrix4();
function animate(time) {
    // for(let i = 0; i < 10000; i++) {
    //     mesh.getMatrixAt(i, matrix);
    //     matrix.decompose(dummy.position, dummy.rotation, dummy.scale);

    //     dummy.rotation.x = i/10000 * time/1000;
    //     dummy.rotation.y = i/10000 * time/500;
    //     dummy.rotation.z = i/10000 * time/1200;
    
    //     dummy.updateMatrix();
    //     mesh.setMatrixAt(i, dummy.matrix);
    // }
    // mesh.instanceMatrix.needsUpdate = true;

    // mesh.rotation.y = time / 10000;

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});