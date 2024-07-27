import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { initializeScene } from 'src/utils/template';

export const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  camera.position.set(12, 6, 12);

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/coffeeMug.glb', (gltf) => {
    gltf.scene.getObjectByName('baked').material.map.anisotropy = 8;
    gltf.scene.position.y -= 3;
    scene.add(gltf.scene);
  });

  const clock = new THREE.Clock();

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    controls.update();

    stats.end();
    renderer.render(scene, camera);
  };

  tick();
};
