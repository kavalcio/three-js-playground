// Noise generators: https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';

import vertexShader from 'src/shaders/dither/vertex.glsl';
import chromaticAberrationFragmentShader from 'src/shaders/postprocessing/fragment-chromatic-aberration.glsl';
import filmGrainFragmentShader from 'src/shaders/postprocessing/fragment-film-grain.glsl';
import bayerFragmentShader from 'src/shaders/dither/fragment-bayer.glsl';
import pixellationFragmentShader from 'src/shaders/postprocessing/fragment-pixellation.glsl';

import { getNormalizedBayerMatrix } from 'src/utils/misc';
import { initializeScene } from 'src/utils/template';

// TODO: for film grain, create a different random value for each color channel?
// TODO: add the ability to manually shift shader pass order in gui. is that possible?
// TODO: hexagonal pixellation pattern instead of square?
// TODO: add lighting envmap

const params = {
  rotationSpeed: 1,
};

export const init = (root) => {
  const PixellationShader = {
    uniforms: {
      uMap: { type: 't' },
      uResolution: { value: 100 },
      uPixellationMethodIndex: { value: 0 },
      uAspectRatio: {
        value: window.innerWidth / window.innerHeight,
      },
    },
    vertexShader,
    fragmentShader: pixellationFragmentShader,
  };

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
      uBrightColor: { value: new THREE.Color(0xfff00f) },
      uDarkColor: { value: new THREE.Color(0x770000) },
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

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
    antialias: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.position.set(58, 55, 130);
  controls.update();

  // Postprocessing
  const renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      samples: 2,
    },
  );

  const composer = new EffectComposer(renderer, renderTarget);
  composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  composer.outputColorSpace = THREE.LinearSRGBColorSpace;

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const pixellationPass = new ShaderPass(PixellationShader, 'uMap');
  composer.addPass(pixellationPass);
  pixellationPass.enabled = false;

  const chromaticAberrationPass = new ShaderPass(
    ChromaticAberrationShader,
    'uMap',
  );
  composer.addPass(chromaticAberrationPass);
  chromaticAberrationPass.enabled = false;

  const bayerDitherPass = new ShaderPass(BayerDitherShader, 'uMap');
  composer.addPass(bayerDitherPass);
  bayerDitherPass.enabled = false;

  const filmGrainPass = new ShaderPass(FilmGrainShader, 'uMap');
  composer.addPass(filmGrainPass);
  filmGrainPass.enabled = false;

  const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gammaCorrectionPass);

  window.addEventListener('resize', () => {
    pixellationPass.uniforms.uAspectRatio.value =
      window.innerWidth / window.innerHeight;
    composer.setSize(window.innerWidth, window.innerHeight);
    composer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Create lights
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
  directionalLight.position.x = 1;
  directionalLight.position.z = 1;
  scene.add(directionalLight);

  // Create objects
  const obj1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(8, 3, 100, 16),
    new THREE.MeshPhongMaterial({ color: 0xffbbdd }),
  );
  scene.add(obj1);
  const obj2 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(10),
    new THREE.MeshPhongMaterial({ color: 0xbbffdd }),
  );
  scene.add(obj2);
  const obj3 = new THREE.Mesh(
    new THREE.IcosahedronGeometry(10),
    new THREE.MeshPhongMaterial({ color: 0xbbffdd }),
  );
  scene.add(obj3);

  // Create clock
  const clock = new THREE.Clock();
  const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    filmGrainPass.uniforms.uTime.value = elapsedTime;
  };

  // Create GUI
  gui.add(params, 'rotationSpeed').min(0).max(3).name('Rotation Speed');
  const pixellationUi = gui.addFolder('Pixellation');
  pixellationUi.add(pixellationPass, 'enabled');
  pixellationUi
    .add(pixellationPass.uniforms.uPixellationMethodIndex, 'value')
    .name('Sampling Method')
    .options({ Median: 0, Mean: 1 });
  pixellationUi
    .add(pixellationPass.uniforms.uResolution, 'value')
    .name('Resolution')
    .step(10)
    .min(10)
    .max(300);
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
  bayerDitherGui
    .addColor(bayerDitherPass.uniforms.uBrightColor, 'value')
    .name('Bright Color');
  bayerDitherGui
    .addColor(bayerDitherPass.uniforms.uDarkColor, 'value')
    .name('Dark Color');
  const filmGrainGui = gui.addFolder('Film Grain');
  filmGrainGui.open();
  filmGrainGui.add(filmGrainPass, 'enabled');
  filmGrainGui
    .add(filmGrainPass.uniforms.uIntensity, 'value')
    .name('intensity')
    .min(0)
    .max(1);

  let objectPositionAngle = 0;

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    // Rotate obj
    obj1.rotation.y += 0.006 * params.rotationSpeed;
    obj1.rotation.z -= 0.006 * params.rotationSpeed;
    obj2.rotation.x -= 0.008 * params.rotationSpeed;
    obj2.rotation.z += 0.008 * params.rotationSpeed;
    obj3.rotation.x -= 0.008 * params.rotationSpeed;
    obj3.rotation.z += 0.008 * params.rotationSpeed;

    // Move obj in a circle
    objectPositionAngle += 0.005 * params.rotationSpeed;
    obj2.position.x = 30 * Math.cos(objectPositionAngle);
    obj2.position.y = 30 * Math.sin(objectPositionAngle);
    obj3.position.x = 30 * Math.cos(objectPositionAngle + Math.PI);
    obj3.position.y = 30 * Math.sin(objectPositionAngle + Math.PI);

    tick();

    stats.end();
    composer.render(scene, camera);
  }

  animate();
};
