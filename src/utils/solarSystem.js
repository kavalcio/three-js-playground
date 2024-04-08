import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export const BLOOM_LAYER_ID = 1;

const originalMaterials = {};

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER_ID);

const darkMaterial = new THREE.MeshBasicMaterial({ color: 'black' });

export const createSelectiveUnrealBloomComposer = ({
  renderer,
  scene,
  camera,
}) => {
  const bloomComposer = new EffectComposer(renderer);
  window.addEventListener('resize', () =>
    bloomComposer.setSize(window.innerWidth, window.innerHeight),
  );
  const renderPass = new RenderPass(scene, camera);
  bloomComposer.addPass(renderPass);
  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.1,
  );
  bloomComposer.addPass(bloomPass);
  bloomComposer.renderToScreen = false;

  const mixPass = new ShaderPass(
    new THREE.ShaderMaterial({
      uniforms: {
        baseTexture: { value: null },
        bloomTexture: { value: bloomComposer.renderTarget2.texture },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;
        varying vec2 vUv;
        void main() {
          gl_FragColor = (texture2D(baseTexture, vUv) + vec4(0.4) * texture2D(bloomTexture, vUv));
          // #include <tonemapping_fragment>
          // #include <encodings_fragment>
        }
      `,
    }),
    'baseTexture',
  );

  const finalComposer = new EffectComposer(renderer);
  window.addEventListener('resize', () =>
    finalComposer.setSize(window.innerWidth, window.innerHeight),
  );
  finalComposer.addPass(renderPass);
  finalComposer.addPass(mixPass);
  finalComposer.renderToScreen = true;

  return {
    bloomComposer,
    finalComposer,
  };
};

export const checkObjectNonBloomed = (obj) => {
  if (obj.isMesh && !bloomLayer.test(obj.layers)) {
    originalMaterials[obj.uuid] = obj.material;
    obj.material = darkMaterial;
  }
};

export const restoreNonBloomedObjectMaterial = (obj) => {
  if (originalMaterials[obj.uuid]) {
    obj.material = originalMaterials[obj.uuid];
    delete originalMaterials[obj.uuid];
  }
};
