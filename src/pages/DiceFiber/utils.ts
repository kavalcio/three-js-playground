import { DIE_SPAWN_AREA_WIDTH } from './constants';

/*
TODO: Concerns with the current starting position/velocity logic:
- Each die type group does its own thing. They group within themselves and have the same velocity within the group, but this is not consistent across groups.
- Within each group, the starting velocity is identical. There should be some variation.
- The velocity direction is random. Maybe it should be towards the center of the spawn area.
- Maybe the starting positions should be less random. E.g. they could be picked from a circle at a certain radius from the center.
*/
export const generateRandomDiceInstances = (count: number) => {
  const instances = [];

  // const randomOrigin = [
  //   (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH / 1.5,
  //   (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH / 1.5,
  // ];

  for (let i = 0; i < count; i++) {
    instances.push({
      key: 'instance_' + Math.random(),
      position: [
        (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,
        5 + (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,

        // Math.max(Math.min(randomOrigin[0] + (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH / 3, DIE_SPAWN_AREA_WIDTH), -DIE_SPAWN_AREA_WIDTH),
        // 3 + (Math.random() - 0.5) * 3,
        // Math.max(Math.min(randomOrigin[1] + (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH / 3, DIE_SPAWN_AREA_WIDTH), -DIE_SPAWN_AREA_WIDTH),
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
    });
  }

  return instances;
};
