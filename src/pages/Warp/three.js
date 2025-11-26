import image1 from 'src/assets/shoe1.webp';
import image2 from 'src/assets/shoe2.webp';
import warpShader from 'src/pages/Warp/shaders/warp.glsl';
import vertexShader from 'src/shaders/dither/vertex.glsl';
import * as THREE from 'three';

import { initializeScene } from '@/utils';

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
  // controls.rotateSpeed = 0;

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
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
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
          document.getElementById('fileInput').click();
        },
      },
      'loadFile',
    )
    .name('Upload Image');

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    controls.update();

    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime;

    stats.end();
    renderer.render(scene, camera);
  }

  animate();

  return { material, mesh: planeObj, clearScene };
};
