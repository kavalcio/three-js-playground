import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import { CARD_PADDING, TILEMAP_VALUES } from '@/constants';
import { BoardState } from '@/types';

import { Draggable } from './Draggable';

export const Droppable = ({
  id,
  cardCount = 1,
  stacks,
  cards,
  isDraggingChild = false,
}: {
  id: string;
  children?: React.ReactNode;
  cardCount?: number;
  stacks: BoardState['stacks'];
  cards: BoardState['cards'];
  isDraggingChild?: boolean;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        zIndex: isDraggingChild ? 10 : 5,
        position: 'relative',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isOver ? 'white' : 'green',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: TILEMAP_VALUES.tileWidth,
        height:
          TILEMAP_VALUES.tileHeight + Math.max(0, cardCount - 1) * CARD_PADDING,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundColor: '#1a8d1a',
          width: TILEMAP_VALUES.tileWidth,
          height: TILEMAP_VALUES.tileHeight,
        }}
      />
      {!!stacks[id].child && (
        <Draggable
          key={stacks[id].child}
          index={0}
          cardId={stacks[id].child}
          cards={cards}
        />
      )}
    </Box>
  );
};
