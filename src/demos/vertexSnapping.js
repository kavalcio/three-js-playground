import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';

const init = (root) => {
  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  // https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

  camera.position.set(8, 0, 60);
  controls.update();

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });

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

export default { init };
