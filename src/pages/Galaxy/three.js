import * as THREE from 'three';

import { initializeScene } from 'src/utils/template';
import { getRandomPolarCoordinate } from 'src/utils/misc';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export const init = (root) => {
  const params = {
    particleCount: 250000,
    particleScale: 17,
    branches: 6,
    branchRadius: 5,
    spin: 0.5,
    radialRandomness: 0.3,
    innerColor: '#f29050',
    outerColor: '#b182f2',
  };

  const { scene, renderer, camera, gui, stats, controls } = initializeScene({
    root,
  });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.position.set(7, 4, 7);
  controls.update();

  let material = null;
  let geometry = null;
  let points = null;

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
    const sizes = new Float32Array(params.particleCount);
    const positionRandomness = new Float32Array(params.particleCount * 3);
    const innerColor = new THREE.Color(params.innerColor);
    const outerColor = new THREE.Color(params.outerColor);
    for (let i = 0; i < params.particleCount; i++) {
      const i3 = i * 3;

      const radius = params.branchRadius * Math.random();
      const branchAngle =
        ((i % params.branches) / params.branches) * Math.PI * 2;
      // const spinAngle = params.spin * radius * Math.PI * 2;

      const randRadius = Math.random() * params.radialRandomness * radius;
      const {
        x: randX,
        y: randY,
        z: randZ,
      } = getRandomPolarCoordinate(randRadius);

      positions[i3] = radius * Math.cos(branchAngle);
      positions[i3 + 1] = 0;
      positions[i3 + 2] = radius * Math.sin(branchAngle);

      positionRandomness[i3] = randX;
      positionRandomness[i3 + 1] = randY;
      positionRandomness[i3 + 2] = randZ;

      const mixedColor = innerColor
        .clone()
        .lerp(outerColor, radius / params.branchRadius);
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      sizes[i] = params.particleScale * Math.random() * 2 + 0.5;
    }

    material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uRotationSpeed: { value: params.spin },
      },
      vertexShader,
      fragmentShader,
    });
    geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute(
      'aPositionRandomness',
      new THREE.BufferAttribute(positionRandomness, 3),
    );

    points = new THREE.Points(geometry, material);
    scene.add(points);
  };

  generateGalaxy();

  // Create GUI
  gui.width = 360;
  gui
    .add(params, 'particleCount', 5000, 500000, 100)
    .onFinishChange(generateGalaxy);
  gui.add(params, 'particleScale', 1, 40).onFinishChange(generateGalaxy);
  gui.add(params, 'branches', 2, 15, 1).onFinishChange(generateGalaxy);
  gui.add(params, 'branchRadius', 1, 10).onFinishChange(generateGalaxy);
  gui.add(params, 'spin', -2, 2).onFinishChange(generateGalaxy);
  gui.add(params, 'radialRandomness', 0, 1).onFinishChange(generateGalaxy);
  gui.addColor(params, 'innerColor').onFinishChange(generateGalaxy);
  gui.addColor(params, 'outerColor').onFinishChange(generateGalaxy);

  const clock = new THREE.Clock();

  const tick = () => {
    requestAnimationFrame(tick);
    stats.begin();

    const elapsedTime = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsedTime + 100;

    stats.end();
    renderer.render(scene, camera);
  };

  tick();
};
