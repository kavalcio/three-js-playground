/*
https://en.wikipedia.org/wiki/Dither
https://github.com/mrdoob/three.js/blob/1a241ef10048770d56e06d6cd6a64c76cc720f95/examples/webgl_postprocessing.html
https://threejs.org/examples/?q=post#webgl_postprocessing
https://threejs.org/examples/?q=postpro#webgl_postprocessing_rgb_halftone
https://thebookofshaders.com/00/
https://www.mia.uni-saarland.de/Research/IP_Halftoning.shtml
*/

import * as THREE from 'three';

import vertexShader from 'src/shaders/dither/vertex.glsl';
import bayerFragmentShader from 'src/shaders/dither/fragment-bayer.glsl';
import blueFragmentShader from 'src/shaders/dither/fragment-blue.glsl';
import fixedFragmentShader from 'src/shaders/dither/fragment-fixed.glsl';
import randomFragmentShader from 'src/shaders/dither/fragment-random.glsl';
import originalFragmentShader from 'src/shaders/dither/fragment-original.glsl';
import bgImage from 'src/assets/xp_background.jpg';

/* Blue noise mask downloaded from: http://momentsingraphics.de/BlueNoise.html */
import blueNoiseImage from 'src/assets/blue_noise_128_128_1.png';

import { initializeScene } from 'src/utils/template';
import { getNormalizedBayerMatrix } from 'src/utils/misc';

/* TODOS:
- Add halftone dithering matrix method - Is this the same thing as stippling?
- Add variable dark and bright color options
- Implement non-monochrome dithering
- Add text on screen to show which dithering algorithm is being used
*/

const init = (root) => {
  const { scene, renderer, camera, gui, stats } = initializeScene({ root });

  camera.position.z = 100;
  camera.fov = 35;
  camera.updateProjectionMatrix();

  // Create material
  const imageTexture = new THREE.TextureLoader().load(bgImage);
  const blueNoiseTexture = new THREE.TextureLoader().load(blueNoiseImage);
  const ditherMaterial = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: bayerFragmentShader,
    transparent: true,
    uniforms: {
      uMap: { type: 't', value: imageTexture },
      uThresholdArray: { value: null },
      uThresholdMatrixWidth: { value: null },
      uThresholdTexture: { value: null },
    },
  });

  const applyBayerDither = (n) => {
    ditherMaterial.fragmentShader = bayerFragmentShader;
    ditherMaterial.uniforms.uThresholdMatrixWidth.value = Math.pow(2, n + 1);
    ditherMaterial.uniforms.uThresholdArray.value = getNormalizedBayerMatrix(n);
    ditherMaterial.needsUpdate = true;
  };
  const applyFixedDither = () => {
    ditherMaterial.fragmentShader = fixedFragmentShader;
    ditherMaterial.needsUpdate = true;
  };
  const applyRandomDither = () => {
    ditherMaterial.fragmentShader = randomFragmentShader;
    ditherMaterial.needsUpdate = true;
  };
  const applyNoDither = () => {
    ditherMaterial.fragmentShader = originalFragmentShader;
    ditherMaterial.needsUpdate = true;
  };
  const applyBlueNoise = () => {
    ditherMaterial.fragmentShader = blueFragmentShader;
    ditherMaterial.uniforms.uThresholdMatrixWidth.value = 128;
    ditherMaterial.uniforms.uThresholdTexture.value = blueNoiseTexture;
    ditherMaterial.needsUpdate = true;
  };

  // Initialize page to show Bayer dithering
  applyBayerDither(1);

  const planeGeo = new THREE.PlaneGeometry(100, 60);
  const planeObj = new THREE.Mesh(planeGeo, ditherMaterial);
  scene.add(planeObj);
  // planeObj.position.z = -20;

  // Create GUI
  gui.add({ Original: () => applyNoDither() }, 'Original');
  gui.add({ 'Fixed threshold': () => applyFixedDither() }, 'Fixed threshold');
  gui.add(
    { 'Random threshold': () => applyRandomDither() },
    'Random threshold',
  );
  gui.add({ 'Bayer (level 0)': () => applyBayerDither(0) }, 'Bayer (level 0)');
  gui.add({ 'Bayer (level 1)': () => applyBayerDither(1) }, 'Bayer (level 1)');
  gui.add({ 'Bayer (level 2)': () => applyBayerDither(2) }, 'Bayer (level 2)');
  gui.add({ 'Bayer (level 3)': () => applyBayerDither(3) }, 'Bayer (level 3)');
  gui.add({ 'Blue noise': () => applyBlueNoise() }, 'Blue noise');

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    stats.end();
    renderer.render(scene, camera);
  }

  animate();
};

export default {
  init,
};
