import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const params = {
  modelColor: 0xff794d,
  shadowColor: 0x7208aa,
};

export const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });
  renderer.setClearColor(0x222233);

  camera.position.set(0, 0, 12);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uModelColor: { value: new THREE.Color(params.modelColor) },
      uShadowColor: { value: new THREE.Color(params.shadowColor) },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uInvert: { value: false },
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
    .addColor(params, 'modelColor')
    .name('Model color')
    .onChange(() => {
      material.uniforms.uModelColor.value.set(params.modelColor);
    });
  gui
    .addColor(params, 'shadowColor')
    .name('Shadow color')
    .onChange(() => {
      material.uniforms.uShadowColor.value.set(params.shadowColor);
    });
  gui.add(material.uniforms.uInvert, 'value').name('Invert');

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
