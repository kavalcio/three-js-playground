import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

import vertexShader from 'src/shaders/dither/vertex.glsl';
import pixellationFragmentShader from 'src/shaders/postprocessing/fragment-pixellation.glsl';
import bayerColorFragmentShader from 'src/shaders/dither/fragment-color.glsl';
import vertexSnappingShader from 'src/shaders/vertex-snapping/vertex.glsl';

import { getNormalizedBayerMatrix } from 'src/utils/misc';
import { initializeScene } from 'src/utils/template';

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

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
    antialias: false,
  });

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
      if (child.userData.name === 'Object_269') {
        modelMaterial = child.material;
        child.material.onBeforeCompile = addVertexSnappingToMaterial;
      }
    });

    gui
      .add(modelMaterial, 'flatShading')
      .name('Flat Shading')
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

  window.addEventListener('resize', () => {
    pixellationPass.uniforms.uAspectRatio.value =
      window.innerWidth / window.innerHeight;
  });

  // Create lights
  const ambientLight = new THREE.AmbientLight(0x404040, 6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
  directionalLight.position.x = 1;
  directionalLight.position.z = 1;
  scene.add(directionalLight);

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
  chromaticAberrationGui.open();

  const bayerDitherGui = gui.addFolder('Bayer Dithering');
  bayerDitherGui.open();
  bayerDitherGui.add(bayerDitherPass, 'enabled');
  bayerDitherGui
    .addColor(bayerDitherPass.uniforms.uBrightColor, 'value')
    .name('Bright Color');
  bayerDitherGui
    .addColor(bayerDitherPass.uniforms.uDarkColor, 'value')
    .name('Dark Color');

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
