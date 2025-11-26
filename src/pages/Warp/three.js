import image1 from 'src/assets/shoe1.webp';
import image2 from 'src/assets/shoe2.webp';
import warpShader from 'src/pages/Warp/shaders/warp.glsl';
import vertexShader from 'src/shaders/dither/vertex.glsl';
import * as THREE from 'three';

import { initializeScene } from '@/utils';

const params = {
  animationSpeed: 1.0,
};

export const init = ({ root }) => {
  const { scene, renderer, camera, gui, stats, controls, clearScene } =
    initializeScene({
      root,
    });
  scene.background = new THREE.Color(0x222222);

  camera.position.z = 100;
  camera.fov = 35;
  camera.updateProjectionMatrix();
  // controls.disconnect();
  // controls.panSpeed = 0;
  controls.rotateSpeed = 0;

  let planeObj;

  // Create material
  const loader = new THREE.TextureLoader();
  const imageTexture1 = loader.load(image1, (texture) => {
    const imageAspectRatio = texture.image.width / texture.image.height;
    planeObj.scale.set(imageAspectRatio, 1, 1);
  });
  const imageTexture2 = loader.load(image2);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader: warpShader,
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uMap1: { type: 't', value: imageTexture1 },
      uMap2: { type: 't', value: imageTexture2 },
    },
  });

  const planeGeo = new THREE.PlaneGeometry(40, 40);
  planeObj = new THREE.Mesh(planeGeo, material);
  scene.add(planeObj);

  const clock = new THREE.Clock();

  // Create GUI
  gui
    .add(
      {
        loadFile: () => {
          document.getElementById('fileInput1').click();
        },
      },
      'loadFile',
    )
    .name('Upload Image 1');
  gui
    .add(
      {
        loadFile: () => {
          document.getElementById('fileInput2').click();
        },
      },
      'loadFile',
    )
    .name('Upload Image 2');
  gui.add(params, 'animationSpeed', 0, 5, 0.1).name('Animation Speed');

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    controls.update();

    material.uniforms.uTime.value += clock.getDelta() * params.animationSpeed;

    stats.end();
    renderer.render(scene, camera);
  }

  animate();

  return { material, mesh: planeObj, clearScene };
};
