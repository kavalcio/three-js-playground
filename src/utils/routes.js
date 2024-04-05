import { fractalBranches, mystify } from '@/demos';

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
];
