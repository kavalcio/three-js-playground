import * as THREE from 'three';

import { TransformControls } from 'three/addons/controls/TransformControls.js';

import { initializeScene } from 'src/utils/template';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

const params = {
  ambientColor: 0xffffff,
  directionalColor: 0xff8c2e,
  pointColor: 0xd60270,
};

export const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  camera.position.set(7, 7, 7);

  /**
   * Material
   */

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uModelColor: { value: new THREE.Color(0xffffff) },

      uAmbientColor: { value: new THREE.Color(params.ambientColor) },
      uAmbientIntensity: { value: 0.01 },

      uDirectionalColor: { value: new THREE.Color(params.directionalColor) },
      uDirectionalDiffuseIntensity: { value: 0.6 },
      uDirectionalSpecularIntensity: { value: 1.0 },
      uDirectionalSpecularPower: { value: 20 },
      uDirectionalPosition: { value: new THREE.Vector3(0.0, 0.0, 3.0) },

      uPointColor: { value: new THREE.Color(params.pointColor) },
      uPointDiffuseIntensity: { value: 1.2 },
      uPointSpecularIntensity: { value: 1.2 },
      uPointSpecularPower: { value: 15 },
      uPointPosition: { value: new THREE.Vector3(1.2, 1.6, 0.8) },
    },
    vertexShader,
    fragmentShader,
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
   * Light helpers and transform controls
   */
  const directionalLightHelper = new THREE.Mesh(
    new THREE.PlaneGeometry(),
    new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }),
  );
  directionalLightHelper.position.copy(
    material.uniforms.uDirectionalPosition.value,
  );
  directionalLightHelper.lookAt(0, 0, 0);
  directionalLightHelper.material.color =
    material.uniforms.uDirectionalColor.value;
  scene.add(directionalLightHelper);

  const directionalLightControl = new TransformControls(
    camera,
    renderer.domElement,
  );
  directionalLightControl.attach(directionalLightHelper);
  directionalLightControl.addEventListener('change', () => {
    material.uniforms.uDirectionalPosition.value.copy(
      directionalLightHelper.position,
    );
    directionalLightHelper.lookAt(0, 0, 0);
  });
  directionalLightControl.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
  });
  scene.add(directionalLightControl);

  const pointLightHelper = new THREE.Mesh(
    new THREE.SphereGeometry(0.2),
    new THREE.MeshBasicMaterial(),
  );
  pointLightHelper.position.copy(material.uniforms.uPointPosition.value);
  pointLightHelper.material.color = material.uniforms.uPointColor.value;
  scene.add(pointLightHelper);

  const pointLightControl = new TransformControls(camera, renderer.domElement);
  pointLightControl.attach(pointLightHelper);
  pointLightControl.addEventListener('change', () => {
    material.uniforms.uPointPosition.value.copy(pointLightHelper.position);
  });
  pointLightControl.addEventListener('dragging-changed', (event) => {
    controls.enabled = !event.value;
  });
  scene.add(pointLightControl);

  /**
   * GUI
   */

  // Scene
  const sceneFolder = gui.addFolder('Scene');
  sceneFolder
    .addColor(material.uniforms.uModelColor, 'value')
    .name('Model Color');

  // Ambient light
  const ambientLightFolder = gui.addFolder('Ambient Light');
  ambientLightFolder
    .addColor(params, 'ambientColor')
    .name('Color')
    .onChange((value) => {
      material.uniforms.uAmbientColor.value.set(value);
    });
  ambientLightFolder
    .add(material.uniforms.uAmbientIntensity, 'value', 0, 1, 0.01)
    .name('Intensity');

  // Directional light
  const directionalLightFolder = gui.addFolder('Directional Light');
  directionalLightFolder
    .addColor(params, 'directionalColor')
    .name('Color')
    .onChange(() => {
      material.uniforms.uDirectionalColor.value.set(params.directionalColor);
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

  // Point light
  const pointLightFolder = gui.addFolder('Point Light');
  pointLightFolder
    .addColor(params, 'pointColor')
    .name('Color')
    .onChange(() => {
      material.uniforms.uPointColor.value.set(params.pointColor);
      pointLightHelper.material.color = material.uniforms.uPointColor.value;
    });
  pointLightFolder
    .add(material.uniforms.uPointDiffuseIntensity, 'value', 0, 2, 0.1)
    .name('Diffuse Intensity');
  pointLightFolder
    .add(material.uniforms.uPointSpecularIntensity, 'value', 0, 2, 0.1)
    .name('Specular Intensity');
  pointLightFolder
    .add(material.uniforms.uPointSpecularPower, 'value', 1, 100, 1)
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
