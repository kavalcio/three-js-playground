import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';
import { useCallback, useState } from 'react';

import { CARD_PADDING, TILE_HEIGHT, TILE_SCALE, TILE_WIDTH } from '@/constants';
import { BoardState } from '@/types';

import { Draggable } from './Draggable';

export const Droppable = ({
  id,
  cardCount = 1,
  stacks,
  cards,
}: {
  id: string;
  children?: React.ReactNode;
  cardCount?: number;
  stacks: BoardState['stacks'];
  cards: BoardState['cards'];
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });
  const [isDragging, setIsDragging] = useState(false);

  const onDragStateChange = useCallback((d: boolean) => setIsDragging(d), []);

  return (
    <Box
      ref={setNodeRef}
      sx={{
        zIndex: isDragging ? 6 : 5,
        position: 'relative',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isOver ? 'white' : 'green',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1,
        width: TILE_WIDTH * TILE_SCALE,
        height:
          TILE_HEIGHT * TILE_SCALE +
          Math.max(0, cardCount - 1) * CARD_PADDING * TILE_SCALE,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#1a8d1a',
          width: TILE_WIDTH * TILE_SCALE,
          height: TILE_HEIGHT * TILE_SCALE,
        }}
      />
      {!!stacks[id].child && (
        <Draggable
          key={stacks[id].child}
          index={0}
          cardId={stacks[id].child}
          cards={cards}
          onDragStateChange={onDragStateChange}
        />
      )}
    </Box>
  );
};
