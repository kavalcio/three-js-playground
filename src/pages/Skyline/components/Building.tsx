import { getRandomInt } from 'src/utils';

import {
  BUILDING_DIMENSIONS,
  COLUMN_WIDTH,
  ROW_HEIGHT,
  SPAWN_AREA_SIZE,
} from '../constants';
import { Window } from './Window';

const WALLS = [
  { axis: 'x', offset: 1, rotation: 0 }, // top
  { axis: 'z', offset: 1, rotation: Math.PI / 2 }, // right
  { axis: 'x', offset: -1, rotation: Math.PI }, // bottom
  { axis: 'z', offset: -1, rotation: -Math.PI / 2 }, // left
] as const;

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
              ((rowColumnCounts.z * COLUMN_WIDTH) / 2 + 0.01) * wall.offset,
            ],
            rotation: [0, wall.rotation, 0],
          });
        } else if (wall.axis === 'z') {
          arr.push({
            position: [
              ((rowColumnCounts.x * COLUMN_WIDTH) / 2 + 0.01) * wall.offset,
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

export const Building = () => {
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

  return (
    <group
      position={[
        Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
        0,
        Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
      ]}
    >
      <mesh position-y={buildingDimensions.y / 2}>
        <boxGeometry
          args={[
            buildingDimensions.x,
            buildingDimensions.y + 0.01,
            buildingDimensions.z,
          ]}
        />
        <meshStandardMaterial color="orange" />
      </mesh>
      {windows.map((window, i) => (
        <Window
          key={`window-${i}`}
          position={window.position}
          rotation={window.rotation}
        />
      ))}
    </group>
  );
};
