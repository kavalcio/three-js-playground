import bayerColorFragmentShader from 'src/shaders/dither/fragment-color.glsl';
import vertexShader from 'src/shaders/dither/vertex.glsl';
import chromaticAberrationFragmentShader from 'src/shaders/postprocessing/fragment-chromatic-aberration.glsl';
import pixellationFragmentShader from 'src/shaders/postprocessing/fragment-pixellation.glsl';
import vertexSnappingShader from 'src/shaders/vertex-snapping/vertex.glsl';
import { getNormalizedBayerMatrix } from 'src/utils/misc';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import { initializeScene } from '@/utils';

// TODO: enable gzip compression for 3d files (.glb, .gltf, etc.)
export const init = (root) => {
  const PixellationShader = {
    uniforms: {
      uMap: { type: 't' },
      uResolution: { value: 230 },
      uPixellationMethodIndex: { value: 0 },
      uAspectRatio: {
        value: window.innerWidth / window.innerHeight,
      },
    },
    vertexShader,
    fragmentShader: pixellationFragmentShader,
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
    fragmentShader: bayerColorFragmentShader,
  };

  const ChromaticAberrationShader = {
    uniforms: {
      uMap: { type: 't' },
      uChromaticAberrationOffset: { value: 0.02 },
    },
    vertexShader,
    fragmentShader: chromaticAberrationFragmentShader,
  };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
    antialias: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const customUniforms = {
    uTime: { value: 0 },
    uSnappingResolution: { value: 3 },
  };

  const addVertexSnappingToMaterial = (material) => {
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

  let model;
  let mixer;

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/xeno/scene.gltf', (gltf) => {
    // gltfLoader.load('/models/shark/scene.gltf', (gltf) => {
    console.log({ gltf });
    model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh) {
        console.log({ child });
        child.material.onBeforeCompile = addVertexSnappingToMaterial;
      }
    });

    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    scene.add(model);
    model.scale.set(10, 10, 10);
  });

  camera.position.set(30, 20, 40);
  camera.needsUpdate = true;
  controls.target = new THREE.Vector3(0, 15, 0);
  controls.update();

  // Postprocessing
  const composer = new EffectComposer(renderer);
  composer.outputColorSpace = THREE.LinearSRGBColorSpace;
  window.addEventListener('resize', () => {
    composer.setSize(window.innerWidth, window.innerHeight);
  });

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const pixellationPass = new ShaderPass(PixellationShader, 'uMap');
  composer.addPass(pixellationPass);

  const chromaticAberrationPass = new ShaderPass(
    ChromaticAberrationShader,
    'uMap',
  );
  composer.addPass(chromaticAberrationPass);

  const bayerDitherPass = new ShaderPass(BayerDitherShader, 'uMap');
  composer.addPass(bayerDitherPass);
  bayerDitherPass.enabled = false;

  window.addEventListener('resize', () => {
    pixellationPass.uniforms.uAspectRatio.value =
      window.innerWidth / window.innerHeight;
  });

  // Create env map
  const rgbeLoader = new RGBELoader();
  rgbeLoader.load('/the_sky_is_on_fire_1k.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = environmentMap;
    scene.environment = environmentMap;
  });
  scene.backgroundBlurriness = 0.07;
  scene.backgroundIntensity = 0.5;

  // Create GUI
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
  chromaticAberrationGui.add(chromaticAberrationPass, 'enabled');
  chromaticAberrationGui
    .add(chromaticAberrationPass.uniforms.uChromaticAberrationOffset, 'value')
    .name('intensity')
    .min(0)
    .max(0.2);

  const bayerDitherGui = gui.addFolder('Bayer Dithering');
  bayerDitherGui.add(bayerDitherPass, 'enabled');

  const vertexSnappingGui = gui.addFolder('Vertex Snapping');
  vertexSnappingGui
    .add(customUniforms.uSnappingResolution, 'value')
    .min(0.5)
    .max(10)
    .step(0.1)
    .name('Snap Resolution');

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    controls.update();

    const deltaTime = clock.getDelta();

    if (mixer) {
      mixer.update(deltaTime);
    }

    stats.end();
    composer.render(scene, camera);
  }

  animate();
};
