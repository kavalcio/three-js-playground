import {
  fractalBranches,
  ragingSea,
  postprocessing,
  inkblot,
  dice,
  dither,
} from '@/demos';

export const ROUTES = [
  {
    path: '/fractal-branches',
    title: 'Fractal Branches',
    component: fractalBranches,
  },
  {
    path: '/raging-sea',
    title: 'Raging Sea',
    component: ragingSea,
  },
  {
    path: '/postprocessing',
    title: 'Postprocessing',
    component: postprocessing,
  },
  {
    path: '/inkblot',
    title: 'Inkblot',
    component: inkblot,
  },
  {
    path: '/dice',
    title: 'Dice',
    component: dice,
  },
  {
    path: '/dither',
    title: 'Dither',
    component: dither,
  },
];
