import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const params = {
  backgroundColor: 0x222233,
  modelColor: 0xff794d,
};

export const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });
  renderer.setClearColor(params.backgroundColor);

  camera.position.set(0, 0, 12);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uModelColor: { value: new THREE.Color(params.modelColor) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    },
    vertexShader,
    fragmentShader,
  });

  window.addEventListener('resize', () => {
    material.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
    );
  });

  /**
   * Objects
   */

  // Torus knot
  const torusKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
    material,
  );
  torusKnot.position.x = 0;
  scene.add(torusKnot);

  // Sphere
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
  sphere.position.x = -3;
  scene.add(sphere);

  // Icosahedron
  const icosahedron = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1),
    material,
  );
  icosahedron.position.x = 3;
  scene.add(icosahedron);

  /**
   * GUI
   */
  gui
    .addColor(params, 'backgroundColor')
    .name('Background color')
    .onChange(() => {
      renderer.setClearColor(params.backgroundColor);
    });
  gui
    .addColor(params, 'modelColor')
    .name('Model color')
    .onChange(() => {
      material.uniforms.vModelColor.value.set(params.modelColor);
    });

  const clock = new THREE.Clock();

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    controls.update();

    const elapsedTime = clock.getElapsedTime();

    sphere.rotation.x = -elapsedTime * 0.1;
    sphere.rotation.y = elapsedTime * 0.2;

    torusKnot.rotation.x = -elapsedTime * 0.1;
    torusKnot.rotation.y = elapsedTime * 0.2;

    icosahedron.rotation.x = -elapsedTime * 0.1;
    icosahedron.rotation.y = elapsedTime * 0.2;

    stats.end();
    renderer.render(scene, camera);
  };

  tick();

  return renderer;
};
