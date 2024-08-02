import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

// TODO: add gui controls for light color, position, intensity, etc.
export const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });
  // renderer.setClearColor(0x222233);

  camera.position.set(7, 7, 7);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(0xffffff) },
      uSpecularPower: { value: 20 },
    },
    vertexShader,
    fragmentShader,
  });

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

  // Light helpers
  const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
  );
  directionalLightHelper.position.set(0, 0, 3);
  scene.add(directionalLightHelper);

  gui.addColor(material.uniforms.uColor, 'value').name('Color');
  gui
    .add(material.uniforms.uSpecularPower, 'value', 1, 100, 1)
    .name('Specular Power');

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
