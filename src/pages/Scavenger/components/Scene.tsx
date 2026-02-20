import { OrbitControls, PointerLockControls, Stats } from '@react-three/drei';
import { animate, utils } from 'animejs';
import gsap from 'gsap';
import { useControls } from 'leva';
import GUI from 'lil-gui';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';
import { CharacterController } from './CharacterController';
import { Environment } from './Environment';

const FAR_START_POINT = 10;
const FAR_COLOR = '#4a1818';
const BAND_1_RANGE = 0.5;
const BAND_1_COLOR = '#ccb4b4';
const BAND_2_RANGE = 0.5;
const BAND_2_COLOR = '#5e2b2b';
const BAND_3_RANGE = 4;
const BAND_3_COLOR = '#5e2b2b';
const NEAR_COLOR = '#cd7878';

const OBSTACLE_COUNT = 1000;
const FIELD_RADIUS = 30;
const temp = new THREE.Object3D();

// TODO: if we use 3rd person camera, the shader's proximity check should use the player position as reference, not the camera position

export const Scene = () => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // const [inputs, set] = useControls(() => ({
  //   far: {
  //     value: FAR_START_POINT,
  //     step: 0.1,
  //     min: 0.1,
  //     max: 100,
  //     onChange: (v) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uFar.value = v;
  //     },
  //   },
  //   band1Range: {
  //     value: BAND_1_RANGE,
  //     step: 0.1,
  //     min: 0,
  //     max: 10,
  //     onChange: (v) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uBand1Range.value = v;
  //     },
  //   },
  //   band2Range: {
  //     value: BAND_2_RANGE,
  //     step: 0.1,
  //     min: 0,
  //     max: 10,
  //     onChange: (v) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uBand2Range.value = v;
  //     },
  //   },
  //   band3Range: {
  //     value: BAND_3_RANGE,
  //     step: 0.1,
  //     min: 0,
  //     max: 10,
  //     onChange: (v) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uBand3Range.value = v;
  //     },
  //   },
  //   // doThing: () => console.log('hey'),
  // }));

  useEffect(() => {
    const gui = new GUI();
    gui
      .add({ far: FAR_START_POINT }, 'far', 0, 30, 0.1)
      .onChange((v: number) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uFar.value = v;
      });
    gui
      .add({ band1Range: BAND_1_RANGE }, 'band1Range', 0, 10, 0.1)
      .onChange((v: number) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uBand1Range.value = v;
      });
    gui
      .add({ band2Range: BAND_2_RANGE }, 'band2Range', 0, 10, 0.1)
      .onChange((v: number) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uBand2Range.value = v;
      });
    gui
      .add({ band3Range: BAND_3_RANGE }, 'band3Range', 0, 10, 0.1)
      .onChange((v: number) => {
        if (!materialRef.current) return;
        materialRef.current.uniforms.uBand3Range.value = v;
      });
    gui.add(
      {
        'Do a thing': () => {
          if (!materialRef.current) return;
          // gsap.to(materialRef.current.uniforms.uFar, {
          //   value: materialRef.current.uniforms.uFar.value + 1,
          // });
          animate(materialRef.current.uniforms.uFar, {
            // value: materialRef.current.uniforms.uFar.value + 1,
            // value: [10, 20, 10],
            value: 30,
            alternate: true,
            loop: 1,
          });
          // animate(materialRef.current.uniforms.uBand1Color, {
          //   value: [BAND_2_COLOR, BAND_1_COLOR, BAND_2_COLOR],
          // });
          // animate(materialRef.current.uniforms.uBand1Color.value, {
          //   value: [BAND_2_COLOR, BAND_1_COLOR, BAND_2_COLOR],
          //   onUpdate: (self) => console.log(self),
          // });
        },
      },
      'Do a thing',
    );
    return () => {
      gui.destroy();
    };
  }, []);

  const uniforms = useMemo(() => {
    return {
      uFar: { value: FAR_START_POINT, type: 'f' },
      uBand1Range: { value: BAND_1_RANGE, type: 'f' },
      uBand2Range: { value: BAND_2_RANGE, type: 'f' },
      uBand3Range: { value: BAND_3_RANGE, type: 'f' },
      uFarColor: { value: new THREE.Color(FAR_COLOR) },
      uBand1Color: { value: new THREE.Color(BAND_1_COLOR) },
      // uBand1Color: { value: new THREE.Color(BAND_2_COLOR) },
      uBand2Color: { value: new THREE.Color(BAND_2_COLOR) },
      uBand3Color: { value: new THREE.Color(BAND_3_COLOR) },
      uNearColor: { value: new THREE.Color(NEAR_COLOR) },
      uPlayerWorldPosition: { value: new THREE.Vector3(0, 0, 0) },
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
          transparent
          // side={THREE.FrontSide}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          ref={materialRef}
        />
      </instancedMesh>
    </>
  );
};
