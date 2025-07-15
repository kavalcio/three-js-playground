import { OrbitControls, Stats, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useMemo, useRef } from 'react';
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

  const { gl: renderer } = useThree();

  useFrame((state, delta) => {
    if (rotate) earthRef.current.rotation.y += delta / 4;
    earthRef.current.material.uniforms.uTime.value += delta;
  });

  const textures = useTexture({
    earthDay: '/solar/earth_day.jpg',
    earthNight: '/solar/earth_night.jpg',
    // earthNormal: '/solar/earth_normal.png',
    // earthSpecular: '/solar/earth_specular.png',
    earthClouds: '/solar/earth_clouds.jpg',
  });

  const anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
  textures.earthDay.colorSpace = THREE.SRGBColorSpace;
  textures.earthNight.colorSpace = THREE.SRGBColorSpace;
  textures.earthDay.anisotropy = anisotropy;
  textures.earthNight.anisotropy = anisotropy;
  textures.earthClouds.anisotropy = anisotropy;

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

  const [{ rotate, atmosphereDayColor, atmosphereTwilightColor }] = useControls(
    () => ({
      rotate: { value: false, label: 'Rotate' },
      cloudDensity: {
        value: 0.8,
        min: 0,
        max: 1,
        label: 'Cloud Density',
        onChange: (value) => {
          earthRef.current.material.uniforms.uCloudDensity.value = value;
        },
      },
      cloudIntensity: {
        value: 0.5,
        min: 0,
        max: 1,
        label: 'Cloud Intensity',
        onChange: (value) => {
          earthRef.current.material.uniforms.uCloudIntensity.value = value;
        },
      },
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
      atmosphereDayColor: {
        value: '#55aaff',
        label: 'Atmosphere Day Color',
        onChange: (value) => {
          earthRef.current.material.uniforms.uAtmosphereDayColor.value.set(
            value,
          );
        },
      },
      atmosphereTwilightColor: {
        value: '#ff4500',
        label: 'Atmosphere Twilight Color',
        onChange: (value) => {
          earthRef.current.material.uniforms.uAtmosphereTwilightColor.value.set(
            value,
          );
        },
      },
    }),
  );

  const uniforms = useMemo(() => {
    return {
      uTime: { value: 0 },
      uLightDirection: { value: sunDirectionCartesian },
      uDayMap: { value: textures.earthDay },
      uNightMap: { value: textures.earthNight },
      uCloudsMap: { value: textures.earthClouds },
      uCloudDensity: { value: 0.8, type: 'f' },
      uCloudIntensity: { value: 0.5, type: 'f' },
      uAtmosphereDayColor: { value: new THREE.Color(atmosphereDayColor) },
      uAtmosphereTwilightColor: {
        value: new THREE.Color(atmosphereTwilightColor),
      },
      // uNormalMap: { value: textures.earthNormal },
    };
  }, [
    textures.earthDay,
    textures.earthNight,
    textures.earthClouds,
    atmosphereDayColor,
    atmosphereTwilightColor,
  ]);

  console.log('uniforms', uniforms);

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
          uniforms={uniforms}
        />
      </mesh>
      <mesh ref={sunRef} position={sunPosition}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color={0xffd700} />
      </mesh>
    </>
  );
};
