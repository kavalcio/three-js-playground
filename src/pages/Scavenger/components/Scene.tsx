import { OrbitControls, Stats } from '@react-three/drei';
import { useControls } from 'leva';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';
import { CharacterController } from './CharacterController';
import { Environment } from './Environment';

const FAR_START_POINT = 10;
const FAR_COLOR = '#4a1818';
const BAND_1_RANGE = 1;
const BAND_1_COLOR = '#ccb4b4';
const BAND_2_RANGE = 3;
const BAND_2_COLOR = '#5e2b2b';
const NEAR_COLOR = '#cd7878';

// const FAR_COLOR = '#4a1818';
const MID_COLOR = '#7a3b3b';
// const NEAR_COLOR = '#cd7878';
// const NEAR_COLOR = '#eba93e';
const OBSTACLE_COUNT = 1000;
const FIELD_RADIUS = 30;
const temp = new THREE.Object3D();

export const Scene = () => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [inputs, set] = useControls(() => ({
    far: {
      value: FAR_START_POINT,
      step: 0.1,
      min: 0.1,
      max: 100,
      onChange: (v) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uFar.value = v;
      },
    },
    band1Range: {
      value: BAND_1_RANGE,
      step: 0.1,
      min: 0,
      max: 10,
      onChange: (v) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uBand1Range.value = v;
      },
    },
    band2Range: {
      value: BAND_2_RANGE,
      step: 0.1,
      min: 0,
      max: 10,
      onChange: (v) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uBand2Range.value = v;
      },
    },
  }));

  const uniforms = useMemo(() => {
    return {
      uFar: { value: FAR_START_POINT, type: 'f' },
      uBand1Range: { value: BAND_1_RANGE, type: 'f' },
      uBand2Range: { value: BAND_2_RANGE, type: 'f' },
      uFarColor: { value: new THREE.Color(FAR_COLOR) },
      uBand1Color: { value: new THREE.Color(BAND_1_COLOR) },
      uBand2Color: { value: new THREE.Color(BAND_2_COLOR) },
      uNearColor: { value: new THREE.Color(NEAR_COLOR) },
    };
  }, []);

  useEffect(() => {
    if (!instancedMeshRef.current) return;
    // Set positions
    for (let i = 0; i < OBSTACLE_COUNT; i++) {
      temp.position.set(
        (Math.random() - 0.5) * FIELD_RADIUS,
        (Math.random() - 0.5) * FIELD_RADIUS,
        (Math.random() - 0.5) * FIELD_RADIUS,
      );
      temp.updateMatrix();
      instancedMeshRef.current.setMatrixAt(i, temp.matrix);
    }
    // Update the instance
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <>
      <color attach="background" args={[FAR_COLOR]} />

      <Stats />

      <OrbitControls dampingFactor={0.18} makeDefault enablePan={false} />

      <Environment />

      <CharacterController />

      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, OBSTACLE_COUNT]}
        count={OBSTACLE_COUNT}
        frustumCulled={false}
        castShadow
      >
        <boxGeometry />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          ref={materialRef}
        />
      </instancedMesh>
    </>
  );
};
