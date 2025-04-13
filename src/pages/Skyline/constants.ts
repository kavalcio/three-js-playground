export const BUILDING_COUNT = 20;
export const BUILDING_DIMENSIONS = {
  x: { min: 3, max: 10 },
  y: { min: 3, max: 20 },
  z: { min: 3, max: 10 },
} as const;
export const ROW_HEIGHT = 0.75;
export const COLUMN_WIDTH = 0.5;
export const STAGE_SIZE = 26;
export const SPAWN_AREA_SIZE = STAGE_SIZE / 2 - 1;
export const WALLS = [
  { axis: 'x', offset: 1, rotation: 0 }, // top
  { axis: 'z', offset: 1, rotation: Math.PI / 2 }, // right
  { axis: 'x', offset: -1, rotation: Math.PI }, // bottom
  { axis: 'z', offset: -1, rotation: -Math.PI / 2 }, // left
] as const;
