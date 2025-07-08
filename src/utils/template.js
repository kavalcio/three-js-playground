import GUI from 'lil-gui';
import Stats from 'stats.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const initializeScene = ({ root, antialias = true } = {}) => {
  // Create scene
  const scene = new THREE.Scene();

  // Create camera
  const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 110;

  // Create renderer
  const renderer = new THREE.WebGLRenderer({ antialias });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.18;
  root.appendChild(renderer.domElement);

  const onWindowResize = () => {
    // Adjust camera and renderer on window resize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    controls.update();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };
  onWindowResize();
  window.addEventListener('resize', onWindowResize, false);

  // Create GUI
  const gui = new GUI({ container: root });

  const stats = new Stats();
  stats.showPanel(0);
  root.appendChild(stats.domElement);

  return {
    scene,
    renderer,
    camera,
    controls,
    gui,
    stats,
    clearScene: () => {
      console.log('clearing scene');
      renderer.domElement.remove();
      stats.domElement.remove();
      gui.destroy();
    },
  };
};
