import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { initializeScene } from '@/utils';

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

export const init = (root) => {
  const { scene, renderer, camera, stats, controls, clearScene } =
    initializeScene({
      root,
    });

  camera.position.set(12, 6, 12);

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/coffeeMug.glb', (gltf) => {
    gltf.scene.getObjectByName('baked').material.map.anisotropy = 8;
    controls.target.y += 3;
    scene.add(gltf.scene);
  });

  const textureLoader = new THREE.TextureLoader();
  const perlinTexture = textureLoader.load('/perlin.png');
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
  smokeGeometry.translate(0, 0.5, 0);
  smokeGeometry.scale(1.5, 6, 1.5);

  const smokeMaterial = new THREE.ShaderMaterial({
    // wireframe: true,
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uPerlinTexture: { value: perlinTexture },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
  smoke.position.y = 1.83;
  scene.add(smoke);

  const clock = new THREE.Clock();

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    controls.update();

    smokeMaterial.uniforms.uTime.value = clock.getElapsedTime();

    stats.end();
    renderer.render(scene, camera);
  };

  tick();

  return clearScene;
};
