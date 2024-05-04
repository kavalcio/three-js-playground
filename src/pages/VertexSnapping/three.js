import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

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
  rgbeLoader.load('/src/assets/the_sky_is_on_fire_1k.hdr', (environmentMap) => {
    console.log(environmentMap);
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
  });
  scene.backgroundBlurriness = 0.07;
  scene.backgroundIntensity = 0.5;

  const material = new THREE.MeshStandardMaterial({ color: 0x22ee22 });

  const customUniforms = {
    uTime: { value: 0 },
  };

  material.onBeforeCompile = (shader) => {
    console.log(shader);
    shader.uniforms.uTime = customUniforms.uTime;
    shader.vertexShader = shader.vertexShader.replace(
      '#include <common>',
      `
        #include <common>

        uniform float uTime;
    `,
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      `
        #include <begin_vertex>

        float snappingPower = 2.0;

        transformed = vec3(
          floor(transformed.x * snappingPower) / snappingPower,
          floor((transformed.y + sin(uTime) * 2.0) * snappingPower) / snappingPower,
          floor(transformed.z * snappingPower) / snappingPower);
    `,
    );
  };

  const object = new THREE.Mesh(
    new THREE.TorusKnotGeometry(6, 2, 128, 32),
    material,
  );
  object.position.set(3, -2, 0);
  scene.add(object);

  const clock = new THREE.Clock();

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    const elapsedTime = clock.getElapsedTime();

    customUniforms.uTime.value = elapsedTime;

    // object.rotateX(0.005);
    // object.rotateY(0.005);

    renderer.render(scene, camera);
    stats.end();
  };

  tick();
};
