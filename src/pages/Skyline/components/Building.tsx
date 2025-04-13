import { getRandomInt } from 'src/utils';

import {
  BUILDING_DIMENSIONS,
  COLUMN_WIDTH,
  ROW_HEIGHT,
  SPAWN_AREA_SIZE,
} from '../constants';

export const Building = () => {
  const rowColumnCounts = {
    x: getRandomInt(BUILDING_DIMENSIONS.x.min, BUILDING_DIMENSIONS.x.max),
    y: getRandomInt(BUILDING_DIMENSIONS.y.min, BUILDING_DIMENSIONS.y.max),
    z: getRandomInt(BUILDING_DIMENSIONS.z.min, BUILDING_DIMENSIONS.z.max),
  };
  const dimensions = {
    x: rowColumnCounts.x * COLUMN_WIDTH,
    y: rowColumnCounts.y * ROW_HEIGHT,
    z: rowColumnCounts.z * COLUMN_WIDTH,
  };

  return (
    <group>
      <mesh
        position={[
          Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
          dimensions.y / 2,
          Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
        ]}
      >
        <boxGeometry args={[dimensions.x, dimensions.y + 0.01, dimensions.z]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  );
};
