import { DndContext } from '@dnd-kit/core';

import { Scene } from './components';

export const Solitaire = () => {
  return (
    <DndContext>
      <Scene />
    </DndContext>
  );
};
