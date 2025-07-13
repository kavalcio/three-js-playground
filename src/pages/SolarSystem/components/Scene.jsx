import { OrbitControls, Stats, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';
import * as THREE from 'three';

import planetFragmentShader from '../shaders/fragment-planet.glsl';
import planetVertexShader from '../shaders/vertex-planet.glsl';

// TODO: dont forget to normalize light direction
// TODO: add bloom to sun
// TODO: add buttons to focus camera on different bodies

const SUN_DISTANCE = 5;

const sunDirectionSpherical = new THREE.Spherical(1, Math.PI / 2, Math.PI / 2);
const sunDirectionCartesian = new THREE.Vector3();
const sunPosition = new THREE.Vector3();

export const Scene = () => {
  const earthRef = useRef();
  const sunRef = useRef();

  useFrame((state, delta) => {
    if (rotate) earthRef.current.rotation.y += delta / 2;
    earthRef.current.material.uniforms.uTime.value += delta;
  });

  const textures = useTexture({
    earthDay: '/solar/earth_day.jpg',
    earthNight: '/solar/earth_night.jpg',
    // earthNormal: '/solar/earth_normal.png',
    // earthSpecular: '/solar/earth_specular.png',
  });

  textures.earthDay.colorSpace = THREE.SRGBColorSpace;
  textures.earthNight.colorSpace = THREE.SRGBColorSpace;

  const updateSunPosition = (value, axis) => {
    sunDirectionSpherical.set(
      sunDirectionSpherical.radius,
      axis === 'phi' ? value : sunDirectionSpherical.phi,
      axis === 'theta' ? value : sunDirectionSpherical.theta,
    );
    earthRef.current.material.uniforms.uLightDirection.value.setFromSpherical(
      sunDirectionSpherical,
    );
    sunPosition
      .setFromSpherical(sunDirectionSpherical)
      .multiplyScalar(-SUN_DISTANCE);
    sunRef.current.position.copy(sunPosition);
  };

  const [{ rotate }] = useControls(() => ({
    rotate: { value: false, label: 'Rotate' },
    lightPhi: {
      value: sunDirectionSpherical.phi,
      min: 0,
      max: Math.PI,
      label: 'Light Phi',
      onChange: (value) => updateSunPosition(value, 'phi'),
    },
    lightTheta: {
      value: sunDirectionSpherical.theta,
      min: 0,
      max: Math.PI * 2,
      label: 'Light Theta',
      onChange: (value) => updateSunPosition(value, 'theta'),
    },
  }));

  return (
    <>
      <Stats />

      <OrbitControls dampingFactor={0.18} makeDefault />

      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight color={0xffffff} intensity={1} position={[3, 3, 3]} />
      <mesh ref={earthRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <shaderMaterial
          vertexShader={planetVertexShader}
          fragmentShader={planetFragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uLightDirection: { value: sunDirectionCartesian },
            uDayMap: { value: textures.earthDay },
            uNightMap: { value: textures.earthNight },
            // uNormalMap: { value: textures.earthNormal },
          }}
        />
      </mesh>
      <mesh ref={sunRef} position={sunPosition}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={0xffd700} />
      </mesh>
    </>
  );
};
