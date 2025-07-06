import * as THREE from 'three';

import bgImage from '@/assets/xp_background.jpg';
import { initializeScene } from '@/utils';

const DISTANCE = -30;

export const init = (root) => {
  let params = {
    distance: DISTANCE,
  };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  scene.background = new THREE.Color(0x222222);

  camera.position.z = 50;
  camera.fov = 65;
  camera.updateProjectionMatrix();

  // Create lights
  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 1;
  scene.add(directionalLight);

  // Create glass orb
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    roughness: 0,
    transmission: 1,
    thickness: 7,
  });
  // TODO: implement physically accurate refraction?
  // const refractSphereCamera = new THREE.CubeCamera( 0.1, 5000, 512 );
  // scene.add( refractSphereCamera );
  // refractSphereCamera.renderTarget.mapping = new THREE.CubeRefractionMapping();
  // const sphereMaterial = new THREE.MeshBasicMaterial({
  // 	color: 0xccccff,
  // 	envMap: refractSphereCamera.renderTarget,
  // 	refractionRatio: 0.985,
  // 	reflectivity: 0.9
  // });
  const sphereGeometry = new THREE.SphereGeometry(7, 32, 32);
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);

  // Create background
  const bgTexture = new THREE.TextureLoader().load(bgImage);
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  const bgGeometry = new THREE.PlaneGeometry(100, 60);
  const bgMaterial = new THREE.MeshBasicMaterial({ map: bgTexture });
  const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
  scene.add(bgMesh);

  gui.add(params, 'distance', -120, -7);
  gui.add(sphereMaterial, 'roughness', 0, 1);
  gui.add(sphereMaterial, 'transmission', 0, 1);
  gui.add(sphereMaterial, 'thickness', 0, 20);

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();

    controls.update();

    // Move background
    bgMesh.position.set(0, 0, params.distance);

    stats.end();
    renderer.render(scene, camera);
  }

  animate();
};
