export const INITIAL_DIE_COUNT = 1;
export const MAX_DIE_COUNT = 30;
export const DIE_SCALE = 1;
export const DIE_SPAWN_AREA_WIDTH = 15;
export const STAGE_WIDTH = 20;

export const DIE_TYPES = [
  'd4', // tetrahedron
  'd6', // cube
  'd8', // octahedron
  'd10', // pentagonal trapezohedron
  'd12', // dodecahedron
  'd20', // icosahedron
];

/*
  These values are manually determined by looking at what number is drawn
  on each face of the dice textures, and what face index corresponds to that face.
  Some dice have more values than the polyhedron face count. That's because some
  of the shapes have non-triangular sides which consist of multiple polygons.
*/
export const DICE_FACE_INDEX_TO_RESULT = {
  d4: {
    0: 4,
    1: 3,
    2: 2,
    3: 1,
  },
  d6: {
    0: 1,
    1: 1,
    2: 5,
    3: 5,
    4: 6,
    5: 6,
    6: 2,
    7: 2,
    8: 3,
    9: 3,
    10: 4,
    11: 4,
  },
  d8: {
    0: 8,
    1: 2,
    2: 4,
    3: 6,
    4: 5,
    5: 3,
    6: 1,
    7: 7,
  },
  d10: {
    0: 4,
    1: 4,
    2: 9,
    3: 9,
    4: 7,
    5: 7,
    6: 10,
    7: 10,
    8: 6,
    9: 6,
    10: 2,
    11: 2,
    12: 8,
    13: 8,
    14: 3,
    15: 3,
    16: 5,
    17: 5,
    18: 1,
    19: 1,
  },
  d12: {
    0: 7,
    1: 7,
    2: 7,
    3: 8,
    4: 8,
    5: 8,
    6: 12,
    7: 12,
    8: 12,
    9: 2,
    10: 2,
    11: 2,
    12: 3,
    13: 3,
    14: 3,
    15: 9,
    16: 9,
    17: 9,
    18: 10,
    19: 10,
    20: 10,
    21: 11,
    22: 11,
    23: 11,
    24: 4,
    25: 4,
    26: 4,
    27: 1,
    28: 1,
    29: 1,
    30: 5,
    31: 5,
    32: 5,
    33: 6,
    34: 6,
    35: 6,
  },
  d20: {
    0: 20,
    1: 14,
    2: 2,
    3: 18,
    4: 4,
    5: 6,
    6: 8,
    7: 12,
    8: 5,
    9: 11,
    10: 16,
    11: 10,
    12: 15,
    13: 13,
    14: 9,
    15: 3,
    16: 17,
    17: 7,
    18: 1,
    19: 19,
  },
};
