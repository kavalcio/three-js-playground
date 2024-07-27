import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';
import { getRandomPolarCoordinate } from 'src/utils/misc';
import starImage from 'src/assets/star.png';

export const init = (root) => {
  const params = {
    particleCount: 250000,
    particleSize: 0.02,
    branches: 6,
    branchRadius: 5,
    spin: 0.2,
    radialRandomness: 0.5,
    innerColor: '#ff812e',
    outerColor: '#a668ff',
  };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  camera.position.set(7, 4, 7);
  controls.update();

  let spinDirection = 1;
  let material = null;
  let geometry = null;
  let points = null;

  const particleTexture = new THREE.TextureLoader().load(starImage);

  const generateGalaxy = () => {
    // Remove old particles
    if (points) {
      geometry.dispose();
      material.dispose();
      scene.remove(points);
    }

    // Create new particles
    const positions = new Float32Array(params.particleCount * 3);
    const colors = new Float32Array(params.particleCount * 3);
    const innerColor = new THREE.Color(params.innerColor);
    const outerColor = new THREE.Color(params.outerColor);
    for (let i = 0; i < params.particleCount; i++) {
      const i3 = i * 3;

      const radius = params.branchRadius * Math.random();
      const branchAngle =
        ((i % params.branches) / params.branches) * Math.PI * 2;
      const spinAngle = params.spin * radius * Math.PI * 2;

      const randRadius = Math.random() * params.radialRandomness * radius;
      const {
        x: randX,
        y: randY,
        z: randZ,
      } = getRandomPolarCoordinate(randRadius);

      positions[i3] = radius * Math.cos(branchAngle + spinAngle) + randX;
      positions[i3 + 1] = randY;
      positions[i3 + 2] = radius * Math.sin(branchAngle + spinAngle) + randZ;

      const mixedColor = innerColor
        .clone()
        .lerp(outerColor, radius / params.branchRadius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    material = new THREE.PointsMaterial({
      size: params.particleSize,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      alphaMap: particleTexture,
    });
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    points = new THREE.Points(geometry, material);
    scene.add(points);

    spinDirection = params.spin > 0 ? 1 : -1;
  };

  generateGalaxy();

  // Create GUI
  gui.width = 360;
  gui
    .add(params, 'particleCount', 5000, 500000, 100)
    .onFinishChange(generateGalaxy);
  gui.add(params, 'particleSize', 0.005, 0.15).onFinishChange(generateGalaxy);
  gui.add(params, 'branches', 2, 15, 1).onFinishChange(generateGalaxy);
  gui.add(params, 'branchRadius', 1, 10).onFinishChange(generateGalaxy);
  gui.add(params, 'spin', -1, 1).onFinishChange(generateGalaxy);
  gui.add(params, 'radialRandomness', 0, 1).onFinishChange(generateGalaxy);
  gui.addColor(params, 'innerColor').onFinishChange(generateGalaxy);
  gui.addColor(params, 'outerColor').onFinishChange(generateGalaxy);

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    controls.update();

    geometry.rotateY(0.001 * spinDirection);

    stats.end();
    renderer.render(scene, camera);
  };

  tick();
};
