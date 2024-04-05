// Noise generators: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js';

import vertexShader from 'src/shaders/dither/vertex.glsl';
import chromaticAberrationFragmentShader from 'src/shaders/postprocessing/fragment-chromatic-aberration.glsl';
import filmGrainFragmentShader from 'src/shaders/postprocessing/fragment-film-grain.glsl';
import bayerFragmentShader from 'src/shaders/dither/fragment-bayer.glsl';

import { getNormalizedBayerMatrix } from 'src/utils/misc';
import { initializeScene } from 'src/utils/template';

// TODO: add custom color option to bayer dither shader?
// TODO: for film grain, create a different random value for each color channel?
// TODO: add the ability to manually shift shader pass order in gui. is that possible?
// TODO: add ability to toggle object texture on/off?

const init = (root) => {
  const ChromaticAberrationShader = {
    uniforms: {
      uMap: { type: 't' },
      uChromaticAberrationOffset: { value: 0.05 },
    },
    vertexShader,
    fragmentShader: chromaticAberrationFragmentShader,
  };

  const bayerOrder = 2;
  const BayerDitherShader = {
    uniforms: {
      uMap: { type: 't' },
      uThresholdArray: { value: getNormalizedBayerMatrix(bayerOrder) },
      uThresholdMatrixWidth: { value: Math.pow(2, bayerOrder + 1) },
    },
    vertexShader,
    fragmentShader: bayerFragmentShader,
  };

  const FilmGrainShader = {
    uniforms: {
      uMap: { type: 't' },
      uTime: { value: 0.0 },
      uIntensity: { value: 0.1 },
    },
    vertexShader,
    fragmentShader: filmGrainFragmentShader,
  };

  // const imageTexture = new THREE.TextureLoader().load(bgImage);
  const createObject = () => {
    const obj = new THREE.Mesh(
      new THREE.IcosahedronGeometry(10),
      // new THREE.MeshPhongMaterial({ color: 0xbbffdd, map: imageTexture }),
      new THREE.MeshPhongMaterial({ color: 0xbbffdd }),
    );
    return obj;
  };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
    antialias: false,
  });

  camera.position.set(58, 55, 130);
  controls.update();

  // Postprocessing
  const composer = new EffectComposer(renderer);
  composer.outputColorSpace = THREE.LinearSRGBColorSpace;
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  const chromaticAberrationPass = new ShaderPass(
    ChromaticAberrationShader,
    'uMap',
  );
  composer.addPass(chromaticAberrationPass);
  const smaaPass = new SMAAPass(
    window.innerWidth * renderer.getPixelRatio(),
    window.innerHeight * renderer.getPixelRatio(),
  );
  composer.addPass(smaaPass);
  const bayerDitherPass = new ShaderPass(BayerDitherShader, 'uMap');
  composer.addPass(bayerDitherPass);
  bayerDitherPass.enabled = false;
  const filmGrainPass = new ShaderPass(FilmGrainShader, 'uMap');
  composer.addPass(filmGrainPass);
  filmGrainPass.enabled = false;

  // Create lights
  const ambientLight = new THREE.AmbientLight(0x404040, 6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.x = 1;
  directionalLight.position.z = 1;
  scene.add(directionalLight);

  // Create objects
  const obj1 = createObject();
  scene.add(obj1);

  const obj2 = createObject();
  scene.add(obj2);

  // Create clock
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    filmGrainPass.uniforms.uTime.value = elapsedTime;
  };

  // Create GUI
  const chromaticAberrationGui = gui.addFolder('Chromatic Aberration');
  chromaticAberrationGui.open();
  chromaticAberrationGui.add(chromaticAberrationPass, 'enabled');
  chromaticAberrationGui
    .add(chromaticAberrationPass.uniforms.uChromaticAberrationOffset, 'value')
    .name('intensity')
    .min(0)
    .max(0.2);
  const bayerDitherGui = gui.addFolder('Bayer Dithering');
  bayerDitherGui.open();
  bayerDitherGui.add(bayerDitherPass, 'enabled');
  const filmGrainGui = gui.addFolder('Film Grain');
  filmGrainGui.open();
  filmGrainGui.add(filmGrainPass, 'enabled');
  filmGrainGui
    .add(filmGrainPass.uniforms.uIntensity, 'value')
    .name('intensity')
    .min(0)
    .max(1);

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    // Rotate obj
    obj2.rotation.x -= 0.01;
    obj2.rotation.z += 0.01;

    // Move obj in a circle
    obj2.position.x = 20 * Math.cos(Date.now() * 0.0005);
    obj2.position.y = 20 * Math.sin(Date.now() * 0.0005);

    tick();

    stats.end();
    composer.render(scene, camera);
  }

  animate();
};

export default {
  init,
};
