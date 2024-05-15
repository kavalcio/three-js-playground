import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

// TODO: make plane large and add fog so that you can't see the edges?

export const init = ({ root, onModalOpen }) => {
  const params = {
    peakColor: 0xa0ffe8,
    valleyColor: 0x184650,
  };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  camera.position.set(-10, 15, 20);
  camera.lookAt(scene.position);
  controls.update();

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: { value: 0 },

      uPeakColor: { value: new THREE.Color(params.peakColor) },
      uValleyColor: { value: new THREE.Color(params.valleyColor) },
      uColorOffset: { value: 0.9 },
      uColorDamping: { value: 4.5 },

      uSinWaveFrequency: { value: new THREE.Vector2(0.4, 0.3) },
      uWaveAmplitude: { value: 0.8 },
      uSinWaveSpeed: { value: new THREE.Vector2(0.6, 1.3) },

      uPerlinWaveIterations: { value: 3 },
      uPerlinWaveFrequency: { value: 0.6 },
      uPerlinWaveAmplitude: { value: 0.5 },
      uPerlinWaveSpeed: { value: 0.6 },
    },
    // wireframe: true,
    side: THREE.DoubleSide,
  });

  const object = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10, 512, 512),
    material,
  );
  object.rotation.x = Math.PI / 2;
  scene.add(object);

  const clock = new THREE.Clock();

  gui.width = 300;
  gui
    .add({ openModal: () => onModalOpen() }, 'openModal')
    .name('About This Demo');
  const colorFolder = gui.addFolder('Color');
  colorFolder.open();
  colorFolder
    .addColor(params, 'peakColor')
    .name('Peak Color')
    .onChange((value) => {
      material.uniforms.uPeakColor.value.set(value);
    });
  colorFolder
    .addColor(params, 'valleyColor')
    .name('Valley Color')
    .onChange((value) => {
      material.uniforms.uValleyColor.value.set(value);
    });
  colorFolder
    .add(material.uniforms.uColorOffset, 'value')
    .min(0)
    .max(3)
    .step(0.01)
    .name('Color Offset');
  colorFolder
    .add(material.uniforms.uColorDamping, 'value')
    .min(1)
    .max(10)
    .step(0.01)
    .name('Color Damping');

  const sinWaveFolder = gui.addFolder('Sinusoidal Waves');
  sinWaveFolder.open();
  sinWaveFolder
    .add(material.uniforms.uSinWaveFrequency.value, 'x')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Wave Frequency X');
  sinWaveFolder
    .add(material.uniforms.uSinWaveFrequency.value, 'y')
    .min(0)
    .max(1)
    .step(0.01)
    .name('Wave Frequency Y');
  sinWaveFolder
    .add(material.uniforms.uWaveAmplitude, 'value')
    .min(0)
    .max(2)
    .step(0.01)
    .name('Wave Amplitude');
  sinWaveFolder
    .add(material.uniforms.uSinWaveSpeed.value, 'x')
    .min(0)
    .max(3)
    .step(0.01)
    .name('Animation Speed X');
  sinWaveFolder
    .add(material.uniforms.uSinWaveSpeed.value, 'y')
    .min(0)
    .max(3)
    .step(0.01)
    .name('Animation Speed Y');

  const perlinWaveFolder = gui.addFolder('Perlin Noise Waves');
  perlinWaveFolder.open();
  perlinWaveFolder
    .add(material.uniforms.uPerlinWaveIterations, 'value')
    .min(1)
    .max(7)
    .step(1)
    .name('Iterations');
  perlinWaveFolder
    .add(material.uniforms.uPerlinWaveFrequency, 'value')
    .min(0)
    .max(5)
    .step(0.01)
    .name('Wave Frequency');
  perlinWaveFolder
    .add(material.uniforms.uPerlinWaveAmplitude, 'value')
    .min(0)
    .max(2)
    .step(0.01)
    .name('Wave Amplitude');
  perlinWaveFolder
    .add(material.uniforms.uPerlinWaveSpeed, 'value')
    .min(0)
    .max(1.5)
    .step(0.01)
    .name('Animation Speed');

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    const elapsedTime = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsedTime;

    renderer.render(scene, camera);
    stats.end();
  };

  tick();
};
