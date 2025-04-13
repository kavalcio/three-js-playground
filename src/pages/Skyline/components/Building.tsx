import { useLayoutEffect, useRef } from 'react';
import { getRandomInt } from 'src/utils';
import * as THREE from 'three';

import {
  BUILDING_DIMENSIONS,
  COLUMN_WIDTH,
  ROW_HEIGHT,
  SPAWN_AREA_SIZE,
  WALLS,
} from '../constants';

const BUILDING_MARGIN = 0.5;
const Z_FIX = 0.01; // to prevent z-fighting

export const Building = () => {
  const ref = useRef<THREE.InstancedMesh>(null!);
  const rowColumnCounts = {
    x: getRandomInt(BUILDING_DIMENSIONS.x.min, BUILDING_DIMENSIONS.x.max),
    y: getRandomInt(BUILDING_DIMENSIONS.y.min, BUILDING_DIMENSIONS.y.max),
    z: getRandomInt(BUILDING_DIMENSIONS.z.min, BUILDING_DIMENSIONS.z.max),
  };
  const buildingDimensions = {
    x: rowColumnCounts.x * COLUMN_WIDTH,
    y: rowColumnCounts.y * ROW_HEIGHT,
    z: rowColumnCounts.z * COLUMN_WIDTH,
  };

  const windows = getWindowDimensions(rowColumnCounts);

  useLayoutEffect(() => {
    const matrixPosition = new THREE.Matrix4();
    const matrixRotation = new THREE.Matrix4();
    if (ref.current) {
      windows.forEach((window, i) => {
        matrixPosition.makeTranslation(...window.position);
        matrixPosition.multiply(
          matrixRotation.makeRotationFromEuler(
            new THREE.Euler(...window.rotation),
          ),
        );
        ref.current.setMatrixAt(i, matrixPosition);
      });
      ref.current.instanceMatrix.needsUpdate = true;
    }
  }, [windows]);

  return (
    <group
      position={[
        Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
        BUILDING_MARGIN / 2,
        Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
      ]}
    >
      <mesh position-y={buildingDimensions.y / 2}>
        <boxGeometry
          args={[
            buildingDimensions.x,
            buildingDimensions.y + BUILDING_MARGIN + Z_FIX,
            buildingDimensions.z,
          ]}
        />
        <meshStandardMaterial color="orange" />
      </mesh>
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, windows.length]}
        count={windows.length}
      >
        <planeGeometry args={[0.2, 0.4]} />
        <meshStandardMaterial color="black" />
      </instancedMesh>
    </group>
  );
};

const getWindowDimensions = (rowColumnCounts: {
  x: number;
  y: number;
  z: number;
}) => {
  const arr: {
    position: [number, number, number];
    rotation: [number, number, number];
  }[] = [];
  WALLS.forEach((wall) => {
    for (let i = 0; i < rowColumnCounts.y; i++) {
      const yPos = i * ROW_HEIGHT + ROW_HEIGHT / 2;
      for (let j = 0; j < rowColumnCounts[wall.axis]; j++) {
        if (wall.axis === 'x') {
          arr.push({
            position: [
              (j + 0.5) * COLUMN_WIDTH - (rowColumnCounts.x * COLUMN_WIDTH) / 2,
              yPos,
              ((rowColumnCounts.z * COLUMN_WIDTH) / 2 + Z_FIX) * wall.offset,
            ],
            rotation: [0, wall.rotation, 0],
          });
        } else if (wall.axis === 'z') {
          arr.push({
            position: [
              ((rowColumnCounts.x * COLUMN_WIDTH) / 2 + Z_FIX) * wall.offset,
              yPos,
              (j + 0.5) * COLUMN_WIDTH - (rowColumnCounts.z * COLUMN_WIDTH) / 2,
            ],
            rotation: [0, wall.rotation, 0],
          });
        }
      }
    }
  });
  return arr;
};
