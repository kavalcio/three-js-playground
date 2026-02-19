import { OrbitControls, Stats } from '@react-three/drei';
import { useControls } from 'leva';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';
import { CharacterController } from './CharacterController';
import { Environment } from './Environment';

const FAR_COLOR = '#4a1818';
const NEAR_COLOR = '#b8b8b8';

export const Scene = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const [inputs, set] = useControls(() => ({
    far: {
      value: 0.1,
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

  return (
    <>
      <color attach="background" args={[FAR_COLOR]} />

      <Stats />

      <OrbitControls dampingFactor={0.18} makeDefault enablePan={false} />

      <Environment />

      <CharacterController />

      <group ref={groupRef}>
        <mesh
          ref={cubeRef}
          position={[1, 0, 0]}
          rotation={[0, Math.PI / 3, 0]}
          castShadow
        >
          <boxGeometry />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            ref={materialRef}
          />
        </mesh>
        <mesh ref={sphereRef} position={[-1, 0, 0]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <shaderMaterial
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
          />
        </mesh>
      </group>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position-x={0}
        position-y={-1}
        position-z={0}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
