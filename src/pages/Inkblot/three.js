import * as THREE from 'three';
import { smootherstep } from 'three/src/math/MathUtils';

import { initializeScene } from '@/utils';

import fragmentShader from './shaders/fragment.glsl';
import vertexShader from './shaders/vertex.glsl';

// TODO: make the plane rectangular?
// TODO: when we set speed to 0, we always get the same inkblot. can we randomize it?

export const init = (root) => {
  const params = { stepSize: 3 };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  renderer.setClearColor(0x333333, 1);

  camera.position.set(0, 0, 20);
  controls.update();

  const material = new THREE.RawShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 10.0 },
      uThreshold: { value: 0.2 },
    },
    side: THREE.DoubleSide,
  });

  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 20, 20),
    material,
  );
  scene.add(object);

  const clock = new THREE.Clock();

  gui
    .add(material.uniforms.uSpeed, 'value')
    .min(0)
    .max(70)
    .step(0.01)
    .name('Speed');
  gui
    .add(material.uniforms.uThreshold, 'value')
    .min(-1)
    .max(1)
    .step(0.01)
    .name('Threshold');
  gui.add(params, 'stepSize').min(0).max(10).step(1).name('Time Step Size');

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    controls.update();

    const elapsedTime = clock.getElapsedTime();

    if (params.stepSize === 0) {
      material.uniforms.uTime.value = elapsedTime;
    } else {
      material.uniforms.uTime.value =
        Math.floor(elapsedTime / params.stepSize) +
        smootherstep(elapsedTime % params.stepSize, 0, params.stepSize);
    }

    renderer.render(scene, camera);
    stats.end();
  };

  tick();
};
