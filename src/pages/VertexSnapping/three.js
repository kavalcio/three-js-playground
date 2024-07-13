import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import vertexSnappingShader from 'src/shaders/vertex-snapping/vertex.glsl';
import { initializeScene } from 'src/utils/template';

export const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  // https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

  camera.position.set(8, 0, 60);
  controls.update();

  // env map
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('/the_sky_is_on_fire_1k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
  });
  scene.backgroundBlurriness = 0.07;
  scene.backgroundIntensity = 0.5;

  const material = new THREE.MeshStandardMaterial({
    color: '#999999',
    roughness: 0.2,
  });

  const params = {
    rotationSpeed: 0.002,
  };

  const customUniforms = {
    uTime: { value: 0 },
    uSnappingResolution: { value: 2 },
  };

  material.onBeforeCompile = (material) => {
    material.uniforms.uTime = customUniforms.uTime;
    material.uniforms.uSnappingResolution = customUniforms.uSnappingResolution;
    material.vertexShader = material.vertexShader.replace(
      '#include <common>',
      `
        #include <common>

        uniform float uTime;
        uniform float uSnappingResolution;
    `,
    );
    material.vertexShader = material.vertexShader.replace(
      '#include <project_vertex>',
      vertexSnappingShader,
    );
  };

  // TODO: should this snap to world space or view space? right now it's snapping to view space
  // TODO: pretty easy to make it snap to world space, just need to do snapping between the modelMatrix multiplication and the viewMatrix multiplication

  gui
    .add(customUniforms.uSnappingResolution, 'value')
    .min(0.5)
    .max(10)
    .step(0.1)
    .name('Snap Resolution');
  gui.add(params, 'rotationSpeed').min(0).max(0.01).name('Rotation Speed');
  gui
    .add(material, 'flatShading')
    .name('Flat Shading')
    .onChange(() => {
      material.needsUpdate = true;
    });

  const object = new THREE.Mesh(
    new THREE.TorusKnotGeometry(6, 2, 128, 32),
    material,
  );
  scene.add(object);

  const clock = new THREE.Clock();

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    const elapsedTime = clock.getElapsedTime();

    customUniforms.uTime.value = elapsedTime;

    object.rotateX(params.rotationSpeed);
    object.rotateY(params.rotationSpeed);

    renderer.render(scene, camera);
    stats.end();
  };

  tick();
};
