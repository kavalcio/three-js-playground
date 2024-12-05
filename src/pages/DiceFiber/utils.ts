import { DIE_SPAWN_AREA_WIDTH, INITIAL_SPEED } from './constants';

export const generateRandomDiceInstances = ({
  diceCount,
  baseLinearVelocity,
  baseStartingPosition,
}: {
  diceCount: number;
  baseLinearVelocity: number[];
  baseStartingPosition: number[];
}) => {
  const instances = [];

  for (let i = 0; i < diceCount; i++) {
    instances.push({
      key: 'instance_' + Math.random(),
      position: [
        Math.max(
          Math.min(
            baseStartingPosition[0] +
              ((Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH) / 2,
            DIE_SPAWN_AREA_WIDTH / 2 - 1,
          ),
          -DIE_SPAWN_AREA_WIDTH / 2 + 1,
        ),
        Math.max(
          Math.min(
            baseStartingPosition[1] +
              ((Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH) / 2,
            DIE_SPAWN_AREA_WIDTH / 2 - 1,
          ),
          -DIE_SPAWN_AREA_WIDTH / 2 + 1,
        ),
        Math.max(
          Math.min(
            baseStartingPosition[2] +
              ((Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH) / 2,
            DIE_SPAWN_AREA_WIDTH / 2 - 1,
          ),
          -DIE_SPAWN_AREA_WIDTH / 2 + 1,
        ),
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
      linearVelocity: [
        baseLinearVelocity[0] + (Math.random() - 0.5) * INITIAL_SPEED,
        baseLinearVelocity[1] + ((Math.random() - 0.5) * INITIAL_SPEED) / 2,
        baseLinearVelocity[2] + (Math.random() - 0.5) * INITIAL_SPEED,
      ],
      angularVelocity: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ],
    });
  }

  return instances;
};
