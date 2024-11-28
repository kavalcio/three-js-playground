import { DIE_SPAWN_AREA_WIDTH } from './constants';

export const generateRandomDiceInstances = (count: number) => {
  const instances = [];

  for (let i = 0; i < count; i++) {
    instances.push({
      key: 'instance_' + Math.random(),
      position: [
        (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,
        5 + (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
    });
  }

  return instances;
};
