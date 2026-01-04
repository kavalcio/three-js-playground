import { useDroppable } from '@dnd-kit/core';
import { Box } from '@mui/material';

import { FOUNDATION_DROPPABLE_ID, SUITS, TILEMAP_VALUES } from '@/constants';
import { BoardState } from '@/types';

import { Draggable } from './Draggable';

export const Foundation = ({
  foundation,
  cards,
}: {
  foundation: BoardState['foundation'];
  cards: BoardState['cards'];
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id: FOUNDATION_DROPPABLE_ID,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: isOver ? 'white' : 'green',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1,
        minWidth: TILEMAP_VALUES.tileWidth,
        height: TILEMAP_VALUES.tileHeight,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          height: 'fit-content',
          gap: '20px',
        }}
      >
        {SUITS.map((suit) => (
          <Box
            key={suit}
            sx={{
              width: TILEMAP_VALUES.tileWidth,
              height: TILEMAP_VALUES.tileHeight,
              backgroundColor: '#1a8d1a',
            }}
          >
            {foundation[suit].length > 0 && (
              <Draggable
                cardId={foundation[suit][foundation[suit].length - 1]}
                index={0}
                cards={cards}
                disabled
              />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
