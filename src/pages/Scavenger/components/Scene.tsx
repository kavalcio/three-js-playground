import { OrbitControls, Stats } from '@react-three/drei';
import { useControls } from 'leva';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';
import { CharacterController } from './CharacterController';
import { Environment } from './Environment';

const FAR_COLOR = '#4a1818';
const NEAR_COLOR = '#7a3b3b';
const OBSTACLE_COUNT = 300;
const FIELD_RADIUS = 30;
const temp = new THREE.Object3D();

export const Scene = () => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [inputs, set] = useControls(() => ({
    far: {
      value: 10,
      step: 0.1,
      min: 0.1,
      max: 100,
      onChange: (v) => {
        console.log(materialRef);
        if (!materialRef.current) return;
        materialRef.current.uniforms.uFar.value = v;
      },
    },
  }));

  const uniforms = useMemo(() => {
    // console.log(inputs);
    return {
      uFar: { value: inputs.far, type: 'f' },
      uNearColor: { value: new THREE.Color(NEAR_COLOR) },
      uFarColor: { value: new THREE.Color(FAR_COLOR) },
    };
  }, [inputs.far]);

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
