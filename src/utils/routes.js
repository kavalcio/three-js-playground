import { fractalBranches, mystify, ragingSea } from '@/demos';

export const ROUTES = [
  {
    path: '/mystify',
    title: 'Mystify',
    component: mystify,
  },
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
];
