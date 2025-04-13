export const BUILDING_COUNT = 2;
export const BUILDING_DIMENSIONS = {
  x: { min: 3, max: 10 },
  y: { min: 3, max: 20 },
  z: { min: 3, max: 10 },
} as const;
export const ROW_HEIGHT = 0.75;
export const COLUMN_WIDTH = 0.5;
export const STAGE_SIZE = 26;
export const SPAWN_AREA_SIZE = STAGE_SIZE / 2 - 1;
