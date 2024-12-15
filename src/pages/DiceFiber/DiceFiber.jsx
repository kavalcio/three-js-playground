import { Canvas } from '@react-three/fiber';
import { useState } from 'react';

import { DiceInterface, Scene } from './components';
import { DIE_TYPES } from './constants';

export const DiceFiber = () => {
  const [diceRollSum, setDiceRollSum] = useState(null);
  const [diceCounts, setDiceCounts] = useState(() =>
    DIE_TYPES.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {}),
  );
  const [sleepingDiceCount, setSleepingDiceCount] = useState(0);

  const rollDice = ({ diceCounts }) => {
    setDiceCounts(diceCounts);
    setSleepingDiceCount(0);
  };

  const areAllDiceSleeping =
    sleepingDiceCount ===
    Object.values(diceCounts).reduce((acc, count) => acc + count, 0);

  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 25, position: [25, 45, 35] }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Scene
          diceCounts={diceCounts}
          diceRollSum={diceRollSum}
          setDiceRollSum={setDiceRollSum}
          incrementSleepingDiceCount={() =>
            setSleepingDiceCount((prev) => prev + 1)
          }
        />
      </Canvas>
      <DiceInterface
        rollDice={rollDice}
        diceRollSum={diceRollSum}
        areAllDiceSleeping={areAllDiceSleeping}
      />
    </>
  );
};
