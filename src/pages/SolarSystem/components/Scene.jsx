import { OrbitControls, Stats, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import * as THREE from 'three';

import planetFragmentShader from '../shaders/fragment-planet.glsl';
import planetVertexShader from '../shaders/vertex-planet.glsl';

// TODO: dont forget to normalize light direction
// TODO: add bloom to sun

const sunSpherical = new THREE.Spherical(1, Math.PI / 2, Math.PI / 2);
const sunDirection = new THREE.Vector3();

export const Scene = () => {
  const sphereRef = useRef();

  useFrame((state, delta) => {
    if (rotate) sphereRef.current.rotation.y += delta / 2;
    sphereRef.current.material.uniforms.uTime.value += delta;
  });

  const textures = useTexture({
    earthDay: '/solar/earth_day.jpg',
    earthNight: '/solar/earth_night.jpg',
    earthNormal: '/solar/earth_normal.png',
    earthSpecular: '/solar/earth_specular.png',
  });

  textures.earthDay.colorSpace = THREE.SRGBColorSpace;
  textures.earthNight.colorSpace = THREE.SRGBColorSpace;

  const [{ rotate, lightPhi, lightTheta }] = useControls(() => ({
    rotate: { value: false, label: 'Rotate' },
    lightPhi: {
      value: sunSpherical.phi,
      min: 0,
      max: Math.PI,
      label: 'Light Phi',
      onChange: (value) => {
        sunSpherical.set(sunSpherical.radius, value, sunSpherical.theta);
        sphereRef.current.material.uniforms.uLightDirection.value.setFromSpherical(
          sunSpherical,
        );
      },
    },
    lightTheta: {
      value: sunSpherical.theta,
      min: 0,
      max: Math.PI * 2,
      label: 'Light Theta',
      onChange: (value) => {
        sunSpherical.set(sunSpherical.radius, sunSpherical.phi, value);
        sphereRef.current.material.uniforms.uLightDirection.value.setFromSpherical(
          sunSpherical,
        );
      },
    },
  }));

  return (
    <>
      <Stats />

      <OrbitControls dampingFactor={0.18} makeDefault />

      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight color={0xffffff} intensity={1} position={[3, 3, 3]} />
      <mesh ref={sphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uLightDirection: { value: sunDirection },
            uDayMap: { value: textures.earthDay },
            uNightMap: { value: textures.earthNight },
            uNormalMap: { value: textures.earthNormal },
          }}
        />
      </mesh>
    </>
  );
};
