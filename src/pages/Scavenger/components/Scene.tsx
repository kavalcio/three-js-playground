import { Stats, useKeyboardControls } from '@react-three/drei';
import { InstancedRigidBodies } from '@react-three/rapier';
import { animate } from 'animejs';
import GUI from 'lil-gui';
import { useCallback, useEffect, useMemo, useRef } from 'react';
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
const FIELD_RADIUS = 100;
const temp = new THREE.Object3D();

// TODO: if we use 3rd person camera, the shader's proximity check should use the player position as reference, not the camera position

export const Scene = ({
  canvasRef,
}: {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const isScanning = useRef<boolean>(false);

  const scanEnvironment = useCallback(async () => {
    if (!!isScanning.current || !materialRef.current) return;
    isScanning.current = true;
    await animate(materialRef.current.uniforms.uFar, {
      // value: [10, 20, 10],
      value: 30,
      alternate: true,
      loop: 1,
    });
    isScanning.current = false;
    // animate(materialRef.current.uniforms.uBand1Color, {
    //   value: [BAND_2_COLOR, BAND_1_COLOR, BAND_2_COLOR],
    // });
    // animate(materialRef.current.uniforms.uBand1Color.value, {
    //   value: [BAND_2_COLOR, BAND_1_COLOR, BAND_2_COLOR],
    //   onUpdate: (self) => console.log(self),
    // });
  }, []);

  const [subscribe] = useKeyboardControls();

  useEffect(() => {
    // Do a scan on scanArea key press
    const unsubscribe = subscribe(({ scanArea }) => {
      if (scanArea) scanEnvironment();
    });
    return () => unsubscribe();
  }, [subscribe, scanEnvironment]);

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
    gui.add({ scan: scanEnvironment }, 'scan');
    return () => {
      gui.destroy();
    };
  }, [scanEnvironment]);

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

  const rbInstances = useMemo(() => {
    const instances = [];

    // const scale = Math.random() + 0.5;

    for (let i = 0; i < OBSTACLE_COUNT; i++) {
      instances.push({
        key: 'instance_' + Math.random(),
        position: [
          Math.max(
            Math.min(
              ((Math.random() - 0.5) * FIELD_RADIUS) / 2,
              FIELD_RADIUS / 2 - 1,
            ),
            -FIELD_RADIUS / 2 + 1,
          ),
          Math.max(
            Math.min(
              ((Math.random() - 0.5) * FIELD_RADIUS) / 2,
              FIELD_RADIUS / 2 - 1,
            ),
            -FIELD_RADIUS / 2 + 1,
          ),
          Math.max(
            Math.min(
              ((Math.random() - 0.5) * FIELD_RADIUS) / 2,
              FIELD_RADIUS / 2 - 1,
            ),
            -FIELD_RADIUS / 2 + 1,
          ),
        ],
        rotation: [Math.random(), Math.random(), Math.random()],
        // scale: [scale],
        // angularVelocity: [
        //   (Math.random() - 0.5) * 10,
        //   (Math.random() - 0.5) * 10,
        //   (Math.random() - 0.5) * 10,
        // ],
      });
    }

    return instances;
  }, []);

  return (
    <>
      <color attach="background" args={[FAR_COLOR]} />

      <Stats />

      <Environment />

      <CharacterController materialRef={materialRef} canvasRef={canvasRef} />

      <InstancedRigidBodies instances={rbInstances}>
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
            side={THREE.FrontSide}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            ref={materialRef}
          />
        </instancedMesh>
      </InstancedRigidBodies>
    </>
  );
};
