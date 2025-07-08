import * as THREE from 'three';

import { initializeScene } from '@/utils';

import {
  BLOOM_LAYER_ID,
  checkObjectNonBloomed,
  createSelectiveUnrealBloomComposer,
  restoreNonBloomedObjectMaterial,
} from './utils';

// TODO: try out tonemapping
// TODO: get outer wilds assets using AssetStudio

export const init = (root) => {
  const { scene, renderer, camera, stats, controls, clearScene } =
    initializeScene({
      root,
    });

  camera.position.set(0, 0, 30);
  controls.update();

  const { bloomComposer, finalComposer } = createSelectiveUnrealBloomComposer({
    renderer,
    scene,
    camera,
  });

  // Create lights
  const ambientLight = new THREE.AmbientLight(0x404040, 6);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 6, 0, 0.5);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // Create objects
  const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc77 });
  const planetMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

  const sun = new THREE.Mesh(sphereGeometry, sunMaterial);
  sun.layers.enable(BLOOM_LAYER_ID);
  scene.add(sun);

  const planet1 = new THREE.Mesh(sphereGeometry, planetMaterial);
  planet1.position.x = 5;
  scene.add(planet1);

  const planet2 = new THREE.Mesh(sphereGeometry, planetMaterial);
  planet2.position.x = -5;
  scene.add(planet2);

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    controls.update();

    scene.traverse(checkObjectNonBloomed);
    bloomComposer.render(scene, camera);
    scene.traverse(restoreNonBloomedObjectMaterial);
    finalComposer.render(scene, camera);

    stats.end();
  };

  tick();

  return clearScene;
};
