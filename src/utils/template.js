import * as THREE from 'three';
import GUI from 'lil-gui';
import Stats from 'stats.js';
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
  // const controls = new OrbitControls(camera, renderer.domElement);
  // document.body.appendChild(renderer.domElement);
  root.appendChild(renderer.domElement);

  function onWindowResize() {
    // Adjust camera and renderer on window resize
    camera.aspect = window.innerWidth / window.innerHeight;
    const initialWindowHeight = window.innerHeight;
    const tanFOV = Math.tan(((Math.PI / 180) * camera.fov) / 2);
    camera.fov =
      (360 / Math.PI) *
      Math.atan(tanFOV * (window.innerHeight / initialWindowHeight));
    camera.updateProjectionMatrix();
    camera.lookAt(scene.position);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }
  window.addEventListener('resize', onWindowResize, false);

  // Create GUI
  const gui = new GUI();

  const stats = new Stats();
  stats.showPanel(0);
  root.appendChild(stats.domElement);

  return {
    scene,
    renderer,
    camera,
    // controls,
    gui,
    stats,
  };
};
