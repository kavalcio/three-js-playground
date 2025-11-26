export const ROUTE_GROUPS = {
  journey: {
    key: 'journey',
    title: 'Three.js Journey',
  },
  shaders: {
    key: 'shaders',
    title: 'Shaders',
  },
  other: {
    key: 'other',
    title: 'Other',
  },
};

export const ORDERED_GROUPS = [
  ROUTE_GROUPS.journey.key,
  ROUTE_GROUPS.shaders.key,
  ROUTE_GROUPS.other.key,
];

export const ROUTES = {
  fractalBranches: {
    path: '/fractal-branches',
    title: 'Fractal Branches',
    group: ROUTE_GROUPS.other.key,
  },
  ragingSea: {
    path: '/raging-sea',
    title: 'Raging Sea',
    group: ROUTE_GROUPS.journey.key,
  },
  postprocessing: {
    path: '/postprocessing',
    title: 'Postprocessing',
    group: ROUTE_GROUPS.shaders.key,
  },
  inkblot: {
    path: '/inkblot',
    title: 'Inkblot',
    group: ROUTE_GROUPS.shaders.key,
  },
  dice: {
    path: '/dice',
    title: 'Dice',
    group: ROUTE_GROUPS.other.key,
  },
  diceFiber: {
    path: '/dice-fiber',
    title: 'Dice Fiber',
    group: ROUTE_GROUPS.other.key,
  },
  dither: {
    path: '/dither',
    title: 'Dither',
    group: ROUTE_GROUPS.shaders.key,
  },
  warp: {
    path: '/warp',
    title: 'Warp',
    group: ROUTE_GROUPS.shaders.key,
  },
  galaxy: {
    path: '/galaxy',
    title: 'Galaxy',
    group: ROUTE_GROUPS.journey.key,
  },
  vertexSnapping: {
    path: '/vertex-snapping',
    title: 'Vertex Snapping',
    group: ROUTE_GROUPS.shaders.key,
  },
  refraction: {
    path: '/refraction',
    title: 'Refraction',
    group: ROUTE_GROUPS.other.key,
  },
  solarSystem: {
    path: '/solar-system',
    title: 'Solar System',
    group: ROUTE_GROUPS.other.key,
  },
  demake: {
    path: '/demake',
    title: 'Demake',
    group: ROUTE_GROUPS.other.key,
  },
  coffeeSmoke: {
    path: '/coffee-smoke',
    title: 'Coffee Smoke',
    group: ROUTE_GROUPS.journey.key,
  },
  hologram: {
    path: '/hologram',
    title: 'Hologram',
    group: ROUTE_GROUPS.journey.key,
  },
  halftone: {
    path: '/halftone',
    title: 'Halftone',
    group: ROUTE_GROUPS.shaders.key,
  },
  lightShading: {
    path: '/light-shading',
    title: 'Light Shading',
    group: ROUTE_GROUPS.journey.key,
  },
  r3fDemo: {
    path: '/r3f-demo',
    title: 'R3F Demo',
    group: ROUTE_GROUPS.other.key,
  },
  skyline: {
    path: '/skyline',
    title: 'Skyline',
    group: ROUTE_GROUPS.other.key,
  },
};
