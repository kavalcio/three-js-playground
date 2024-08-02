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
      uModelColor: { value: new THREE.Color(0xffffff) },

      uAmbientColor: { value: new THREE.Color(0xffffff) },
      uAmbientIntensity: { value: 0.05 },

      uDirectionalColor: { value: new THREE.Color(0xffffff) },
      uDirectionalDiffuseIntensity: { value: 0.5 },
      uDirectionalSpecularIntensity: { value: 0.5 },
      uDirectionalSpecularPower: { value: 20 },
      uDirectionalPosition: { value: new THREE.Vector3(0.0, 0.0, 3.0) },
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

  // GUI
  const sceneFolder = gui.addFolder('Scene');
  sceneFolder
    .addColor(material.uniforms.uModelColor, 'value')
    .name('Model Color');

  const ambientLightFolder = gui.addFolder('Ambient Light');
  ambientLightFolder
    .addColor(material.uniforms.uAmbientColor, 'value')
    .name('Color');
  ambientLightFolder
    .add(material.uniforms.uAmbientIntensity, 'value', 0, 1, 0.01)
    .name('Intensity');

  const directionalLightFolder = gui.addFolder('Directional Light');
  directionalLightFolder
    .addColor(material.uniforms.uDirectionalColor, 'value')
    .name('Color')
    .onChange(() => {
      directionalLightHelper.material.color =
        material.uniforms.uDirectionalColor.value;
    });
  directionalLightFolder
    .add(material.uniforms.uDirectionalDiffuseIntensity, 'value', 0, 2, 0.1)
    .name('Diffuse Intensity');
  directionalLightFolder
    .add(material.uniforms.uDirectionalSpecularIntensity, 'value', 0, 2, 0.1)
    .name('Specular Intensity');
  directionalLightFolder
    .add(material.uniforms.uDirectionalSpecularPower, 'value', 1, 100, 1)
    .name('Specular Power');

  const onDirectionalLightPositionChange = () => {
    directionalLightHelper.position.copy(
      material.uniforms.uDirectionalPosition.value,
    );
    directionalLightHelper.lookAt(0, 0, 0);
  };

  directionalLightFolder
    .add(material.uniforms.uDirectionalPosition.value, 'x', -10, 10, 0.1)
    .name('Position X')
    .onChange(onDirectionalLightPositionChange);
  directionalLightFolder
    .add(material.uniforms.uDirectionalPosition.value, 'y', -10, 10, 0.1)
    .name('Position Y')
    .onChange(onDirectionalLightPositionChange);
  directionalLightFolder
    .add(material.uniforms.uDirectionalPosition.value, 'z', -10, 10, 0.1)
    .name('Position Z')
    .onChange(onDirectionalLightPositionChange);

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
