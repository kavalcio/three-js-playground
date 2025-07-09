import * as THREE from 'three';

import { initializeScene } from '@/utils';

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

const params = {
  color: 0x7ff27d,
};

export const init = (root) => {
  const { scene, renderer, camera, stats, controls, gui, clearScene } =
    initializeScene({
      root,
    });
  renderer.setClearColor(0x222233);

  camera.position.set(7, 7, 7);

  const textureLoader = new THREE.TextureLoader();
  const perlinTexture = textureLoader.load('/perlin.png');
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(params.color) },
    },
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });

  // Torus knot
  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material,
  );
  torusKnot.position.x = 1.5;
  scene.add(torusKnot);

  // Sphere
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
  sphere.position.x = -1.5;
  scene.add(sphere);

  // GUI
  gui.addColor(params, 'color').onChange((color) => {
    material.uniforms.uColor.value.set(color);
  });

  const clock = new THREE.Clock();

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    controls.update();

    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    sphere.rotation.x = -elapsedTime * 0.1;
    sphere.rotation.y = elapsedTime * 0.2;

    torusKnot.rotation.x = -elapsedTime * 0.1;
    torusKnot.rotation.y = elapsedTime * 0.2;

    stats.end();
    renderer.render(scene, camera);
  };

  tick();

  return clearScene;
};
