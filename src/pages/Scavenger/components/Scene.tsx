import { Stats, useGLTF, useKeyboardControls } from '@react-three/drei';
import {
  BallCollider,
  CapsuleCollider,
  InstancedRigidBodies,
} from '@react-three/rapier';
import { animate } from 'animejs';
import GUI from 'lil-gui';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

import fragmentShader from '../shaders/fragment.glsl';
import vertexShader from '../shaders/vertex.glsl';
import { AudioHandler } from '../utils';
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

const OBSTACLE_COUNT = 2000;
const FIELD_RADIUS = 200;
const temp = new THREE.Object3D();

const OBSTACLE_TYPES = [
  { key: 'asteroid_1', colliderNodes: [<BallCollider args={[0.8]} />] },
  {
    key: 'asteroid_2',
    colliderNodes: [<BallCollider args={[0.8]} />],
  },
  { key: 'asteroid_3', colliderNodes: [<BallCollider args={[0.8]} />] },
  {
    key: 'asteroid_4',
    colliderNodes: [<BallCollider args={[0.7]} position={[-0.4, 0, 0]} />],
  },
  {
    key: 'asteroid_5',
    colliderNodes: [
      <CapsuleCollider
        args={[0.7, 0.7]}
        position={[0, 0.3, 0.3]}
        rotation={[Math.PI * 0.5, 0, Math.PI * 0.8]}
      />,
    ],
  },
  {
    key: 'asteroid_6',
    colliderNodes: [<BallCollider args={[0.7]} position={[-0, 0.1, 0.5]} />],
  },
  {
    key: 'asteroid_7',
    colliderNodes: [
      <BallCollider args={[0.8]} />,
      <BallCollider args={[0.5]} position={[0.3, 1.2, 0.4]} />,
    ],
  },
];

export const Scene = ({
  materialRef,
  audioHandler,
}: {
  materialRef: React.RefObject<THREE.ShaderMaterial | null>;
  audioHandler: React.RefObject<AudioHandler>;
}) => {
  const instancedMeshRef = useRef<THREE.InstancedMesh>(null);

  const isScanning = useRef<boolean>(false);

  const model = useGLTF('/models/scavenger/scavenger.glb');

  console.log(model);

  const scanEnvironment = useCallback(async () => {
    if (!!isScanning.current || !materialRef.current) return;
    isScanning.current = true;

    // Play sound
    audioHandler.current.play('sonar', {
      lowpass: 1000,
      reverb: 'hall',
      volume: 0.5,
    });

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
  }, [materialRef, audioHandler]);

  const [subscribe] = useKeyboardControls();

  useEffect(() => {
    // Do a scan on scanArea key press
    const unsubscribe = subscribe(({ scanArea }) => {
      if (scanArea) scanEnvironment();
    });
    return () => unsubscribe();
  }, [subscribe, scanEnvironment]);

  // useEffect(() => {
  //   const gui = new GUI();
  //   gui
  //     .add({ far: FAR_START_POINT }, 'far', 0, 30, 0.1)
  //     .onChange((v: number) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uFar.value = v;
  //     });
  //   gui
  //     .add({ band1Range: BAND_1_RANGE }, 'band1Range', 0, 10, 0.1)
  //     .onChange((v: number) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uBand1Range.value = v;
  //     });
  //   gui
  //     .add({ band2Range: BAND_2_RANGE }, 'band2Range', 0, 10, 0.1)
  //     .onChange((v: number) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uBand2Range.value = v;
  //     });
  //   gui
  //     .add({ band3Range: BAND_3_RANGE }, 'band3Range', 0, 10, 0.1)
  //     .onChange((v: number) => {
  //       if (!materialRef.current) return;
  //       materialRef.current.uniforms.uBand3Range.value = v;
  //     });
  //   gui.add({ scan: scanEnvironment }, 'scan');
  //   return () => {
  //     gui.destroy();
  //   };
  // }, [scanEnvironment, materialRef]);

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

  const obstacleInstances = useMemo(() => {
    return OBSTACLE_TYPES.reduce((acc, { key }) => {
      const instances = [];
      for (let i = 0; i < OBSTACLE_COUNT / OBSTACLE_TYPES.length; i++) {
        const scale = Math.random() * 4 + 0.5;
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
          scale: [scale, scale, scale],
        });
      }
      acc[key] = instances;
      return acc;
    }, {});
  }, []);

  return (
    <>
      <color attach="background" args={[FAR_COLOR]} />

      {/* <Stats /> */}

      <Environment />
      {OBSTACLE_TYPES.map(({ key: type, colliderNodes }) => (
        <InstancedRigidBodies
          instances={obstacleInstances[type]}
          colliders={false}
          colliderNodes={colliderNodes}
        >
          <instancedMesh
            ref={instancedMeshRef}
            args={[undefined, undefined, obstacleInstances[type].length]}
            count={obstacleInstances[type].length}
            frustumCulled={false}
            castShadow
          >
            <bufferGeometry attach="geometry" {...model.nodes[type].geometry} />
            <shaderMaterial
              transparent
              side={THREE.FrontSide}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              uniforms={uniforms}
              ref={materialRef}
            />
            {/* <meshStandardMaterial wireframe /> */}
          </instancedMesh>
        </InstancedRigidBodies>
      ))}
    </>
  );
};
