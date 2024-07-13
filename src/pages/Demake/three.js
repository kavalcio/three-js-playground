import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

import vertexShader from 'src/shaders/dither/vertex.glsl';
import pixellationFragmentShader from 'src/shaders/postprocessing/fragment-pixellation.glsl';
import bayerColorFragmentShader from 'src/shaders/dither/fragment-color.glsl';
import vertexSnappingShader from 'src/shaders/vertex-snapping/vertex.glsl';
import chromaticAberrationFragmentShader from 'src/shaders/postprocessing/fragment-chromatic-aberration.glsl';

import { getNormalizedBayerMatrix } from 'src/utils/misc';
import { initializeScene } from 'src/utils/template';

// TODO: some shader passes mess with the colors and make everything darker. look into it (maybe gamma correction? or outputEncoding?)
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
      uChromaticAberrationOffset: { value: 0.05 },
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
    uSnappingResolution: { value: 2 },
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
  let modelMaterial;
  let mixer;

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('/models/scp/scene.gltf', (gltf) => {
    console.log({ gltf });
    model = gltf.scene;

    model.traverse((child) => {
      if (child.userData.name === 'Plane__0') {
        const parent = child.parent;
        parent.remove(child);
      }
      if (child.userData.name === 'Object_269') {
        modelMaterial = child.material;
        child.material.onBeforeCompile = addVertexSnappingToMaterial;
      }
    });

    modelMaterial.roughness = 0.6;

    gui
      .add(modelMaterial, 'flatShading')
      .name('Flat Shading')
      .onChange(() => {
        modelMaterial.needsUpdate = true;
      });

    gui
      .add(modelMaterial, 'roughness')
      .min(0)
      .max(1)
      .name('Roughness')
      .onChange(() => {
        modelMaterial.needsUpdate = true;
      });

    mixer = new THREE.AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);
    action.play();

    scene.add(model);
    model.scale.set(10, 10, 10);
    // camera.lookAt(model.position);
  });

  camera.position.set(20, 55, 30);
  camera.needsUpdate = true;
  controls.update();

  // Postprocessing
  const composer = new EffectComposer(renderer);
  composer.outputColorSpace = THREE.LinearSRGBColorSpace;
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const pixellationPass = new ShaderPass(PixellationShader, 'uMap');
  composer.addPass(pixellationPass);
  pixellationPass.enabled = false;

  const bayerDitherPass = new ShaderPass(BayerDitherShader, 'uMap');
  composer.addPass(bayerDitherPass);
  bayerDitherPass.enabled = false;

  const chromaticAberrationPass = new ShaderPass(
    ChromaticAberrationShader,
    'uMap',
  );
  composer.addPass(chromaticAberrationPass);
  chromaticAberrationPass.enabled = false;

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

  gui
    .add(customUniforms.uSnappingResolution, 'value')
    .min(0.5)
    .max(10)
    .step(0.1)
    .name('Snap Resolution');

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    const deltaTime = clock.getDelta();

    if (mixer) {
      mixer.update(deltaTime);
    }

    stats.end();
    composer.render(scene, camera);
  }

  animate();
};
